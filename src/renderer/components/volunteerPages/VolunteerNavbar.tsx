import { AppBar, Box, Button, IconButton, MenuItem, Toolbar, Typography } from '@mui/material'
import * as React from 'react'
import { Link, redirect, useNavigate } from 'react-router-dom';

/*
Home 
Events
College Events (*if college email domain was used)
Settings
*/
const pages = ['Home', 'Events', 'College Events', 'Past Events'];

export default function VolunteerNavBar() : JSX.Element {
    
    return (
        <>
        <Box>
            <AppBar position = "static" sx={{paddingBottom:'2px', margin:0}}>
                <Toolbar disableGutters>
                    <MenuItem key='Home' sx={{height:'100%'}} component={"a"} href={'/volunteerHome'}>
                        <Typography textAlign="center">Home</Typography>
                    </MenuItem>
                    <MenuItem data-my-value={'Events'} sx={{height:'100%'}} component={"a"} href={'/volunteerEvents'}>
                        <Typography textAlign="center">Events</Typography>
                    </MenuItem>

                </Toolbar>
            </AppBar>
        </Box>
        </>
    )

}
