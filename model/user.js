const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userShema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  image: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  cigarettes: {
    type: String,
  },
  packCigarettesPrice: {
    type: String,
    require: false,
  },
});

module.exports = mongoose.model("User", userShema);
