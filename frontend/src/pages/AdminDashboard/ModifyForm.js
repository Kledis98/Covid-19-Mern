import React, { useState, useEffect } from "react";
import axios from "axios";
import InfoBox from "../../InfoBox";
import { prettyPrintStat } from "../../util";
import { Card, CardContent, Grid } from "@mui/material";

function ModifyForm() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalCases, setTotalCases] = useState(0);
  const [totalDeaths, setTotalDeaths] = useState(0);
  const [totalRecoveries, setTotalRecoveries] = useState(0);
  const [covidData, setCovidData] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("http://localhost:5000/countries");
        if (response.status === 200) {
          setCountries(response.data);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const fetchData = async () => {
    try {
      // Choose the appropriate endpoint
      // const response = await fetch(`/covid?country=${selectedCountry}&date=${selectedDate}`);
      const response = await fetch(
        `http://localhost:5000/covid?country=${selectedCountry}&date=${selectedDate}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.length > 0) {
        setCovidData(data);
      } else {
        console.log("No data found for the selected country and date.");
        setCovidData(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCountryChange = async (event) => {
    const newSelectedCountry = event.target.value;
    setSelectedCountry(newSelectedCountry);
    console.log("Selected Country ID:", selectedCountry);

    try {
      // Make a request to your backend to get the corresponding data
      const response = await axios.get(
        `http://localhost:5000/country/${newSelectedCountry}`
      );
      const dataArray = response.data;
      console.log("Response from server:", response); // Log the entire response

      const data = dataArray[0];

      if (data) {
        // Update state with the data for the selected country
        setCountryData(data, () => {
          console.log("Updated Country Data:", countryData);
        });
      } else {
        console.error("Invalid data received from the server:", data);
      }
    } catch (error) {
      console.error("Error fetching country data:", error); // Log the error object
      console.log("Error response:", error.response); // Log the error response
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleFetchData = async () => {
    console.log("Selected Date for Fetch Data:", selectedDate);
    setLoading(true);

    await fetchData();
    setLoading(false);
  };

  const handleModifyData = async () => {
    try {
      // Start loading state
      setLoading(true);

      // Make a request to update data
      const response = await axios.put(
        `http://localhost:5000/covid/${selectedCountry}/${selectedDate}`,
        {
          totalCases,
          totalDeaths,
          totalRecoveries,
          // Add more fields as needed
        }
      );

      // Log the response (for debugging)
      console.log("Modify Data Response:", response);

      // If the modification was successful, you might want to update the UI or show a success message
      // For example, you can fetch the data again to reflect the changes
      fetchData();

      // Reset the input fields
      setTotalCases(0);
      setTotalDeaths(0);
      setTotalRecoveries(0);

      // Stop loading state
      setLoading(false);
    } catch (error) {
      // Handle errors
      console.error("Error modifying data:", error);

      // Stop loading state
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid ">
      <div className="row g-3 justify-content-center my-2 ">
        <div className="col-md-7 ">
          <div className="p-3 bg-white rounded ">
            <h2>Modify Data</h2>
            <div className="mb-2">
              <label>Select Country:</label>
              <select value={selectedCountry} onChange={handleCountryChange}>
                <option value="" disabled>
                  Select a country
                </option>
                {countries.map((country) => (
                  <option key={country._id} value={country._id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="date">Select Date:</label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
            <div>
              <button
                type="button"
                onClick={handleFetchData}
                className="btn btn-success "
              >
                Fetch Data
              </button>
              <hr></hr>
            </div>
            <Grid container spacing={3} className="mb-3">
              {/* Display the total data */}
              {covidData &&
                covidData.map((entry) => (
                  <React.Fragment key={entry._id}>
                    <Grid item xs={4}>
                      <InfoBox title="Total Cases" cases={entry.totalCases} />
                    </Grid>
                    <Grid item xs={4}>
                      <InfoBox
                        title="Total Recoveries"
                        cases={entry.totalRecoveries}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <InfoBox title="Total Deaths" cases={entry.totalDeaths} />
                    </Grid>
                  </React.Fragment>
                ))}
            </Grid>
            <div>
              <div className="mb-2 mt-2">
                <label htmlFor="totalCases">Total Cases:</label>
                <input
                  type="number"
                  id="totalCases"
                  value={totalCases}
                  onChange={(e) => setTotalCases(e.target.value)}
                />
              </div>
              <div className="mb-2 ">
                <label htmlFor="totalRecoveries">Total Recoveries:</label>
                <input
                  type="number"
                  id="totalRecoveries"
                  value={totalRecoveries}
                  onChange={(e) => setTotalRecoveries(e.target.value)}
                />
              </div>
              <div className="mb-3 ">
                <label htmlFor="totalDeaths">Total Deaths:</label>
                <input
                  type="number"
                  id="totalDeaths"
                  value={totalDeaths}
                  onChange={(e) => setTotalDeaths(e.target.value)}
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleModifyData}
                  className={`btn btn-primary`}
                >
                  {loading ? "Modifying Data..." : "Modify Data"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModifyForm;
