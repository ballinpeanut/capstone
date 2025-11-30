const assert = require("assert");   // Node testing module 
const fs = require("fs");
const path = require("path");

/* Creates quick delay to be sure that 
  environment is ready 
*/ 
before(function (done) {
  this.timeout(50000); // Wait 5 seconds before tests run
 
  console.log("Waiting for DB to connect...");
  
  setTimeout(() => {
    console.log("Continuing tests...");
    done();
  }, 2000); // Delay of 2 seconds 
});

/* Setup before running tests */ 
describe("Basic checks", function () {

  // Confirm tests are running 
  it("Confirm that tests can execute", function () {
    const result = "tests can exectute"
    assert.strictEqual(result, "tests can exectute" );
  });

  // Makes sure "test" environment variable is correctly set
  it("Confirm Node is setup for tests", function () {
    const env = process.env.NODE_ENV || "test"
    assert.strictEqual(env, "test");
  }); 

  // Check that all required folders exist
  it("Confirm Required Folder structure", function () {
    const root = path.join(__dirname, ".."); 
    const reqFolders = [
        "backend",
        "backend/config",
        "backend/controllers",
        "backend/middleware",
        "backend/models",
        "backend/routes",
        "frontend",
        "docs",
        "tests",
        ".github/workflows"
    ]; 
    // This loops through the expected folders to confirm they're present 
    reqFolders.forEach((folder) => {
        const folders = path.join(root, folder); 
        assert.ok(fs.existsSync(folders), `${folder} is missing`)
    }); 
  });
});
