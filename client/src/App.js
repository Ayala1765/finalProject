import React from "react";
import { Routes, Route,Navigate  } from "react-router-dom";
import Login from "./Components/Login";
import HomeDonor from "./Components/HomeDonor";
import 'primeicons/primeicons.css';
import About from "./Components/About";
import AddDonation from "./Components/AddDonation";
import { useDispatch, useSelector } from 'react-redux';
import NavigateDonor from "./Components/NavigateDonor";
import PaymentPage from "./Components/PaymentPage";
import RecentDonations from "./Components/RecentDonations";
function App() {
    const { token, role, user } = useSelector((state) => state.token);

    return (
        <>
            {role == "manager" ? <NavigateDonor /> : role == "user" ? <NavigateDonor /> : <></>}

            <Routes>
                <Route path="/" element={token ? <Navigate to="/homeDonor" replace /> : <Navigate to="/Login" replace />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/homeDonor" element={<HomeDonor />} />
                <Route path="/about" element={<About />} />
                <Route path="/addDonation" element={<AddDonation />} />
                <Route path="/paymentPage" element={<PaymentPage />} />
                <Route path="/recentDonations" element={<RecentDonations />} />
            </Routes>
        </>
    );
}

export default App;