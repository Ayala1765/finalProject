//useEffect
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import './FormDemo.css';

const Register = () => {
    // const [countries, setCountries] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [visible, setVisible] = useState(false);

    const [formData, setFormData] = useState({});
    // const countryservice = new CountryService();
    const defaultValues = {
        name: '',
        email: '',
        password: '',
        date: null,
        country: null,
        accept: false
    }

    // useEffect(() => {
    //     countryservice.getCountries().then(data => setCountries(data));
    //     console.log(countries);
    // }, [])

    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

    const onSubmit = async(data) => {
        setFormData(data);
        setShowMessage(true);
        setVisible(false);
        reset()
        await axios.post('http://localhost:1135/auth/register', data )

    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;
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
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>Registration Successful!</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        Your account is registered under name <b>{formData.name}</b> ; it'll be valid next 30 days without activation. Please check <b>{formData.email}</b> for activation instructions.
                    </p>
                </div>
            </Dialog>
            <a style={{
                color: 'blue',
                textDecoration: 'underline',
                cursor: 'pointer'
            }} onClick={() => { setVisible(true) }}>
                Donating for the first time?
            </a>
            <h3></h3>
            <Dialog visible={visible} style={{ width: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }}>
                <div className="flex justify-content-center">
                    <div className="card">
                        <h5 className="text-center">Register</h5>
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="name" control={control} rules={{ required: 'Name is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                    <label htmlFor="name" className={classNames({ 'p-error': errors.name })}>Name*</label>
                                </span>
                                {getFormErrorMessage('name')}
                            </div>
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="username" control={control} rules={{ required: 'UserName is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                    <label htmlFor="username" className={classNames({ 'p-error': errors.name })}>UserName*</label>
                                </span>
                                {getFormErrorMessage('username')}
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
                                {getFormErrorMessage('email')}
                            </div>
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="password" control={control} rules={{ required: 'Password is required.' }} render={({ field, fieldState }) => (
                                        <Password id={field.name} {...field} toggleMask className={classNames({ 'p-invalid': fieldState.invalid })} header={passwordHeader} footer={passwordFooter} />
                                    )} />
                                    <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>Password*</label>
                                </span>
                                {getFormErrorMessage('password')}
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
                                {getFormErrorMessage('phone')}
                            </div>
                            <br />
                            <div className="field-checkbox">
                                <Controller name="accept" control={control} rules={{ required: true }} render={({ field, fieldState }) => (
                                    <Checkbox inputId={field.name} onChange={(e) => field.onChange(e.checked)} checked={field.value} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="accept" className={classNames({ 'p-error': errors.accept })}>I agree to the terms and conditions*</label>
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