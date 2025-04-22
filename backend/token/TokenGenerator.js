const jwt = require("jsonwebtoken");

const generate_Access_token = (ID, access, FullName) => {
  return jwt.sign({ ID, access, FullName }, process.env.SECRET_ACCESS_TOKEN, {
    expiresIn: "10m",
  });
};

const generate_refresh_token = (ID) => {
  return jwt.sign({ ID }, process.env.SECRET_REFRESH_TOKEN, {
    expiresIn: "30d",
  });
};

module.exports = { generate_Access_token, generate_refresh_token };
