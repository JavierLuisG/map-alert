"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "./page.module.css";
import CardAlert from "../../components/card-alert/CardAlert.jsx";
import { getAlerts } from "../../../service/alerts";

const Alerts = () => {
  const containerRef = useRef(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await getAlerts();
        setAlerts(data);
      } catch (error) {
        console.error("Error al obtener alertas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div
      className={styles.scroll_container}
      ref={containerRef}
      role="region"
      aria-label="Lista de alertas"
    >
      {loading ? (
        <p className={styles.loading}>Cargando alertas...</p>
      ) : alerts.length === 0 ? (
        <p className={styles.empty}>No hay alertas creadas.</p>
      ) : (
        <section className={styles.container_cards}>
          {alerts.map((alert) => (
            <CardAlert key={alert.id} alert={alert} />
          ))}
        </section>
      )}
    </div>
  );
};

export default Alerts;
