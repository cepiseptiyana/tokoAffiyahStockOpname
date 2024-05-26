const fs = require("node:fs");

function jsonLogin() {
  let file = fs.readFileSync("data/login.json", "utf-8");
  const contacts = JSON.parse(file);
  return contacts;
}

module.exports = { jsonLogin };
