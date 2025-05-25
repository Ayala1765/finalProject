import React, { useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from 'primereact/toast';
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { useSelector } from 'react-redux';

const PaymentPage = () => {
    const [cardNumber, setCardNumber] = useState("");
    const [cardHolderName, setCardHolderName] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [cvv, setCvv] = useState("");
    const toast = useRef(null);
    const navigate = useNavigate();
    const { role } = useSelector((state) => state.token);
    const location = useLocation();
    const updatedForm = location.state?.updatedForm;

    if (!updatedForm) {
        return <div>Error: No donation data provided.</div>;
    }

    const handlePayment = async () => {
        // ולידציות
        if (!cardNumber || !cardHolderName || !expirationDate || !cvv) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please fill in all fields', life: 3000 });
            return;
        }

        if (!/^[a-zA-Z\s]+$/.test(cardHolderName)) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Card holder name must contain only letters and spaces', life: 3000 });
            return;
        }

        const isValidCardNumber = (number) => {
            const regex = /^\d{13,19}$/;
            if (!regex.test(number)) {
                return false;
            }
            let sum = 0;
            let shouldDouble = false;
            for (let i = number.length - 1; i >= 0; i--) {
                let digit = parseInt(number[i]);
                if (shouldDouble) {
                    digit *= 2;
                    if (digit > 9) digit -= 9;
                }
                sum += digit;
                shouldDouble = !shouldDouble;
            }
            return sum % 10 === 0;
        };

        if (!isValidCardNumber(cardNumber)) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Invalid card number', life: 3000 });
            return;
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate)) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Expiration date must be in MM/YY format', life: 3000 });
            return;
        }

        const isExpired = (date) => {
            const [month, year] = date.split("/").map(Number);
            const now = new Date();
            const currentYear = now.getFullYear() % 100;
            const currentMonth = now.getMonth() + 1;
            return year < currentYear || (year === currentYear && month < currentMonth);
        };

        if (isExpired(expirationDate)) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Card is expired', life: 3000 });
            return;
        }

        if (!/^\d{3,4}$/.test(cvv)) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'CVV must be 3 or 4 digits', life: 3000 });
            return;
        }

        // שליחת נתוני התשלום
        try {
            // שליחת פרטי אשראי
            const paymentData = { cardHolderName, cardNumber, expirationDate, cvv }
            await axios.post("http://localhost:1135/creditDetails", paymentData);

            // פיצול תרומת פורים - רק אחרי שהתשלום עבר!
            if (
                updatedForm.event === 'Purim' &&
                updatedForm.Day === 'both'
            ) {
                const half = Number(updatedForm.donationAmount) / 2;
                const donation1 = { ...updatedForm, donationAmount: half, Day: 'yd' };
                const donation2 = { ...updatedForm, donationAmount: half, Day: 'tv' };
                await axios.post("http://localhost:1135/donation", donation1);
                await axios.post("http://localhost:1135/donation", donation2);
            } else {
                await axios.post("http://localhost:1135/donation", updatedForm);
            }

            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Payment Successful!', life: 2000 });
            setTimeout(() => {
                if (role === "manager") navigate('/getAllDonations');
                else if (role === "user") navigate('/recentDonations');
            }, 2000);

        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Payment failed. Please try again.', life: 3000 });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handlePayment();
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="p-d-flex p-jc-center p-ai-center p-mt-5">
                <Card title="Payment Page" className="p-shadow-5" style={{ width: "400px" }}>
                    <div className="p-field">
                        <label htmlFor="cardHolderName">Card Holder</label>
                        <InputText
                            id="cardHolderName"
                            value={cardHolderName}
                            onChange={(e) => setCardHolderName(e.target.value)}
                        />
                    </div>

                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="cardNumber">Card Number</label>
                            <InputText
                                id="cardNumber"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                            />
                        </div>

                        <div className="p-field">
                            <label htmlFor="expirationDate">Expiry Date</label>
                            <InputText
                                id="expirationDate"
                                value={expirationDate}
                                onChange={(e) => setExpirationDate(e.target.value)}
                            />
                        </div>

                        <div className="p-field">
                            <label htmlFor="cvv">CVV</label>
                            <InputText
                                id="cvv"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                maxLength={4}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <Button label="Pay Now" icon="pi pi-check" className="p-mt-3" onClick={handlePayment} />
                    </div>
                </Card>
            </div>
        </>
    );
};

export default PaymentPage;