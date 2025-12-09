// src/utils/getActiveUserTokens.js
import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  runTransaction,
  doc,
  Timestamp
} from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { generateOrderId } from "./Helpers";

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


function normalizeInventory(inv) {
  if (!inv) return [];
  if (Array.isArray(inv)) return inv;
  // if stored as object map { bunmaska: 10, ... } convert to array
  if (typeof inv === "object") {
    return Object.entries(inv).map(([name, quantity]) => ({
      name,
      quantity: Number(quantity) || 0,
    }));
  }
  return [];
}

// helper: parse a time string "HH:mm" into a Date on today's date
function parseTimeHHMM(timeStr) {
  // if it's an ISO datetime string, return Date directly
  if (!timeStr) return new Date();
  if (timeStr.includes("T") || timeStr.includes("-")) {
    const d = new Date(timeStr);
    if (!isNaN(d.getTime())) return d;
  }
  const [hh, mm] = timeStr.split(":").map((n) => Number(n));
  const d = new Date();
  d.setHours(isNaN(hh) ? 0 : hh, isNaN(mm) ? 0 : mm, 0, 0);
  return d;
}

// helper: format Date to "HH:mm"
function fmtHHMM(date) {
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

// orderplace


export async function placeOrderAndUpdateInventory(slotId, userData, items) {
  const slotRef = doc(db, "Bookings", slotId);
  const ordersCol = collection(db, "Bookings", slotId, "userBookings");

  return await runTransaction(db, async (transaction) => {
    const slotSnap = await transaction.get(slotRef);
    if (!slotSnap.exists()) throw new Error("Slot not found");

    const slotData = slotSnap.data();

    // normalize inventory to array of {name, quantity}
    const inventory = normalizeInventory(slotData.inventory);

    // 1) Inventory check
    for (const [itemName, qty] of Object.entries(items)) {
      const orderedQty = Number(qty) || 0;
      const invItem = inventory.find((it) => it.name === itemName);
      const available = invItem ? Number(invItem.quantity) || 0 : 0;
      if (orderedQty > available) {
        throw new Error(`${itemName} is out of stock or insufficient quantity (requested ${orderedQty}, available ${available})`);
      }
    }

    // 2) Determine next token from slotDoc.nextToken (atomic counter)
    const currentNext = Number(slotData.nextToken || 0);
    const tokenNumber = currentNext + 1;

    // 3) Compute expected delivery
    // base time = slot.lastExpectedDelivery (HH:mm) or slot.startTime (HH:mm)
    let baseTimeStr = slotData.lastExpectedDelivery || slotData.startTime;
    if (!baseTimeStr) {
      // fallback to now
      baseTimeStr = fmtHHMM(new Date());
    }

    const baseDate = parseTimeHHMM(baseTimeStr);

    // compute minutes to add: bunmaska count or default 1
    const bunQty = Number(items.bunmaska || 0);
    const minutesToAdd = bunQty > 0 ? bunQty : 1;

    // For token 1: expected = slot.startTime + minutesToAdd
    // For token >1: expected = lastExpectedDelivery + minutesToAdd
    const newDate = new Date(baseDate.getTime());
    newDate.setMinutes(newDate.getMinutes() + minutesToAdd);
    const newExpectedTime = fmtHHMM(newDate); // "HH:mm"

    // 4) Deduct inventory (create newInventory array)
    const newInventory = inventory.map((inv) => {
      const ordered = Number(items[inv.name] || 0);
      return {
        ...inv,
        quantity: (Number(inv.quantity) || 0) - ordered,
      };
    });

    // 5) Update slot doc atomically: nextToken, inventory, lastExpectedDelivery
    transaction.update(slotRef, {
      nextToken: tokenNumber,
      inventory: newInventory,
      lastExpectedDelivery: newExpectedTime,
      // optional: you may also store lastUpdatedAt
      lastUpdatedAt: Timestamp.now(),
    });

    // 6) Create new order doc (use a new doc ref to set inside transaction)
    const newOrderId = generateOrderId();
    const orderDocRef = doc(ordersCol); // new auto-id doc ref
    const orderData = {
      ...userData,
      orderId: newOrderId,
      tokenNumber,
      items,
      expectedDelivery: newExpectedTime,
      prepMinutes: minutesToAdd,
      timestamp: Timestamp.now(),
    };

    transaction.set(orderDocRef, orderData);

    // 7) return useful info
    return {
      tokenNumber,
      expectedDelivery: newExpectedTime,
      orderId: newOrderId,
    };
  });
}
