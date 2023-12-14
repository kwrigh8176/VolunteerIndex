import { AppBar, Box, Button, IconButton, Menu, MenuItem, Modal, Toolbar, Typography } from '@mui/material'
import * as React from 'react'
import AccountCircle from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {store} from '../../redux';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    backdrop: 'static',
    display: 'flex',
    flexDirection:'row', 
    flexWrap: 'wrap' , 
  };

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


    if (store.getState().collegeOrg == true)
    {
        routes = allRoutes
    }
    else
    {
        routes = limitedRoutes
    }
    
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openMenu, setOpenMenu] = React.useState<boolean>(false);
    const [openExitModal, setOpenExitModal] = React.useState<boolean>(false);

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

            
                <div>
                    <IconButton
                            size="large"
                            aria-label="account of current organization"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                            onClick={() => navigate('/orgCreateEvents')}
                        >
                            <AddIcon />
                    </IconButton>

                    
                    <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="inherit"
                    onClick={() => navigate('/orgProfile')}
                    >
                        <AccountCircle />
                    </IconButton>
                    

                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                        onClick={() =>  setOpenExitModal(true)}
                    >
                        <ExitToAppIcon />
                    </IconButton>
                </div>

                <Menu open={openMenu} anchorEl={anchorEl} sx={{backgroundColor:'#'}} onClose={handleClose}>
                    {routes.map(item => 
                        <MenuItem key='Home' sx={{height:'100%'}} onClick={() => navigate(item.pageRoute)}>
                            <Typography textAlign="center" color='black'>{item.pageName}</Typography>
                        </MenuItem>
                    )}
                </Menu>


                </Toolbar>
            </AppBar>
        </Box>

        <Modal open={openExitModal}>
            <Box sx={modalStyle}>
                <div style={{width: '100%',display: 'flex' , justifyContent:'center'}}>
                    <Typography>Would you like to log out?</Typography>
                </div>

                <div style={{width: '100%',display: 'flex' , justifyContent:'center'}}>
                    <Button onClick={() => setOpenExitModal(false)} variant="contained">Cancel</Button>
                    <Button onClick={() => { navigate('/')}} variant="outlined" sx={{marginLeft:'10px'}}>Confirm</Button>
                </div>
            </Box>
        </Modal>
        </>
    )
}
