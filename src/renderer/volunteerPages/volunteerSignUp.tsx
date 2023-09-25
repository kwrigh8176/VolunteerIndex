import * as React from 'react';
import TextField from '@mui/material/TextField';

import Link from '@mui/material/Link';
import Button from '@mui/material/Button';

function VolunteerSignUp(){
    return(
        <html>
            <body>
                    <div 
                        style={{
                            position: 'absolute', left: '50%', top: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}>
                        <TextField id="outlined-basic" label="First Name" variant="outlined"/>
                        <br></br>
                        <TextField id="outlined-basic" label="Last Name" variant="outlined"/>
                        <br></br>
                        <TextField id="outlined-basic" label="Email" variant="outlined"/>
                        <br></br>
                        <TextField id="outlined-basic" label="Phone Number" variant="outlined"/>
                        <br></br>
                        <TextField id="outlined-basic" label="Username" variant="outlined" inputProps={{maxLength: 15}}/>
                        <br></br>
                        <TextField id="outlined-basic" label="Password" variant="outlined" inputProps={{maxLength: 25}}/>
                        <br></br>
                        <Button variant="outlined">Sign Up</Button>
                        <Button href="/OrgSignUp" variant="contained" color="primary">Organization Sign Up Here</Button>
                        <Button href="/" variant="contained" color="primary">Login Here</Button>
                    </div>
            </body>
        </html>
    );
}

export default VolunteerSignUp