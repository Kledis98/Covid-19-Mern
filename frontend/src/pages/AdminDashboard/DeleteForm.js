import React, { useState, useEffect } from "react";
import axios from "axios";

function DeleteForm() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [covidData, setCovidData] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

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
        `http://localhost:5000/country/${newSelectedCountry}`
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
      console.log("Error response:", error.response); // Log the error response
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleDeleteData = async () => {
    try {
      // Start loading state
      setLoading(true);

      // Make a request to delete data
      const response = await axios.delete(
        `http://localhost:5000/covid/${selectedCountry}/${selectedDate}`
      );

      if (response.status === 200) {
        setDeleteMessage("Data deleted successfully");
      } else if (response.status === 404) {
        setDeleteMessage("No data found for the given country and date");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error deleting data:", error);
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid ">
      <div className="row g-3 justify-content-center my-2 ">
        <div className="col-md-7 ">
          <div className="p-3 bg-white rounded ">
            <h2>Delete Data</h2>
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
            {deleteMessage && (
              <div className="delete-message">{deleteMessage}</div>
            )}
            <div>
              <button
                type="button"
                onClick={handleDeleteData}
                className={`btn btn-danger `}
              >
                Delete Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteForm;
