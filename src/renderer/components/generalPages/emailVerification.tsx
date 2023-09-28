import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React from "react";
import db_config from "../../../globals";
import { resendCodes } from "../../../sendVerificationEmails";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useNavigate } from "react-router-dom";


export default function emailVerification() : JSX.Element {
    const [buttonDisable, setbuttonDisable] = React.useState(false)
    const [verifyTextBox, setVerifyTextBox] = React.useState('')
    const [errorText, setErrorText] = React.useState('')

    const sql = require('mssql');
    const navigate = useNavigate();
    
    async function resetCode(){
        
        setbuttonDisable(true)
        resendCodes()
        setTimeout(() => {
            setbuttonDisable(false)
        }, 30000)

    }

    async function processCode(){
        setbuttonDisable(true)
        await sql.connect(db_config)

        var username = sessionStorage.getItem("username")
        var loginType = sessionStorage.getItem("loginType")

        let request = new sql.Request()
        request.input("username",username)
        if (loginType == "Organization"){
            var result = await request.query("SELECT LoginKey FROM LoginKey WHERE OrgId = @username")
            if (result.recordset.length == 1){
                setTimeout(() => {
                    navigate("/orgHome")
                })
            }
            else{
                setErrorText('Invalid Code')
            }
        }
        else{
            var result = await request.query("SELECT LoginKey FROM LoginKey WHERE VolunteerId = @username")
            if (result.recordset.length == 1){
                setTimeout(() => {
                    navigate("/volunteerHome")
                })
                
            }
            else{
                setErrorText('Invalid Code')
            }
        }

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
                <Button disabled={buttonDisable} onClick={resendCodes}>Reset Code</Button>
            </div>
        </>
    )
}