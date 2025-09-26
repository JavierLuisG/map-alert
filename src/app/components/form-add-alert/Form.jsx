"use client";

import React, { useState, useEffect } from "react";
import { alertTypeOptions, getDescriptionsForType } from "../../data/alertType";
import { level as levelOptions } from "../../data/alertLevel";
import styles from "./page.module.css";
import { ScrollShadow } from "@heroui/react";

const Form = () => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [otherText, setOtherText] = useState("");
  const [priority, setPriority] = useState("");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    setDescription("");
    setOtherText("");
  }, [category]);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setAddress(`Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`);
      },
      (err) => {
        console.warn("No se pudo obtener geolocalización:", err.message);
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalDescription = description === "Otro" ? otherText : description;

    const newAlert = {
      id: Date.now().toString(),
      category: category || null,
      description: finalDescription || null,
      priority,
      address,
      coordinates: coords,
      createdAt: new Date().toISOString(),
    };

    console.log("NEW ALERT ->", newAlert);
    alert("Alerta preparada en consola (ver devtools).");
  };
  
  return (
    <ScrollShadow className={styles.scrollShadow}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Categoría */}
        <div className={styles.form_group}>
          <label htmlFor="category">Categoría *</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled hidden>
              Selecciona categoría
            </option>
            {alertTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Descripción */}
        <div className={styles.form_group}>
          <label htmlFor="description">Descripción *</label>
          <select
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!category}
            required
          >
            <option value="" disabled hidden>
              {category ? "Selecciona descripción" : "Primero elige categoría"}
            </option>
            {getDescriptionsForType(category).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {description === "Otro" && (
          <div className={styles.form_group}>
            <label htmlFor="other">Especificar *</label>
            <input
              id="other"
              type="text"
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              placeholder="Describe brevemente"
              required
            />
          </div>
        )}

        {/* Nivel de prioridad */}
        <div className={styles.form_group}>
          <label htmlFor="priority">Nivel de prioridad *</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="" disabled hidden>
              Selecciona una opción
            </option>
            {levelOptions.map((lv) => (
              <option key={lv} value={lv}>
                {lv}
              </option>
            ))}
          </select>
        </div>

        {/* Dirección */}
        <div className={styles.form_group}>
          <label htmlFor="address">Dirección *</label>
          <div className={styles.address_group}>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ej: Calle 123 #45-67"
              required
            />
            <span className={styles.location_link} onClick={useCurrentLocation}>
              Usar ubicación actual
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className={styles.form_actions}>
          <button type="submit" className={styles.submit_btn}>
            Enviar alerta
          </button>
        </div>
      </form>
    </ScrollShadow>
  );
};

export default Form;
