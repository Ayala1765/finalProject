import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
// import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea'; import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css'; // נושא
import 'primereact/resources/primereact.min.css'; // רכיבי PrimeReact
import 'primeicons/primeicons.css'; // אייקונים של PrimeReact
import 'primeflex/primeflex.css'; // עיצוב רספונסיבי
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'

const AddDonation = () => {
    const { token, role, user } = useSelector((state) => state.token);
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        donationAmount: '',
        donationDate: null,
        coinType: '',
        Day: '',
        notes: '',
        donorId: '',
        event: '',
    });

    const coinOptions = [
        { label: '$', value: '$' },
        { label: '₪', value: '₪' },
    ];

    // const dayOptions = [
    //     { label: '15', value: 15 },
    //     { label: '14', value: 14 },
    // ];

    const eventOptions = [
        { label: 'Pesach', value: 'Pesach' },
        { label: 'Shavuot', value: 'Shavuot' },
        { label: 'RoshHshna', value: 'RoshHshna' },
        { label: 'Sukut', value: 'Sukut' },
        { label: 'Porim', value: 'Porim' },
        { label: 'General', value: 'General' },
    ];


    const handleChange = (e, fieldName) => {
        setFormData({ ...formData, [fieldName]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        formData.donorId = user._id
        await axios.post("http://localhost:1135/donation", formData)
        navigate('/PaymentPage')

    }
    // כאן ניתן להוסיף לוגיקה לשמירת הנתונים בשרת
    return (<>
        <div className="p-fluid">
            <h2>הכנסת פרטי תרומה</h2>

            <div className="field">
                <label htmlFor="donationAmount">סכום תרומה</label>
                <InputText
                    id="donationAmount"
                    value={formData.donationAmount}
                    onChange={(e) => handleChange(e, 'donationAmount')}
                    type="number"
                    required
                />
            </div>

            {/* <div className="field">
                <label htmlFor="donationDate">תאריך תרומה</label>
                <Calendar
                    id="donationDate"
                    value={formData.donationDate}
                    onChange={(e) => handleChange(e, 'donationDate')}
                    dateFormat="dd/mm/yy"
                    showIcon
                />
            </div> */}

            <div className="field">
                <label htmlFor="coinType">סוג מטבע</label>
                <Dropdown
                    id="coinType"
                    value={formData.coinType}
                    onChange={(e) => handleChange(e, 'coinType')}
                    options={coinOptions}
                    placeholder="בחר סוג מטבע"
                />
            </div>

            {/* <div className="field">
                <label htmlFor="Day">יום</label>
                <Dropdown
                    id="Day"
                    value={formData.Day}
                    onChange={(e) => handleChange(e, 'Day')}
                    options={dayOptions}
                    placeholder="בחר יום"
                />
            </div> */}



            {/* <div className="field">
                <label htmlFor="donorUserName">שם משתמש של התורם</label>
                <InputText
                    id="donorUserName"
                    value={formData.donorUserName}
                    onChange={(e) => handleChange(e, 'donorUserName')}
                    required
                />
            </div> */}

            <div className="field">
                <label htmlFor="event">אירוע</label>
                <Dropdown
                    id="event"
                    value={formData.event}
                    options={eventOptions}
                    onChange={(e) => handleChange(e, 'event')}
                />
            </div>
            <div className="field">
                <label htmlFor="notes">הערות</label>
                <InputTextarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange(e, 'notes')}
                    rows={4}
                    autoResize
                />
            </div>
            <Button
                label="שלח"
                icon="pi pi-check"
                className="p-button-success"
                onClick={handleSubmit}
            />
        </div>
    </>
    )
}

export default AddDonation

