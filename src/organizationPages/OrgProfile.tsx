import React, { useEffect } from "react"
import connectionString from '../config';
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
import { Avatar, IconButton, InputAdornment, MenuItem, Modal, Typography } from "@mui/material"
import validator from "validator"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import moment from "moment"
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from "react-router-dom";
import { store } from "../redux";

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

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
export default function OrgProfile() : JSX.Element {
    var storeData = store.getState()

    const [loading, setLoading] = React.useState(0)
    const [loadedInfo, setLoadedInfo] = React.useState<any[]>([])
    const [loadedInfoJSX, setLoadedInfoJSX]= React.useState<JSX.Element>(<Alert severity="warning"><AlertTitle>Fetching data from API...</AlertTitle></Alert>)

    const [modalControl, setModalControl] = React.useState(false);
    const [passwordModalControl, setPasswordModalControl] = React.useState(false);
    const [disabledButton, setDisabledButton] = React.useState(false)
    const [deleteAccountModal, setDeleteAccountModal] = React.useState(false);

    const [profilePicture, setProfilePicture] = React.useState<boolean>();
    const [counter, setCounter] = React.useState(0)

    const [oldPassword, setOldPassword] = React.useState('')
    const [newPassword1, setNewPassword1] = React.useState('')
    const [newPassword2, setNewPassword2] = React.useState('')

    const [oldPasswordVisibility, setOldPasswordVisibility] = React.useState(false);
    const [newPasswordVisibility1, setNewPasswordVisibility1] = React.useState(false);
    const [newPasswordVisibility2, setNewPasswordVisibility2] = React.useState(false);

    const [deleteUsername, setDeleteUsername] = React.useState('');
    const [deletePassword, setDeletePassword] = React.useState('');
    const [deletePasswordVisibility, setDeletePasswordVisibility] = React.useState(false);

    const [errorType, setErrorType] = React.useState('')

    const [confirmationResponse, setConfirmationResponse] = React.useState('')
 

    var connString = connectionString + "/getProfilePicture/?Id=" + storeData.Id +  "&" + "loginType=" + storeData.loginType

    var navigate = useNavigate();
    
    const getLoadedInfo = async () => {
        setConfirmationResponse('')
        setErrorType('')

        var temp = '';
        await axios.get(connectionString + "/getOrgProfile/", {params:{
            OrgId: storeData.Id,
            username: storeData.username,
            token: storeData.token, 
            loginType: "Organization"
        }}).then(function (response) {
            setLoadedInfo(response.data)
         }).catch(function (error){
            temp = "error"
            if (error.response == undefined){
                    setLoadedInfoJSX(<Alert severity="error"><AlertTitle>Network error connecting to the API, please try again.</AlertTitle></Alert>)
            }
            else
            {
                setLoadedInfoJSX(<Alert severity="error"><AlertTitle>{error.response.data}</AlertTitle></Alert>)
            }
            return
        
         });  
         
         if(temp == "error")
         {
            return
         }
         
         await axios.get(connString).then(function (response) {
            if (response.data == null)
            {
                setProfilePicture(false)
            }   
            else
            {
                setProfilePicture(true)
           
             }
        })
    }

    async function handleProfilePicture(e: React.FormEvent<HTMLInputElement>) {
        setConfirmationResponse("");
        setErrorType('');

        const target = e.target as HTMLInputElement & {
          files: FileList;
        }

       

        if(target.files[0].size > 2097152)
        {
            setErrorType('error')
            setConfirmationResponse("File is too big! (2MB only)");
            return
        }

         

        const formData = new FormData();
        formData.append("avatar",target.files[0]);

        await axios.post(connectionString + "/uploadProfilePicture/", formData, {
            
            headers: {
                'Content-Type': 'multipart/form-data'
            },

            params:{
                Id: storeData.Id,
                username: storeData.username,
                token: storeData.token, 
                loginType: "Organization",
                profileImageLink: loadedInfo[0].ProfilePicture
            }
    
        }).then(function (response) {
            window.location.reload()
        }).catch(function (error){
            setErrorType('error')
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

    const processPasswordChange = async() => {
        setDisabledButton(true)
        setConfirmationResponse("");
        setErrorType('');

        if (newPassword1 != newPassword2)
        {
            setConfirmationResponse("Passwords dont match.")
            return
        }

        await axios.post(connectionString + "/processPasswordChange/", null, {params:{
            Id: storeData.Id,
            username: storeData.username,
            token: storeData.token, 
            loginType: "Organization",
            newPassword: newPassword1,
            oldPassword: oldPassword,
        }}).then(function (response) {
            setErrorType('success')
            setConfirmationResponse(response.data)
            
        }).catch(function (error){
            setErrorType('error')
            if (error.response == undefined){
                setConfirmationResponse("Network error connecting to the API, please try again.")
            }
            else
            {
                setConfirmationResponse(error.response.data)
            }
     
            setDisabledButton(false)
         });    
    }

    const processDeleteAccount = async() => {
        setDisabledButton(true)
        setConfirmationResponse("");
        setErrorType('');


        await axios.get(connectionString + "/deleteAccount/", {params:{
            orgId: storeData.Id,
            username: storeData.username,
            token: storeData.token, 
            loginType: "Organization",
            givenUsername: deleteUsername,
            givenPassword: deletePassword,
            locale:  moment.tz.guess(true) 
        }}).then(function (response) {
            setErrorType('success')
            setConfirmationResponse(response.data)
            setTimeout(() =>{
                navigate("/")
            }, 5000)
            
         }).catch(function (error){
            setErrorType('error')
            if (error.response == undefined){
                setConfirmationResponse("Network error connecting to the API, please try again.")
            }
            else
            {
                setConfirmationResponse(error.response.data)
            }
            setDisabledButton(false)
         });  
         
    }

    const processSaving = async () => {

        setDisabledButton(true)

        setConfirmationResponse("");
        setErrorType('');

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
            setErrorType('error');
            setConfirmationResponse(errMsg)
            return
        }

        await axios.post(connectionString + "/getTakenOrgData/", null, {params:{
            email: loadedInfo[0].Email,
            username: storeData.username,
            phonenumber: loadedInfo[0].PhoneNumber,
            token:  storeData.token,
            orgId: storeData.Id,
            loginType: "Organization",
            newUsername: loadedInfo[0].Username,

        }}).then(function (response) {
            axios.post(connectionString + "/saveOrgProfile/", null, {params:{
                orgId: storeData.Id,
                email: loadedInfo[0].Email,
                username: loadedInfo[0].Username,
                phonenumber: loadedInfo[0].PhoneNumber,
                bio: loadedInfo[0].Bio,
                State: loadedInfo[0].State,
                Address: loadedInfo[0].Address,
                orgName: loadedInfo[0].OrgName,
                token:  storeData.token,
                loginType: storeData.loginType,
                oldUsername: storeData.username,
                locale:  moment.tz.guess(true) 
            }}).then(function (response) {
                setErrorType('success');
                setConfirmationResponse('Data saved.')
                store.dispatch({type:'changeUsername', username:loadedInfo[0].Username})
                store.dispatch({type:'changeState', state:loadedInfo[0].State})
             }).catch(function (error){
                setErrorType('error');
                if (error.response == undefined){
                    setConfirmationResponse("Network error connecting to the API, please try again.")
                }
                else
                {
                    setConfirmationResponse(error.response.data)
                }
            
             });  
         }).catch(function (error){
            setErrorType('error');
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
                        
                        <Card sx={{border:1}}>
                            {profilePicture == false && 
                                    <CardHeader
                                avatar={
                                            <Avatar sx={{ bgcolor: 'grey' }}>
                                                {loadedInfo[0].FirstName.charAt(0)}
                                            </Avatar>
                                        }
                
                                sx={{borderTop:'1px solid black'}}
                                title = {
                                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                        Upload Profile Picture (Reloads Page)
                                        <VisuallyHiddenInput type="file" accept="image/png, image/jpg, image/jpeg" onChange={handleProfilePicture}/>
                      
                                    </Button>
                                }
                                >
                                </CardHeader>
                            }

                            {profilePicture != true && 
                                     <CardHeader
                                        avatar={
                                                    <Avatar src={connString}>
                                                    </Avatar>
                                                }
                        
                                        sx={{borderTop:'1px solid black'}}
                                        title = {
                                            <>
                                            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                                Upload Profile Picture (Reloads Page)
                                                <VisuallyHiddenInput type="file" accept="image/png, image/jpg, image/jpeg" onChange={handleProfilePicture}/>
                                            </Button>
                                            </>
                                        }
                                     >
                                     
                                     </CardHeader>
                            }
                            <CardHeader title="Your Info" subheader="Click on a field to edit. Click the save button below to save." subheaderTypographyProps={{ color: 'black' }}  sx={{borderTop:'1px solid black'}} >
                            </CardHeader>
                            <CardContent sx={{borderBottom:'1px white'}}>
                                <TextField defaultValue={loadedInfo[0].Username} label='Username' sx={{marginRight:'5px'}}  inputProps={{ maxLength: 15 }} onChange={(event) => (loadedInfo[0].Username = event.target.value)} ></TextField>

                                <TextField defaultValue={loadedInfo[0].Email} label='Email'  sx={{marginRight:'5px'}} inputProps={{ maxLength: 50 }} onChange={(event) => (loadedInfo[0].Email = event.target.value)} ></TextField>
                                <TextField defaultValue={loadedInfo[0].PhoneNumber} label='Phone Number (No Spaces)' sx={{ marginRight:'5px'}} inputProps={{ maxLength: 10 }} onChange={(event) => (loadedInfo[0].PhoneNumber = event.target.value)} ></TextField>
                                
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
                            <TextField defaultValue={loadedInfo[0].Address} label='Address' sx={{marginRight:'5px'}} inputProps={{ maxLength: 50 }} onChange={(event) => (loadedInfo[0].Address = event.target.value)} ></TextField>
                            <TextField defaultValue={loadedInfo[0].OrgName} label='Organization Name' sx={{marginRight:'5px'}} inputProps={{ maxLength: 50 }} onChange={(event) => (loadedInfo[0].OrgName = event.target.value)} ></TextField>
                            </CardContent>
                            <CardContent sx={{borderTop:'1px solid black'}}>
                                <Button sx={{border:'1px solid black', color:'red'}} onClick={() => {setPasswordModalControl(true)}} disabled={disabledButton}>Reset Password </Button> <Button sx={{border:'1px solid black'}} onClick={() => setModalControl(true)} disabled={disabledButton}>Save All Information</Button>
                            </CardContent>
                            <CardContent sx={{borderTop:'1px solid black'}}>
                                <Button sx={{border:'1px solid black', color:'red'}} onClick={() => {setDeleteAccountModal(true)}} disabled={disabledButton}>Delete Account </Button>
                            </CardContent>
                        </Card>
                    </Box>
                </>
                
            )
        }
   
        

    }, [loadedInfo, counter])



    if (loading == 0){
        setLoading(1)
        getLoadedInfo()
        {/*Just a temporary message for signaling data is being retrieved */}
        return (
            <>
                <Alert severity="warning">
                      <AlertTitle>Fetching data from API...</AlertTitle>
                  </Alert>
            </>
        )
    }
    else{
        return (
            <>
  

                <OrgNavbar pageName="Profile"/>
                {loadedInfoJSX}

                <Modal
                    open={modalControl}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"      
                >    
                    <Box sx={modalStyle}>
                        {errorType == 'error' &&
                            <Alert severity="error">
                                <AlertTitle>{confirmationResponse}</AlertTitle>
                            </Alert>
                        }
                    
                        {errorType == 'success'  &&
                            <Alert severity="success">
                                <AlertTitle>{confirmationResponse}</AlertTitle>
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

                        {errorType == 'error' &&
                            <Alert severity="error" sx={{marginBottom: '10px'}}>
                                <AlertTitle>{confirmationResponse}</AlertTitle>
                            </Alert>
                        }

                        {errorType == 'success' &&
                            <Alert severity="success" sx={{marginBottom: '10px'}}>
                                <AlertTitle>{confirmationResponse}</AlertTitle>
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
                
                <Modal
                    open={deleteAccountModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"    
                >
                    <Box sx={modalStyle}>

                        {errorType == 'error' &&
                            <Alert severity="error" sx={{marginBottom: '10px'}}>
                                <AlertTitle>{confirmationResponse}</AlertTitle>
                            </Alert>
                        }

                        {errorType == 'success' &&
                            <Alert severity="success" sx={{marginBottom: '10px'}}>
                                <AlertTitle>{confirmationResponse}</AlertTitle>
                            </Alert>
                        }

                        <Typography sx={{color:'red'}}>Are you sure you want to delete your account? <b>This action is irreversible!</b></Typography>
                        <Typography sx={{color:'red'}}>Type your username and password to confirm.</Typography>

                        <TextField label="Username" onChange={(event) => {setDeleteUsername(event.target.value)}} sx={{marginBottom:'5px'}}>
                        </TextField>
                        
                        <TextField type={deletePasswordVisibility ? 'text': 'password'} label="Password" onChange={(event) => {setDeletePassword(event.target.value)}} 
                        InputProps={{
                        endAdornment: <InputAdornment position="end">
                                        <IconButton onClick={() => {setDeletePasswordVisibility(!newPasswordVisibility2)}}>
                                            
                                            {deletePasswordVisibility ? <Visibility/>: <VisibilityOff/>}
                                        </IconButton>
                                      </InputAdornment>,
                        }}>
                        </TextField>

                        <br></br>
                        <Button disabled={disabledButton} onClick={() => {
                            setConfirmationResponse('')
                            setErrorType('');
                            setDeletePassword('')
                            setDeleteUsername('')
                            setDeleteAccountModal(false)}
                            }
                            sx={{border: '1px solid black', marginTop:'3px'}}
                            
                            >
                            Cancel
                        </Button>
                        <Button disabled={disabledButton} sx={{border: '1px solid black', marginLeft:'2px', marginTop:'3px'}} onClick={processDeleteAccount}>
                            Confirm
                        </Button>
                    </Box>
                </Modal>
            </>
        
            )
    }

    
    

}