import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../redux/tokenSlice';

const NavigateAdmin = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => {
                navigate('/homedonor')
            }

        },

        {
            label: 'Donors',
            icon: 'pi pi-users',
            command: () => {
                navigate('/getAllDonors')
            }
        }
        ,

        {
            label: 'Donation',
            icon: 'pi pi-wallet',
            command: () => {
                navigate('/getAllDonations')
            }
        }
        ,

        {
            label: 'Add donor',
            icon: 'pi pi-user-plus',
            command: () => {
                navigate('/AddDonor')
            }
        }
       

    ]
    const end = (
        <div className="flex align-items-center gap-2">
            <Button onClick={() => {
                dispatch(logOut());
                navigate('/')
            }}>Logout</Button>
        </div>
    )
    return (<>
        <div className="card">
            <Menubar model={items} end={end} />
        </div>
        
    </>)
}
export default NavigateAdmin