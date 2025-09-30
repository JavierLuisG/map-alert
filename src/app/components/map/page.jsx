"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { db } from "../../../service/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";

const containerStyle = { width: "100%", height: "100%" };

const priorityColors = {
  Alta: "red",
  Media: "orange",
  Baja: "yellow",
};

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

const fallbackCenter = { lat: 4.711, lng: -74.0721 }; // Bogotá fallback

export default function Map() {
  const pathname = usePathname();
  const router = useRouter();
  const mapRef = useRef(null);

  const [map, setMap] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [center, setCenter] = useState(fallbackCenter);
  const [activeAlert, setActiveAlert] = useState(null);

  const mapApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Extraer id si la ruta es /detail/<id>
  const selectedId = React.useMemo(() => {
    if (!pathname) return null;
    const m = pathname.match(/\/detail\/([^/]+)/);
    return m ? m[1] : null;
  }, [pathname]);

  useEffect(() => {
    const handler = (e) => {
      const found = alerts.find((a) => a.id === e.detail);
      if (found && found.coordinates && map) {
        map.panTo(found.coordinates);
        map.setZoom(15);
        setActiveAlert(found);
      }
    };

    window.addEventListener("alert-selected", handler);
    return () => window.removeEventListener("alert-selected", handler);
  }, [alerts, map]);

  // Obtener ubicación del navegador al iniciar
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        // si el usuario bloquea location, usamos fallback
        console.warn("No se pudo obtener la ubicación, usando fallback.");
      }
    );
  }, []);

  // Escuchar Firestore en tiempo real (colección "alerts")
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "alerts"),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAlerts(data);
      },
      (err) => console.error("Firestore onSnapshot error:", err)
    );

    return () => unsub();
  }, []);

  // Cuando cambie selectedId (por ejemplo al clicar una card -> navigate to /detail/:id),
  // centrar el mapa en la alerta correspondiente y abrir su InfoWindow
  useEffect(() => {
    if (!selectedId || !map || alerts.length === 0) {
      // si no hay selección, cerramos ventana
      if (!selectedId) setActiveAlert(null);
      return;
    }
    const found = alerts.find((a) => a.id === selectedId);
    if (found && found.coordinates) {
      const pos = { lat: found.coordinates.lat, lng: found.coordinates.lng };
      // mover mapa suavemente
      map.panTo(pos);
      map.setZoom(15);
      setActiveAlert(found);
    }
  }, [selectedId, alerts, map]);

  const handleMapLoad = (mapInstance) => {
    setMap(mapInstance);
    mapRef.current = mapInstance;
  };

  const handleMarkerClick = (alert) => {
    // abrir InfoWindow y centrar
    setActiveAlert(alert);
    if (map && alert.coordinates) {
      map.panTo({ lat: alert.coordinates.lat, lng: alert.coordinates.lng });
      map.setZoom(15);
    }
    // navegar a detail (esto actualizará URL y permitirá al layout/panel saber la selección)
    router.push(`/detail/${alert.id}`);
  };

  return (
    <LoadScript googleMapsApiKey={mapApiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={handleMapLoad}
        options={{ styles: mapStyles, streetViewControl: false }}
      >
        {/* Markers */}
        {alerts.map((alert) =>
          alert.coordinates ? (
            <Marker
              key={alert.id}
              position={{
                lat: alert.coordinates.lat,
                lng: alert.coordinates.lng,
              }}
              onClick={() => handleMarkerClick(alert)}
              icon={
                // Protegemos el acceso a window.google por si aún no se ha cargado la lib
                typeof window !== "undefined" && window.google
                  ? {
                      path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                      fillColor: priorityColors[alert.priority] || "gray",
                      fillOpacity: 1,
                      strokeWeight: 1,
                      scale: 6,
                    }
                  : undefined
              }
            />
          ) : null
        )}
        {/* 
        {activeAlert && activeAlert.coordinates && (
          <InfoWindow
            position={{
              lat: activeAlert.coordinates.lat,
              lng: activeAlert.coordinates.lng,
            }}
            onCloseClick={() => setActiveAlert(null)}
          >
            <div className={styles.infowindow}>
              <h3 className={styles.infowindow_title}>
                {activeAlert.category?.charAt(0).toUpperCase() +
                  (activeAlert.category?.slice(1) || "")}
              </h3>
              <p className={styles.infowindow_desc}>
                {activeAlert.description}
              </p>
              <p className={styles.infowindow_priority}>
                Prioridad: {activeAlert.priority}
              </p>
            </div>
          </InfoWindow>
        )} */}
      </GoogleMap>
    </LoadScript>
  );
}
