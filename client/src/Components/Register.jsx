//useEffect
import React, { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import './FormDemo.css'
import { Route, Routes } from 'react-router-dom';
import TermsAndConditions from './TermsAndConditions'

const Register = () => {
    const [visible, setVisible] = useState(false);
    const toast = useRef(null)
    const [formData, setFormData] = useState({});
    const defaultValues = {}
    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues })
    const onSubmit = async (data) => {
        setFormData(data)
        try {
            const res = await axios.post('http://localhost:1135/api/auth/register', data)
            console.log(res.data.message)
            setVisible(false);
            reset()
            showGood(res.data.message)
        }
        catch (e) {
            console.log(e.response.data.error)
            showError(e.response.data.error)
        }
    }
    const showError = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 })
    }
    const showGood = (message) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 })
    }
    const passwordHeader = <h6>Pick a password</h6>;
    const passwordFooter = (
        <React.Fragment>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
            </ul>
        </React.Fragment>
    );

    return (
        <div className="form-demo">
            <Toast ref={toast} />
            <a style={{
                color: 'green',
                textDecoration: 'underline',
                cursor: 'pointer'
            }} onClick={() => { setVisible(true) }}>
                Donating for the first time?
            </a>
            <Dialog visible={visible} style={{ width: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }}>
                <div className="flex justify-content-center">
                    <div className="card">
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="name" control={control} rules={{ required: 'Name is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                    <label htmlFor="name" className={classNames({ 'p-error': errors.name })}>Name*</label>
                                </span>
                            </div>
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="username" control={control} rules={{ required: 'UserName is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                    <label htmlFor="username" className={classNames({ 'p-error': errors.name })}>UserName*</label>
                                </span>
                            </div>
                            <div className="field">
                                <span className="p-float-label p-input-icon-right">
                                    <i className="pi pi-envelope" />
                                    <Controller name="email" control={control}
                                        rules={{ required: 'Email is required.', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address. E.g. example@gmail.com' } }}
                                        render={({ field, fieldState }) => (
                                            <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                        )} />
                                    <label htmlFor="email" className={classNames({ 'p-error': !!errors.email })}>Email*</label>
                                </span>
                            </div>
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="password" control={control} rules={{ required: 'Password is required.' }} render={({ field, fieldState }) => (
                                        <Password id={field.name} {...field} toggleMask className={classNames({ 'p-invalid': fieldState.invalid })} header={passwordHeader} footer={passwordFooter} />
                                    )} />
                                    <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>Password*</label>
                                </span>
                            </div>
                            <div className="unfield">
                                <span className="p-float-label">
                                    <Controller
                                        name="phone"
                                        control={control}
                                        rules={{
                                            required: 'Phone number is required.',
                                            pattern: {
                                                value: /^[0-9]{10}$/, // דוגמה למספר טלפון עם 10 ספרות
                                                message: 'Please enter a valid phone number.'
                                            }
                                        }}
                                        render={({ field, fieldState }) => (
                                            <InputText
                                                id={field.name}
                                                {...field}
                                                className={classNames({ 'p-invalid': fieldState.invalid })}
                                            />
                                        )}
                                    />
                                    <label htmlFor="phone" className={classNames({ 'p-error': errors.phone })}>
                                        Phone Number*
                                    </label>
                                </span>
                            </div>
                            <br />
                            <div className="field-checkbox">
                                <Controller
                                    name="accept"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field, fieldState }) => (
                                        <Checkbox
                                            inputId={field.name}
                                            onChange={(e) => field.onChange(e.checked)}
                                            checked={field.value}
                                            className={classNames({ 'p-invalid': fieldState.invalid })}
                                        />
                                    )}
                                />
                                <label htmlFor="accept" className={classNames({ 'p-error': errors.accept })}>
                                    I agree to the <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">terms and conditions</a>*
                                </label>


                            </div>
                            <Button type="submit" label="Submit" className="mt-2" />
                        </form>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}



export default Register