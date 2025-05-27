import React, { useState } from "react";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import axios from "axios";

const ForgotPasswordDialog = () => {
    const [visible, setVisible] = useState(false);
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // פותח דיאלוג
    const openDialog = (e) => {
        e.preventDefault();
        setVisible(true);
    };

    // סגירת דיאלוג ואיפוס
    const handleClose = () => {
        setVisible(false);
        setStep(1);
        setEmail("");
        setVerificationCode("");
        setNewPassword("");
        setMessage("");
        setLoading(false);
    };

    // שליחת קוד לאימייל
    const handleSendCode = async () => {
        
        setLoading(true);
        setMessage("");
        try {
            const res = await axios.post("http://localhost:1135/api/auth/sendVerificationCode", { email })
            console.log(res);
            setMessage(res.data.message);
            setStep(2);
        } catch (e) {
            setMessage(e.response?.data?.message || "Error sending code");
        }
        setLoading(false);
    };

    // שליחת קוד וסיסמה חדשה
    const handleResetPassword = async () => {
        setLoading(true);
        setMessage("");
        try {
            const res = await axios.post("http://localhost:1135/api/auth/resetPasswordWithCode", {
                email,
                verificationCode,
                newPassword,
            });
            setMessage(res.data.message);
            setStep(3);
        } catch (e) {
            setMessage(e.response?.data?.message || "Error resetting password");
        }
        setLoading(false);
    };

    return (
        <>
            {/* תגית a שמפעילה את הדיאלוג */}
            <a href="#" onClick={openDialog} style={{
                color: 'green',
                textDecoration: 'underline',
                cursor: 'pointer'
            }}>
                forgat password?
            </a>
            <Dialog header=" forgat password " visible={visible} style={{ width: '30vw' }} onHide={handleClose} closable={!loading}>
                {step === 1 && (
                    <div className="p-fluid">
                        <label htmlFor="email">Email address </label>
                        <InputText
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={loading}
                            autoFocus
                        />
                        <Button
                            label="Send code"
                            icon="pi pi-send"
                            className="p-mt-3"
                            onClick={handleSendCode}
                            disabled={!email || loading}
                        />
                        {message && <div style={{ color: "red", marginTop: "1em" }}>{message}</div>}
                    </div>
                )}
                {step === 2 && (
                    <div className="p-fluid">
                        <label htmlFor="code">Verification code</label>
                        <InputText
                            id="code"
                            value={verificationCode}
                            onChange={e => setVerificationCode(e.target.value)}
                            disabled={loading}
                            autoFocus
                        />
                        <label htmlFor="newPassword" className="p-mt-2">New password</label>
                        <Password
                            id="newPassword"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            feedback={false}
                            disabled={loading}
                            toggleMask
                        />
                        <Button
                            label="Reset password"
                            icon="pi pi-refresh"
                            className="p-mt-3"
                            onClick={handleResetPassword}
                            disabled={!verificationCode || !newPassword || loading}
                        />
                        {message && <div style={{ color: "red", marginTop: "1em" }}>{message}</div>}
                    </div>
                )}
                {step === 3 && (
                    <div style={{ textAlign: "center", color: "green" }}>
                        <i className="pi pi-check-circle" style={{ fontSize: '2em' }}></i>
                        <h4>Password successfully reset!</h4>
                        <p>You can log in with the new password.</p>
                    </div>
                )}
            </Dialog>
        </>
    );
};

export default ForgotPasswordDialog;