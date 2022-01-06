const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  console.assert(user.isAdmin !== undefined,
      "createToken passed user without isAdmin property");//writes err msg if false

  console.assert(user.isPaid !== undefined,
      "createToken passed user without isPaid property");//writes err msg if false
    console.log(user)
  let payload = {
    username: user.username,
    isAdmin: user.isAdmin || false,
    isPaid: user.isPaid || false, //altered for fooyuh
  };

  console.log(SECRET_KEY);
  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
