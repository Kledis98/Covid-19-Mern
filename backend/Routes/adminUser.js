const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../Models/Admin");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const mongoose = require("mongoose");
const CovidData = require("../Models/CovidData");

// Add data
router.post("/covid/:country/:date", async (req, res) => {
  try {
    console.log("Request received"); // Add this line

    const { country, date } = req.params;
    const { totalCases, totalDeaths, totalRecoveries } = req.body;

    // Assuming country is an ObjectID
    const countryObjectId = new mongoose.Types.ObjectId(country);

    // Create a new CovidData document
    const newData = new CovidData({
      country: countryObjectId,
      date,
      totalCases,
      totalDeaths,
      totalRecoveries,
    });

    // Save the new data to the database
    await newData.save();

    console.log("Data added successfully");
    res.status(201).json({ message: "Data added successfully" });
  } catch (error) {
    console.error("Error adding data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Delete data
router.delete("/covid/:country/:date", async (req, res) => {
  try {
    const { country, date } = req.params;

    // Assuming country is an ObjectID
    const countryObjectId = new mongoose.Types.ObjectId(country);

    const result = await CovidData.deleteOne({
      country: countryObjectId,
      date,
    });

    if (result.deletedCount === 0) {
      console.log("Data not found for the given country and date.");
      return res
        .status(404)
        .json({ error: "Data not found for the given country and date" });
    }

    console.log("Data deleted successfully");
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update CovidData for a specific country and date
router.put("/covid/:country/:date", async (req, res) => {
  try {
    const { country, date } = req.params;
    const { totalCases, totalDeaths, totalRecoveries } = req.body;

    // Assuming country is an ObjectID
    const countryObjectId = new mongoose.Types.ObjectId(country);

    const existingData = await CovidData.findOne({
      country: countryObjectId,
      date,
    });

    if (!existingData) {
      console.log("Data not found for the given country and date.");
      return res
        .status(404)
        .json({ error: "Data not found for the given country and date" });
    }
    console.log("Before save - existingData:", existingData);

    existingData.totalCases = totalCases;
    existingData.totalDeaths = totalDeaths;
    existingData.totalRecoveries = totalRecoveries;

    console.log("After modifications - existingData:", existingData);

    await existingData.save();

    console.log("Data updated successfully");
    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin-panel", protect, (req, res) => {
  // The user is authenticated, and req.user contains the user information
  res.json({ message: "Admin Panel Route" });
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Request body:", req.body);

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ message: "Admin does not exist!" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    console.log("Is password valid?", isPasswordValid);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Username or Password is Incorrect!" });
    }

    const token = jwt.sign({ id: admin._id }, "secret");
    res.json({ token, adminID: admin._id });
  } catch (error) {
    console.error("Error in login route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
