"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../../service/firebase";
import styles from "./page.module.css";
import Link from "next/link";

const Detail = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const docRef = doc(db, "alerts", id);
    const unsub = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          setAlert({ id: snap.id, ...snap.data() });
        } else {
          setAlert(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error al leer detalle:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [id]);

  if (!id) return <div style={{ padding: 16 }}>ID no especificado.</div>;
  if (loading) return <div style={{ padding: 16 }}>Cargando detalle...</div>;
  if (!alert) return <div style={{ padding: 16 }}>Alerta no encontrada.</div>;

  return (
    <div className={styles.detail_container}>
      <div style={{ marginBottom: 12 }}>
        <Link href="/alerts">← Volver</Link>
      </div>

      <h1>{alert.category ? alert.category.charAt(0).toUpperCase() + alert.category.slice(1) : "Alerta"}</h1>
      <p style={{ fontWeight: 600 }}>{alert.description}</p>

      <dl style={{ marginTop: 12 }}>
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
          {alert.coordinates ? `${alert.coordinates.lat}, ${alert.coordinates.lng}` : "-"}
        </dd>

        <dt>Creada</dt>
        <dd>{alert.createdAt ? new Date(alert.createdAt).toLocaleString() : "-"}</dd>
      </dl>
    </div>
  );
};

export default Detail;
