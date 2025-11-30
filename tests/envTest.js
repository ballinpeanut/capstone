/**
 * Environment Test File
 * Purpose: Verify environment variables and essential Node modules are accessible.
 */

console.log("Running environment configuration test...\n");

// Check for environment variables
const requiredEnvVars = ["MONGO_URI", "PORT"];
let missingVars = [];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    missingVars.push(key);
  }
});

if (missingVars.length > 0) {
  console.warn(`Missing environment variables: ${missingVars.join(", ")}`);
} else {
  console.log("All required environment variables are set.");
}

// Check that required Node modules are installed
try {
  require("express");
  require("dotenv");
  require("cors");
  console.log("All required modules are available.");
} catch (err) {
  console.error("Missing a required module:", err.message);
}

// Basic runtime logic test
function add(a, b) {
  return a + b;
}

const result = add(2, 3);
if (result === 5) {
  console.log("Basic runtime test passed.");
} else {
  console.error("Basic runtime test failed.");
}

console.log("\nEnvironment test complete.");
