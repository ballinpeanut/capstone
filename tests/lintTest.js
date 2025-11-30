/**
 * Lint Test File
 * Purpose: Ensures ESLint configuration correctly flags code issues.
 */

// Unused variable  
const dbConnection = "mongodb://localhost:27017/test";

// Missing semicolon  
function connectToDb() {
    console.log("Connecting to database")
}

// Inconsistent indentation  
function registerUser(user) {
  if (!user.email) {
      console.log("Missing email");
    return false;
  }
  console.log(`Registering ${user.email}`);
  return true;
}

// Unused import simulation  
const express = require("express");

// Variable naming convention test  
const User_name = "Patrick";

// Console.log  
console.log("Lint test file executed successfully.");

// Long line test  
const veryLongString = "This is an intentionally long string meant to check whether the ESLint max-len rule is active and properly configured to catch excessive line length violations for demonstration purposes only.";
