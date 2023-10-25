import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import * as React from 'react'
import AccountCircle from '@mui/icons-material/AccountCircle';
/*
Home 
Events
College Events (*if college email domain was used)
Settings
*/

const pagesAndRoutes = [
    {
        pageName: "Home",
        pageRoute:"/volunteerHome"
    },
    {
        pageName: "Events",
        pageRoute:"/volunteerEvents"
    },
    {
        pageName: "Past Events",
        pageRoute:"/volunteerPastEvents"
    }
]


export default function VolunteerNavBar() : JSX.Element {


    return (
        <>
        <Box sx={{flexGrow:1, paddingBottom:'75px '}}>
            <AppBar sx={{paddingBottom:'2px', margin:0, backgroundColor:'#1f2120', flexGrow:1}}>
                <Toolbar disableGutters sx={{flexGrow:1}}>
                {pagesAndRoutes.map(item => 

                    <MenuItem key='Home' sx={{height:'100%'}} component={"a"} href={item.pageRoute} style={
                        item.pageRoute === sessionStorage.getItem("currRoute") ? {backgroundColor: 'black'} : {backgroundColor: ''}}>
                        <Typography textAlign="center" color='white'>{item.pageName}</Typography>
                    </MenuItem>
                )}

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
