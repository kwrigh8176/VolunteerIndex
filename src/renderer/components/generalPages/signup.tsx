import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import React from 'react'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from 'react-router-dom';
import connectionString from '../../../../config';
import axios from 'axios';
import { Box, styled } from '@mui/material';


var validator = require('validator');

const StyledInput = styled(TextField)`
& .MuiOutlinedInput-notchedOutline {
    border-color: white;
 }
 & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: white;
 }
 & .MuiSvgIcon-root : {
    color: 'white',
 }
`;

var style = {
    input: {color: 'white'}, 
    marginBottom: '7px', 
    minWidth: 150,
    borderColor:'white'
}



function checkIllegalChars(str:string){
    return !/[~`!#$%\^&*+=\-\[\]\\';,@\/{}|\\":<>\?]/g.test(str);
}

const SignUp = () : JSX.Element => {

    const navigate = useNavigate();
   
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
    const [successfulText, setSuccessfulText] = React.useState(true);

    const [state, setState] = React.useState<string>('');

    async function processVolunterSignUp(){
        
        setErrorText('')

        {/*Check for empty fields at first*/}
        if ( email.toString() == '' || phoneNumber.toString() == '' || username.toString() == '' || password.toString() == '' || firstName.toString() == '' || lastName.toString() == '' || state.toString() == '' )
        {
            setErrorText('One or more fields are empty.');
            return
        }

        if (checkIllegalChars(firstName.toString()) == false || checkIllegalChars(middleInitial.toString()) == false  || checkIllegalChars(lastName.toString()) == false)
        {
            setErrorText('One or more fields contain invalid characters (check the name fields).');
            return
        }

        if (validator.isMobilePhone(phoneNumber.toString()) == false || phoneNumber.length!=10)
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

        {/*Resetting the error text*/}
        setErrorText('');

       
        await axios.post(connectionString + "/processVolunteerSignUp/", null, {
            params: {
                email: email,
                phoneNumber: phoneNumber,
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
                state: state,
                DOB: DOB,
                middleInitial: middleInitial,
            }
        }).then(function (response) {
            setSuccessfulText(false)
            setTimeout(() =>{
                navigate("/")
            }, 5000)


        }).catch(function (error){
            if (error.response == undefined)
            {
                setErrorText('Error connecting to the API. Please try again.')
            }
            else{
                setErrorText(error.response.data)
            }
            setDisableSignUpButton(false)
        });  

            


       
         
    }
    
    async function processOrgSignUp(){

        {/*Check for empty fields at first*/}
        if (orgName.toString() == '' || address.toString() == '' || email.toString() == '' || phoneNumber.toString() == '' || username.toString() == '' || password.toString() == '' || state.toString() == '')
        {
            setErrorText('One or more fields are empty.');
            return
        }

        if (validator.isMobilePhone(phoneNumber.toString()) == false || phoneNumber.length!=10)
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
       
        axios.post(connectionString + "/processOrgSignUp/", null, {params: {
            email: email,
            phoneNumber: phoneNumber,
            username: username,
            password: password,
            orgName: orgName,
            address: address,
            state: state,
        }}).then(function (response) {
            setSuccessfulText(false)
            setTimeout(() =>{
                navigate("/")
            }, 5000)
        }).catch(function (error){
            if (error.response == undefined)
            {
                setErrorText('Error connecting to the API. Please try again.')
            }
            else{
                setErrorText(error.response.data)
            }

            setDisableSignUpButton(false)
        });  

           
         
    }

    const volunteerSignUp = () : JSX.Element => {
        return (
            <>
                    <div style={{width:'100%'}}>
                        <StyledInput id="outlined-basic" label="First Name" inputProps={{maxLength: 50}} onChange={(event) => setFirstName(event.target.value)} variant="outlined"
                        InputProps={{sx : {color : "white"}  }}
                        sx={style}
                        InputLabelProps={{ sx: {color: "white"}}}
                       
                        />
                    </div>
                    <div>
                        <StyledInput id="outlined-basic" label="Middle Initial (Optional)"  inputProps={{maxLength: 1}} onChange={(event) => setMiddleInitial(event.target.value)} variant="outlined" 
                        InputProps={{sx : {color : "white"}  }}
                        sx={style}
                        InputLabelProps={{ sx: {color: "white"}}}/>
                    </div>
                    <div>
                        <StyledInput id="outlined-basic" label="Last Name" inputProps={{maxLength: 50}} onChange={(event) => setLastName(event.target.value)} variant="outlined" 
                            InputProps={{sx : {color : "white"}  }}
                            sx={style}
                            InputLabelProps={{ sx: {color: "white"}}}
                        />
                    </div>
                    <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker label="Date of Birth" value={DOB} onChange={(val) => {setDOB(dayjs(val))}}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                '& fieldset':{
                                    borderColor: 'white',
                                }
                                }, 
                                marginBottom:'7px'
                                }}
                                slotProps={{ textField: { InputLabelProps: { sx : {color : "white"}  } , inputProps : { sx : {color : "white"} } } }}
                            />
                        </LocalizationProvider>
                    </div>
                    <div>
                        <StyledInput id="outlined-basic" type="email" label="Email" variant="outlined" onChange={(event) => setEmail(event.target.value)} inputProps={{maxLength: 50}} 
                        InputProps={{sx : {color : "white"}  }}
                        sx={style}
                        InputLabelProps={{ sx: {color: "white"}}}
                        />
                    </div>
                    <div>
                        <StyledInput id="outlined-basic" label="Phone Number (No Dashes)" inputProps={{maxLength: 10}} onChange={(event) => setPhoneNumber(event.target.value)} variant="outlined"
                        InputProps={{sx : {color : "white"}  }}
                        sx={style}
                        InputLabelProps={{ sx: {color: "white"}}}
                        />
                    </div>
                    <div>
                        <StyledInput select label="State/Territory" value={state} onChange={(event) => setState(event.target.value)} 
                            InputProps={{sx : {color : "white"}  }}
                            sx={style}
                            InputLabelProps={{ sx: {color: "white"}}}
                        >

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
                            <MenuItem value="HI">Hawaii</MenuItem>
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
                            <MenuItem value="WI">Wisconsin</MenuItem>
                            <MenuItem value="WY">Wyoming</MenuItem>
                        </StyledInput>
                    </div>
                    <div>
                        <StyledInput id="outlined-basic" label="Username" variant="outlined" onChange={(event) => setUsername(event.target.value)} inputProps={{maxLength: 15}}
                            InputProps={{sx : {color : "white"}  }}
                            sx={style}
                            InputLabelProps={{ sx: {color: "white"}}}
                        />
                    </div>
                    <div>
                        <StyledInput id="outlined-basic" label="Password" type="password" variant="outlined" onChange={(event) => setPassword(event.target.value)} inputProps={{maxLength: 25}}
                            InputProps={{sx : {color : "white"}  }}
                            sx={style}
                            InputLabelProps={{ sx: {color: "white"}}}
                        />
                    </div>
            </>
        )

        
    }

    const orgSignUp = () : JSX.Element => {
        return (
            <>
                
                    <StyledInput id="outlined-basic" label="Organization Name" variant="outlined" inputProps={{maxLength: 50}} onChange={(event) => setOrgName(event.target.value)}
                        InputProps={{sx : {color : "white"}  }}
                        sx={style}
                        InputLabelProps={{ sx: {color: "white"}}}
                    /> 
                    <br></br>
                    <StyledInput id="outlined-basic" label="Address" variant="outlined" inputProps={{maxLength: 50}} onChange={(event) => setAddress(event.target.value)}
                        InputProps={{sx : {color : "white"}  }}
                        sx={style}
                        InputLabelProps={{ sx: {color: "white"}}}
                    />
                    <br></br>
                    <StyledInput id="outlined-basic" label="Email" variant="outlined"  inputProps={{maxLength: 50}} onChange={(event) => setEmail(event.target.value)}
                        InputProps={{sx : {color : "white"}  }}
                        sx={style}
                        InputLabelProps={{ sx: {color: "white"}}}
                    />
                    <br></br>
                    <StyledInput id="outlined-basic" label="Phone Number" variant="outlined" inputProps={{maxLength: 10}} onChange={(event) => setPhoneNumber(event.target.value)}
                        InputProps={{sx : {color : "white"}  }}
                        sx={style}
                        InputLabelProps={{ sx: {color: "white"}}}
                    />
                    <br></br>
                        <StyledInput select label="State/Territory" value={state} onChange={(event) => setState(event.target.value)}
                            InputProps={{sx : {color : "white"}  }}
                            sx={style}
                            InputLabelProps={{ sx: {color: "white"}}}
                        >

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
                            <MenuItem value="HI">Hawaii</MenuItem>
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
                            <MenuItem value="WI">Wisconsin</MenuItem>
                            <MenuItem value="WY">Wyoming</MenuItem>
                    </StyledInput>
                    <br></br>
                    <StyledInput id="outlined-basic" label="Username" variant="outlined" inputProps={{maxLength: 15}} onChange={(event) => setUsername(event.target.value)}
                        InputProps={{sx : {color : "white"}  }}
                        sx={style}
                        InputLabelProps={{ sx: {color: "white"}}}
                    />
                    <br></br>
                    <StyledInput id="outlined-basic" label="Password" type="password" variant="outlined" inputProps={{maxLength: 25}} onChange={(event) => setPassword(event.target.value)}
                        InputProps={{sx : {color : "white"}  }}
                        sx={style}
                        InputLabelProps={{ sx: {color: "white"}}}
                    />
                    <br></br>
            </>
        )
    }

    

    return (

        <>
            <div 
                style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
                <Box sx={{flex:1, flexDirection:'row', flexWrap:'wrap'}}>
                    {errorText != '' && 
                    
                        <Alert severity="error">
                            <AlertTitle>{errorText}</AlertTitle>
                        </Alert>
                    }
                    {successfulText == false && 
                
                        <Alert severity="success">
                            <AlertTitle>Sign up successful. Redirecting...</AlertTitle>
                            
                        </Alert>
                    }
                    <div style={{width:'100%', paddingTop:'7px'}}>
                        <StyledInput select value={signUpType}  label="Sign Up Type" 
                                    onChange={(event) => setSignUpType(event.target.value)} 
                                    InputProps={{sx : {color : "white"}  }}
                                    sx={style}
                                    InputLabelProps={{ sx: {color: "white"}}}
                                >
                                    <MenuItem value='Volunteer'>Volunteer</MenuItem>
                                    <MenuItem value='Organization'>Organization</MenuItem>
                        </StyledInput>
                    </div>
                    
                    {signUpType.toString() == 'Volunteer' && <>{volunteerSignUp()} <Button variant="contained" disabled={disableSignUpButton} onClick={processVolunterSignUp} sx={{marginRight:'5px'}}>Sign Up</Button> </>}
                    {signUpType.toString() == 'Organization' && <>{orgSignUp()} <Button variant="contained" disabled={disableSignUpButton} onClick={processOrgSignUp} sx={{marginRight:'5px'}}>Sign Up</Button></>}
                    <Button onClick={() => navigate('/')} variant="outlined" color="primary" disabled={disableSignUpButton}>Login Here</Button> 
                    
                </Box>
            </div>
        </>


    )



}

export default SignUp