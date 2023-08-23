const crypto = require('crypto');
const Session = require("../models/sessionsModel");

// Function to generate a random date within a given range
function getRandomDate() {
  const startDate = new Date(2024, 0, 1);
  const endDate = new Date(2024, 11, 31);

  const startTimestamp = startDate.getTime();
  const endTimestamp = endDate.getTime();
  const randomTimestamp = Math.random() * (endTimestamp - startTimestamp) + startTimestamp;

  return new Date(randomTimestamp);
};

const saveSession = async function (username) {
  const token = crypto.createHash('md5').update(username).digest("hex");
  // insert token to the session table
  const session = new Session();
  session.token = token;
  session.user = username;
  session.expire = getRandomDate();
  return session.save();
};


module.exports = {
  saveSession,
}