import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import HomeDonor from "./Components/HomeDonor";
import 'primeicons/primeicons.css';

function App() {
    return (
        <>

            <Routes>
                <Route path="/" element={<Login />} />

                
                <Route path="/homeDonor" element={<HomeDonor />} />

            </Routes>
        </>
    );
}

export default App;