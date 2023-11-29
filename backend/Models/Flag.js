const mongoose = require("mongoose");

const flagSchema = new mongoose.Schema({
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
  },
  name: {
    type: String,
    required: true,
  },
  flag: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
  },
  long: {
    type: Number,
  },
  cases: {
    type: Number,
    required: true,
  },
  deaths: {
    type: Number,
    required: true,
  },
  recovered: {
    type: Number,
    required: true,
  },
});

const FlagsData = mongoose.model("FlagsData", flagSchema);

module.exports = FlagsData;
