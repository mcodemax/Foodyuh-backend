"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();

require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev"; //for authentication
const FDC_BASE_URL = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=`;

//https://itnext.io/how-to-use-environment-variables-in-node-js-cb2ef0e9574a
//https://www.youtube.com/watch?v=17UVejOw3zA
const FDC_API_KEY = process.env.FDC_API_KEY || "KEY_NOT_HERE";

//path.resolve(process.cwd(), '.env') => default 
//https://www.npmjs.com/package/dotenv   docs

const PORT = +process.env.PORT || 3001;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? "postgresql://postgres:myPassword@localhost:5433/foodyuh_test"
      : process.env.DATABASE_URL || "postgresql://postgres:myPassword@localhost:5433/foodyuh";
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Foodyuh Config:".green);
console.log("FDC_API_KEY:".yellow, FDC_API_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  FDC_API_KEY,
  FDC_BASE_URL,
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
