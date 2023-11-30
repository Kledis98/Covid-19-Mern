import axios from "axios";
import { useState, useEffect } from "react";
import React from "react";
import numeral from "numeral";
import { Line } from "react-chartjs-2";
import moment from "moment";
import { CategoryScale, Chart } from "chart.js/auto";

Chart.register(CategoryScale);

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
      title: function (tooltipItem) {
        return moment(tooltipItem[0].label).format("MM/DD/YYYY");
      },
    },
  },
  scales: {
    xAxes: [
      {
        unit: "day", // Adjusted to "day"
        time: {
          format: "MM/DD/YYYY", // Adjust the format to match the incoming date format
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

function LineGraph({ selectedCountryId }) {
  const [data, setData] = useState([]);
  const [countryName, setCountryName] = useState("");

  const buildChartData = (data) => {
    let chartData = [];
    for (let entry of data) {
      let newDataPoint = {
        x: moment(entry.date).format("MM/DD/YYYY"),
        y: entry.totalCases,
      };
      chartData.push(newDataPoint);
    }
    return chartData;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://covid-19-tracker-mt79.onrender.com/covid/${selectedCountryId}`
        );

        if (response.status === 200) {
          const data = response.data;
          let chartData = buildChartData(data);
          setData(chartData);

          // Fetch country name based on the selectedCountryId
          const countryResponse = await axios.get(
            `https://covid-19-tracker-mt79.onrender.com/countries/${selectedCountryId}`
          );

          if (countryResponse.status === 200) {
            setCountryName(countryResponse.data.name);
          } else {
            console.error(
              "Error fetching country. Server responded with status:",
              countryResponse.status
            );
            console.error("Server response:", countryResponse.data);
          }
        } else {
          console.error(
            "Error fetching data. Server responded with status:",
            response.status
          );
          console.error("Server response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [selectedCountryId]);
  return (
    <div>
      {Array.isArray(data) && data.length > 0 && (
        <Line
          data-test="table-linegraph-right"
          data={{
            datasets: [
              {
                label: `${countryName}`,
                fill: true,
                pointHoverRadius: 4,
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraph;
