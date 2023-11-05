import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import * as React from 'react'
import AccountCircle from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
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



export default function OrgNavBar(pageName: any) : JSX.Element {
    var routes;
    if (sessionStorage.getItem("collegeOrgs") == "true")
    {
        routes = allRoutes
    }
    else
    {
        routes = limitedRoutes
    }
    
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openMenu, setOpenMenu] = React.useState<boolean>(false);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setOpenMenu(true)
    };

    const handleClose = () => {
        setAnchorEl(null);
        setOpenMenu(false)
    };
    
    return (
        <>
        <Box sx={{flexGrow:1, paddingBottom:'75px '}}>
            <AppBar sx={{paddingBottom:'2px', margin:0, backgroundColor:'#1f2120', flexGrow:1}}>
                
                <Toolbar disableGutters style={{display:'flex', justifyContent:"space-between", width:'100%'}}>

                

                <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={handleClick}
                >
                    <MenuIcon />
                </IconButton>

                <Typography sx={{fontSize:32}}>{pageName.pageName}</Typography>

                <Box>
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
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                component={`a`} href={`/orgProfile`}
                >
                    <AccountCircle />
                </IconButton>
                </Box>

                <Menu open={openMenu} anchorEl={anchorEl} sx={{backgroundColor:'#'}} onClose={handleClose}>
                    {routes.map(item => 
                        <MenuItem key='Home' sx={{height:'100%'}} component={"a"} href={item.pageRoute}>
                            <Typography textAlign="center" color='black'>{item.pageName}</Typography>
                        </MenuItem>
                    )}
                </Menu>


                </Toolbar>
            </AppBar>
        </Box>
        </>
    )
}
