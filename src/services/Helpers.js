import { db } from "../../firebaseConfig";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

// 🔹 Generate Order ID (AB-376)
export function generateOrderId() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const part1 =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];
  const part2 = Math.floor(100 + Math.random() * 900);
  return `${part1}-${part2}`;
}

// 🔹 Get next token number for that slot
export async function getNextTokenNumber(slotId) {
  const ref = collection(db, "Bookings", slotId, "userBookings");
  const snapshot = await getDocs(ref);
  return snapshot.size + 1;
}

// 🔹 Ensure Firestore path exists
export async function ensureSlotPath(slotId) {
  await setDoc(doc(db, "Bookings", slotId), { exists: true }, { merge: true });
}
