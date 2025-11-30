process.env.NODE_ENV = "test";

const { expect } = require("chai");
const Experience = require("../backend/models/Experience");
const { createExperience } = require("../backend/controllers/experienceController");

// This sets up a fake response object
function mockResponse() {
  const res = {};
  res.statusCode = 0;
  res.data = null;
  res.status = function (code) {
    this.statusCode = code;
    return this;
  };
  res.json = function (payload) {
    this.data = payload;
    return this;
  };
  return res;
}

describe("CREATE EXPERIENCE - CONTROLLER TEST", () => {
  it("Create an experience and return 201", async () => {
    // fake request and response
    const req = {
      user: { id: "123" },
      body: {
        title: "Manual Test Experience",
        date_traveled: "2025-11-10",
        location: "Portland",
        visibility: "public",
        images: ["https://storage.googleapis.com/fakeimg.jpg"],
      },
    };
    const res = mockResponse();

    // temporarily replace Experience.create with fake function
    const originalCreate = Experience.create;
    Experience.create = async (data) => ({
      _id: "abc123",
      ...data,
      user_id: req.user.id,
    });

    // run controller from /controllers/experienceController 
    await createExperience(req, res);

    // make assertions 
    expect(res.statusCode).to.equal(201);
    expect(res.data).to.have.property("_id");
    expect(res.data.images[0]).to.match(/^https:\/\/storage\.googleapis\.com/);

    // restore original
    Experience.create = originalCreate;
  });

  it("Fail if Required fields are missing", async () => {
    const req = { user: { id: "123" }, body: {} };
    const res = mockResponse();

    try {
      await createExperience(req, res);
      throw new Error("Expected an error but none was thrown");
    } catch (err) {
      expect(err.message).to.include("mandatory");
    }
  });
});
