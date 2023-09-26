import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import React from 'react'
import VolunteerSignUp from '../volunteerPages/volunteerSignUp';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { abort } from 'process';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InputLabel from '@mui/material/InputLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

var validator = require('validator');

function checkIllegalChars(str:string){
    return !/[~`!#$%\^&*+=\-\[\]\\';,@/{}|\\":<>\?]/g.test(str);
}

const SignUp = () : JSX.Element => {

    const sql = require('mssql');

    {/*Volunteer specific data*/}
    const [firstName, setFirstName] = React.useState<string >('');
    const [middleInitial, setMiddleInitial] = React.useState<string >('');
    const [lastName, setLastName] = React.useState<string>('');

    const [DOB, setDOB] = React.useState<Dayjs>(dayjs('2023-01-1'));

    {/*Org specific data*/}
    const [orgName, setOrgName] = React.useState<string >('');
    const [address, setAddress] = React.useState<string>('');

    {/*Data for both*/}
    const [email, setEmail] = React.useState<string>('');
    const [phoneNumber, setPhoneNumber] = React.useState<string>('');
    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');

    {/*Conditional rendering stuff*/}
    const [disableSignUpButton, setDisableSignUpButton] = React.useState<boolean>(false);
    const [signUpType, setSignUpType] = React.useState<string>('Volunteer');
    const [errorText, setErrorText] = React.useState<string>('');

    const [state, setState] = React.useState<string>('');

    

    async function processVolunterSignUp(){
        
        {/*Check for empty fields at first*/}
        if ( email.toString() == '' || phoneNumber.toString() == '' || username.toString() == '' || password.toString() == '' || firstName.toString() == '' || lastName.toString() == '' || state.toString() == '' )
        {
            setErrorText('One or more fields are empty.');
            return
        }

        if (checkIllegalChars(firstName.toString()) == true || checkIllegalChars(middleInitial.toString())  || checkIllegalChars(lastName.toString()))
        {
            setErrorText('One or more fields contain invalid characters (check the name fields).');
            return
        }

        if (validator.isMobilePhone(phoneNumber.toString()) == false)
        {
            setErrorText('Phone Number is not valid.');
            return
        }

        if (validator.isEmail(email.toString()) == false)
        {
            setErrorText('Email is not valid.');
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
                let result = await request.query("SELECT * FROM Volunteer WHERE Username=@username_parameter")
                
                if (result.recordset.length == 1){
                    setErrorText('Username already exists!')
                    throw new Error('Username already exists!')
                }
                else
                {

                    {/*Checking if the email is already in use*/}
                    request = new sql.Request()
                    request.input('email_parameter', sql.VarChar, email.toString())
                    result = await request.query("SELECT * FROM Volunteer WHERE Email=@email_parameter")
                    if (result.recordset.length == 1){
                        setErrorText('Email is already in use.')
                        throw new Error('Email is already in use.')
                    }
                    else{

                        {/*Checking if the phone number is already in use*/}
                        request = new sql.Request()
                        request.input('phonenumber_parameter', sql.VarChar, phoneNumber.toString())
                        result = await request.query("SELECT * FROM Volunteer WHERE PhoneNumber=@phonenumber_parameter")
                        if (result.recordset.length == 1){
                            setErrorText('Phone Number is already in use.')
                            throw new Error('Phone Number is already in use.')
                        }
                        else{
                            //then we can move to email verification here

                            //input data into db

            

                            //then redirect to verification page

                            request = new sql.Request()
                            request.input('firstname_parameter', sql.VarChar, firstName.toString())
                            request.input('middleinitial_parameter', sql.VarChar, middleInitial.toString())
                            request.input('lastname_parameter', sql.VarChar, lastName.toString())
                            request.input('DOB_parameter', sql.VarChar, dayjs(DOB.toString()).format('YYYY-MM-DD').toString())
                            request.input('email_parameter', sql.VarChar, email.toString())
                            request.input('phonenumber_parameter', sql.VarChar, phoneNumber.toString())
                            request.input('username_parameter', sql.VarChar, username.toString())
                            request.input('password_parameter', sql.VarChar, password.toString())
                            request.input('state_parameter', sql.VarChar, state.toString())

                            request.query("INSERT INTO Volunteer (FirstName, MiddleInitial, LastName, DOB, Email, PhoneNumber, Username, Password, State, CollegeStudent) VALUES (@firstname_parameter, @middleinitial_parameter,@lastname_parameter,@DOB_parameter, @email_parameter, @phonenumber_parameter, @username_parameter, @password_parameter, @state_parameter, NULL )")
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
        if (orgName.toString() == '' || address.toString() == '' || email.toString() == '' || phoneNumber.toString() == '' || username.toString() == '' || password.toString() == '' || state.toString() == '')
        {
            setErrorText('One or more fields are empty.');
            return
        }

        if (validator.isMobilePhone(phoneNumber.toString()) == false)
        {
            setErrorText('Phone Number is not valid.');
            return
        }

        if (validator.isEmail(email.toString()) == false)
        {
            setErrorText('Email is not valid.');
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

                            request = new sql.Request()
                            request.input('orgname_parameter', sql.VarChar, orgName.toString())
                            request.input('address_parameter', sql.VarChar, address.toString())
                            request.input('email_parameter', sql.VarChar, email.toString())
                            request.input('phonenumber_parameter', sql.VarChar, phoneNumber.toString())
                            request.input('username_parameter', sql.VarChar, username.toString())
                            request.input('password_parameter', sql.VarChar, password.toString())
                            request.input('state_parameter', sql.VarChar, state.toString())

                            // figure out password encryption too here

                            request.query("INSERT INTO Orgs (OrgName, Address, Email, PhoneNumber, Username, Password, State, CollegeOrgs) VALUES (@orgname_parameter, @address_parameter, @email_parameter, @phonenumber_parameter, @username_parameter, @password_parameter, @state_parameter,  NULL)")

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

    const volunteerSignUp = () : JSX.Element => {
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
                        <TextField id="outlined-basic" label="First Name" inputProps={{maxLength: 50}} onChange={(event) => setFirstName(event.target.value)} variant="outlined"/>
                        <br></br>
                        <TextField id="outlined-basic" label="Middle Initial (Optional)"  inputProps={{maxLength: 1}} onChange={(event) => setMiddleInitial(event.target.value)} variant="outlined"/>
                        <br></br>
                        <TextField id="outlined-basic" label="Last Name" inputProps={{maxLength: 50}} onChange={(event) => setLastName(event.target.value)} variant="outlined"/>
                        <br></br>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker label="Date of Birth" value={DOB} onChange={(val) => {setDOB(dayjs(val))} } />
                            <br></br>
                        </LocalizationProvider>
                        <TextField id="outlined-basic" type="email" label="Email" variant="outlined" onChange={(event) => setEmail(event.target.value)} inputProps={{maxLength: 50}}/>
                        <br></br>
                        <TextField id="outlined-basic" label="Phone Number (No Dashes)" inputProps={{maxLength: 10}} onChange={(event) => setPhoneNumber(event.target.value)} variant="outlined"/>
                        <br></br>
                        <InputLabel id="demo-simple-select-label">State/Territory</InputLabel>
                        <Select label="State/Territory" value={state} onChange={(event) => setState(event.target.value)}>

                            <MenuItem value="AL">Alabama</MenuItem>
                            <MenuItem value="AK">Alaska</MenuItem>
                            <MenuItem value="AZ">Arizona</MenuItem>
                            <MenuItem value="AR">Arkansas</MenuItem>
                            <MenuItem value="CA">California</MenuItem>
                            <MenuItem value="CO">Colorado</MenuItem>
                            <MenuItem value="DE">Delaware</MenuItem>
                            <MenuItem value="DC">District of Columbia</MenuItem>
                            <MenuItem value="FL">Florida</MenuItem>
                            <MenuItem value="GA">Georgia</MenuItem>
                            <MenuItem value="DE">Hawaii</MenuItem>
                            <MenuItem value="ID">Idaho</MenuItem>
                            <MenuItem value="IL">Illinois</MenuItem>
                            <MenuItem value="IN">Indiana</MenuItem>
                            <MenuItem value="IA">Iowa</MenuItem>
                            <MenuItem value="KS">Kansas</MenuItem>
                            <MenuItem value="LA">Louisiana</MenuItem>
                            <MenuItem value="ME">Maine</MenuItem>
                            <MenuItem value="MD">Maryland</MenuItem>
                            <MenuItem value="MA">Massachusetts</MenuItem>
                            <MenuItem value="MI">Michigan</MenuItem>
                            <MenuItem value="MN">Minnesota</MenuItem>
                            <MenuItem value="MS">Mississippi</MenuItem>
                            <MenuItem value="MO">Missouri</MenuItem>
                            <MenuItem value="MT">Montana</MenuItem>
                            <MenuItem value="NE">Nebraska</MenuItem>
                            <MenuItem value="NV">Nevada</MenuItem>
                            <MenuItem value="NH">New Hampshire</MenuItem>
                            <MenuItem value="NJ">New Jersey</MenuItem>
                            <MenuItem value="NM">New Mexico</MenuItem>
                            <MenuItem value="NY">New York</MenuItem>
                            <MenuItem value="NC">North Carolina</MenuItem>
                            <MenuItem value="ND">North Dakota</MenuItem>
                            <MenuItem value="OH">Ohio</MenuItem>
                            <MenuItem value="OK">Oklahoma</MenuItem>
                            <MenuItem value="OR">Oregon</MenuItem>
                            <MenuItem value="PA">Pennsylvania</MenuItem>
                            <MenuItem value="PR">Puerto Rico</MenuItem>
                            <MenuItem value="RI">Rhode Island</MenuItem>
                            <MenuItem value="SC">South Carolina</MenuItem>
                            <MenuItem value="SD">South Dakota</MenuItem>
                            <MenuItem value="TN">Tennessee</MenuItem>
                            <MenuItem value="TX">Texas</MenuItem>
                            <MenuItem value="UT">Utah</MenuItem>
                            <MenuItem value="VT">Vermont</MenuItem>
                            <MenuItem value="VI">Virgin Island</MenuItem>
                            <MenuItem value="VA">Virginia</MenuItem>
                            <MenuItem value="WA">Washington</MenuItem>
                            <MenuItem value="WV">West Virgnia</MenuItem>
                            <MenuItem value="TX">Wisconsin</MenuItem>
                            <MenuItem value="WY">Wyoming</MenuItem>
                            
                        
                        
                    </Select>
                    <br></br>
                    <TextField id="outlined-basic" label="Username" variant="outlined" onChange={(event) => setUsername(event.target.value)} inputProps={{maxLength: 15}}/>
                    <br></br>
                    <TextField id="outlined-basic" label="Password" type="password" variant="outlined" onChange={(event) => setPassword(event.target.value)} inputProps={{maxLength: 25}}/>
                    <br></br>
                    <Button variant="outlined" disabled={disableSignUpButton} onClick={processVolunterSignUp}>Sign Up</Button>
                    <Button href="/" variant="contained" color="primary" disabled={disableSignUpButton}>Login Here</Button>
                </div>
            </>
        )

        
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
                    <TextField id="outlined-basic" label="Password" type="password" variant="outlined" inputProps={{maxLength: 25}} onChange={(event) => setPassword(event.target.value)}/>
                    <br></br>
                        <InputLabel id="demo-simple-select-label">State/Territory</InputLabel>
                        <Select label="State/Territory" value={state} onChange={(event) => setState(event.target.value)}>

                            <MenuItem value="AL">Alabama</MenuItem> 
                            <MenuItem value="AK">Alaska</MenuItem>
                            <MenuItem value="AZ">Arizona</MenuItem>
                            <MenuItem value="AR">Arkansas</MenuItem>
                            <MenuItem value="CA">California</MenuItem>
                            <MenuItem value="CO">Colorado</MenuItem>
                            <MenuItem value="DE">Delaware</MenuItem>
                            <MenuItem value="DC">District of Columbia</MenuItem>
                            <MenuItem value="FL">Florida</MenuItem>
                            <MenuItem value="GA">Georgia</MenuItem>
                            <MenuItem value="DE">Hawaii</MenuItem>
                            <MenuItem value="ID">Idaho</MenuItem>
                            <MenuItem value="IL">Illinois</MenuItem>
                            <MenuItem value="IN">Indiana</MenuItem>
                            <MenuItem value="IA">Iowa</MenuItem>
                            <MenuItem value="KS">Kansas</MenuItem>
                            <MenuItem value="LA">Louisiana</MenuItem>
                            <MenuItem value="ME">Maine</MenuItem>
                            <MenuItem value="MD">Maryland</MenuItem>
                            <MenuItem value="MA">Massachusetts</MenuItem>
                            <MenuItem value="MI">Michigan</MenuItem>
                            <MenuItem value="MN">Minnesota</MenuItem>
                            <MenuItem value="MS">Mississippi</MenuItem>
                            <MenuItem value="MO">Missouri</MenuItem>
                            <MenuItem value="MT">Montana</MenuItem>
                            <MenuItem value="NE">Nebraska</MenuItem>
                            <MenuItem value="NV">Nevada</MenuItem>
                            <MenuItem value="NH">New Hampshire</MenuItem>
                            <MenuItem value="NJ">New Jersey</MenuItem>
                            <MenuItem value="NM">New Mexico</MenuItem>
                            <MenuItem value="NY">New York</MenuItem>
                            <MenuItem value="NC">North Carolina</MenuItem>
                            <MenuItem value="ND">North Dakota</MenuItem>
                            <MenuItem value="OH">Ohio</MenuItem>
                            <MenuItem value="OK">Oklahoma</MenuItem>
                            <MenuItem value="OR">Oregon</MenuItem>
                            <MenuItem value="PA">Pennsylvania</MenuItem>
                            <MenuItem value="PR">Puerto Rico</MenuItem>
                            <MenuItem value="RI">Rhode Island</MenuItem>
                            <MenuItem value="SC">South Carolina</MenuItem>
                            <MenuItem value="SD">South Dakota</MenuItem>
                            <MenuItem value="TN">Tennessee</MenuItem>
                            <MenuItem value="TX">Texas</MenuItem>
                            <MenuItem value="UT">Utah</MenuItem>
                            <MenuItem value="VT">Vermont</MenuItem>
                            <MenuItem value="VI">Virgin Island</MenuItem>
                            <MenuItem value="VA">Virginia</MenuItem>
                            <MenuItem value="WA">Washington</MenuItem>
                            <MenuItem value="WV">West Virgnia</MenuItem>
                            <MenuItem value="TX">Wisconsin</MenuItem>
                            <MenuItem value="WY">Wyoming</MenuItem>
                            
                        
                        
                    </Select>
                    <br></br>
                    <Button variant="outlined" disabled={disableSignUpButton} onClick={processOrgSignUp}>Sign Up</Button>
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