import React, { useEffect } from "react"
import connectionString from "../../../../config"
import axios from "axios"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardContent from "@mui/material/CardContent"
import VolunteerNavBar from "./VolunteerNavbar"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import { Modal, Typography } from "@mui/material"
import validator from "validator"

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

export default function VolunteerProfile() : JSX.Element {

    const [loading, setLoading] = React.useState(0)
    const [loadedInfo, setLoadedInfo] = React.useState<any[]>([])
    const [loadedInfoJSX, setLoadedInfoJSX]= React.useState<JSX.Element>(<p></p>)

    const [modalControl, setModalControl] = React.useState(false);
    const [disabledButton, setDisabledButton] = React.useState(false)

    const [confirmationResponse, setConfirmationResponse] = React.useState('')
    const getLoadedInfo = async () => {
        setConfirmationResponse('')

        var connectionStringWithParams = connectionString + "/getVolunteerProfile/" + sessionStorage.getItem("Id") + '/' + 'placeholdervalue'
        await axios.get(connectionStringWithParams).then(function (response) {
            setLoadedInfo(response.data)
            
         }).catch(function (error){
            setLoadedInfoJSX(<p>Data could not be retrieved. Try restarting the app.</p>)
        
         });  
    }

    const processSaving = async () => {

        setDisabledButton(true)

        var checkVariable = false
        var errMsg = ""

        if (loadedInfo[0].Username == '' || loadedInfo[0].Email == '' || loadedInfo[0].PhoneNumber == '')
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
        }

        var connectionStringWithParams = connectionString + "/saveVolunteerProfile/" + sessionStorage.getItem("Id") + '/' + loadedInfo[0].Username + '/' + loadedInfo[0].Email + '/' + loadedInfo[0].PhoneNumber + '/' + loadedInfo[0].Bio + '/' + 'placeholdervalue'
        await axios.post(connectionStringWithParams).then(function (response) {
            setConfirmationResponse('Data saved.')
            
         }).catch(function (error){
            setConfirmationResponse(error.data.response)
        
         });  

         setDisabledButton(false)

    }

    useEffect(() => {
        

        if (loadedInfo.length != 0){

            setLoadedInfoJSX(
                <>
                    <Box>
                        
                        <Card>
                            <CardHeader title={"Welcome, " + loadedInfo[0].FirstName} >
                            </CardHeader>
                            <CardHeader title="Your Info" subheader="Click on a field to edit. Click the save button below to save." subheaderTypographyProps={{ color: 'black' }}  sx={{borderTop:'1px solid black'}} >
                            </CardHeader>
                            <CardContent sx={{borderBottom:'1px white'}}>
                                <TextField defaultValue={loadedInfo[0].Username} label='Username' sx={{marginRight:'5px'}} InputLabelProps={{style: { color: 'black' }}} inputProps={{ maxLength: 15 }} onChange={(event) => (loadedInfo[0].Username = event.target.value)} ></TextField>

                                <TextField defaultValue={loadedInfo[0].Email} label='Email'  sx={{marginRight:'5px'}} InputLabelProps={{style: { color: 'black' }}} inputProps={{ maxLength: 50 }} onChange={(event) => (loadedInfo[0].Email = event.target.value)} ></TextField>
                                <TextField defaultValue={loadedInfo[0].PhoneNumber} label='Phone Number (No Spaces)' sx={{ marginRight:'5px'}} InputLabelProps={{style: { color: 'black' }}} inputProps={{ maxLength: 10 }} onChange={(event) => (loadedInfo[0].PhoneNumber = event.target.value)} ></TextField>
                            </CardContent>
              
                            <CardHeader title="Bio" subheader="Feel free to describe yourself here. (250 characters max)" subheaderTypographyProps={{ color: 'black' }}  sx={{borderTop:'1px solid black'}} >
                            </CardHeader>
                            <CardContent>
                                <textarea defaultValue={loadedInfo[0].Bio} onChange={(event) => (loadedInfo[0].Bio = event.target.value)}  maxLength={250}></textarea>
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
                <VolunteerNavBar/>
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

            </>
        
            )
    }

    
    

}