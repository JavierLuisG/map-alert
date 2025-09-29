"use client";

import React from "react";
import styles from "./page.module.css";
import { Link } from "@heroui/react";
import { timeAgo } from "../../../utils/timeAgo";

const CardAlert = ({ alert }) => {
  const {
    id,
    description,
    category,
    priority,
    address,
    city,
    createdAt,
    mapImage,
  } = alert;

  const levelClass =
    priority === "Alta"
      ? styles.high
      : priority === "Media"
      ? styles.medium
      : styles.low;

  return (
    <Link href={`/alerts/${id}`} className={styles.card_link}>
      <article
        className={styles.card_container}
        aria-labelledby={`alert-title-${id}`}
      >
        {/* imagen del mapa */}
        <div className={styles.thumb}>
          {mapImage ? (
            <img src={mapImage} alt="Miniatura de la ubicación" />
          ) : (
            <div className={styles.placeholder} aria-hidden="true">
              Mapa
            </div>
          )}
        </div>

        {/* contenido principal */}
        <div className={styles.card_body}>
          <h3 id={`alert-title-${id}`} className={styles.title}>
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : "—"}
          </h3>
          <p className={styles.text_description}>{description}</p>
          <p className={styles.meta}>
            <span className={styles.location}>
              {address || "Ubicación no especificada"}
            </span>
          </p>
        </div>

        <section className={styles.card_info_body}>
          <p className={styles.text_city}>{city}</p>
          <p className={styles.text_time}>{timeAgo(createdAt)}</p>
        </section>

        {/* barra de color */}
        <div
          className={`${styles.color_bar} ${levelClass}`}
          aria-hidden="true"
        />
      </article>
    </Link>
  );
};

export default CardAlert;
