import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useDispatch, useSelector } from 'react-redux'
import axios from "axios"
import { format } from 'date-fns'

const RecentDonations = () => {
    const { token, role, user } = useSelector((state) => state.token);
    const [donations, setDonations] = useState([])
    const [loading, setLoading] = useState(true); // סטייט להציג טעינה
    const [error, setError] = useState(null); // סטייט לטיפול בשגיאות
    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await axios.get(`http://localhost:1135/donation/${user._id}`)
                const formatDate = response.data.map(donation => ({
                    ...donation,
                    donationDate: format(new Date(donation.donationDate), 'yyyy-MM-dd') 
                }));
                setDonations(formatDate);
            } catch (err) {
                setError(err.message); // שמירת הודעת השגיאה
            } finally {
                setLoading(false); // סיום מצב הטעינה

            }
        };
        fetchDonations()
    }, [user])
    if (loading) {
        return <p>Loading...</p>; // הודעת טעינה
    }

    if (error) {
        return <p>Error: {error}</p>; // הודעת שגיאה
    }

    return (
        <>

            <div className="card">
                <DataTable value={donations} stripedRows tableStyle={{ minWidth: '50rem' }}>
                    <Column field="donationAmount" header="donationAmount"></Column>
                    <Column field="donationDate" header="donationDate"></Column>
                    <Column field="coinType" header="coinType"></Column>
                    <Column field="event" header="event"></Column>
                </DataTable>
            </div>
        </>
    )

}
export default RecentDonations
