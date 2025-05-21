import React, { useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from 'primereact/toast';
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

const PaymentPage = () => {
    const [cardNumber, setCardNumber] = useState("");
    const [cardHolderName, setCardHolderName] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [cvv, setCvv] = useState("");
    const toast = useRef(null);
    const navigate = useNavigate();

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

        // שליחת נתונים לשרת
        try {
            const paymentData = { cardHolderName, cardNumber, expirationDate, cvv };
            await axios.post("http://localhost:1135/creditDetails", paymentData);
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Payment Successful!', life: 2000 });
            setTimeout(() => {
                navigate('/recentDonations');
            }, 2000);

        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Payment failed. Please try again.', life: 3000 });
            console.error("Error processing payment:", error.response?.data || error.message);
        }
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handlePayment();
        }
    }
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
                                onKeyDown={handleKeyDown} // Add this line

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