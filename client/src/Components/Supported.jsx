import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import ViewSupported from './ViewSupported';

const Supported = () => {
    const [supported, setSupported] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('add');
    const [categoryName, setCategoryName] = useState('');
    const [category, setCategory] = useState('')
    const [editId, setEditId] = useState(null)
    const [error, setError] = useState('')
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [showViewSupported, setShowViewSupported] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [deleteId, setDeleteId] = useState(null)

    const getAllCategories = async () => {
        try {
            const res = await axios.get('http://localhost:1135/api/category');
            setSupported(res.data);
        } catch (err) {
            setError('שגיאה בטעינת הקטגוריות!');
        }
    };

    const handleAddOrEdit = async () => {
        setError('');
        try {
            if (dialogMode === 'add') {
                const res = await axios.post('http://localhost:1135/api/category', { name: categoryName });
                setCategory(res.data)
            } else if (dialogMode === 'edit' && editId) {
                await axios.put(`http://localhost:1135/api/category/${editId}`, { name: categoryName });
            }
            setShowDialog(false);
            setCategoryName('');
            setEditId(null);
            getAllCategories();
        } catch (err) {
            setError('שגיאה בשמירה!');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:1135/api/category/${id}`)
            getAllCategories()
        } catch (err) {
            setError('שגיאה במחיקה!')
        }
    };

    const openAddDialog = () => {
        setDialogMode('add')
        setCategoryName('')
        setEditId(null)
        setShowDialog(true)
        setError('')
    };

    const openEditDialog = (id, name) => {
        setDialogMode('edit');
        setCategoryName(name);
        setEditId(id);
        setShowDialog(true);
        setError('');
    };

    useEffect(() => {
        getAllCategories();
    }, []);

    const dialogFooter = (
        <Button
            label={dialogMode === 'add' ? 'add' : 'edit'}
            icon="pi pi-check"
            className="p-button-success"
            onClick={handleAddOrEdit}
        />
    );

    return (
        <>
            <Button
                label="add category"
                icon="pi pi-plus"
                className="p-button-success mb-3"
                onClick={openAddDialog}
            />
            <Dialog
                header={dialogMode === 'add' ? 'add category' : 'edit category'}
                visible={showDialog}
                style={{ width: '30vw' }}
                onHide={() => setShowDialog(false)}
                footer={dialogFooter}
            >
                <div className="field">
                    <label htmlFor="categoryName">category Name:</label>
                    <InputText
                        id="categoryName"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        autoFocus
                    />
                </div>
                {error && <div style={{ color: 'red', marginTop: '0.5em' }}>{error}</div>}
            </Dialog>


            {supported.map((ind) => (

                <Card
                    footer={
                        <>
                            <Button
                                severity="info"
                                icon="pi pi-pencil"
                                onClick={() => openEditDialog(ind._id, ind.name)}
                            />
                            <Button
                                severity="danger"
                                icon="pi pi-trash"
                                style={{ marginLeft: '0.5em' }}
                                onClick={() => {
                                    setDeleteId(ind._id);
                                    setShowDeleteDialog(true);
                                }}
                            />
                        </>
                    }
                >
                    <Button
                        label={ind.name}
                        style={{ fontSize: '2em' }}
                        className="p-button-link"
                        onClick={() => {
                            setSelectedCategory(ind); // שומר את שם הקטגוריה
                            setShowViewSupported(true);
                        }}
                    />
                </Card>
            ))}
            <Dialog
                visible={showDeleteDialog}
                style={{ width: '350px' }}
                header="Delete Confirmation"
                modal
                footer={
                    <>
                        <Button
                            label="No"
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={() => setShowDeleteDialog(false)}
                        />
                        <Button
                            label="Yes"
                            icon="pi pi-check"
                            className="p-button-danger"
                            onClick={async () => {
                                await handleDelete(deleteId);
                                setShowDeleteDialog(false);
                            }}
                        />
                    </>
                }
                onHide={() => setShowDeleteDialog(false)}
            >
                <div style={{ fontSize: '1.2em' }}>
                    Are you sure you want to delete this category?
                </div>
            </Dialog>
            {showViewSupported && (
                <ViewSupported
                    category={selectedCategory}
                    onClose={() => setShowViewSupported(false)}
                />
            )}
        </>
    );
};

export default Supported;