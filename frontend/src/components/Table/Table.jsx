import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Table.css";
import numeral from "numeral";


function CountryTable() {
  const [countriesData, setCountriesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://covid-19-tracker-mt79.onrender.com/countries?date=2023-03-05"
        );

        if (response.status === 200) {
          const sortedCountriesData = response.data.sort(
            (a, b) => b.totalCases - a.totalCases
          );
    
          setCountriesData(sortedCountriesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    
      <div className="table">
       
          {countriesData.map((country) => (
            <tr key={country._id}>
              <td>{country.name}</td>
              <td>
              <strong>{numeral(country.totalCases).format("0,0")}</strong>
              </td>
            </tr>
          ))}
      </div>
    
  );
}

export default CountryTable;