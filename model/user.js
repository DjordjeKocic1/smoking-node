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
  image: String,
  address: String,
  city: String,
  cigarettes: String,
  packCigarettesPrice: String,
  cigarettesInPack: String,
  userVerified:Boolean
});

module.exports = mongoose.model("User", userShema);
