/**
 * API Connection Test
 * Purpose: Simulate API endpoint checks to verify server.
 */

const axios = require("axios");

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

async function pingServer() {
  console.log("Checking server connectivity...\n");

  try {
    const response = await axios.get(`${BASE_URL}/`);
    console.log(`Server responded with status: ${response.status}`);
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      console.warn("Cannot connect — is the server running?");
    } else {
      console.error(`Unexpected error: ${error.message}`);
    }
  }
}

async function checkNonexistentRoute() {
  try {
    await axios.get(`${BASE_URL}/nonexistent`);
    console.warn("Unexpected success: nonexistent route returned 200.");
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log("Correctly returned 404 for nonexistent route.");
    } else {
      console.error("Unexpected response:", error.message);
    }
  }
}

(async () => {
  console.log("Starting API connection test...\n");
  await pingServer();
  await checkNonexistentRoute();
  console.log("\nAPI connection test complete.");
})();
