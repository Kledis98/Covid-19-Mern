import React, { useState, useEffect } from "react";
import axios from "axios";

function AddForm() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalCases, setTotalCases] = useState(0);
  const [totalDeaths, setTotalDeaths] = useState(0);
  const [totalRecoveries, setTotalRecoveries] = useState(0);
  const [covidData, setCovidData] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addMessage, setAddMessage] = useState("");

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

  const handleAddData = async () => {
    try {
      setLoading(true);

      const existingDataResponse = await axios.get(
        `https://covid-19-tracker-mt79.onrender.com/covid?country=${selectedCountry}&date=${selectedDate}`
      );

      const existingData = existingDataResponse.data;

      if (existingData && existingData.length > 0) {
        setAddMessage("Data already exists for the selected country and date");
      } else {
        // Data doesn't exist, proceed with adding
        const response = await axios.post(
          `https://covid-19-tracker-mt79.onrender.com/covid/${selectedCountry}/${selectedDate}`,
          {
            totalCases,
            totalDeaths,
            totalRecoveries,
          }
        );

        if (response.status === 201) {
          setAddMessage("Data added successfully");
        } else {
          setAddMessage("Failed to add data");
        }

        // Fetch updated data after adding
        await fetchData();
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid ">
      <div className="row g-3 justify-content-center my-2 ">
        <div className="col-md-7 ">
          <div className="p-3 bg-white rounded ">
            <h2>Add Data</h2>
            <div className="mb-2">
              <label>Select Country:</label>
              <select
                data-test="add-country-dropdown"
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
                data-test="add-date-picker"
                type="date"
                id="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="totalCases">Total Cases:</label>
              <input
                data-test="add-total-cases"
                type="number"
                id="totalCases"
                value={totalCases}
                onChange={(e) => setTotalCases(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="totalDeaths">Total Deaths:</label>
              <input
                data-test="add-total-deaths"
                type="number"
                id="totalDeaths"
                value={totalDeaths}
                onChange={(e) => setTotalDeaths(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="totalRecoveries">Total Recoveries:</label>
              <input
                data-test="add-total-recoveries"
                type="number"
                id="totalRecoveries"
                value={totalRecoveries}
                onChange={(e) => setTotalRecoveries(e.target.value)}
              />
            </div>

            {addMessage && (
              <div data-test="success-message-added-data">{addMessage}</div>
            )}

            <div>
              <button
                data-test="add-data-button"
                type="button"
                onClick={handleAddData}
                className={`btn btn-success `}
              >
                Add Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddForm;
