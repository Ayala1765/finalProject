import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
// import { ProductService } from './service/ProductService';
const RecentDonations = () => {
    const [donations, setDonations] = useState([]);
    // useEffect(() => {
    //     ProductService.getProductsMini().then(data => setDonations(data));
    // }, []);
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

