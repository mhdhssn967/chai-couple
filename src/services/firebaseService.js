import { collection, getDocs, doc, updateDoc, addDoc, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig"
import { getAuth } from "firebase/auth";

// Fetch all slots
export const fetchSlots = async () => {
  try {
    const slotsRef = collection(db, "slots");
    const snapshot = await getDocs(slotsRef);

    const slots = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Optional: sort by date/time
    slots.sort((a, b) => new Date(a.date + " " + a.timeFrom) - new Date(b.date + " " + b.timeFrom));

    return slots;
  } catch (err) {
    console.error("Error fetching slots:", err);
    return [];
  }
};


// Fetch all active slots
export const fetchActiveSlots = async () => {
  
  try {
    const slotsRef = collection(db, "slots");
    const snapshot = await getDocs(slotsRef);
    

    const activeSlots = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))

      

    // Optional: sort by date/time
    activeSlots.sort(
      (a, b) => new Date(a.date + " " + a.timeFrom) - new Date(b.date + " " + b.timeFrom)
    );


    return activeSlots;
  } catch (err) {
    console.error("Error fetching active slots:", err);
    return [];
  }
};

// Deactivate a slot and move it to previousSlots
export const deactivateSlot = async (slot) => {
  try {
    // 1. Update the original slot to active = false
    const slotRef = doc(db, "slots", slot.id);
    await updateDoc(slotRef, { active: false });

    // 2. Add to previousSlots collection
    await addDoc(collection(db, "previousSlots"), {
      ...slot,
      deactivatedAt: new Date().toISOString(),
    });

    return true;
  } catch (err) {
    console.error("Error deactivating slot:", err);
    return false;
  }
};

export const fetchStartedSlot = async () => {
  try {
    const slotsRef = collection(db, "slots");

    // Query only started slot
    const q = query(slotsRef, where("isStarted", "==", true));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("No active started slot found");
      return null;
    }

    // Should return only one slot anyway
    const slot = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    console.log("Started Slot:", slot);

    return slot;
  } catch (err) {
    console.error("Error fetching started slot:", err);
    return null;
  }
};


// Roles identification
// roleUtils.js


/**
 * Fetches role from Firebase Custom Claims
 * @returns {Promise<"admin" | "user" | null>} role
 */
export async function getUserRole() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) return null;

  // Force refresh token to ensure updated custom claims
  const token = await user.getIdTokenResult(true);

  return token.claims.role || "user"; // default fallback
}

/**
 * Helper function to check if the user is admin
 * @returns boolean
 */
export async function isAdmin() {
  const role = await getUserRole();
  return role === "admin";
}

/**
 * Helper function to check if the user is a normal user
 * @returns boolean
 */
export async function isUser() {
  const role = await getUserRole();
  return role === "user";
}
