"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config(); //maybe revet to this ifthere's errors; require("dotenv").config();
//might need to hchange this to default hen deploying app to heroku
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev"; //for authentication

//maybe move to frontend
const {SECRET_API_KEY} = process.env.FDC_API_KEY ? {SECRET_API_KEY: null} : require('./secret');
//https://itnext.io/how-to-use-environment-variables-in-node-js-cb2ef0e9574a
const FDC_API_KEY = process.env.FDC_API_KEY || SECRET_API_KEY;
//const {FDC_API_KEY} = require('./secret')

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
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
