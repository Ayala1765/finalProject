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
import { RadioButton } from "primereact/radiobutton";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Checkbox } from 'primereact/checkbox';
const AddDonation = () => {
    const { token, role, user } = useSelector((state) => state.token);
    const [isYudaled, setIsYudaled] = useState(false);
    const [isTetvav, setIsTetvav] = useState(false);
    const [isPurim, setIsPurim] = useState(false);


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
        { label: 'Purim', value: 'Purim' },
        { label: 'General', value: 'General' },
    ];


    const handleChange = (e, fieldName) => {
        setFormData({ ...formData, [fieldName]: e.target.value })
        if (e.target.value === "Purim") {
            setIsPurim(true)
        } else {
            if (fieldName == "event")
                setIsPurim(false)

        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        formData.donorId = user._id
        if (isTetvav === "yd")
            formData.Day = 14
        if (isTetvav === "tv")
            formData.Day = 15

        await axios.post("http://localhost:1135/donation", formData)
        navigate('/PaymentPage')

    }
    return (<>
        <div className="p-fluid">
            <h2>Enter donation details</h2>

            <div className="field">
                <label htmlFor="donationAmount">Donation amount</label>
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
                <label htmlFor="coinType">Currency type</label>
                <Dropdown
                    id="coinType"
                    value={formData.coinType}
                    onChange={(e) => handleChange(e, 'coinType')}
                    options={coinOptions}
                    placeholder="Select currency type"
                />
            </div>

          
    



            <div className="field">
                <label htmlFor="event">event</label>
                <Dropdown
                    id="event"
                    value={formData.event}
                    options={eventOptions}
                    onChange={(e) => handleChange(e, 'event')}
                    placeholder="Select an event"

                />


                {isPurim ? <div className="card flex flex-column align-items-center gap-3">

                    <label htmlFor="purim">You can choose which Purim the donation will be made on:</label >

                    <div className="flex align-items-center">
                        <RadioButton inputId="ingredient3" name="pizza" value="yd" onChange={(e) => setIsTetvav(e.value)} checked={isTetvav == 'yd'} />
                        <label htmlFor="yd" className="ml-2">י"ד | Purim Deprezim</label>
                    </div>
                    <div className="flex align-items-center">
                        <RadioButton inputId="ingredient4" name="pizza" value="tv" onChange={(e) => setIsTetvav(e.value)} checked={isTetvav == 'tv'} />
                        <label htmlFor="tv" className="ml-2">ט"ו | Purim Demokfin</label>
                    </div>

                </div>
                    : <></>
                }


            </div>
            <div className="field">
                <label htmlFor="notes">Notes</label>
                <InputTextarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange(e, 'notes')}
                    rows={4}
                    autoResize
                />
            </div>
            <Button
                label="Send"
                icon="pi pi-check"
                className="p-button-success"
                onClick={handleSubmit}
            />
        </div>
    </>
    )
}

export default AddDonation

