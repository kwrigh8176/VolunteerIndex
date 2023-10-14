import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import * as React from 'react'
import AccountCircle from '@mui/icons-material/AccountCircle';
/*
Home 
Events
College Events (*if college email domain was used)
Settings
*/


export default function VolunteerNavBar() : JSX.Element {


    return (
        <>
        <Box sx={{flexGrow:1, paddingBottom:'75px '}}>
            <AppBar sx={{paddingBottom:'2px', margin:0, backgroundColor:'#1f2120', flexGrow:1}}>
                <Toolbar disableGutters sx={{flexGrow:1}}>
                    <MenuItem key='Home' sx={{height:'100%'}} component={"a"} href={'/volunteerHome'}>
                        <Typography textAlign="center" color='white'>Home</Typography>
                    </MenuItem>
                    <MenuItem data-my-value={'Events'} sx={{height:'100%'}} component={"a"} href={'/volunteerEvents'}>
                        <Typography textAlign="center" color='white'>Events</Typography>
                    </MenuItem>
                    <MenuItem data-my-value={'Events'} sx={{height:'100%', flexGrow:1}} component={"a"} href={'/volunteerPastEvents'}>
                        <Typography textAlign="center" color='white'>Past Events</Typography>
                    </MenuItem>
                    <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                component={`a`} href={`/volunteerProfile`}
              >
                <AccountCircle />
              </IconButton>

               
          


                </Toolbar>
            </AppBar>
        </Box>
        </>
    )

}
