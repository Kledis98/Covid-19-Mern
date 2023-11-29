const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Assuming country names should be unique
  },

  // Other fields as needed
});

const Country = mongoose.model("Country", countrySchema);

module.exports = Country;
