import { db } from "../../firebaseConfig";
import { collection, getDocs, setDoc, doc, runTransaction } from "firebase/firestore";

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
  const slotRef = doc(db, "Bookings", slotId); // parent doc

  const newToken = await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(slotRef);

    if (!snap.exists()) {
      transaction.set(slotRef, { nextToken: 1 });
      return 1;
    }

    const current = snap.data().nextToken || 0;
    const next = current + 1;

    transaction.update(slotRef, { nextToken: next });
    return next;
  });

  return newToken;
}

// 🔹 Ensure Firestore path exists
export async function ensureSlotPath(slotId) {
  await setDoc(doc(db, "Bookings", slotId), { exists: true }, { merge: true });
}
