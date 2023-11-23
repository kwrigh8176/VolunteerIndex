import { Alert, AlertTitle, Button, MenuItem, TextField, Typography, styled } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import connectionString from "../config";

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

const ForgotUsername = () : JSX.Element => {

    const navigate = useNavigate();
    const [loginType, setLoginType] = React.useState<string>('Volunteer');
    const [email, setEmail] = React.useState<string>('');
    const [disableButton, setDisableButton] = React.useState(false);

    const [resCode, setResCode] = React.useState(0)
    const [resText, setResText] = React.useState('')
    async function forgotUsername(){
        setDisableButton(true)
        await axios.post(connectionString + "/forgotusername/", null, {
            params: {
                loginType: loginType,
                Email: email,
            }
        }).then(function (response) {
            setResCode(response.status)
            setResText(response.data)


        }).catch(function (error){
            setResCode(error.response.status)
            if (error.response == undefined)
            {
                setResText('Error connecting to the API. Please try again.')
            }
            else{
                setResText(error.response.data)
            }
            
        });  
        setDisableButton(false)
    }

    return (
        <>
            <Button disabled={disableButton}  onClick={() => navigate('/')}>Back</Button>
            <div style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)',
                    flex: 1,
                    display: 'flex', 
                    flexDirection:'row', 
                    flexWrap: 'wrap' , 
                    alignItems:'center', 
                    justifyContent:'center'
                }}>
                    {resCode == 200 &&
                        <Alert severity="success">
                            <AlertTitle>{resText}</AlertTitle>
                        </Alert>

                    }
                    {resCode == 400 &&
                        <Alert severity="error">
                            <AlertTitle>{resText}</AlertTitle>
                        </Alert>

                    }
                   <div style={{width:'100%', display:'flex', flexDirection:'row', flexWrap: 'wrap' , alignItems:'center', justifyContent:'center', paddingTop:'1rem'}}>
                        <StyledInput select value={loginType}  label="Login Type" onChange={(event) => setLoginType(event.target.value)}
                        InputProps={{sx : {color : "white"}  }}
                        sx={{input: {color: 'white'},marginRight: '10px', minWidth: 150, borderColor:'white', marginTop:'5px'}}
                        InputLabelProps={{ sx: {color: "white"}}}
                        >
                            <MenuItem value='Volunteer'>Volunteer</MenuItem>
                            <MenuItem value='Organization'>Organization</MenuItem>
                        </StyledInput>
                    </div>
                    <div style={{width: '100%',display: 'flex'}}>
                        <Typography sx={{color:'white'}}>Enter your email below to find your username. You will be emailed the username you signed up with.</Typography>
                    </div>
             
                    <div style={{width: '100%',display: 'flex', justifyContent:'center', paddingTop:'1rem'}}>
                        <StyledInput label="Email" 
                        InputProps={{sx : {color : "white"}  }}
                        sx={{input: {color: 'white'},marginRight: '10px', minWidth: 150, borderColor:'white', marginTop:'5px', marginBottom:'5px'}}
                        InputLabelProps={{ sx: {color: "white"}}}
                        onChange={(event) => setEmail(event.target.value)}>
                        
                        </StyledInput>
                    </div>
                    <Button disabled={disableButton} onClick={() => forgotUsername()}>Find Username</Button>
            </div>
        </>
    )


}

export default ForgotUsername