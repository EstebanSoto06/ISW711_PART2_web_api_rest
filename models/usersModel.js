const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  cellphone: { type: String },
  verificationCode: { type: Number },
  verified: { type: Boolean, default: false},
  twoFA: { type: Boolean, default: true},
  admin: { type: Boolean, default: false}
});

module.exports = mongoose.model('User', user);