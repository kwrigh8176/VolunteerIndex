import * as React from 'react'
import VolunteerEvents from './VolunteerEvents'

const VolunteerHome = () : JSX.Element => {
    return (
        <>
            <p>Volunteer Home</p>
            {VolunteerEvents()}
        </>
    )
}

export default VolunteerHome