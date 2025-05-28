import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { format } from 'date-fns'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { Button } from 'primereact/button'
import Visual from './Visual'


const GetAllDonations = () => {
    const { token } = useSelector((state) => state.token);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
        'donorId.name': { value: null, matchMode: 'startsWith' },
        event: { value: null, matchMode: 'equals' },
        donationDate: { value: null, matchMode: 'between' },
        donationAmount: { value: null, matchMode: 'custom' },
    });

    const events = [
        { label: 'Pesach', value: 'Pesach' },
        { label: 'Shavues', value: 'Shavues' },
        { label: 'Rosh Hashana', value: 'Rosh Hashana' },
        { label: 'Sukess', value: 'Sukess' },
        { label: 'Purim-י"ד', value: 'Purim-י"ד' },
        { label: 'Purim-ט"ו', value: 'Purim-ט"ו' },
        { label: 'General', value: 'General' },
    ];

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await axios.get('http://localhost:1135/api/donation', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formatted = response.data.map((donation) => {
                    let event = donation.event;
                    const dayValue = (donation.Day || '').toString().toLowerCase().trim();

                    if (donation.event?.toLowerCase() === 'purim') {
                        if (dayValue === 'yd') {
                            event = 'Purim-י"ד';
                        } else if (dayValue === 'tv') {
                            event = 'Purim-ט"ו';
                        } else if (dayValue === 'both') {
                            event = 'Purim-י"ד וט"ו';
                        } else {
                            event = 'Purim-ט"ו';
                        }
                    }
                    return {
                        ...donation,
                        donationDate: new Date(donation.donationDate),
                        event,
                    };
                });
                setDonations(formatted);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDonations();
    }, [token]);

    const refreshDonations = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:1135/api/donation', {
                headers: { Authorization: `Bearer ${token}` },
            })
            setDonations(response.data);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = () => {
        const filteredDonations = donations.map(donation => ({
            name: donation.donorId.name,
            amount: donation.donationAmount,
            coinType: donation.coinType,
            event: donation.event,
            date: format(donation.donationDate, 'dd-MM-yy')
        }));
        const ws = XLSX.utils.json_to_sheet(filteredDonations);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Donations');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'donations.xlsx');
    }

    const paginatorLeft = <Button type="button" onClick={refreshDonations} icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" onClick={exportToExcel} icon="pi pi-download" text />;

    const donationDateFilterTemplate = (options) => {
        const [from, to] = options.value ?? [null, null];
        return (
            <div className="flex gap-2">
                <Calendar
                    value={from}
                    onChange={(e) => options.filterApplyCallback([e.value, to])}
                    placeholder="From"
                    dateFormat="yy-mm-dd"
                    showIcon={false}
                />
                <Calendar
                    value={to}
                    onChange={(e) => options.filterApplyCallback([from, e.value])}
                    placeholder="To"
                    dateFormat="yy-mm-dd"
                    showIcon={false}
                />
            </div>
        )
    }

    const eventFilterTemplate = (options) => (
        <Dropdown
            value={options.value}
            options={events}
            onChange={(e) => options.filterApplyCallback(e.value)}
            placeholder="Select Event"
            className="p-column-filter" // PrimeReact class
            showClear
        />
    )

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (<>
        {/* הוסף את הקלאס donations-table-container לדיב "card" */}
        <div className="card donations-table-container">
            <DataTable
                value={donations}
                paginator
                rows={10}
                dataKey="_id"
                filters={filters}
                filterDisplay="row"
                loading={loading}
                globalFilterFields={['donorId.name']}
                emptyMessage="No donations found."
                paginatorLeft={paginatorLeft}
                paginatorRight={paginatorRight}
            >
                <Column
                    field="donorId.name"
                    header="Donor Name"
                    filter
                    filterPlaceholder="Search by name"
                    showFilterMenu={false}
                    style={{ minWidth: '12rem' }}
                />
                <Column
                    field="event"
                    header="Event"
                    filter
                    filterElement={eventFilterTemplate}
                    showFilterMenu={false}
                    style={{ minWidth: '12rem' }}
                />
                <Column
                    field="donationDate"
                    header="Donation Date"
                    filter
                    filterElement={donationDateFilterTemplate}
                    showFilterMenu={false}
                    style={{ minWidth: '12rem' }}
                    body={rowData => format(rowData.donationDate, 'dd-MM-yy')}
                />
                <Column
                    field="donationAmount"
                    header="Donation Amount"
                    sortable
                    showFilterMenu={false}
                    style={{ minWidth: '12rem' }}
                />
                <Column
                    field="coinType"
                    header="coin Type"
                    showFilterMenu={false}
                    style={{ minWidth: '12rem' }}
                />
            </DataTable>
        </div>
        <Visual></Visual>
    </>
    );
};

export default GetAllDonations;