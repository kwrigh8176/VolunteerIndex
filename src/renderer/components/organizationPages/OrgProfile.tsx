import React, { useEffect } from "react"
import connectionString from "../../../../config"
import axios from "axios"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardContent from "@mui/material/CardContent"
import OrgNavbar from "./OrgNavbar"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import { IconButton, InputAdornment, InputLabel, MenuItem, Modal, Select, Typography } from "@mui/material"
import validator from "validator"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    backdrop: 'static'
  };

export default function OrgProfile() : JSX.Element {

    const [loading, setLoading] = React.useState(0)
    const [loadedInfo, setLoadedInfo] = React.useState<any[]>([])
    const [loadedInfoJSX, setLoadedInfoJSX]= React.useState<JSX.Element>(<p></p>)

    const [modalControl, setModalControl] = React.useState(false);
    const [passwordModalControl, setPasswordModalControl] = React.useState(false);
    const [disabledButton, setDisabledButton] = React.useState(false)

    const [oldPassword, setOldPassword] = React.useState('')
    const [newPassword1, setNewPassword1] = React.useState('')
    const [newPassword2, setNewPassword2] = React.useState('')

    const [oldPasswordVisibility, setOldPasswordVisibility] = React.useState(false);
    const [newPasswordVisibility1, setNewPasswordVisibility1] = React.useState(false);
    const [newPasswordVisibility2, setNewPasswordVisibility2] = React.useState(false);

    const [confirmationResponse, setConfirmationResponse] = React.useState('')
    const getLoadedInfo = async () => {
        setConfirmationResponse('')

     
        await axios.get(connectionString + "/getOrgProfile/", {params:{
            OrgId: sessionStorage.getItem("orgId"),
            username: sessionStorage.getItem("username"),
            token: sessionStorage.getItem("token"), 
            loginType: sessionStorage.getItem("loginType")
        }}).then(function (response) {
            setLoadedInfo(response.data)

            
         }).catch(function (error){

            if (error.response == undefined){
                setLoadedInfoJSX(<p>Network error connecting to the API, please try again.</p>)
            }
            else
            {
                setLoadedInfoJSX(<p>{error.response.data}</p>)
            }
      
        
         });  
    }

    const processPasswordChange = async() => {
        setDisabledButton(true)
        if (newPassword1 != newPassword2)
        {
            setConfirmationResponse("Passwords dont match.")
            return
        }

        await axios.post(connectionString + "/processPasswordChange/", null, {params:{
            Id: sessionStorage.getItem("orgId"),
            username: sessionStorage.getItem("username"),
            token: sessionStorage.getItem("token"), 
            loginType: sessionStorage.getItem("loginType"),
            newPassword: newPassword1,
            oldPassword: oldPassword,
        }}).then(function (response) {
            setConfirmationResponse("Data saved.")
            
        }).catch(function (error){
            if (error.response == undefined){
                setConfirmationResponse("Network error connecting to the API, please try again.")
            }
            else
            {
                setConfirmationResponse(error.response.data)
            }
     
        
         });  
         setDisabledButton(false)
    }

    const processSaving = async () => {

        setDisabledButton(true)

        var checkVariable = false
        var errMsg = ""

        if (loadedInfo[0].Username == '' || loadedInfo[0].Email == '' || loadedInfo[0].PhoneNumber == '' || loadedInfo[0].Address == '')
        {
            checkVariable = true 
            errMsg += 'One or more fields are empty.' + '\n'
             
        }

        if (validator.isMobilePhone(loadedInfo[0].PhoneNumber) == false)
        {
            checkVariable = true 
            errMsg += 'Phone Number is not valid.' + '\n'
      
        }

        if (validator.isEmail(loadedInfo[0].Email) == false)
        {
            checkVariable = true 
            errMsg += 'Email is not valid.' + '\n'
            
        }

        if (checkVariable){
            setConfirmationResponse(errMsg)
            return
        }

        await axios.post(connectionString + "/getTakenOrgData/", null, {params:{
            email: loadedInfo[0].Email,
            username: sessionStorage.getItem("username"),
            phonenumber: loadedInfo[0].PhoneNumber,
            token:  sessionStorage.getItem("token"),
            orgId: sessionStorage.getItem("orgId"),
            loginType: sessionStorage.getItem("loginType"),
            newUsername: loadedInfo[0].Username,

        }}).then(function (response) {
            axios.post(connectionString + "/saveOrgProfile/", null, {params:{
                orgId: sessionStorage.getItem("orgId"),
                email: loadedInfo[0].Email,
                username: loadedInfo[0].Username,
                phonenumber: loadedInfo[0].PhoneNumber,
                bio: loadedInfo[0].Bio,
                State: loadedInfo[0].State,
                Address: loadedInfo[0].Address,
                orgName: loadedInfo[0].OrgName,
                token:  sessionStorage.getItem("token"),
                loginType: sessionStorage.getItem("loginType"),
                oldUsername: sessionStorage.getItem("username"),
            }}).then(function (response) {
                setConfirmationResponse('Data saved.')
                sessionStorage.setItem("username", loadedInfo[0].Username)
             }).catch(function (error){
                if (error.response == undefined){
                    setConfirmationResponse("Network error connecting to the API, please try again.")
                }
                else
                {
                    setConfirmationResponse(error.response.data)
                }
            
             });  
         }).catch(function (error){
            if (error.response == undefined){
                setConfirmationResponse("Network error connecting to the API, please try again.")
            }
            else
            {
                setConfirmationResponse(error.response.data)
            }
         });  

        

         setDisabledButton(false)

    }

    useEffect(() => {
        

        if (loadedInfo.length != 0){

            setLoadedInfoJSX(
                <>
                    <Box>
                        
                        <Card>
                            <CardHeader title={"Welcome, " + loadedInfo[0].OrgName} >
                            </CardHeader>
                            <CardHeader title="Your Info" subheader="Click on a field to edit. Click the save button below to save." subheaderTypographyProps={{ color: 'black' }}  sx={{borderTop:'1px solid black'}} >
                            </CardHeader>
                            <CardContent sx={{borderBottom:'1px white'}}>
                                <TextField defaultValue={loadedInfo[0].Username} label='Username' sx={{marginRight:'5px'}} InputLabelProps={{style: { color: 'black' }}} inputProps={{ maxLength: 15 }} onChange={(event) => (loadedInfo[0].Username = event.target.value)} ></TextField>

                                <TextField defaultValue={loadedInfo[0].Email} label='Email'  sx={{marginRight:'5px'}} InputLabelProps={{style: { color: 'black' }}} inputProps={{ maxLength: 50 }} onChange={(event) => (loadedInfo[0].Email = event.target.value)} ></TextField>
                                <TextField defaultValue={loadedInfo[0].PhoneNumber} label='Phone Number (No Spaces)' sx={{ marginRight:'5px'}} InputLabelProps={{style: { color: 'black' }}} inputProps={{ maxLength: 10 }} onChange={(event) => (loadedInfo[0].PhoneNumber = event.target.value)} ></TextField>
                                
                                <TextField select label="State" defaultValue={loadedInfo[0].State} onChange={(event) => (loadedInfo[0].State = event.target.value)}>
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
                                </TextField>
                            </CardContent>
                            <CardContent sx={{borderBottom:'1px white'}}>
                            <TextField defaultValue={loadedInfo[0].Address} label='Address' sx={{marginRight:'5px'}} InputLabelProps={{style: { color: 'black' }}} inputProps={{ maxLength: 50 }} onChange={(event) => (loadedInfo[0].Address = event.target.value)} ></TextField>
                            <TextField defaultValue={loadedInfo[0].OrgName} label='Organization Name' sx={{marginRight:'5px'}} InputLabelProps={{style: { color: 'black' }}} inputProps={{ maxLength: 50 }} onChange={(event) => (loadedInfo[0].OrgName = event.target.value)} ></TextField>
                            </CardContent>
                            <CardContent sx={{borderTop:'1px solid black'}}>
                                <Button sx={{border:'1px solid black', color:'red'}} onClick={() => {setPasswordModalControl(true)}} disabled={disabledButton}>Reset Password </Button>
                            </CardContent>
                            <CardContent sx={{borderTop:'1px solid black'}}>
                                <Button sx={{border:'1px solid black'}} onClick={() => setModalControl(true)} disabled={disabledButton}>Save </Button>
                            </CardContent>
                        </Card>
                    </Box>
                </>
                
            )
        }
        else{
            setLoadedInfoJSX(<p>Data is being retrieved...</p>)
        }
        

    }, [loadedInfo])



    if (loading == 0){
        setLoading(1)
        getLoadedInfo()
        {/*Just a temporary message for signaling data is being retrieved */}
        return (
            <>
                <p>
                </p>
            </>
        )
    }
    else{
        return (
            <>
                <OrgNavbar/>
                {loadedInfoJSX}

                <Modal
                    open={modalControl}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"      
                >    
                    <Box sx={modalStyle}>
                        {confirmationResponse != '' && confirmationResponse != 'Data saved.'  &&
                            <Alert severity="error">
                                <AlertTitle>{confirmationResponse}</AlertTitle>
                            </Alert>
                        }
                    
                        {confirmationResponse == 'Data saved.' &&
                            <Alert severity="success">
                                <AlertTitle>Data saved.</AlertTitle>
                            </Alert>
                        }
                    
                        <Typography>Are you sure you want to save your data?</Typography>
                        <br></br>
                        <Typography sx={{color:'red'}}>If you are changing your state, all the currently active events you have will be deleted.</Typography>

                        <Button disabled={disabledButton} onClick={() => {
                            setConfirmationResponse('')
                            setModalControl(false)}
                            }>
                            Cancel
                        </Button>
                        <Button disabled={disabledButton} onClick={processSaving}>
                            Confirm
                        </Button>
                    </Box>
                </Modal> 

                <Modal
                    open={passwordModalControl}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"    
                >
                    <Box sx={modalStyle}>

                        {confirmationResponse != '' && confirmationResponse != 'Data saved.'  &&
                            <Alert severity="error" sx={{marginBottom: '10px'}}>
                                <AlertTitle>{confirmationResponse}</AlertTitle>
                            </Alert>
                        }

                        {confirmationResponse == 'Data saved.'  &&
                            <Alert severity="success" sx={{marginBottom: '10px'}}>
                                <AlertTitle>Password has been changed!</AlertTitle>
                            </Alert>
                        }

                        <TextField type={oldPasswordVisibility ? 'text': 'password'} label="Old Password" onChange={(event) => {setOldPassword(event.target.value)}} sx={{marginBottom:'5px'}}
                        InputProps={{
                        endAdornment: <InputAdornment position="end">
                                        <IconButton onClick={() => {setOldPasswordVisibility(!oldPasswordVisibility)}}>
                                            
                                            {oldPasswordVisibility ? <Visibility/>: <VisibilityOff/>}
                                        </IconButton>
                                      </InputAdornment>,
                        }}>
                        </TextField>

                        <TextField type={newPasswordVisibility1 ? 'text': 'password'} label="New Password" onChange={(event) => {setNewPassword1(event.target.value)}} sx={{marginBottom:'5px'}}
                        InputProps={{
                        endAdornment: <InputAdornment position="end">
                                        <IconButton onClick={() => {setNewPasswordVisibility1(!newPasswordVisibility1)}}>
                                            
                                            {newPasswordVisibility1 ? <Visibility/>: <VisibilityOff/>}
                                        </IconButton>
                                      </InputAdornment>,
                        }}>
                        </TextField>
                        
                        <TextField type={newPasswordVisibility2 ? 'text': 'password'} label="New Password (again)" onChange={(event) => {setNewPassword2(event.target.value)}} 
                        InputProps={{
                        endAdornment: <InputAdornment position="end">
                                        <IconButton onClick={() => {setNewPasswordVisibility2(!newPasswordVisibility2)}}>
                                            
                                            {newPasswordVisibility2 ? <Visibility/>: <VisibilityOff/>}
                                        </IconButton>
                                      </InputAdornment>,
                        }}>
                        </TextField>
                
                        <br></br>
                        <Button disabled={disabledButton} onClick={() => {
                            setConfirmationResponse('')
                            setPasswordModalControl(false)}
                            }
                            sx={{border: '1px solid black', marginTop:'3px'}}
                            
                            >
                            Cancel
                        </Button>
                        <Button disabled={disabledButton} sx={{border: '1px solid black', marginLeft:'2px', marginTop:'3px'}} onClick={processPasswordChange}>
                            Confirm
                        </Button>
                    </Box>
                </Modal> 

            </>
        
            )
    }

    
    

}