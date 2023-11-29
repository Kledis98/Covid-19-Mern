import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import LogIn from "../components/LogIn/Login";
import "../App.css"; // Updated import path
import InfoBox from "../InfoBox";
import Map from "../Map";
import { Card, CardContent, Grid } from "@mui/material";
// import MyDatePicker from "./MyDatePicker";
import { format } from "date-fns";
import Table from "../components/Table/Table";
import LineGraph from "../components/LineGraph/LineGraph";
import { CategoryScale, Chart } from "chart.js/auto";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.css";
import { prettyPrintStat } from "../util";
import {useCookies} from 'react-cookie'




function Home() {
    const [countries, setCountries] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [covidData, setCovidData] = useState(null);
    const [selectedCountryId, setSelectedCountryId] = useState("");
    const [dailyData, setDailyData] = useState(null); // New state for daily data
    const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
    const [mapZoom, setMapZoom] = useState(3);
    const [mapFlagCountries, setMapFlagCountries] = useState([]);
    const [countryData, setCountryData] = useState(null);
    const [flagCountries, setFlagCountries] = useState([]);
    const [casesType, setCasesType] = useState("cases");
    const [cookies, setCookies] = useCookies(["access_token"]);
    const [dataExists, setDataExists] = useState(true);


  



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
  
    useEffect(() => {
      const fetchFlagsData = async () => {
        try {
          const response = await axios.get("http://localhost:5000/flagsdata");
          const data = response.data;
          console.log("Flags daaattaaa:", data);
  
          const flagCountries = data.map((country) => ({
            name: country.name,
          }));
  
          setFlagCountries(flagCountries);
          setMapFlagCountries(data);
          console.log("NEWWW", flagCountries);
          // Handle the flagsData as needed in your frontend
        } catch (error) {
          console.error("Error fetching Flags Data:", error);
        }
      };
  
      // Call the function to fetch Flags Data
      fetchFlagsData();
    }, []);
  
    // Function to calculate daily cases and deaths
    const calculateDailyData = (selectedData, previousData) => {
      const dailyCases =
        selectedData.totalCases - (previousData ? previousData.totalCases : 0);
      const dailyDeaths =
        selectedData.totalDeaths - (previousData ? previousData.totalDeaths : 0);
      const dailyRecoveries =
        selectedData.totalRecoveries -
        (previousData ? previousData.totalRecoveries : 0);
  
      return { dailyCases, dailyDeaths, dailyRecoveries };
    };
  
    // Function to calculate the previous date
    const getPreviousDate = (currentDate) => {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - 1);
      return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    };
  
    const fetchData = async () => {
      try {
        // Choose the appropriate endpoint
        // const response = await fetch(`/covid?country=${selectedCountry}&date=${selectedDate}`);
        const response = await fetch(
          `http://localhost:5000/covid?country=${selectedCountryId}&date=${selectedDate}`
        );
            console.log("check date here : " , response)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
  
        if (data && data.length > 0) {
          setCovidData(data);
          setDataExists(true);

  
          // Fetch data for the previous date
          const previousDate = getPreviousDate(selectedDate);
          const previousResponse = await fetch(
            `http://localhost:5000/covid?country=${selectedCountryId}&date=${previousDate}`
          );
  
          if (!previousResponse.ok) {
            throw new Error(`HTTP error! Status: ${previousResponse.status}`);
          }
  
          const previousData = await previousResponse.json();
  
          if (previousData && previousData.length > 0) {
            // Calculate daily data and set it in the state
            const { dailyCases, dailyDeaths, dailyRecoveries } =
              calculateDailyData(data[0], previousData[0]);
            setDailyData({ dailyCases, dailyDeaths, dailyRecoveries });
          } else {
            console.log("No data found for the previous date.");
            setDailyData(null);
          }
        } else {
          console.log("No data found for the selected country and date.");
          setCovidData(null);
          setDataExists(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);

      }
    };
  
    const handleCountryChange = async (event) => {
      const newSelectedCountryId = event.target.value;
      setSelectedCountryId(newSelectedCountryId);
      console.log("Selected Country ID:", selectedCountryId);
  
      try {
        // Make a request to your backend to get the corresponding data
        const response = await axios.get(
          `http://localhost:5000/country/${newSelectedCountryId}`
        );
        const dataArray = response.data;
        console.log("Response from server:", response); // Log the entire response
  
        const data = dataArray[0];
  
        if (data && data.lat !== undefined && data.long !== undefined) {
          // Update state with the data for the selected country
          setCountryData(data);
          console.log("THe countrydata :", countryData);
          setMapCenter([data.lat, data.long]);
          console.log("Setting map center to:", [data.lat, data.long]);
          setMapZoom(4);
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
  
    const handleFetchData = () => {
      console.log("Selected Date for Fetch Data:", selectedDate);
      fetchData();
    };

    return (
        <div>
          <div className="app">
            <div className="app__left">
              <div className="app__header">
                <h1>Covid 19</h1>
              </div>
              <div className="app__options">
                <div className="app__dropdown">
                  <select
                    title="Some placeholder text..."
                    className="form-select mb-3 "
                    value={selectedCountryId}
                    onChange={handleCountryChange}
                  >
                    <option value="" className="disabled selected">
                      Select a country
                    </option>
                    {countries.map((country) => (
                      <option
                        className="selected"
                        key={country._id}
                        value={country._id}
                      >
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="date-container">
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
                    className="btn btn-success fetch-button"
                  >
                    Fetch Data
                  </button>
                </div>
              </div>
              <Grid container spacing={3}>
                {/* Display the total data */}
                {covidData &&
                  covidData.map((entry) => (
                    <React.Fragment key={entry._id}>
                      <Grid item xs={4}>
                        <InfoBox
                          onClick={(e) => setCasesType("cases")}
                          title="Total Cases"
                          cases={prettyPrintStat(entry.totalCases)}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <InfoBox
                          onClick={(e) => {
                            setCasesType("recovered");
                            console.log(casesType);
                          }}
                          title="Total Recoveries"
                          cases={prettyPrintStat(entry.totalRecoveries)}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <InfoBox
                          onClick={(e) => setCasesType("deaths")}
                          title="Total Deaths"
                          cases={prettyPrintStat(entry.totalDeaths)}
                        />
                      </Grid>
                    </React.Fragment>
                  )) }
    
                {/* Display the daily data */}
                {dailyData &&  dataExists && (
                  <React.Fragment>
                    <Grid item xs={4}>
                      <InfoBox
                        title="Daily Cases"
                        cases={prettyPrintStat(dailyData.dailyCases)}
                      ></InfoBox>
                    </Grid>
                    <Grid item xs={4}>
                      <InfoBox
                        title="Daily Recoveries"
                        cases={prettyPrintStat(dailyData.dailyRecoveries)}
                      ></InfoBox>
                    </Grid>
                    <Grid item xs={4}>
                      <InfoBox
                        title="Daily Deaths"
                        cases={prettyPrintStat(dailyData.dailyDeaths)}
                      ></InfoBox>
                    </Grid>
                  </React.Fragment>
                )}
              </Grid>
              {!dataExists && (
        <div className="missing-data">Data not found for the selected date.</div>
      )}
    
              <Map
                casesType={casesType}
                flagCountries={mapFlagCountries}
                center={mapCenter}
                zoom={mapZoom}
              />
            </div>
    
            <Card className="app__right">
              <CardContent>
                <h3>Total Cases by Country</h3>
                <Table />
                {countryData && countryData.name && (
                  <h3>Historical cases of {countryData.name}</h3>
                )}
                <LineGraph selectedCountryId={selectedCountryId} />
              </CardContent>
            </Card>
          </div>
          <div>
            <footer
              id="sticky-footer"
              className="flex-shrink-0 py-2 bg-dark text-white-50"
            >
              <div className="container text-center">
                <Link to="/login">Log In</Link>
              </div>
            </footer>
          </div>
        </div>
    )
}

export default Home;