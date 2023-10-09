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
    const [verifyTextBox, setVerifyTextBox] = React.useState('')
    const [errorText, setErrorText] = React.useState('')

    const sql = require('mssql');
    const navigate = useNavigate();
    
    async function resetCode(){
        
        setbuttonDisable(true)
        var connectionStringWithParams = connectionString + "/resendCodes/" + sessionStorage.getItem("username") + "/" + sessionStorage.getItem("email") + "/" + "placeholderValue"  
        axios.get(connectionStringWithParams).then(function (response) {});       

        setTimeout(() => {
            setbuttonDisable(false)
        }, 30000)

    }

    async function processCode(){
        setErrorText('')
        setbuttonDisable(true)
        var connectionStringWithParams = connectionString + "/processCode/" + sessionStorage.getItem("username")  + "/" + sessionStorage.getItem("loginType")  + "/" + verifyTextBox
        await axios.get(connectionStringWithParams)
        .then(function (response) {

                if (sessionStorage.getItem("loginType")  == "Volunteer")
                {
                    setTimeout(() =>{
                        navigate("/volunteerHome")
                    }, 5000)
                }
                else
                {
                    setTimeout(() =>{
                        navigate("/orgHome")
                    }, 5000)
                }
                
                
            

        }).catch(function (error){
            setErrorText(error.response.data)
        });        

        setbuttonDisable(false)


    }

    return(
        <>
            <div 
            style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
                {errorText.toString() == 'Invalid Code' && 
                    
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
                <TextField label="Enter code here: " onChange={(event) => setVerifyTextBox(event.target.value)} inputProps={{maxLength: 6}}></TextField>
                <Button disabled={buttonDisable} onClick={processCode} >Verify Code</Button> 
                <br></br>
                <Button disabled={buttonDisable} onClick={resetCode}>Reset Code</Button>
            </div>
        </>
    )
}