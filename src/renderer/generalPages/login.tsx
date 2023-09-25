import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function Login(){
    return(
        <html>
            <body>
                <h1 style={{textAlign: 'center'}}>Welcome to VolunteerIndex!</h1>
                    <div 
                        style={{
                            position: 'absolute', left: '50%', top: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}>
                        <TextField id="outlined-basic" label="Username" variant="outlined" />
                        <br></br>
                        <TextField id="outlined-basic" label="Password" variant="outlined" />
                        <br></br>
                        <Button variant="outlined">Login</Button>
                    </div>
            </body>
        </html>
    );
}