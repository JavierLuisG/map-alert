"use client";

import React, { useState, useEffect } from "react";
import { alertTypeOptions, getDescriptionsForType } from "../../data/alertType";
import { level as levelOptions } from "../../data/alertLevel"; // tu archivo level existente
import styles from "./page.module.css";

const AddAlert = () => {
  const [type, setType] = useState(""); // ej: "incendio"
  const [description, setDescription] = useState(""); // ej: "Fuga de gas..."
  const [otherText, setOtherText] = useState("");
  const [level, setLevel] = useState(levelOptions[0] || "low");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState(null);

  // cuando cambia type, limpiar description
  useEffect(() => {
    setDescription("");
    setOtherText("");
  }, [type]);

  // Intento simple de geolocalización (si el usuario no pone dirección)
  const useCurrentLocation = async () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.warn("No se pudo obtener geolocalización:", err.message);
      }
    );
  };

  // Submit: arma el objeto final (aquí puedes enviarlo a Firebase)
  const handleSubmit = (e) => {
    e.preventDefault();

    const finalDescription = description === "Otro" ? otherText : description;

    const newAlert = {
      id: Date.now().toString(),
      type: type || null,
      description: finalDescription || null,
      level,
      locationText: address || (coords ? "Ubicación actual" : null),
      coordinates: coords,
      createdAt: new Date().toISOString(),
      // mapImage: // aquí podrías generar la static map y guardarla
    };

    console.log("NEW ALERT ->", newAlert);
    // TODO: enviar a tu API / Firebase
    alert("Alerta preparada en consola (ver devtools).");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 800, margin: "0 auto", padding: 12 }}
    >
      <h2>Reportar nueva alerta</h2>

      <label>
        Tipo (categoría)
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="">-- Selecciona tipo --</option>
          {alertTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <br />

      <label>
        Descripción
        <select
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={!type}
          required
        >
          <option value="">
            {type ? "-- Elige descripción --" : "Primero elige tipo"}
          </option>
          {getDescriptionsForType(type).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>

      {description === "Otro" && (
        <>
          <br />
          <label>
            Especificar (otro)
            <input
              type="text"
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              placeholder="Describe brevemente"
              required
            />
          </label>
        </>
      )}

      <br />

      <label>
        Nivel (severity)
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          {levelOptions.map((lv) => (
            <option key={lv} value={lv}>
              {lv}
            </option>
          ))}
        </select>
      </label>

      <br />

      <label>
        Dirección (opcional)
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Ej: Calle 123 #45-67"
        />
      </label>

      <div style={{ marginTop: 8 }}>
        <button type="button" onClick={useCurrentLocation}>
          Usar ubicación actual
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <button type="submit">Enviar alerta</button>
      </div>
    </form>
  );
};

export default AddAlert;
