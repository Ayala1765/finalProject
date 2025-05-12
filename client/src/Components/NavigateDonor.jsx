import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
const NavigateDonor = () => {
    const navigate = useNavigate()
    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => {
                navigate('/homeDonor');
            }

        }

    ];
    return (<>
        <div className="card">
            <Menubar model={items} />
        </div>
    </>)
}
export default NavigateDonor