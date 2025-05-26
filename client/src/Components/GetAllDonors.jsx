import React, { useState, useEffect } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { useSelector } from 'react-redux';
import axios from 'axios';

const GetAllDonors = () => {
    const { token } = useSelector((state) => state.token);
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            setError("Token is missing");
            setLoading(false);
            return;
        }

        const fetchDonors = async () => {
            setLoading(true);

            try {
                const response = await axios.get(`http://localhost:1135/api/donor`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Initialize donors with empty children
                const treeData = response.data.map((donor) => ({
                    key: donor._id, // Use donor ID as the key for uniqueness
                    data: {
                        id: donor._id,
                        name: donor.name,
                        email: donor.email,
                        phone: donor.phone
                    },
                    children: donor.children?.map((donation) => ({
                        key: donation._id, // Use donation ID as the key for uniqueness
                        data: {
                            id: donation._id,
                            name: `Donation`,
                            email: `donationAmount: ${donation.donationAmount}`,
                            phone: `donationDate: ${new Date(donation.donationDate).toLocaleDateString('en-GB')}`,
                            coinType: `coinType: ${donation.coinType}`
                        },
                        children: [] // Ensure children is defined
                    })) || [] // Fallback to an empty array if no children
                }));

                console.log("Donors data:", treeData); // Debugging
                setDonors(treeData);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDonors();
    }, [token]);

    const loadDonations = async (node) => {
        try {
            const response = await axios.get(`http://localhost:1135/api/donation/${node.data.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Map donations to TreeTable format
            const donations = response.data.map((donation, index) => ({
                key: `${node.key}-${index}`,
                data: {
                    name: `Donation ${index + 1}`,
                    email: `donationAmount: ${donation.donationAmount}`,
                    phone: `donationDate: ${donation.donationDate}`,
                    coinType: `coinType: ${donation.coinType}`
                },
                children: []
            }));

            // Update the donor's children with the donations
            const updatedDonors = donors.map((donor) =>
                donor.key === node.key ? { ...donor, children: donations } : donor
            );

            console.log("Updated donors:", updatedDonors); // Debugging
            setDonors(updatedDonors);
        } catch (err) {
            console.error("Failed to load donations:", err);
        }
    };

    const handleExpand = (event) => {
        const node = event.node;

        // Load donations only if they haven't been loaded yet
        if (node.children.length === 0) {
            loadDonations(node);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="card">
            <TreeTable value={donors} tableStyle={{ minWidth: '50rem' }} onExpand={handleExpand}>
                <Column field="name" header="Name" expander></Column>
                <Column field="email" header="Email"></Column>
                <Column field="phone" header="Phone"></Column>
            </TreeTable>
        </div>
    );
};

export default GetAllDonors;