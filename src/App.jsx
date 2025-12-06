import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import SplashLogo from "./components/SplashLogo";   // 👈 ADD THIS

// Pages
import AdminHomePage from "./pages/AdminHomePage";
import AddSlot from "./pages/AddSlot";
import Menu from "./pages/Menu";
import Slots from "./pages/Slots";
import LiveOrderPage from "./pages/LiveOrderPage";
import Footer from "./components/Footer";
import LoginRegister from "./pages/LoginRegister";
import UserHomePage from "./pages/UserHomePage";
import BookSlotPage from "./userPages/BookSlotPage";
import OrderToken from "./userPages/OrderToken";
import Orders from "./pages/Orders";
import OrderLive from "./userPages/OrderLive";

function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <Router>
      {/* Splash Screen */}
      {!splashDone && <SplashLogo onFinish={() => setSplashDone(true)} />}

      {/* Only show the real app after the splash is finished */}
      {splashDone && (
        <div className="main-container">
          <Navbar />

          <div style={{ marginBottom: "80px" }}>
            <Routes>
              {/* Public routes */}
              <Route path="/admin" element={<AdminHomePage />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/login" element={<LoginRegister />} />
              <Route path="/book/:slotId" element={<BookSlotPage />} />
              <Route path="/my-token" element={<OrderToken />} />

              {/* Protected */}
              <Route
                path="/add-slot"
                element={
                  <ProtectedRoute>
                    <AddSlot />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/order-status"
                element={
                  <ProtectedRoute>
                    <OrderLive />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/orders/:slotId"
                element={
                  <ProtectedRoute adminOnly>
                    <Orders />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/view-slots"
                element={
                  <ProtectedRoute>
                    <Slots />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/live-order"
                element={
                  <ProtectedRoute>
                    <LiveOrderPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/" element={<UserHomePage />} />
            </Routes>
          </div>

          <Footer />
        </div>
      )}
    </Router>
  );
}

export default App;
