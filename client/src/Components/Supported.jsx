import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Supported = () => {
    const [supported, setSupported] = useState([]);
    const [showDialog, setShowDialog] = useState(false); // מצב לפתיחת הדיאלוג
    const [newCategory, setNewCategory] = useState(''); // שם הקטגוריה החדשה

    const getAllCategories = async () => {
        try {
            const res = await axios.get('http://localhost:1135/category');
            setSupported(res.data);
            console.log(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const addCategory = async () => {
        try {

            await axios.post('http://localhost:1135/category', { name: newCategory });
            setNewCategory('');
            setShowDialog(false);
            getAllCategories(); // רענון הרשימה לאחר הוספה
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllCategories();
    }, []);

    const header = (<></>);
    const footer = (
        <>
            <Button severity="info" icon="pi pi-pencil" />
            <Button severity="danger" icon="pi pi-trash" style={{ marginLeft: '0.5em' }} />
        </>
    );

    return (
        <>
            <Button 
                label="Add Category" 
                icon="pi pi-plus" 
                className="p-button-success mb-3" 
                onClick={() => setShowDialog(true)} 
            />
            <Dialog 
                header="Add New Category" 
                visible={showDialog} 
                style={{ width: '30vw' }} 
                onHide={() => setShowDialog(false)}
            >
                <div className="field">
                    <label htmlFor="categoryName">Category Name:</label>
                    <InputText 
                        id="categoryName" 
                        value={newCategory} 
                        onChange={(e) => setNewCategory(e.target.value)} 
                    />
                </div>
                <Button 
                    label="Add" 
                    icon="pi pi-check" 
                    className="p-button-success mt-3" 
                    onClick={addCategory} 
                />
            </Dialog>
            {supported.map((ind) => {
                return (
                    <Link 
                        to={`/viewSupported`} 
                        key={ind._id} 
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <Card 
                            title={ind.name} 
                            className="md:w-25rem" 
                            footer={footer} 
                            header={header}
                        >
                        </Card>
                    </Link>
                );
            })}
        </>
    );
};

export default Supported;