const express = require("express");
const multer = require("multer");
const { uploadExperienceImage } = require("../controllers/uploadController");

const router = express.Router(); 

// Multer handles image upload from form data // 
// https://github.com/expressjs/multer#readme // 
const upload = multer ({
    storage: multer.memoryStorage(),    // keeps file in temp mem  
    limits: {fileSize: 5*1024*1024},    // max img. filesize 
})  

router.post("/:experienceId", upload.single("image"), uploadExperienceImage); 

module.exports = router; 