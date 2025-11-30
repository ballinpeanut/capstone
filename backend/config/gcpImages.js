const { Storage } = require('@google-cloud/storage');
const path = require('path');
const dotenv = require('dotenv');

/* Load Google Cloud environment variables from .env
    - located one level up in backend dir */ 
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

console.log("Credentials path:", process.env.GOOGLE_APPLICATION_CREDENTIALS); // Prints path to the key file (for debugging)

/* Creates GCP storage client */ 
// Uses credentials/project ID values from .env file  
const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS 
});

// Connects the specific bucket where images will be uploaded
const imageBucket = storage.bucket(process.env.GOOGLE_BUCKET_NAME);

module.exports = imageBucket; // Exports imageBucket for use in upload route 
