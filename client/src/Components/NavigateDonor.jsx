import React from 'react'
import { Menubar } from 'primereact/menubar'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logOut } from '../redux/tokenSlice'

const NavigateDonor = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => {
                navigate('/homeDonor')
            }

        },
        {
            label: 'About us',
            icon: 'pi pi-star',
            command: () => {
                navigate('/about')
            }
        },
        {
            label: 'For donation',
            icon: 'pi pi-plus-circle',
            command: () => {
                navigate('/addDonation')
            }
        },
        {
            label: 'Recent donations',
            icon: 'pi pi-history',
            command: () => {
                navigate('/RecentDonations')
            }
        }


    ]
    const end = (
        <div className="flex align-items-center gap-2">
            <Button
                icon="pi pi-sign-out"
                className="p-button-rounded p-button-success"
                style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                
                }}
                onClick={() => {
                    dispatch(logOut())
                    navigate('/')
                }}
                aria-label="Logout"
            />
        </div>
    )
    return (<>
        <div className="card">
            <Menubar model={items} end={end} />
        </div>
    </>)
}
export default NavigateDonor