const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const promptRequest = new Schema({
  tag: { type: String},
  type: { type: String, required: true }, // It can be"edit", "images" o "completions"
  userID: { type: String, required: true },
  // Other atributes 
  data: { type: Object }
});

module.exports = mongoose.model('promptRequest', promptRequest);