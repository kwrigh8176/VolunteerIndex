import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link, { BrowserRouter, useNavigate } from 'react-router-dom';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import connectionString from '../../../../config';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import axios from 'axios';


const Login = () : JSX.Element => {
    
    const navigate = useNavigate();
    
    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [disableLoginButton, setDisableLoginButton] = React.useState(false);
    const [loginType, setLoginType] = React.useState<string>('Volunteer');
    const [errorText, setErrorText] = React.useState<string>('');
    

    const VerifyLogin = async () => {

            setDisableLoginButton(true)
            setErrorText('')
           
            
            if (loginType == 'Volunteer'){
                
                await axios.post(connectionString + '/verifylogin/', null, {
                        params : {
                                username: username,
                                password: password,
                                loginType: loginType,

                        }
                        }).then(function (response) {
                            
                            var getBody = response.data
                            sessionStorage.setItem("state",getBody.State)
                            sessionStorage.setItem("username",username)
                            sessionStorage.setItem("password",password)
                            sessionStorage.setItem("Id",getBody.VolunteerId)
                            sessionStorage.setItem("email", getBody.Email)
                            sessionStorage.setItem("loginType","Volunteer")
                            sessionStorage.setItem("collegeStudent",getBody.CollegeStudent)
                            navigate('/emailverification')
                        
                    }).catch(function (error){
                        if (error.response == undefined)
                        {
                            setErrorText('Error connecting to the API. Please try again.')
                        }
                        else{
                            setErrorText(error.response.data)
                        }
                    });  

            
                 setDisableLoginButton(false)
            }
            else{
              
                await axios.post(connectionString + '/verifylogin/', null, {
                        params : {
                                username: username,
                                password: password,
                                loginType: loginType,
                                
                        }
                        }).then(function (response) {
                        var getBody = response.data
                        sessionStorage.setItem("state",getBody.State)
                        sessionStorage.setItem("username",getBody.Username)
                        sessionStorage.setItem("orgId", getBody.OrgId)
                        sessionStorage.setItem("email", getBody.Email)
                        sessionStorage.setItem("phoneNumber", getBody.PhoneNumber)
                        sessionStorage.setItem("address", getBody.Address)
                        sessionStorage.setItem("loginType","Organization")
                        sessionStorage.setItem("collegeOrgs",getBody.CollegeOrgs)
                        navigate('/emailverification')
                    

                }).catch(function (error){
                    if (error.response == undefined)
                    {
                        setErrorText('Error connecting to the API. Please try again.')
                    }
                    else{
                        setErrorText(error.response.data)
                    }
                });  
                setDisableLoginButton(false)
            }

            
    }



    return(
        <>
                    <h1 style={{textAlign: 'center'}}>Welcome to VolunteerIndex!</h1>
                        <div 
                            style={{
                                position: 'absolute', left: '50%', top: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}>
                            {errorText != '' && 
                    
                                <Alert severity="error">
                                    <AlertTitle>{errorText}</AlertTitle>
                                </Alert>
                            }
                            <Select labelId="demo-simple-select-label" value={loginType}  label="Login Type" onChange={(event) => setLoginType(event.target.value)}>
                                <MenuItem value='Volunteer'>Volunteer</MenuItem>
                                <MenuItem value='Organization'>Organization</MenuItem>
                            </Select>
                            <TextField id="outlined-basic" label="Username" onChange={(event) => setUsername(event.target.value)} variant="outlined" />
                            <br></br>
                            <TextField id="outlined-basic" label="Password" onChange={(event) => setPassword(event.target.value)} type="password" variant="outlined" />
                            <br></br>
                            <Button variant="outlined" disabled={disableLoginButton} onClick={() => {VerifyLogin()}}>
                                Login
                            </Button>

                            <Button href={`/signup`} disabled={disableLoginButton} variant="contained" color="primary">Sign Up Here</Button>
                        </div>
        </>
    );
}

export default Login