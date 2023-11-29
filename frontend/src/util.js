import React from "react";
import { Circle, Popup } from "react-leaflet";
import numeral from "numeral";

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    multiplier: 50,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 70,
  },
  deaths: {
    hex: "#fb4443",
    multiplier: 500,
  },
};

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const showDataOnMap = (data, casesType = "cases") => {
  console.log("Cases Typeee:", casesType); // Add this line

  if (!data || !Array.isArray(data)) {
    console.error("Invalid data:", data);
    return null;
  }

  return data.map((country) => {
    const { _id, lat, long } = country;

    if (!_id || lat === undefined || long === undefined) {
      console.error("Invalid country data:", country);
      return null;
    }

    // Ensure that lat and long are valid numbers
    if (
      typeof lat !== "number" ||
      typeof long !== "number" ||
      isNaN(lat) ||
      isNaN(long)
    ) {
      console.error("Invalid lat or long values for country:", country);
      return null;
    }

    return (
      <Circle
        key={_id}
        center={[lat, long]}
        fillOpacity={0.4}
        pathOptions={{
          color: casesTypeColors[casesType].hex,
          fillColor: casesTypeColors[casesType].hex,
        }}
        radius={
          Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
        }
      >
        <Popup>
          <div className="info-container">
            <div
              className="info-flag"
              style={{ backgroundImage: `url(${country.flag})` }}
            ></div>

            <div className="info-name">{country.name}</div>
            <div className="info-cases">
              Cases: {numeral(country.cases).format("0,0")}
            </div>
            <div className="info-recovered">
              Recovered: {numeral(country.recovered).format("0,0")}
            </div>
            <div className="info-deaths">
              Deaths: {numeral(country.deaths).format("0,0")}
            </div>
          </div>
        </Popup>
      </Circle>
    );
  });
};
