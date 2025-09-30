"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../../service/firebase";
import styles from "./page.module.css";
import Link from "next/link";
import DetailAlert from "../../../components/detail-alert/DetailAlert";
import LeftLine from "../../../../assets/icons/arrow-left-line.svg";

const Detail = () => {
  const params = useParams();
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
      <div className={styles.detail_header}>
        <Link href="/alerts">
          <LeftLine width={24} height={24} />
        </Link>
        <p>Regresar al listado de alertas</p>
      </div>
      <DetailAlert alert={alert} />
    </div>
  );
};

export default Detail;
