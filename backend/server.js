const express = require("express");
const mongoose = require("mongoose");
const Country = require("./Models/Country");
const CovidData = require("./Models/CovidData");
const Admin = require("./Models/Admin");
const axios = require("axios");
const bcrypt = require("bcrypt");
const adminUserRouter = require("./Routes/adminUser");
const cors = require("cors");
const { format } = require("date-fns");
const { parseISO } = require("date-fns");
const { ObjectId } = mongoose.Types; // Add this line to import ObjectId
const FlagsData = require("./Models/Flag");
const stringSimilarity = require("string-similarity");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
const PORT = 5000;

app.use(bodyParser.json());
app.use(adminUserRouter);

// MongoDB connection and schema/model definitions...

const uri =
  "mongodb+srv://kledis123:kledis123@covidfirsttry-cluster.f7rqmvv.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri);

// const fetchDataFromAPI = async () => {
//   try {
//     // Fetch data from the external API
//     const response = await axios.get(
//       "https://disease.sh/v3/covid-19/historical?lastdays=100"
//     );

//     // Check if the request was successful
//     if (response.status !== 200) {
//       throw new Error(`Failed to fetch data. Status: ${response.status}`);
//     }

//     // Extract relevant information
//     const historicalData = response.data;

//     // Log the structure of the received data
//     // console.log(
//     //   "Received data structure:",
//     //   JSON.stringify(historicalData, null, 2)
//     // );

//     // Process and use the data as needed
//     historicalData.forEach(async (countryData) => {
//       // Extract data for each country
//       const countryName = countryData.country;
//       const timeline = countryData.timeline;

//       // Create or update Country document
//       const countryDocument = await Country.findOneAndUpdate(
//         { name: countryName },
//         { name: countryName },
//         { upsert: true, new: true }
//       );

//       // Extract data for each date from the timeline
//       const dates = Object.keys(timeline.cases);

//       // Create or update CovidData documents for each date
//       const promises = dates.map((date) => {
//         const formattedDate = format(new Date(date), "yyyy-MM-dd");

//         const covidData = {
//           country: countryDocument._id,
//           date: formattedDate, // Use the formatted date
//           totalCases: timeline.cases[date],
//           totalDeaths: timeline.deaths[date],
//           totalRecoveries: timeline.recovered[date],
//           // Add other fields as needed
//         };

//         return CovidData.findOneAndUpdate(
//           { country: countryDocument._id, date: covidData.date },
//           covidData,
//           { upsert: true, new: true }
//         );
//       });

//       await Promise.all(promises);
//     });

//     console.log("Data successfully fetched and stored.");
//   } catch (error) {
//     console.error("Error fetching or storing data:", error);
//   }
// };

// // Call the function to fetch and store data
// fetchDataFromAPI();

// const saveFlagToDatabase = async () => {
//   try {
//     // Check if there's any data in the FlagsData collection
//     const existingData = await FlagsData.findOne();

//     // If there's existing data, skip fetching and saving
//     if (existingData) {
//       console.log(
//         "Data already exists in the database. Skipping fetch and save."
//       );
//       return;
//     }
//     // Fetch data from the API
//     const response = await axios.get(
//       "https://disease.sh/v3/covid-19/countries"
//     );

//     // Check if the request was successful
//     if (response.status === 200) {
//       const apiData = response.data;

//       // Transform data and save to MongoDB
//       const flagsData = await Promise.all(
//         apiData.map(async (data) => {
//           const countryNames = await Country.find().distinct("name");
//           const matches = stringSimilarity.findBestMatch(
//             data.country,
//             countryNames
//           );

//           const bestMatchName = matches.bestMatch.target;
//           const country = await Country.findOne({ name: bestMatchName });

//           if (country) {
//             return {
//               country: country._id,
//               name: data.country,
//               flag:
//                 data.countryInfo && data.countryInfo.flag
//                   ? data.countryInfo.flag
//                   : "",
//               lat:
//                 data.countryInfo && data.countryInfo.lat
//                   ? data.countryInfo.lat
//                   : null,
//               long:
//                 data.countryInfo && data.countryInfo.long
//                   ? data.countryInfo.long
//                   : null,
//               cases: data.cases,
//               deaths: data.deaths,
//               recovered: data.recovered,
//               // Other fields from the API response
//             };
//           } else {
//             console.error(`Country not found for name: ${data.country}`);
//             return null; // or handle this case appropriately
//           }
//         })
//       );

//       const validFlagsData = flagsData.filter((flag) => flag !== null);

//       await FlagsData.insertMany(validFlagsData);
//       console.log("Data fetched and saved successfully!");
//     } else {
//       console.error(
//         "Error fetching data from the API. Status:",
//         response.status
//       );
//     }
//   } catch (error) {
//     console.error("Error fetching and saving data:", error);
//   }
// };

// // Call the function to fetch and save data
// saveFlagToDatabase();

/// / /
///
/////
////
///

// async function createAdmin() {
//   try {
//     const username = "kledis123";
//     const password = "kledis123";

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create the admin document
//     const admin = new Admin({
//       username,
//       password: hashedPassword,
//     });

//     // Save the admin to the database
//     await admin.save();

//     console.log("Admin created successfully");
//   } catch (error) {
//     console.error("Error creating admin:", error);
//   }
// }

// createAdmin();

app.get("/countries", async (req, res) => {
  try {
    const countries = await Country.find({}, "_id name"); // Include both _id and name
    res.json(countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/country/:countryId", async (req, res) => {
  try {
    const countryId = req.params.countryId;
    // Convert the countryId to a MongoDB ObjectId

    const countryData = await FlagsData.find({ country: countryId });

    // Send the data back to the frontend
    res.json(countryData);
  } catch (error) {
    console.error("Error fetching country data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/flagsdata", async (req, res) => {
  try {
    const flagsData = await FlagsData.find();
    res.json(flagsData);
  } catch (error) {
    console.error("Error fetching FlagsData:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// // Endpoint to get data for a specific country
// app.get("/country/:countryName", async (req, res) => {
//   const { countryName } = req.params;

//   try {
//     // Find the Country document
//     const country = await Country.findOne({ name: countryName });

//     if (!country) {
//       return res.status(404).json({ error: "Country not found" });
//     }

//     // Find related data from the FlagsData collection
//     const flagsData = await FlagsData.findOne({ country: country._id });

//     if (!flagsData) {
//       return res.status(404).json({ error: "Data not found for the country" });
//     }

//     // Combine data and send it to the client
//     const combinedData = {
//       country,
//       flagsData,
//     };

//     res.json(combinedData);
//   } catch (error) {
//     console.error("Error fetching country data:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.get("/covid", async (req, res) => {
  try {
    const { country, date } = req.query;

    const parsedDate = parseISO(date);

    if (!parsedDate || isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date format. Please provide a valid date.");
    }

    const formattedDate = format(parsedDate, "yyyy-MM-dd");

    const covid = await CovidData.find({
      country: new ObjectId(country), // Convert selectedCountryId to ObjectId
      date: new Date(formattedDate),
    })
      .select("totalCases totalDeaths totalRecoveries")
      .exec();

    if (!covid || covid.length === 0) {
      return res.json({
        message: "No data found for the specified country and date.",
      });
    }

    res.json(covid);
  } catch (error) {
    console.error("Error fetching covid data:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/covid/countries", async (req, res) => {
  try {
    const { date } = req.query;

    const parsedDate = parseISO(date);

    if (!parsedDate || isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date format. Please provide a valid date.");
    }

    const formattedDate = format(parsedDate, "yyyy-MM-dd");

    const countries = await Country.find().exec();

    // Fetch total cases for each country for the specified date
    const fetchDataForDate = async (country) => {
      try {
        const covidData = await CovidData.find({
          country: country._id,
          date: new Date(formattedDate),
        })
          .select("totalCases")
          .exec();

        return {
          _id: country._id,
          name: country.name,
          totalCases: covidData.length ? covidData[0].totalCases : 0,
        };
      } catch (error) {
        console.error(`Error fetching data for ${country.name}:`, error);
      }
    };

    // Fetch total cases for each country
    const countriesData = await Promise.all(
      countries.map((country) => fetchDataForDate(country))
    );

    res.json(countriesData);
  } catch (error) {
    console.error("Error fetching covid data:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/covid/:countryId", async (req, res) => {
  try {
    const { countryId } = req.params;
    console.log(`Fetching data for country: ${countryId}`);

    // Fetch all data for the specified country
    const covidData = await CovidData.find({ country: countryId });

    // Extract and send relevant data to the client
    const formattedData = covidData.map((entry) => ({
      date: entry.date,
      totalCases: entry.totalCases,
      totalDeaths: entry.totalDeaths,
      totalRecoveries: entry.totalRecoveries,
      // Add other relevant fields if needed
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/countries/:countryId", async (req, res) => {
  try {
    const { countryId } = req.params;
    console.log(`Fetching data for country: ${countryId}`);

    // Fetch the country by ID
    const country = await Country.findById(countryId);

    if (!country) {
      return res.status(404).json({ error: "Country not found" });
    }

    // Fetch the flag data based on the countryId from FlagsData
    const flagData = await FlagsData.findOne({ country: countryId });

    if (!flagData) {
      return res
        .status(404)
        .json({ error: "Flag data not found for the country" });
    }

    // Send relevant data to the client, including the flag URL
    const formattedData = {
      name: country.name,
      flag: flagData.flag,
      lat: flagData.lat,
      long: flagData.long,
      cases: flagData.cases,
      deaths: flagData.deaths,
      recovered: flagData.recovered,
    };

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching country:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/// Endpoint to get data for all countries from FlagsData collection

app.get("/flagsdata", async (req, res) => {
  try {
    // Fetch all flag data for countries from FlagsData collection
    const flagsData = await FlagsData.find();

    // Return the flag data for all countries
    res.json(flagsData);
  } catch (error) {
    console.error("Error fetching countries data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
