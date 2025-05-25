import React from "react";
import { Routes, Route,Navigate  } from "react-router-dom";
import Login from "./Components/Login";
import HomeDonor from "./Components/HomeDonor";
import 'primeicons/primeicons.css';
import About from "./Components/About";
import AddDonation from "./Components/AddDonation";
import {useSelector } from 'react-redux';
import NavigateDonor from "./Components/NavigateDonor";
import NavigateAdmin from "./Components/NavigateAdmin";
import PaymentPage from "./Components/PaymentPage";
import GetAllDonors from "./Components/GetAllDonors";
import RecentDonations from "./Components/RecentDonations";
import GetAllDonations from "./Components/GetAllDonations";
import AddDonor from "./Components/AddDonor";
import AdminAddDonation from "./Components/AdminAddDonation";
import TermsAndConditions from './Components/TermsAndConditions';
import Supported from './Components/Supported';
import ViewSupported from './Components/ViewSupported';

function App() {
    const { token, role } = useSelector((state) => state.token);

    return (
        <>
            {role === "manager" ? <NavigateAdmin /> : role === "user" ? <NavigateDonor /> : <></>}
            <Routes>
                <Route path="/" element={token ? <Navigate to="/homeDonor" replace /> : <Navigate to="/Login" replace />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/homeDonor" element={<HomeDonor />} />
                <Route path="/about" element={<About />} />
                <Route path="/addDonation" element={<AddDonation />} />
                <Route path="/paymentPage" element={<PaymentPage />} />
                <Route path="/recentDonations" element={<RecentDonations />} />
                <Route path="/getAllDonors" element={<GetAllDonors />} />
                <Route path="/getAllDonations" element={<GetAllDonations />} />
                <Route path="/addDonor" element={<AddDonor />} />
                <Route path="/adminAddDonation" element={<AdminAddDonation />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="/supported" element={<Supported />} />
                <Route path="/viewSupported" element={<ViewSupported />} />

            </Routes>
        </>
    );
}

export default App;