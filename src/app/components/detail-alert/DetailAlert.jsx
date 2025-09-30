"use client";

import React from "react";
import styles from "./page.module.css";

const DetailAlert = ({ alert }) => {
  return (
    <div className={styles.scroll_container}>
      <div className={styles.title_container}>
        <h1>
          {alert.category
            ? alert.category.charAt(0).toUpperCase() + alert.category.slice(1)
            : "Alerta"}
        </h1>
        <p className={styles.description}>{alert.description}</p>
      </div>

      <dl className={styles.detail_list}>
        <dt>Dirección</dt>
        <dd>{alert.address || "-"}</dd>

        <dt>Calle</dt>
        <dd>{alert.street || "-"}</dd>

        <dt>Barrio</dt>
        <dd>{alert.neighborhood || "-"}</dd>

        <dt>Ciudad</dt>
        <dd>{alert.city || "-"}</dd>

        <dt>Departamento</dt>
        <dd>{alert.department || "-"}</dd>

        <dt>País</dt>
        <dd>{alert.country || "-"}</dd>

        <dt>Prioridad</dt>
        <dd>{alert.priority || "-"}</dd>

        <dt>Coordenadas</dt>
        <dd>
          {alert.coordinates
            ? `${alert.coordinates.lat}, ${alert.coordinates.lng}`
            : "-"}
        </dd>

        <dt>Creada</dt>
        <dd>
          {alert.createdAt ? new Date(alert.createdAt).toLocaleString() : "-"}
        </dd>
      </dl>
    </div>
  );
};

export default DetailAlert;
