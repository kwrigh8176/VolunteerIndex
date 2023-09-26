import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import orgSignUp from '../organizationPages/orgSignUp';
import Link, { BrowserRouter } from 'react-router-dom';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


const Login = () : JSX.Element => {
    
    const sql = require('mssql');

    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [disableLoginButton, setDisableLoginButton] = React.useState(false);
    const [loginType, setLoginType] = React.useState<string>('Volunteer');



    const VerifyOrgLogin = async () => {

            setDisableLoginButton(true)
            try 
            {

                await sql.connect(config)

                let request = new sql.Request()
                request.input('username_parameter', sql.VarChar, username.toString())
                let result = await request.query("SELECT * FROM Orgs WHERE Username=@username_parameter")
                
                if (result.recordset.length == 1){

                    request = new sql.Request()
                    request.input('password_parameter', sql.VarChar, password.toString())
                    result = await request.query("SELECT * FROM Orgs WHERE Password=@password_parameter")
                    //password should be deencrypted here

                    if (result.recordset.length == 1){
                        //then take them to their respective dashboard
                    }
                    else{
                        alert('Incorrect password!')
                    }
                }
                else{
                    alert('User not found!')
                }
                
                
            }
            catch(err)
            {

                console.log(err)
            }
            setDisableLoginButton(false)
    }

    const VerifyVolunteerLogin = async () => {

        setDisableLoginButton(true)
        try 
        {

            await sql.connect(config)

            let request = new sql.Request()
            request.input('username_parameter', sql.VarChar, username.toString())
            let result = await request.query("SELECT * FROM Volunteer WHERE Username=@username_parameter")
            
            if (result.recordset.length == 1){

                request = new sql.Request()
                request.input('password_parameter', sql.VarChar, password.toString())
                result = await request.query("SELECT * FROM Volunteer WHERE Password=@password_parameter")
                //password should be deencrypted here

                if (result.recordset.length == 1){
                    //then take them to their respective dashboard
                }
                else{
                    alert('Incorrect password!')
                }
            }
            else{
                alert('User not found!')
            }
            
            
        }
        catch(err)
        {

            console.log(err)
        }
        setDisableLoginButton(false)
}


    return(
        <>
                    <h1 style={{textAlign: 'center'}}>Welcome to VolunteerIndex!</h1>
                        <div 
                            style={{
                                position: 'absolute', left: '50%', top: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}>
                            <Select labelId="demo-simple-select-label" value={loginType}  label="Login Type" onChange={(event) => setLoginType(event.target.value)}>
                                <MenuItem value='Volunteer'>Volunteer</MenuItem>
                                <MenuItem value='Organization'>Organization</MenuItem>
                            </Select>
                            <TextField id="outlined-basic" label="Username" onChange={(event) => setUsername(event.target.value)} variant="outlined" />
                            <br></br>
                            <TextField id="outlined-basic" label="Password" onChange={(event) => setPassword(event.target.value)} type="password" variant="outlined" />
                            <br></br>
                            <Button variant="outlined" disabled={disableLoginButton} onClick={() => {
                                if (loginType.toString() == "Volunteer"){
                                    VerifyVolunteerLogin()
                                }
                                else{
                                    VerifyOrgLogin()
                                }
                            }}>
                                Login
                            </Button>

                            <Button href={`/signup`} disabled={disableLoginButton} variant="contained" color="primary">Sign Up Here</Button>
                        </div>
        </>
    );
}

export default Login