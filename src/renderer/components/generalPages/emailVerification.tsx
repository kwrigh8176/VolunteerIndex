import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useNavigate } from "react-router-dom";
import connectionString from "../../../../config";
import axios from "axios";


export default function emailVerification() : JSX.Element {
    const [buttonDisable, setbuttonDisable] = React.useState(false)
    const [verifyButtonDisable, setVerifyButtonDisable] = React.useState(false)
    const [verifyTextBox, setVerifyTextBox] = React.useState('')

    const [errorText, setErrorText] = React.useState('')
    const [successText, setSuccessText] = React.useState('')

    const navigate = useNavigate();
    
    async function resetCode(){
        
        setbuttonDisable(true)
        axios.post(connectionString + "/resendCodes/", null, {
            params: {
                username: sessionStorage.getItem("username"),
                email: sessionStorage.getItem("email"),
                loginType: sessionStorage.getItem("loginType"),
            }
        }).then(function (response) {

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
            }

        }).then(function (response) {
                setErrorText('Sucessful Verification')
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
                {errorText != '' && 
                    
                            <Alert severity="error">
                                <AlertTitle>Invalid Code</AlertTitle>
                            </Alert>
                        }

                {errorText.toString() == 'Sucessful Verification' && 
                    
                        <Alert severity="success">
                            <AlertTitle>Sucessful Verification! You will be redirected in 5 seconds.</AlertTitle>
                        </Alert>
                }
                <h1>Input the code to login. You can reset the code if necessary (30 second cooldown).</h1>
                <br></br>
                <p>Don't forget to check spam folders!</p>
                <br></br>
                <TextField label="Enter code here: " onChange={(event) => setVerifyTextBox(event.target.value)} inputProps={{maxLength: 10}}></TextField>
                <Button disabled={verifyButtonDisable} onClick={processCode} >Verify Code</Button> 
                <br></br>
                <Button disabled={buttonDisable} onClick={resetCode}>Reset Code</Button>
            </div>
        </>
    )
}