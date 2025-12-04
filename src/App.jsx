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
import Slots from "./pages/Slots"
import LiveOrderPage from "./pages/LiveOrderPage";
import Footer from "./components/Footer";
function App() {
 


  return (
    <Router>
      {/* Navbar always visible */}
      <Navbar />

      <div style={{marginBottom:'80px'}}>
        <Routes>
          <Route path="/" element={<AdminHomePage />} />
          <Route path="/add-slot" element={<AddSlot />} />
          <Route path="/view-slots" element={<Slots />} />
          <Route path="/live-order" element={<LiveOrderPage />} />
          {/* <Route path="/track-orders" element={<TrackOrders />} /> */}
          <Route path="/menu" element={<Menu />} />
        </Routes>
      </div>
       <Footer/>
    </Router>
  );
}

export default App;
