import React, { useRef, useEffect } from "react";
import "./Map.css";
import { MapContainer, TileLayer } from "react-leaflet";
import { showDataOnMap } from "../../util";

function Map({ flagCountries, casesType = "cases", center, zoom }) {
  const mapRef = useRef();

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  return (
    <div className="map">
      <MapContainer ref={mapRef} center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {showDataOnMap(flagCountries, casesType)}
      </MapContainer>
    </div>
  );
}

export default Map;
