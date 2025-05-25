import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const ViewSupported = () => {
    const [supported, setSupported] = useState([]);

    useEffect(() => {
        // כאן תוכל להוסיף קריאה לשרת כדי לשלוף נתונים
        // לדוגמה:
        // axios.get('http://localhost:1135/supported').then((res) => setSupported(res.data));
    }, []);

    // פונקציה ליצירת כפתורים בתוך כל שורה
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button 
                    type="button" 
                    icon="pi pi-search" 
                    rounded 
                    onClick={() => viewDetails(rowData)} 
                    tooltip="View Details"
                />
                <Button 
                    type="button" 
                    icon="pi pi-pencil" 
                    severity="success" 
                    rounded 
                    onClick={() => editRow(rowData)} 
                    tooltip="Edit Row"
                />
            </div>
        );
    };

    // פונקציות לדוגמה עבור פעולות הכפתורים
    const viewDetails = (rowData) => {
        console.log('View details for:', rowData);
    };

    const editRow = (rowData) => {
        console.log('Edit row:', rowData);
    };

    return (
        <>
            <div className="card">
                <DataTable value={supported} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="name" header="Name"></Column>
                    <Column field="contactName" header="Contact Name"></Column>
                    <Column field="contactPhone" header="Contact Phone"></Column>
                    <Column field="category" header="Category"></Column>
                    <Column body={actionBodyTemplate} header=""></Column> {/* עמודת כפתורים */}
                </DataTable>
            </div>
        </>
    );
};

export default ViewSupported;