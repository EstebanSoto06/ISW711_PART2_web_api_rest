const Session= require("../models/sessionModel");
const crypto = require('crypto');

const saveSession = function (username) {
  const token = crypto.createHash('md5').update(username).digest("hex")
  // insert token to the session table
  const session = new Session();
  session.token = token;
  session.user = username;

  // expiration date will be 1 month after the date the session is opened
  const actualDate = new Date();
  const expirationDate = new Date(actualDate);
  expirationDate.setMonth(expirationDate.getMonth() + 1);
  session.expire = expirationDate;
  
  session.save(function (err) {
    if (err) {
      console.log('error while saving the session', err)
      return {
        error: 'There was an error saving the session'
      };
    }
    return session;
  });
};

module.exports = {
  saveSession,
}