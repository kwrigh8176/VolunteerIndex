import { AppBar, Box, IconButton, MenuItem, Toolbar, Typography } from '@mui/material'
import * as React from 'react'
import AccountCircle from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
/*
Home 
Events
College Events (*if college email domain was used)
Settings
*/

const allRoutes = [
    {
        pageName: "All Events",
        pageRoute:"/orgCurrentEvents"
    },
    {
        pageName: "Past Events",
        pageRoute:"/orgPastEvents"
    },
    {
        pageName: "College Events",
        pageRoute:"/orgCollegeEvents"
    }
]


const limitedRoutes = [
    {
        pageName: "All Events",
        pageRoute:"/orgCurrentEvents"
    },
    {
        pageName: "Past Events",
        pageRoute:"/orgPastEvents"
    }
]



export default function OrgNavBar() : JSX.Element {
    var routes;
    if (sessionStorage.getItem("collegeOrgs") == "true")
    {
        routes = allRoutes
    }
    else
    {
        routes = limitedRoutes
    }

    return (
        <>
        <Box sx={{flexGrow:1, paddingBottom:'75px '}}>
            <AppBar sx={{paddingBottom:'2px', margin:0, backgroundColor:'#1f2120', flexGrow:1}}>
                <Toolbar disableGutters sx={{flexGrow:1}}>
                    {routes.map(item => 

                        <MenuItem key='Home' sx={{height:'100%'}} component={"a"} href={item.pageRoute} style={
                            item.pageRoute === sessionStorage.getItem("currRoute") ? {backgroundColor: 'black'} : {backgroundColor: ''}}>
                            <Typography textAlign="center" color='white'>{item.pageName}</Typography>
                        </MenuItem>
                    )}

                    <IconButton
                        size="large"
                        aria-label="account of current organization"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                        component={`a`}
                        href={'/orgCreateEvents'}
                    >
                        <AddIcon />
                    </IconButton>

                    <IconButton
                        size="large"
                        aria-label="account of current organization"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                        component={`a`}
                        href={'/orgProfile'}
                    >
                        <AccountCircle />
                    </IconButton>

                </Toolbar>
            </AppBar>
        </Box>
        </>
    )

}
