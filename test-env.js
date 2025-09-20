// server/test-env.js
console.log("Starting test-env.js");
const dotenv = require('dotenv');
const path = require('path'); // <-- 1. Import path module

console.log("--- Starting environment test ---");

// 2. Point dotenv to the correct .env file location
const result = dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Check if dotenv returned an error while parsing the file
if (result.error) {
  console.error("!!! DOTENV PARSING ERROR:", result.error);
}

// This shows us what dotenv *actually* read from the file
console.log("Dotenv parsed object:", result.parsed);

// This shows us what is available in the final process.env
console.log("MONGODB_URI from process.env:", process.env.MONGODB_URI);

console.log("--- Test finished ---");