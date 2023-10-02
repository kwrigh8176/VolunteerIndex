import { AppBar } from '@mui/material'
import * as React from 'react'

/*
Home 
Events
College Events (*if college email domain was used)
Settings
*/
const pages = ['Home', 'Events', 'Settings'];

export default function NavBar() : JSX.Element {
    const [activeTab, setActiveTab] = React.useState('Home')
    return (
        <AppBar>

        </AppBar>
    )

}
