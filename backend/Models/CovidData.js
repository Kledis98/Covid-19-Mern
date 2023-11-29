const mongoose = require("mongoose");

const covidDataSchema = new mongoose.Schema({
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  totalCases: {
    type: Number,
    required: true,
  },
  totalDeaths: {
    type: Number,
    required: true,
  },
  totalRecoveries: {
    type: Number,
    required: true,
  },
});

const CovidData = mongoose.model("CovidData", covidDataSchema);

module.exports = CovidData;
