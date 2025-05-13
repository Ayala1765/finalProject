import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import HomeDonor from "./Components/HomeDonor";
import 'primeicons/primeicons.css';
import About from "./Components/About";
import AddDonation from "./Components/AddDonation";
import { useDispatch, useSelector } from 'react-redux';
import NavigateDonor from "./Components/NavigateDonor";
import PaymentPage from "./Components/PaymentPage";
function App() {
    const { token, role, user } = useSelector((state) => state.token);

    return (
        <>
            {role == "manager" ? <NavigateDonor /> : role == "user" ? <NavigateDonor /> : <></>}

            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/homeDonor" element={<HomeDonor />} />
                <Route path="/about" element={<About />} />
                <Route path="/addDonation" element={<AddDonation />} />
                <Route path="/paymentPage" element={<PaymentPage />} />
            </Routes>
        </>
    );
}

export default App;