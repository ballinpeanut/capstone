const asyncHandler = require("express-async-handler");
const bucket = require("../config/gcpImages");
const Experience = require("../models/Experience");

/**
 * Upload an image for an existing Experience
 * Route: POST /api/upload/:experienceId
 * Access: public (no auth yet)
 */
const uploadExperienceImage = asyncHandler(async (req, res) => {
    const experienceId = req.params.experienceId.trim();
    // console.log("BODY fields:", req.body);
    // console.log("FILE object:", req.file);

    const experience = await Experience.findById(experienceId);
    if  (!experience){
        return res.status(404).json({ error: "Experience not found" }); 
    }
    if (!req.file){
        return res.status(400).json({ error: "No image uploaded" });
    }
    const user_id = req.body.user_id;   

    const fd = bucket.file(`${user_id}/${Date.now()}-${req.file.originalname}`);

    
    // Upload to Google Cloud via stream 
    const uploadStream = fd.createWriteStream({
        resumable: false, 
        contentType: req.file.mimetype, 
    })

    // Handle stream errors 
    uploadStream.on("error", (err) => {
        console.error("Error uploading to the cloud: ", err); 
        res.status(500).json({message: "Google Cloud error"}); 
    })

    // If successfull this will return the URL 
    uploadStream.on ("finish", async () => {
        const url = `https://storage.googleapis.com/${bucket.name}/${fd.name}`; // Constructs the URL 
        
        experience.images.push(url);    // Stores image URL to user Experience 
        await experience.save();

        res.status(200).json({
            message: "Image uploaded & linked to Experience",
            imageUrl: url, 
            experience,
        }); 
    })
    
    uploadStream.end(req.file.buffer);

}); 

module.exports = { uploadExperienceImage };