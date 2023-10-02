import { AppBar, Button } from '@mui/material'
import * as React from 'react'
import { redirect, useNavigate } from 'react-router-dom';

/*
Home 
Events
College Events (*if college email domain was used)
Settings
*/
const pages = ['Home', 'Events', 'Settings'];

export default function VolunteerNavBar() : JSX.Element {
    return (
        <AppBar position = "static">
            <Button href={`/volunteerEvents`}>
                
            </Button>
        </AppBar>
    )

}
