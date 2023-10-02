import * as React from 'react'
import VolunteerEvents from './VolunteerEvents'
import VolunteerNavBar from './VolunteerNavbar'

const VolunteerHome = () : JSX.Element => {
    return (
        <>
            {VolunteerNavBar()}
            <p>Volunteer Home</p>
        </>
    )
}

export default VolunteerHome