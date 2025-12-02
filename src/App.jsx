import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Pages
import AdminHomePage from "./pages/AdminHomePage";
import AddSlot from "./pages/AddSlot";
// import ViewSlots from "./pages/ViewSlots";
import LiveOrderPanel from "./pages/LiveOrderPanel";
import ActiveSlot from "./pages/ActiveSlot";
// import TrackOrders from "./pages/TrackOrders";
import Menu from "./pages/Menu";

function App() {
  const slot={
    title: "Evening Chai Session",
    date: "2025-12-03",
    timeFrom: "17:30",
    timeTo: "19:00",
    place: "Marine Drive, Kochi",
    limit: 200
  }
 const orders=[
  {
    orderId: "ORD001",
    token: 12,
    name: "Rahul",
    items: { bunMuska: 2, chai: 1, tiramisu: 0 }
  },
  {
    orderId: "ORD002",
    token: 13,
    name: "Fatima",
    items: { bunMuska: 1, chai: 2, tiramisu: 1 }
  },
  {
    orderId: "ORD003",
    token: 14,
    name: "Arjun",
    items: { bunMuska: 3, chai: 0, tiramisu: 1 }
  },
  {
    orderId: "ORD004",
    token: 15,
    name: "Meera",
    items: { bunMuska: 1, chai: 1, tiramisu: 2 }
  },
  {
    orderId: "ORD005",
    token: 16,
    name: "Jasim",
    items: { bunMuska: 0, chai: 3, tiramisu: 1 }
  },
  {
    orderId: "ORD006",
    token: 17,
    name: "Ananya",
    items: { bunMuska: 2, chai: 2, tiramisu: 0 }
  },
  {
    orderId: "ORD007",
    token: 18,
    name: "Sanjay",
    items: { bunMuska: 1, chai: 0, tiramisu: 1 }
  },
  {
    orderId: "ORD008",
    token: 19,
    name: "Neha",
    items: { bunMuska: 2, chai: 1, tiramisu: 1 }
  },
  {
    orderId: "ORD009",
    token: 20,
    name: "Kiran",
    items: { bunMuska: 3, chai: 2, tiramisu: 0 }
  },
  {
    orderId: "ORD010",
    token: 21,
    name: "Ayesha",
    items: { bunMuska: 0, chai: 1, tiramisu: 2 }
  }
]

  return (
    <Router>
      {/* Navbar always visible */}
      <Navbar />

      <Routes>
        <Route path="/" element={<AdminHomePage />} />
        <Route path="/add-slot" element={<AddSlot />} />
        <Route path="/view-slots" element={<ActiveSlot slot={slot}/>} />
        <Route path="/live-order" element={<LiveOrderPanel orders={orders} slot={slot}/>} />
        {/* <Route path="/track-orders" element={<TrackOrders />} /> */}
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </Router>
  );
}

export default App;
