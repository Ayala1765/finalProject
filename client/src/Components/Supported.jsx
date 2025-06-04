import React, { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import axios from 'axios'
import ViewSupported from './ViewSupported'

const Supported = () => {
    const [supported, setSupported] = useState([])
    const [showDialog, setShowDialog] = useState(false)
    const [dialogMode, setDialogMode] = useState('add')
    const [categoryName, setCategoryName] = useState('')
    const [editId, setEditId] = useState(null)
    const [error, setError] = useState('')
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [showViewSupported, setShowViewSupported] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [deleteId, setDeleteId] = useState(null)

    const getAllCategories = async () => {
        try {
            const res = await axios.get('http://localhost:1135/api/category')
            setSupported(res.data)
        } catch (err) {
            setError('שגיאה בטעינת הקטגוריות!')
        }
    }

    const handleAddOrEdit = async () => {
        setError('')
        try {
            if (!categoryName.trim()) {
                setError('שם הקטגוריה לא יכול להיות ריק!')
                return
            }
            if (dialogMode === 'add') {
                await axios.post('http://localhost:1135/api/category', { name: categoryName })
            } else {
                await axios.put(`http://localhost:1135/api/category/${editId}`, { name: categoryName })
            }
            getAllCategories()
            setShowDialog(false)
            setCategoryName('')
        } catch (err) {
            setError('שגיאה בשמירת הקטגוריה!')
            console.error(err)
        }
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:1135/api/category/${id}`)
            getAllCategories()
        } catch (err) {
            setError('שגיאה במחיקת הקטגוריה!')
        }
    }

    useEffect(() => {
        getAllCategories()
    }, [])

    const header = (name, id) => (
        <div className="flex justify-content-between align-items-center">
            <h3>{name}</h3>
            <div>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success p-button-text mr-2"
                    onClick={() => {
                        setDialogMode('edit')
                        setCategoryName(name)
                        setEditId(id)
                        setShowDialog(true)
                    }}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger p-button-text"
                    onClick={() => {
                        setDeleteId(id)
                        setShowDeleteDialog(true)
                    }}
                />
            </div>
        </div>
    )

    return (
        <>
            <div className="supported-categories-container"> 
                <div className="flex flex-wrap justify-content-center gap-4"> 
                    {supported.map(category => (
                        <Card
                            key={category._id}
                            title={header(category.name, category._id)}
                            className="category-card"
                        >
                            <div className="flex justify-content-center">
                                <Button
                                    label="View Supported"
                                    icon="pi pi-users"
                                    className="p-button-info"
                                    onClick={() => {
                                        setSelectedCategory(category)
                                        setShowViewSupported(true)
                                    }}
                                />
                            </div>
                        </Card>
                    ))}
                    <Card
                        title={
                            <div className="flex justify-content-center align-items-center h-full">
                                <h3>Add New Category</h3>
                            </div>
                        }
                        className="category-card add-new-card"
                    >
                        <div className="flex justify-content-center">
                            <Button
                                icon="pi pi-plus"
                                className="p-button-rounded p-button-success"
                                onClick={() => {
                                    setDialogMode('add')
                                    setCategoryName('')
                                    setShowDialog(true)
                                }}
                            />
                        </div>
                    </Card>
                </div>
                <Dialog
                    visible={showDialog}
                    style={{ width: '450px' }}
                    header={dialogMode === 'add' ? 'Add New Category' : 'Edit Category'}
                    modal
                    className="p-fluid"
                    footer={
                        <>
                            <Button
                                label="Cancel"
                                icon="pi pi-times"
                                className="p-button-text"
                                onClick={() => setShowDialog(false)}
                            />
                            <Button
                                label={dialogMode === 'add' ? 'Add' : 'Save'}
                                icon="pi pi-check"
                                className="p-button-success"
                                onClick={handleAddOrEdit}
                            />
                        </>
                    }
                    onHide={() => {
                        setShowDialog(false)
                        setError('')
                    }}
                >
                    <div className="field">
                        <label htmlFor="categoryName">Category Name</label>
                        <InputText
                            id="categoryName"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            required
                            className={error ? 'p-invalid' : ''}
                        />
                        {error && <small className="p-error">{error}</small>}
                    </div>
                </Dialog>
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
                                    await handleDelete(deleteId)
                                    setShowDeleteDialog(false)
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
            </div> 

            {showViewSupported && (
                <ViewSupported
                    category={selectedCategory}
                    onClose={() => setShowViewSupported(false)}
                />
            )}
        </>
    )
}

export default Supported