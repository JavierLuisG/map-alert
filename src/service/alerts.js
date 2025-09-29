import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

const alertsCollection = collection(db, "alerts");

// Obtener alertas ordenadas por fecha de creación (descendente)
export async function getAlerts() {
  const q = query(alertsCollection, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// Crear una alerta nueva
export async function createAlert(alert) {
  const newAlert = {
    ...alert,
    createdAt: alert.createdAt || new Date().toISOString(),
  };

  const docRef = await addDoc(alertsCollection, newAlert);
  return { id: docRef.id, ...newAlert };
}
