"use client";

import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { getAlerts } from "../../../service/alerts";

const Map = () => {
  const [map, setMap] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const defaultCenter = { lat: 4.711, lng: -74.0721 };
  const containerStyle = { width: "100%", height: "100%" };
  const mapApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    async function fetchAlerts() {
      const data = await getAlerts();
      setAlerts(data);
    }
    fetchAlerts();
  }, []);

  const handleMapLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  return (
    <LoadScript googleMapsApiKey={mapApiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={12}
        onLoad={handleMapLoad}
      >
        {alerts.map((alert) => (
          <Marker
            key={alert.id}
            position={{ lat: alert.lat, lng: alert.lng }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
