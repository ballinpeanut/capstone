require("dotenv").config({ path: "./backend/.env" });

const fs = require("fs");
const path = require("path");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const app = require("../backend/server");

chai.use(chaiHttp);

/* TESTS IMAGE UPLOADS TO EXISTING EXPERIENCES */ 
describe("UPLOADS IMAGE /api/upload/:experienceId", function () {
  this.timeout(30000); // allow enough time for GCS upload

  // Uses already existing Experience _id from MongoDB
  const experienceId = process.env.EXPERIENCE_ID; 
  const userId = process.env.TEST_USER_ID;

  it("Uploads to Google cloud and updates Experience", async function () {
    // This will confirm that the image exists
    const imagePath = path.join(__dirname, "test.img");
    if (!fs.existsSync(imagePath)) {
      throw new Error(" Missing Image");
    }

    // Uploads image 
    const uploadRes = await chai
      .request(app)
      .post(`/api/upload/${experienceId}`) // matches routes/uploadRoutes.js
      .attach("image", fs.readFileSync(imagePath), "test-image.jpg")
      .field("user_id", userId);

    // Confirms response is valid 
    expect(uploadRes).to.have.status(200);
    expect(uploadRes.body).to.have.property("imageUrl");
    expect(uploadRes.body).to.have.property("experience");

    const imageUrl = uploadRes.body.imageUrl;
    console.log("Uploaded image URL:", imageUrl);

    // 4️⃣ Verify MongoDB Experience has updated images array
    const updated = uploadRes.body.experience;
    expect(updated.images).to.include(imageUrl);
    expect(updated._id).to.equal(experienceId);

    console.log("\n🧾 Experience successfully updated:\n", JSON.stringify(updated, null, 2));
  });
});
