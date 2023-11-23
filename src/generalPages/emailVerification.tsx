import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useNavigate } from "react-router-dom";
import connectionString from "../config";
import axios from "axios";
import { Box } from "@mui/material";
import { Typography } from "@mui/joy";
import dayjs from "dayjs";


export default function EmailVerification() : JSX.Element {
    const [buttonDisable, setbuttonDisable] = React.useState(false)
    const [verifyButtonDisable, setVerifyButtonDisable] = React.useState(false)
    const [verifyTextBox, setVerifyTextBox] = React.useState('')

    const [errorText, setErrorText] = React.useState('')

    const navigate = useNavigate();
    
    async function resetCode(){
        
        setbuttonDisable(true)
        axios.post(connectionString + "/resendCodes/", null, {
            params: {
                username: sessionStorage.getItem("username"),
                email: sessionStorage.getItem("email"),
                loginType: sessionStorage.getItem("loginType"),
                dateTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss.000')
            }
        }).then(function (response) {
            setErrorText('')
        }).catch(function(error){
            if (error.response == undefined)
            {
                setErrorText('Error connecting to the API. Please try again.')
            }
            else{
                setErrorText(error.response.data)
            }
        });       
            
        setTimeout(() => {
            setbuttonDisable(false)
        }, 30000)

    }

    async function processCode(){
        setErrorText('')
        setbuttonDisable(true)
      
        await axios.post(connectionString + "/processCode/", null, {
            params:{
                username: sessionStorage.getItem("username"),
                loginType: sessionStorage.getItem("loginType"),
                keyProvided: verifyTextBox,
                dateTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss.000')
            }

        }).then(function (response) {
                setErrorText('Successful Verification')
                sessionStorage.setItem("token",response.data)
                if (sessionStorage.getItem("loginType")  == "Volunteer")
                {
                    setTimeout(() =>{
                        navigate("/volunteerHome")
                    }, 5000)
                }
                else
                {
                    setTimeout(() =>{
                        navigate("/orgCurrentEvents")
                    }, 5000)
                }
                
                
            

        }).catch(function (error){
            if (error.response == undefined)
            {
                setErrorText('Error connecting to the API. Please try again.')
            }
            else{
                setErrorText(error.response.data)
            }
            
            
        });        

        setVerifyButtonDisable(false)
        setbuttonDisable(false)


    }

    return(
        <>
            <div 
            style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
                <Box sx={{backgroundColor:'grey', flex:1}}>
                {errorText != '' &&  errorText != 'Successful Verification' && 
                    
                            <Alert severity="error">
                                <AlertTitle>{errorText}</AlertTitle>
                            </Alert>
                        }

                {errorText == 'Successful Verification' && 
                    
                        <Alert severity="success">
                            <AlertTitle>Successful Verification! You will be redirected in 5 seconds.</AlertTitle>
                        </Alert>
                }
                <Typography sx={{color:'black'}}>Input the code to login. You can reset the code if necessary (Codes expire after 10 minutes).</Typography>
                <Typography sx={{color:'black', fontWeight:'bold', marginBottom:'5px'}} >(Don't forget to check spam folders!)</Typography>
                <TextField label="Enter code here: " onChange={(event) => setVerifyTextBox(event.target.value)} inputProps={{maxLength: 10}} sx={{width:'100%', marginBottom:'5px'}}></TextField>
                <Button disabled={verifyButtonDisable} onClick={processCode} variant="contained" sx={{marginRight:'5px'}}>Verify Code</Button> 
                <Button disabled={buttonDisable} onClick={resetCode} variant="outlined">Reset Code</Button>
                </Box>
            </div>
        </>
    )
}