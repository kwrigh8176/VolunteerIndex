import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import orgSignUp from '../organizationPages/orgSignUp';
import Link from '@mui/material/Link';

const sql = require('mssql');

function VerifyLogin(){
        var poolConnection = sql.connect(config);
}

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
                        <Link href="/OrgSignUp">Organization Sign Up</Link>
                    </div>
            </body>
        </html>
    );
}

