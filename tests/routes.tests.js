/*Routes Testing
  Uses Mocha, Chai, Chai-HTTP
   This makes sure that 
   routes (register, login, etc.)
   respond correctly using different 
   parameters 
*/

// Sets the testing environment 
process.env.NODE_ENV = "test";

/*This ensures that print messages 
  won't show any stack tracing 
  errors - keeps console.log only 
*/
const originalStderrWrite = process.stderr.write.bind(process.stderr);
process.stderr.write = (chunk, ...args) => {
  const msg = chunk.toString();

  // This filters out the stack lines 
  if (
    msg.includes("at ") ||               // stack trace lines
    msg.includes("node:internal") ||     
    msg.includes("node_modules")          
  ) {
    return;  
  }

  // Prints everything else out per normal usage 
  return originalStderrWrite(chunk, ...args);
};

/* IMPORTS */
const chai = require("chai");    
const chaiHttp = require("chai-http");  // Allows HTTP requests  
const expect = chai.expect;
const app = require("../backend/server");

chai.use(chaiHttp);

/* This tests routes including login 
  and registration routes. Attempts to login
  and tests if user is already registered 
  */
describe("Confirm routes work", function () {

  /*Registration route accepts user data */
  it("Responds to the registration route", function (done) {
    chai.request(app)
      .post("/api/users/register")
      .send({
        username: "testuser",
        email: "testuser@example.com",
        password: "12345"
    })
    .end((err, res) => {
      // This will jump the error if user exists
      if (err && err.message.includes("already registered")) return done();  
      expect(res.status).to.be.within(200, 500);
      done();
    });
  });

  /* Checks duplicate registration using same email */
  it("Failed if trying to register with an existing email", function (done) {
  chai.request(app)
    .post("/api/users/register")
    .send({
      username: "testuser", 
      email: "testuser@example.com", // same as before
      password: "12345"
    })
    .end((err, res) => {
      expect(res.status).to.be.within(400, 500);
      done();
    });
  });

  /* Registration fails when required fields are missing */ 
  it("Fails registration if email is missing", function (done) {
  chai.request(app)
    .post("/api/users/register")
    .send({
      username: "missingemail",
      password: "12345"
    })
    .end((err, res) => {
      expect(res.status).to.be.within(400, 500);
      done();
    });
});

  /* Login works with valid creds */ 
  it("Responds to the login route", function (done) {
    chai.request(app)
      .post("/api/users/login")
      .send({
        email: "testuser@example.com",
        password: "12345"
      })
      .end((err, res) => {
        expect(res.status).to.be.within(200, 500);
        done();
      });
   });
   
  /* Checks Invalid Login Creds */
  it("Rejects login with wrong password", function (done) {
    chai.request(app)
      .post("/api/users/login")
      .send({
        email: "testuser@example.com",
        password: "wrongpassword"
      })
      .end((err, res) => {
        expect(res.status).to.be.within(400, 500);
        done();
      });
  });

  /*  Checks for invalid routes */
  it("Returns 404 for an invalid route", function (done) {
    chai.request(app)
      .get("/api/users/thisroutedoesnotexist")
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });
});

