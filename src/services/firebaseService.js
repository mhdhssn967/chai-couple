import { collection, getDocs, doc, updateDoc, addDoc, query, where, getDoc } from "firebase/firestore";
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


// Fetch all orders

export async function getOrdersForSlot(slotId) {
  try {
    const ref = collection(db, "Bookings", slotId, "userBookings");
    const snap = await getDocs(ref);

    const orders = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort by token number (ascending)
    return orders.sort((a, b) => (a.tokenNumber || 0) - (b.tokenNumber || 0));
  } catch (err) {
    console.error("Error fetching orders:", err);
    return [];
  }
}



// Fetches the started slot and its orders
export async function getActiveSlotWithOrders() {
  try {
    // 1️⃣ Find the slot that is currently started
    const startedSlot=await fetchStartedSlot()

    // 2️⃣ Fetch all user orders inside that slot
    const ordersRef = collection(
      db,
      "Bookings",
      startedSlot.id,
      "userBookings"
    );

    const ordersSnap = await getDocs(ordersRef);

    const orders = ordersSnap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.tokenNumber || 0) - (b.tokenNumber || 0));

    return { orders };

  } catch (err) {
    console.error("Error fetching active slot + orders:", err);
    return { orders: [] };
  }
}


// 
export const getOrdersCount = async (slotId) => {
  try {
    const ref = collection(db, "Bookings", slotId, "userBookings");
    const snap = await getDocs(ref);

    return snap.size; // ⬅ returns number of docs
  } catch (err) {
    console.error("Error fetching order count:", err);
    return 0;
  }
};

// slot stop
export async function stopSlot(slotId) {
  try {
    if (!slotId) throw new Error("Slot ID missing");

    // 1️⃣ Mark the slot as stopped
    await updateDoc(doc(db, "slots", slotId), {
      isStarted: false,
      updatedAt: new Date(),
    });

    // 2️⃣ Delete the liveOrder document
    await deleteDoc(doc(db, "liveOrder", slotId));

    console.log("Slot stopped & live order removed:", slotId);
    return true;

  } catch (error) {
    console.error("Error stopping slot:", error);
    return false;
  }
}