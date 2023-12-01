import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import "../App.css"; 
import InfoBox from "../components/InfoBox/InfoBox";
import Map from "../components/Map/Map";
import { Card, CardContent, Grid } from "@mui/material";
import Table from "../components/Table/Table";
import LineGraph from "../components/LineGraph/LineGraph";
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
          const response = await axios.get("https://covid-19-tracker-mt79.onrender.com/countries");
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
          const response = await axios.get("https://covid-19-tracker-mt79.onrender.com/flagsdata");
          const data = response.data;
  
          const flagCountries = data.map((country) => ({
            name: country.name,
          }));
  
          setFlagCountries(flagCountries);
          setMapFlagCountries(data);
          // Handle the flagsData as needed in your frontend
        } catch (error) {
          console.error("Error fetching Flags Data:", error);
        }
      };
  
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
     
        const response = await fetch(
          `https://covid-19-tracker-mt79.onrender.com/covid?country=${selectedCountryId}&date=${selectedDate}`
        );
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
            `https://covid-19-tracker-mt79.onrender.com/covid?country=${selectedCountryId}&date=${previousDate}`
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
            setDailyData(null);
          }
        } else {
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
  
      try {
        // Make a request to your backend to get the corresponding data
        const response = await axios.get(
          `https://covid-19-tracker-mt79.onrender.com/country/${newSelectedCountryId}`
        );
        const dataArray = response.data;
  
        const data = dataArray[0];
  
        if (data && data.lat !== undefined && data.long !== undefined) {
          // Update state with the data for the selected country
          setCountryData(data);
          setMapCenter([data.lat, data.long]);
          setMapZoom(4);
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
  
    const handleFetchData = () => {
      fetchData();
    };

    return (
        <div>
          <div className="app">
            <div className="app__left">
              <div className="app__header">
                <h1>COVID-19 Tracker</h1>
              </div>
              <div className="app__options">
                <div className="app__dropdown">
                  <select
                  data-test="country-dropdown"
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
                  data-test="date-input"
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                </div>
                <div>
                  <button
                  data-test="fetch-button"
                    type="button"
                    onClick={handleFetchData}
                    className="btn btn-success fetch-button"
                  >
                    Fetch Data
                  </button>
                </div>
              </div>
              <Grid container spacing={3}
               data-test="grid-container"
                 >
                {/* Display the total data */}
                {covidData &&
                  covidData.map((entry) => (
                    <React.Fragment key={entry._id}>
                      <Grid item xs={4}
                       data-test="grid-first-row">
                        <InfoBox
                        data-test="info-box"
                          onClick={(e) => setCasesType("cases")}
                          title="Total Cases"
                          cases={prettyPrintStat(entry.totalCases)}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <InfoBox
                        data-test="info-box"
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
                        data-test="info-box"
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
                    <Grid item xs={4} data-test="grid-second-row">
                      <InfoBox
                      data-test="info-box"
                        title="Daily Cases"
                        cases={prettyPrintStat(dailyData.dailyCases)}
                      ></InfoBox>
                    </Grid>
                    <Grid item xs={4}>
                      <InfoBox
                      data-test="info-box"
                        title="Daily Recoveries"
                        cases={prettyPrintStat(dailyData.dailyRecoveries)}
                      ></InfoBox>
                    </Grid>
                    <Grid item xs={4}>
                      <InfoBox
                      data-test="info-box"
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
              <CardContent
                data-test = "table-linegraph-right">
                <h3>Total Cases by Country</h3>
                <Table />
                {countryData && countryData.name && (
                  <h3>Historical cases of {countryData.name}</h3>
                )}
                <LineGraph selectedCountryId={selectedCountryId}
                />
              </CardContent>
            </Card>
          </div>
          <div>
            <footer
              id="sticky-footer"
              className="flex-shrink-0 py-2 bg-dark text-white-50"
            >
              <div className="container text-center">
                <Link
                data-test = "login-button"
                to="/login">Log In
                </Link>
              </div>
            </footer>
          </div>
        </div>
    )
}

export default Home;