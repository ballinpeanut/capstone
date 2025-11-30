const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");

require("dotenv").config({ path: "./backend/.env" });
const app = require("../backend/server");

chai.use(chaiHttp);

describe("FETCH ALL EXPERIENCES", () => {
  it("Returns experiences with image URLs", async () => {
    const res = await chai.request(app).get("/api/experiences");

    console.log("\nList of Experiences:", JSON.stringify(res.body, null, 2))

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");

    if (res.body.length > 0) {
      const exp = res.body[0];
      expect(exp).to.have.property("title");
      expect(exp).to.have.property("images");
      expect(exp.images[0]).to.match(/^https:\/\/storage\.googleapis\.com/);
    }
  });
});
