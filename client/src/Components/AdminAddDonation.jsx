import React, { useEffect, useRef, useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { RadioButton } from "primereact/radiobutton"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import axios from "axios"
import { AutoComplete } from 'primereact/autocomplete'
import { coinOptions, eventOptions } from '../options'

const AdminAddDonation = () => {
    const { user } = useSelector((state) => state.token)
    const [whichDay, setWhichDay] = useState(false)
    const [isPurim, setIsPurim] = useState(false)
    const toast = useRef(null)
    const { token } = useSelector((state) => state.token)
    const [allDonors, setAllDonors] = useState([])
    const [donors, setDonors] = useState([])
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        donationAmount: '',
        coinType: '',
        Day: '',
        notes: '',
        donorId: '',
        event: '',
    })



    useEffect(() => {
        getDonors()
    }, [])

    const getDonors = async () => {
        try {
            const response = await axios.get(`http://localhost:1135/api/donor`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const formattedDonors = response.data.map(donor => ({
                label: donor.name,
                value: donor._id,
            }))
            setAllDonors(formattedDonors)
            setDonors(formattedDonors)
        } catch (err) {
            console.error("Error fetching donors:", err)
        }
    }

    const handleChange = (e, fieldName) => {
        const value = e.target ? e.target.value : e.value
        setFormData({ ...formData, [fieldName]: value })

        if (fieldName === "event") {
            setIsPurim(value === "Purim")
        }
    }

    const validateForm = () => {
        if (!formData.donationAmount || isNaN(formData.donationAmount) || Number(formData.donationAmount) <= 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please enter a valid donation amount.', life: 3000 })
            return false
        }
        if (!formData.coinType) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please select a currency type.', life: 3000 })
            return false
        }
        if (!formData.event) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please select an event.', life: 3000 })
            return false
        }
        if (isPurim && !whichDay) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please select a Purim day.', life: 3000 })
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        if (e) e.preventDefault()
        if (!validateForm()) return

        const updatedForm = { ...formData }

        if (whichDay === "yd")
            updatedForm.Day = "yd"
        if (whichDay === "tv")
            updatedForm.Day = "yd"
        if (whichDay === "both")
            updatedForm.Day = "both"
        navigate('/PaymentPage', { state: { updatedForm } })
    }

    return (
        <div className="form-card-container">
            <Toast ref={toast} />
            <h2>Enter donation details</h2>
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label htmlFor="donorId">Select Donor</label>
                    <AutoComplete
                        value={donors.find(donor => donor.value === formData.donorId)?.label || formData.donorId || ''}
                        suggestions={donors}
                        completeMethod={(e) => {
                            const query = e.query.toLowerCase()
                            if (!query) {
                                setDonors(allDonors)
                            } else {
                                const filteredDonors = allDonors.filter(donor =>
                                    donor.label.toLowerCase().includes(query)
                                )
                                setDonors(filteredDonors)
                            }
                        }}
                        field="label"
                        onChange={(e) => {
                            if (e.value && typeof e.value === 'string') {
                                setFormData({ ...formData, donorId: e.value })
                            } else {
                                setFormData({ ...formData, donorId: e.value?.value || '' })
                            }
                        }}

                        placeholder="Select a donor"
                    />
                </div>
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
                    <label htmlFor="event">Event</label>
                    <Dropdown
                        id="event"
                        value={formData.event}
                        options={eventOptions}
                        onChange={(e) => handleChange(e, 'event')}
                        placeholder="Select an event"
                    />
                    {isPurim ? (
                        <div className="card flex flex-column align-items-center gap-3">
                            <label htmlFor="purim">You can choose which Purim the donation will be made on:</label>
                            <div className="flex align-items-center">
                                <RadioButton inputId="ingredient3" name="pizza" value="yd" onChange={(e) => setWhichDay(e.value)} checked={whichDay === 'yd'} />
                                <label htmlFor="yd" className="ml-2">י"ד | Purim Deprezim</label>
                            </div>
                            <div className="flex align-items-center">
                                <RadioButton inputId="ingredient4" name="pizza" value="tv" onChange={(e) => setWhichDay(e.value)} checked={whichDay === 'tv'} />
                                <label htmlFor="tv" className="ml-2">ט"ו | Purim Demokfin</label>
                            </div>
                            <div className="flex align-items-center">
                                <RadioButton inputId="ingredient4" name="pizza" value="both" onChange={(e) => setWhichDay(e.value)} checked={whichDay === 'both'} />
                                <label htmlFor="both" className="ml-2">bothOfTheDays</label>
                            </div>
                        </div>
                    ) : null}
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
                    type="submit"
                />
            </form>
        </div>
    )
}

export default AdminAddDonation