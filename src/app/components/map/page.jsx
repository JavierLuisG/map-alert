"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { getAlerts } from "../../../service/alerts";

const containerStyle = { width: "100%", height: "100%" };

// Colores por prioridad (icono del marker)
const priorityColors = {
  Alta: "red",
  Media: "orange",
  Baja: "yellow",
};

// Estilo para limpiar el mapa
const mapStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
];

const fallbackCenter = { lat: 4.711, lng: -74.0721 }; // Bogotá

const Map = () => {
  const [map, setMap] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [center, setCenter] = useState(fallbackCenter);
  const [activeAlert, setActiveAlert] = useState(null);

  const mapApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Obtener ubicación actual
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCenter({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          console.warn("No se pudo obtener la ubicación, usando fallback.");
        }
      );
    }
  }, []);

  // Traer alertas
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
        center={center}
        zoom={12}
        onLoad={handleMapLoad}
        options={{ styles: mapStyles }}
      >
        {alerts.map(
          (alert) =>
            alert.coordinates && (
              <Marker
                key={alert.id}
                position={{
                  lat: alert.coordinates.lat,
                  lng: alert.coordinates.lng,
                }}
                onClick={() => setActiveAlert(alert)}
                icon={{
                  path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                  fillColor: priorityColors[alert.priority],
                  fillOpacity: 1,
                  strokeWeight: 1,
                  scale: 6,
                }}
              />
            )
        )}

        {activeAlert && (
          <InfoWindow
            position={{
              lat: activeAlert.coordinates.lat,
              lng: activeAlert.coordinates.lng,
            }}
            onCloseClick={() => setActiveAlert(null)}
          >
            <div className={styles.infowindow}>
              <h3 className={styles.infowindow_title}>
                {activeAlert.category}
              </h3>
              <p className={styles.infowindow_desc}>
                {activeAlert.description}
              </p>
              <p className={styles.infowindow_priority}>
                Prioridad: {activeAlert.priority}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
