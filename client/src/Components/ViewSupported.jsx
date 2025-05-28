import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import axios from 'axios';

const phoneRegex = /^0\d{9}$/;

const ViewSupported = ({ category, onClose }) => {
    const [supported, setSupported] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('add');
    const [editId, setEditId] = useState(null);
    const [newRow, setNewRow] = useState({
        name: '',
        contactName: '',
        contactPhone: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const toast = useRef(null);

    const fetchSupported = async () => {
        try {
            const res = await axios.get('http://localhost:1135/api/supported');
            setSupported(res.data.filter(sup => sup.category?.name === category.name));
        } catch (err) {
            showErrorToast('Failed to load supported people');
        }
    };

    useEffect(() => {
        fetchSupported();
        // eslint-disable-next-line
    }, [category]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:1135/api/category');
                setCategories(res.data);
            } catch (err) {
                showErrorToast('Failed to load categories');
            }
        };
        fetchCategories();
    }, []);

    const validateForm = () => {
        let errors = {};
        if (!newRow.name.trim()) errors.name = 'Please enter a name';
        if (!newRow.contactName.trim()) errors.contactName = 'Please enter a contact name';
        if (!newRow.contactPhone.trim()) {
            errors.contactPhone = 'Please enter a phone number';
        } else if (!phoneRegex.test(newRow.contactPhone.trim())) {
            errors.contactPhone = 'Invalid phone number';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const showSuccessToast = (msg) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
    };

    const showErrorToast = (msg) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: msg, life: 4000 });
    };

    const handleAddOrEdit = async () => {
        if (!validateForm()) return;
        try {
            if (dialogMode === 'add') {
                await axios.post('http://localhost:1135/api/supported', {
                    name: newRow.name,
                    contactName: newRow.contactName,
                    contactPhone: newRow.contactPhone,
                    category: category._id // always use the page's category
                });
                showSuccessToast('Supported person added successfully!');
            } else if (dialogMode === 'edit' && editId) {
                await axios.put(`http://localhost:1135/api/supported/${editId}`, {
                    name: newRow.name,
                    contactName: newRow.contactName,
                    contactPhone: newRow.contactPhone,
                    category: category._id
                });
                showSuccessToast('Supported person updated!');
            }
            setShowDialog(false);
            setNewRow({ name: '', contactName: '', contactPhone: '' });
            setFormErrors({});
            setEditId(null);
            setDialogMode('add');
            fetchSupported();
        } catch (err) {
            showErrorToast('Failed to save supported person');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:1135/api/supported/${id}`);
            showSuccessToast('Supported person deleted!');
            fetchSupported();
        } catch (err) {
            showErrorToast('Failed to delete supported person');
        }
    };

    const handleEdit = (rowData) => {
        setDialogMode('edit');
        setEditId(rowData._id);
        setNewRow({
            name: rowData.name,
            contactName: rowData.contactName,
            contactPhone: rowData.contactPhone
        });
        setShowDialog(true);
    };

    const actions = (rowData) => (
        <div>
            <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-info p-mr-2"
                style={{ marginRight: '0.5em' }}
                onClick={() => handleEdit(rowData)}
                tooltip="Edit"
            />
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => handleDelete(rowData._id)}
                tooltip="Delete"
            />
        </div>
    );

    const dialogFooter = (
        <Button
            label={dialogMode === 'add' ? "Add" : "Edit"}
            icon="pi pi-check"
            className="p-button-success"
            onClick={handleAddOrEdit}
        />
    );

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddOrEdit();
        }
    };

    return (
        <div className="view-supported-overlay">
            <Toast ref={toast} />
            <div className="view-supported-content-card">
                <div className="flex justify-content-between align-items-center mb-3">
                    <h2>Supported for: {category.name}</h2>
                    <div>
                        <Button
                            label="Add Supported"
                            icon="pi pi-plus"
                            className="p-button-primary mr-2"
                            onClick={() => {
                                setDialogMode('add');
                                setNewRow({ name: '', contactName: '', contactPhone: '' });
                                setFormErrors({});
                                setShowDialog(true);
                            }}
                        />
                        <Button
                            icon="pi pi-times"
                            className="p-button-danger"
                            onClick={onClose}
                        />
                    </div>
                </div>

                <Dialog
                    visible={showDialog}
                    style={{ width: '450px' }}
                    header={dialogMode === 'add' ? 'Add New Supported Person' : 'Edit Supported Person'}
                    modal
                    className="p-fluid"
                    footer={dialogFooter}
                    onHide={() => {
                        setShowDialog(false);
                        setNewRow({ name: '', contactName: '', contactPhone: '' });
                        setFormErrors({});
                    }}
                >
                    <div className="field mb-2">
                        <label>Name:</label>
                        <InputText
                            value={newRow.name}
                            onChange={e => setNewRow({ ...newRow, name: e.target.value })}
                            className={formErrors.name ? 'p-invalid' : ''}
                        />
                        {formErrors.name && <small className="p-error">{formErrors.name}</small>}
                    </div>
                    <div className="field mb-2">
                        <label>Contact Name:</label>
                        <InputText
                            value={newRow.contactName}
                            onChange={e => setNewRow({ ...newRow, contactName: e.target.value })}
                            className={formErrors.contactName ? 'p-invalid' : ''}
                        />
                        {formErrors.contactName && <small className="p-error">{formErrors.contactName}</small>}
                    </div>
                    <div className="field mb-2">
                        <label>Phone:</label>
                        <InputText
                            value={newRow.contactPhone}
                            onChange={e => setNewRow({ ...newRow, contactPhone: e.target.value })}
                            className={formErrors.contactPhone ? 'p-invalid' : ''}
                            onKeyDown={handleKeyDown}
                        />
                        {formErrors.contactPhone && <small className="p-error">{formErrors.contactPhone}</small>}
                    </div>
                </Dialog>
                <div className="card">
                    <DataTable value={supported} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="name" header="Name" />
                        <Column field="contactName" header="Contact Name" />
                        <Column field="contactPhone" header="Phone" />
                        <Column body={actions} header="Actions" style={{ width: '8em' }} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default ViewSupported;