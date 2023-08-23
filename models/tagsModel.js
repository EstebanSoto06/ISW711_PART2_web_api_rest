const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tag = new Schema({
  userID: { type: String, required: true },
  name: { type: String },
});

module.exports = mongoose.model('tag', tag);