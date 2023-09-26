import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';


function OrgSignUp(){

    const sql = require('mssql');

    const [orgName, setOrgName] = React.useState<string >('');
    const [address, setAddress] = React.useState<string>('');
    const [email, setEmail] = React.useState<string>('');
    const [phoneNumber, setPhoneNumber] = React.useState<string>('');
    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [disableLoginButton, setDisableLoginButton] = React.useState<boolean>(false);



    function processOrgSignUp(){
        async () => {
            try
            {
                
                let connection = await sql.connect(config)

                const getExistingUsernames = await connection.request()
                .input('username_parameter', sql.VarChar(15), username) 
                .query(`SELECT * FROM dbo.Orgs WHERE Username=@username_parameter`,);

                console.dir(getExistingUsernames)

                const getExistingEmails  = await connection.request()
                .input('email_parameter', sql.VarChar(50), email)
                .query(`SELECT * FROM dbo.Orgs WHERE Email=@email_parameter`,);

                const getExistingOrgNames  = await connection.request()
                .input('orgName_parameter', sql.VarChar(50), orgName)
                .query(`SELECT * FROM dbo.Orgs WHERE OrgName=@orgName_parameter`,);

                setDisableLoginButton(true)
            }
            catch(err)
            {
                setDisableLoginButton(true)
                console.log(err)
            }
        }
    }

    return(
        <html>
            <body>
                    <div 
                        style={{
                            position: 'absolute', left: '50%', top: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}>
                        <TextField id="outlined-basic" label="Organization Name" variant="outlined" inputProps={{maxLength: 50}} onChange={(event) => setOrgName(event.target.value)}/>
                        <br></br>
                        <TextField id="outlined-basic" label="Address" variant="outlined" inputProps={{maxLength: 50}} onChange={(event) => setAddress(event.target.value)}/>
                        <br></br>
                        <TextField id="outlined-basic" label="Email" variant="outlined"  inputProps={{maxLength: 50}} onChange={(event) => setEmail(event.target.value)}/>
                        <br></br>
                        <TextField id="outlined-basic" label="Phone Number" variant="outlined" inputProps={{maxLength: 10}} onChange={(event) => setPhoneNumber(event.target.value)}/>
                        <br></br>
                        <TextField id="outlined-basic" label="Username" variant="outlined" inputProps={{maxLength: 15}} onChange={(event) => setUsername(event.target.value)}/>
                        <br></br>
                        <TextField id="outlined-basic" label="Password" variant="outlined" inputProps={{maxLength: 25}} onChange={(event) => setPassword(event.target.value)}/>
                        <br></br>
                        <Button variant="outlined">Sign Up</Button>
                        <Button href="/VolunteerSignUp" variant="contained" color="primary">Volunteer Sign Up Here</Button>
                        <Button href="/" variant="contained" color="primary">Login Here</Button>
                    </div>
            </body>
        </html>
    );
}

export default OrgSignUp