// src/utils/getActiveUserTokens.js
import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

/**
 * Fetches all bookings (tokens) for the current user in active slots.
 * @param {string} [userIdOverride] - Optional: pass a userId; otherwise it uses current logged-in user.
 * @returns {Promise<Array>} - Array of booking objects (may be empty)
 */
export async function getActiveUserTokens() {
  try {
    // determine user id
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) return [];

    const results = [];

    // 1) Fetch slots where isActive == true
    const slotsRef = collection(db, "slots");
    const activeSlotsQuery = query(slotsRef, where("active", "==", true));
    const activeSlotsSnap = await getDocs(activeSlotsQuery);
console.log(activeSlotsSnap)
;

    if (activeSlotsSnap.empty) return []; // no active slots

    // 2) For each active slot, query its userBookings subcollection for this user
    const promises = activeSlotsSnap.docs.map(async (slotDoc) => {
      const slotId = slotDoc.id;
      const slotData = slotDoc.data();

      // userBookings subcollection path: Bookings/{slotId}/userBookings
      const userBookingsRef = collection(db, "Bookings", slotId, "userBookings");
      const userQuery = query(userBookingsRef, where("userId", "==", userId));
      const userBookingsSnap = await getDocs(userQuery);

      // push each booking found
      userBookingsSnap.forEach((bk) => {
        const bkData = bk.data();
        results.push({
          bookingId: bk.id,
          slotId,
          slotName: slotData.slotName || slotData.place || "",
          tokenNumber: bkData.tokenNumber,
          orderId: bkData.orderId,
          bookingData: bkData,
        });
      });
    });

    // await all slot queries
    await Promise.all(promises);

    return results;
  } catch (err) {
    console.error("Error in getActiveUserTokens:", err);
    return [];
  }
}
