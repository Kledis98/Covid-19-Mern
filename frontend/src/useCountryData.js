// useCountryData.js

import { useState, useEffect } from "react";
import axios from "axios";

const useCountryData = (date) => {
  const [countriesData, setCountriesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/covid/countries?date=2023-03-09`
        );

        if (response.status === 200) {
          const sortedCountriesData = response.data.sort(
            (a, b) => b.totalCases - a.totalCases
          );

          setCountriesData(sortedCountriesData);
          console.log("HEre are the latest one ", countriesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [date]);

  return countriesData;
};

export default useCountryData;
