import React, { useState, useEffect } from "react";
import axios from "axios";
import InfoBox from "../../components/InfoBox/InfoBox";
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
        const response = await axios.get(
          "https://covid-19-tracker-mt79.onrender.com/countries"
        );
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
      const response = await fetch(
        `https://covid-19-tracker-mt79.onrender.com/covid?country=${selectedCountry}&date=${selectedDate}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.length > 0) {
        setCovidData(data);
      } else {
        setCovidData(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCountryChange = async (event) => {
    const newSelectedCountry = event.target.value;
    setSelectedCountry(newSelectedCountry);

    try {
      // Make a request to your backend to get the corresponding data
      const response = await axios.get(
        `https://covid-19-tracker-mt79.onrender.com/country/${newSelectedCountry}`
      );
      const dataArray = response.data;

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
      console.log("Error response:", error.response);
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleFetchData = async () => {
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
        `https://covid-19-tracker-mt79.onrender.com/covid/${selectedCountry}/${selectedDate}`,
        {
          totalCases,
          totalDeaths,
          totalRecoveries,
        }
      );

      fetchData();

      // Reset the input fields
      setTotalCases(0);
      setTotalDeaths(0);
      setTotalRecoveries(0);

      // Stop loading state
      setLoading(false);
    } catch (error) {
      console.error("Error modifying data:", error);

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
              <select
                data-test="modify-country-dropdown"
                value={selectedCountry}
                onChange={handleCountryChange}
              >
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
                data-test="modify-date-input"
                type="date"
                id="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
            <div>
              <button
                data-test="modify-fetch-button"
                type="button"
                onClick={handleFetchData}
                className="btn btn-success "
              >
                Fetch Data
              </button>
              <hr></hr>
            </div>
            <Grid data-test="info-box" container spacing={3} className="mb-3">
              {/* Display the total data */}
              {covidData &&
                covidData.map((entry) => (
                  <React.Fragment key={entry._id}>
                    <Grid data-test="info-box-total-cases" item xs={4}>
                      <InfoBox title="Total Cases" cases={entry.totalCases} />
                    </Grid>
                    <Grid data-test="info-box-total-recoveries" item xs={4}>
                      <InfoBox
                        title="Total Recoveries"
                        cases={entry.totalRecoveries}
                      />
                    </Grid>
                    <Grid data-test="info-box-total-deaths" item xs={4}>
                      <InfoBox title="Total Deaths" cases={entry.totalDeaths} />
                    </Grid>
                  </React.Fragment>
                ))}
            </Grid>
            <div>
              <div className="mb-2 mt-2">
                <label htmlFor="totalCases">Total Cases:</label>
                <input
                  data-test="modify-totalCases"
                  type="number"
                  id="totalCases"
                  value={totalCases}
                  onChange={(e) => setTotalCases(e.target.value)}
                />
              </div>
              <div className="mb-2 ">
                <label htmlFor="totalRecoveries">Total Recoveries:</label>
                <input
                  data-test="modify-totalRecoveries"
                  type="number"
                  id="totalRecoveries"
                  value={totalRecoveries}
                  onChange={(e) => setTotalRecoveries(e.target.value)}
                />
              </div>
              <div className="mb-3 ">
                <label htmlFor="totalDeaths">Total Deaths:</label>
                <input
                  data-test="modify-totalDeaths"
                  type="number"
                  id="totalDeaths"
                  value={totalDeaths}
                  onChange={(e) => setTotalDeaths(e.target.value)}
                />
              </div>
              <div>
                <button
                  data-test="modify-data-button"
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
