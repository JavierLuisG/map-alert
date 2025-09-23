"use client";

import React, { useRef } from "react";
import styles from "./page.module.css";
import CardAlert from "../../components/card-alert/CardAlert.jsx";
import { mockAlerts } from "../../../mocks/alerts";

const Alerts = () => {
  const containerRef = useRef(null);

  return (
    <div
      className={styles.scroll_container}
      ref={containerRef}
      role="region"
      aria-label="Lista de alertas"
    >
      <section className={styles.container_cards}>
        {mockAlerts.map((alert) => (
          <CardAlert key={alert.id} alert={alert} />
        ))}
      </section>
    </div>
  );
};

export default Alerts;
