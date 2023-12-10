import { Alert, AlertTitle, Button, IconButton, InputAdornment, MenuItem, TextField, Typography, styled } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import connectionString from '../config';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

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

const ResetPassword = () : JSX.Element => {

    const navigate = useNavigate();
    const [password1, setPassword1] = React.useState<string>('');
    const [password2, setPassword2] = React.useState<string>('');
    const [disableButton, setDisableButton] = React.useState(false);

    const [resCode, setResCode] = React.useState(0)
    const [resText, setResText] = React.useState('')

    const [newPasswordVisibility1, setNewPasswordVisibility1] = React.useState(false);
    const [newPasswordVisibility2, setNewPasswordVisibility2] = React.useState(false);

    async function resetPassword(){
        setDisableButton(true)

         if (password1 != password2)
         {
            setResCode(400)
            setResText("Passwords do not match.")
            setDisableButton(false)
            return
         }

        await axios.post(connectionString + "/resetpassword/", null, {
            params: {
                loginType: sessionStorage.getItem("loginType"),
                username: sessionStorage.getItem("username"),
                password: password1,
            }
        }).then(function (response) {
            setResCode(response.status)
            setResText(response.data)
            setTimeout(() =>{
                navigate("/")
            }, 5000)

        }).catch(function (error){
            setResCode(error.response.status)
            if (error.response == undefined)
            {
                setResText('Error connecting to the API. Please try again.')
            }
            else{
                setResText(error.response.data)
            }
            setDisableButton(false)
        });  
        
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

                    <div style={{width: '100%',display: 'flex' , justifyContent:'center'}}>
                        <Typography sx={{color:'white'}}>Enter a new password in.</Typography>
                    </div>
             
                    <div style={{width: '100%',display: 'flex', justifyContent:'center', paddingTop:'1rem'}}>
                        <StyledInput type={newPasswordVisibility1 ? 'text': 'password'} label="New Password" onChange={(event) => {setPassword1(event.target.value)}} sx={{marginBottom:'5px'}}
                            InputProps={{
                            endAdornment: <InputAdornment position="end">
                                            <IconButton onClick={() => {setNewPasswordVisibility1(!newPasswordVisibility1)}}>
                                                
                                                {newPasswordVisibility1 ? <Visibility sx={{color:'white'}}/>: <VisibilityOff sx={{color:'white'}}/>}
                                            </IconButton>
                                        </InputAdornment>,
                            }}
                            InputLabelProps={{ sx: {color: "white"}}}
                        />
                    </div>
                    <div style={{width: '100%',display: 'flex', justifyContent:'center', paddingTop:'1rem'}}>
                    <StyledInput type={newPasswordVisibility2 ? 'text': 'password'} label="New Password Again" onChange={(event) => {setPassword2(event.target.value)}} sx={{marginBottom:'5px'}}
                        InputProps={{
                        endAdornment: <InputAdornment position="end">
                                        <IconButton onClick={() => {setNewPasswordVisibility2(!newPasswordVisibility2)}}>
                                            
                                            {newPasswordVisibility2 ? <Visibility sx={{color:'white'}}/>: <VisibilityOff sx={{color:'white'}}/>}
                                        </IconButton>
                                      </InputAdornment>,
                        }}
                        InputLabelProps={{ sx: {color: "white"}}}
                    />
                    </div>
                    <Button disabled={disableButton} onClick={() => resetPassword()}>Confirm Password</Button>
            </div>
        </>
    )


}

export default ResetPassword