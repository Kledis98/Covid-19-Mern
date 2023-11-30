import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Table.css";
import numeral from "numeral";

function CountryTable() {
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://covid-19-tracker-mt79.onrender.com/countries?date=2023-03-08"
        );

        if (response.status === 200) {
          const sortedCountriesData = response.data.sort(
            (a, b) => b.totalCases - a.totalCases
          );
    
          setCountriesData(sortedCountriesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="table">
      {loading ? (
        <p>Loading...</p>
      ) : (
        countriesData.map((country) => (
          <tr key={country._id}>
            <td>{country.name}</td>
            <td>
              {country.totalCases !== undefined ? (
                <strong>{numeral(country.totalCases).format("0,0")}</strong>
              ) : (
                "N/A"
              )}
            </td>
          </tr>
        ))
      )}
    </div>
  );
}

export default CountryTable;
