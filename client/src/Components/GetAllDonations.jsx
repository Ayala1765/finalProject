import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { format } from 'date-fns';

const GetAllDonations = () => {
    const { token } = useSelector((state) => state.token);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
        'donorId.name': { value: null, matchMode: 'startsWith' },
        event: { value: null, matchMode: 'equals' },
        donationDate: { value: null, matchMode: 'custom' },
        donationAmount: { value: null, matchMode: 'custom' },
    });
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await axios.get(`http://localhost:1135/donation`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const formatDate = response.data.map((donation) => ({
                    ...donation,
                    donationDate: format(new Date(donation.donationDate), 'yyyy-MM-dd'),
                }));
                setDonations(formatDate);
                setEvents([...new Set(formatDate.map((donation) => donation.event))]); // יצירת רשימת אירועים ייחודיים
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDonations();
    }, [token]);

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
        );
    };

    const eventFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={events}
                onChange={(e) => options.filterApplyCallback(e.value)}
                placeholder="Select Event"
                className="p-column-filter"
                showClear
            />
        );
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="card">
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
                />
                <Column
                    field="donationAmount"
                    header="Donation Amount"
                    // filter
                    sortable
                    showFilterMenu={false} 
                    style={{ minWidth: '12rem' }}
                />
            </DataTable>
        </div>
    );
};

export default GetAllDonations;