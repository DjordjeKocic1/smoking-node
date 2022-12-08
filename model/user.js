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
    require: false,
  },
  cigarettes: {
    type: String,
    require: false,
  },
  packCigarettesPrice: {
    type: String,
    require: false,
  },
});

module.exports = mongoose.model("User", userShema);
