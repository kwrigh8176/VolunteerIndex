import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import connectionString from '../../../../config';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import axios from 'axios';
import { Card, Link, styled } from '@mui/material';


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
                    
                        <div 
                            style={{
                                position: 'absolute', left: '50%', top: '50%',
                                transform: 'translate(-50%, -50%)',
                                flex: 1
                            }}>
                            {errorText != '' && 
                    
                                <Alert severity="error">
                                    <AlertTitle>{errorText}</AlertTitle>
                                </Alert>
                            }
                            <div style={{display:'flex', flexDirection:'row', flexWrap: 'wrap' , alignItems:'center', justifyContent:'center'}}>
                                <span style={{width:'100%'}}>
                                    <h1 style={{textAlign: 'center', color:'white'}}>Welcome to VolunteerIndex!</h1>
                                </span>
                                <div style={{width:'100%', display:'flex', flexDirection:'row', flexWrap: 'wrap' , alignItems:'center', justifyContent:'center'}}>
                                    <StyledInput select value={loginType}  label="Login Type" onChange={(event) => setLoginType(event.target.value)}
                                    InputProps={{sx : {color : "white"}  }}
                                    sx={{input: {color: 'white'},marginRight: '10px', minWidth: 150, borderColor:'white', marginTop:'5px'}}
                                    InputLabelProps={{ sx: {color: "white"}}}
                                    >
                                        <MenuItem value='Volunteer'>Volunteer</MenuItem>
                                        <MenuItem value='Organization'>Organization</MenuItem>
                                    </StyledInput>
                                </div>
                                <div style={{width:'100%', display:'flex', flexDirection:'row', flexWrap: 'wrap' , alignItems:'center', justifyContent:'center'}}>
                                        <StyledInput id="outlined-basic" label="Username" onChange={(event) => setUsername(event.target.value)} variant="outlined" 
                                    InputProps={{sx : {color : "white"}  }}
                                    sx={{input: {color: 'white'},marginRight: '10px', minWidth: 150, borderColor:'white' , marginTop:'5px'}}
                                    InputLabelProps={{ sx: {color: "white"}}}
                                    />

                                </div>
                                <div style={{width:'100%', display:'flex', flexDirection:'row', flexWrap: 'wrap' , alignItems:'center', justifyContent:'center'}}>
                                    <StyledInput id="outlined-basic" label="Password" onChange={(event) => setPassword(event.target.value)} type="password" variant="outlined" 
                                        InputProps={{sx : {color : "white"}  }}
                                        sx={{input: {color: 'white'},marginRight: '10px', minWidth: 150, borderColor:'white', marginTop:'5px', marginBottom:'5px'}}
                                        InputLabelProps={{ sx: {color: "white"}}}
                                        />

                                </div>
                                <div style={{justifyContent:'center', alignItems:'center', width:'100%', display:'flex'}}>
                                    <Button variant="contained" disabled={disableLoginButton} onClick={() => {VerifyLogin()}}>
                                        Login
                                    </Button>

                                    <Button disabled={disableLoginButton} variant="outlined" color="primary" sx={{marginLeft: '1rem'}} onClick={() => navigate('/signup')}>Sign Up Here</Button>
                                </div>
                                <div style={{justifyContent:'center', alignItems:'center', width:'100%', display:'flex', paddingTop:'3px'}}>
                                    <Button component={Link} onClick={() => navigate('/')} variant='text'>Forgot Password?</Button>
                                </div>
                                <div style={{justifyContent:'center', alignItems:'center', width:'100%', display:'flex', paddingTop:'3px'}}>
                                <Button component={Link} onClick={() => navigate('/')}>Forgot Username?</Button>
                                </div>
                            </div>
                        </div>
        </>
    );
}

export default Login