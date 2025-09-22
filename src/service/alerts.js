import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const alertsCollection = collection(db, "alerts");

export async function getAlerts() {
  const snapshot = await getDocs(alertsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function createAlert(alert) {
  await addDoc(alertsCollection, alert);
}
