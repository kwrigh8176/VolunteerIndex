import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import React from 'react'
import VolunteerSignUp from '../volunteerPages/volunteerSignUp';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { abort } from 'process';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const SignUp = () : JSX.Element => {

    const sql = require('mssql');

    const [orgName, setOrgName] = React.useState<string >('');
    const [address, setAddress] = React.useState<string>('');
    const [email, setEmail] = React.useState<string>('');
    const [phoneNumber, setPhoneNumber] = React.useState<string>('');
    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [disableSignUpButton, setDisableSignUpButton] = React.useState<boolean>(false);
    const [signUpType, setSignUpType] = React.useState<string>('Volunteer');
    const [errorText, setErrorText] = React.useState<string>('');

    async function processVolunterSignUp(){
        
        {/*Check for empty fields at first*/}
        if (address.toString() == '' || email.toString() == '' || phoneNumber.toString() == '' || username.toString() == '' || password.toString() == '' )
        {
            setErrorText('One or more fields are empty.');
            return
        }

        setDisableSignUpButton(true)
            try
            {
                {/*Resetting the error text*/}
                setErrorText('');

                await sql.connect(config)

                
                {/*Checking if the username is in use*/}
                let request = new sql.Request()
                request.input('username_parameter', sql.VarChar, username.toString())
                let result = await request.query("SELECT * FROM Orgs WHERE Username=@username_parameter")
                
                if (result.recordset.length == 1){
                    setErrorText('Username already exists!')
                    throw new Error('Username already exists!')
                }
                else
                {
                    {/*Checking if the organization name exists*/}
                    request = new sql.Request()
                    request.input('orgname_parameter', sql.VarChar, orgName.toString())
                    result = await request.query("SELECT * FROM Orgs WHERE OrgName=@orgname_parameter")
                    if (result.recordset.length == 1){
                        setErrorText('Organization with that name already exists!')
                        throw new Error('Organization with that name already exists!')
                    }
                    else
                    {
                        {/*Checking if the email is already in use*/}
                        request = new sql.Request()
                        request.input('email_parameter', sql.VarChar, email.toString())
                        result = await request.query("SELECT * FROM Orgs WHERE Email=@email_parameter")
                        if (result.recordset.length == 1){
                            setErrorText('Email is already in use.')
                            throw new Error('Email is already in use.')
                        }
                        else{
                            //then we can move to email verification here


            

                            //then redirect to verification page
                        }
                    }
                    
                }

            }
            catch(err)
            {
                sql.close()
                setDisableSignUpButton(false)
            }

            setDisableSignUpButton(false)
         
    }
    
    
    async function processOrgSignUp(){

        {/*Check for empty fields at first*/}
        if (orgName.toString() == '' || address.toString() == '' || email.toString() == '' || phoneNumber.toString() == '' || username.toString() == '' || password.toString() == '' )
        {
            setErrorText('One or more fields are empty.');
            return
        }

        setDisableSignUpButton(true)
            try
            {
                {/*Resetting the error text*/}
                setErrorText('');

                await sql.connect(config)

                
                {/*Checking if the username is in use*/}
                let request = new sql.Request()
                request.input('username_parameter', sql.VarChar, username.toString())
                let result = await request.query("SELECT * FROM Orgs WHERE Username=@username_parameter")
                
                if (result.recordset.length == 1){
                    setErrorText('Username already exists!')
                    throw new Error('Username already exists!')
                }
                else
                {
                    {/*Checking if the organization name exists*/}
                    request = new sql.Request()
                    request.input('orgname_parameter', sql.VarChar, orgName.toString())
                    result = await request.query("SELECT * FROM Orgs WHERE OrgName=@orgname_parameter")
                    if (result.recordset.length == 1){
                        setErrorText('Organization with that name already exists!')
                        throw new Error('Organization with that name already exists!')
                    }
                    else
                    {
                        {/*Checking if the email is already in use*/}
                        request = new sql.Request()
                        request.input('email_parameter', sql.VarChar, email.toString())
                        result = await request.query("SELECT * FROM Orgs WHERE Email=@email_parameter")
                        if (result.recordset.length == 1){
                            setErrorText('Email is already in use.')
                            throw new Error('Email is already in use.')
                        }
                        else{
                            //then we can move to email verification here


            

                            //then redirect to verification page
                        }
                    }
                    
                }

            }
            catch(err)
            {
                sql.close()
                setDisableSignUpButton(false)
            }

            setDisableSignUpButton(false)
         
    }


    const orgSignUp = () : JSX.Element => {
        return (
            <>
                <div 
                    style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    {errorText.toString() != '' && 
                    
                        <Alert severity="error">
                            <AlertTitle>Invalid Inputs</AlertTitle>
                            {errorText} 
                        </Alert>
                    }
                    
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
                    <Button variant="outlined" disabled={disableSignUpButton} onClick={processOrgSignUp}>Sign Up</Button>
                    <Button href="/" variant="contained" color="primary" disabled={disableSignUpButton}>Login Here</Button>
                </div>
            </>
        )
    }

    const volunteerSignUp = () : JSX.Element => {
        return (
            <>
                <div 
                    style={{
                        position: 'absolute', left: '50%', top: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}>
                    <TextField id="outlined-basic" label="First Name" variant="outlined"/>
                    <br></br>
                    <TextField id="outlined-basic" label="Middle Initial" variant="outlined"/>
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
                    <Button variant="outlined" disabled={disableSignUpButton}>Sign Up</Button>
                    <Button href="/" variant="contained" color="primary" disabled={disableSignUpButton}>Login Here</Button>
                </div>
            </>
        )

        
    }

    return (

        <>
            <Select labelId="demo-simple-select-label" value={signUpType}  label="Sign Up Type" onChange={(event) => setSignUpType(event.target.value)}>
                <MenuItem value='Volunteer'>Volunteer</MenuItem>
                <MenuItem value='Organization'>Organization</MenuItem>
            </Select>
            {signUpType.toString() == 'Volunteer' && volunteerSignUp()}
            {signUpType.toString() == 'Organization' && orgSignUp()}
        </>


    )



}

export default SignUp