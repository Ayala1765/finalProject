import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { InputNumber } from "primereact/inputnumber";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

const PaymentPage = () => {
    const [cardNumber, setCardNumber] = useState("");
    const [cardHolder, setCardHolder] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [amount, setAmount] = useState(null);
    const [currency, setCurrency] = useState("₪");

    const currencies = [
        { label: "₪ - Shekel", value: "₪" },
        { label: "$ - Dollar", value: "$" },
        { label: "€ - Euro", value: "€" },
    ];

    const handlePayment = () => {
        // בדיקות תקינות ושליחת הנתונים לשרת
        if (!cardNumber || !cardHolder || !expiryDate || !cvv || !amount) {
            alert("Please fill in all fields");
            return;
        }

        console.log("Processing payment...", {
            cardNumber,
            cardHolder,
            expiryDate,
            cvv,
            amount,
            currency,
        });

        alert("Payment Successful!");
    };

    return (
        <div className="p-d-flex p-jc-center p-ai-center p-mt-5">
            <Card title="Payment Page" className="p-shadow-5" style={{ width: "400px" }}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="cardNumber">Card Number</label>
                        <InputText
                            id="cardNumber"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="1234 5678 9012 3456"
                        />
                    </div>

                    <div className="p-field">
                        <label htmlFor="cardHolder">Card Holder</label>
                        <InputText
                            id="cardHolder"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="p-field">
                        <label htmlFor="expiryDate">Expiry Date</label>
                        <InputText
                            id="expiryDate"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            placeholder="MM/YY"
                        />
                    </div>

                    <div className="p-field">
                        <label htmlFor="cvv">CVV</label>
                        <InputText
                            id="cvv"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            placeholder="123"
                            maxLength={3}
                        />
                    </div>

                    <div className="p-field">
                        <label htmlFor="amount">Amount</label>
                        <InputNumber
                            id="amount"
                            value={amount}
                            onValueChange={(e) => setAmount(e.value)}
                            mode="currency"
                            currency="ILS"
                            locale="he-IL"
                        />
                    </div>

                    <div className="p-field">
                        <label htmlFor="currency">Currency</label>
                        <Dropdown
                            id="currency"
                            value={currency}
                            options={currencies}
                            onChange={(e) => setCurrency(e.value)}
                            placeholder="Select a currency"
                        />
                    </div>

                    <Button label="Pay Now" icon="pi pi-check" className="p-mt-3" onClick={handlePayment} />
                </div>
            </Card>
        </div>
    );
};

export default PaymentPage;