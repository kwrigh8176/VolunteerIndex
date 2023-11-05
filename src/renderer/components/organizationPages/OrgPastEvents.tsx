import React, { useEffect } from "react";
import connectionString from "../../../../config";
import axios from "axios";
import OrgNavBar from "./OrgNavbar";
import CardHeader from "@mui/material/CardHeader";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import { Alert, AlertTitle, Button, Modal } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Clear from "@mui/icons-material/Clear";



export default function OrgPastEvents() : JSX.Element {

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


    sessionStorage.setItem("currRoute", "/orgPastEvents")

    const [cardsFromDb,setCardsFromDb] = React.useState<any[]>([])
    const [eventSlots,setEventSlots] = React.useState<any[]>([])
    const orgId = sessionStorage.getItem('orgId');

    useEffect(() => {
        getEvents()
    }, [])

    {/*Event Retrieval*/}

    const getEvents = async () => {

        var tempArray = new Array()
        var tempText = ''

        await axios.get(connectionString + "/getOrganizationPastEvents/", {params:{
            orgId: orgId,
            username: sessionStorage.getItem("username"),
            token: sessionStorage.getItem("token"),
            loginType: sessionStorage.getItem("loginType")
        }}).then(function (response){
            if (response.data.length != 0){
                const sorted = response.data.sort((objA : any,objB:any)=>{
                    const dateA = new Date(`${objA.Date}`).valueOf();
                    const dateB = new Date(`${objB.Date}`).valueOf();
                    if(dateA > dateB){
                      return 1
                    }
                    return -1
                });
                setCardsFromDb(sorted)
                tempArray = sorted
            }
            else{
                setErrorText('Events not found.')
            }
        })
        .catch(function (error){
            tempText = 'error'
            if (error.response == undefined)
            {
                setErrorText('Error connecting to the API. Please try again.')
            }
            else
            {
                setErrorText(error.response.data)
            }
            
        }); 
        
        if (tempText != ''){
            return 
        }

        var holdSlots = new Array()

        if (tempArray.length == 1){
            if (tempArray[0].length == 0){
                return 
            }
            
        }

        for (var i = 0; i < tempArray.length; i++){
            var eventId = tempArray[i].EventId

           
            await axios.get(connectionString + "/getOrganizationEventSlots/", {params:{
                eventId: eventId,
                username: sessionStorage.getItem("username"),
                token: sessionStorage.getItem("token")
            }}).then(function (response) {
                if (response.data.length >= 1){
                    for (var dataindex = 0; dataindex < response.data.length; dataindex++){
                        holdSlots.push(response.data[dataindex])
                    }
                }
                   
            }).catch(function (error){
                if (error.response == undefined)
                {
                    setErrorText('Error connecting to the API. Please try again.')
                }
                else
                {
                    setErrorText(error.response.data)
                }

            });     

        }
        setEventSlots(holdSlots);
    }

    const setNoShow = async (Id: number) => {
        setDisableButtons(true)
        await axios.post(connectionString + "/organizationSetNoShow/", null, {params:{
            Id: Id,
            username: sessionStorage.getItem('username'),
            token: sessionStorage.getItem('token'),

        }}).then(function (response){
            setModalError('')
            setModalSuccess(response.data)
            setTimeout(() => {
                window.location.reload();
            }, 5000)
         })
        .catch(function (error){
            setModalSuccess('')
            if (error.response == undefined){
                setModalError("Network error connecting to the API, please try again.")
        
            }
            else
            {
                setModalError(error.response.data)
            }
            setDisableButtons(false)
            return
        }); 
    }
  
    const setHoursVerified = async (Id: number) => {
        setDisableButtons(true)
        await axios.post(connectionString + "/organizationSetHoursVerified/", null, {params:{
            Id: Id,
            username: sessionStorage.getItem('username'),
            token: sessionStorage.getItem('token'),

        }}).then(function (response){
            setModalError('')
            setModalSuccess(response.data)
            setTimeout(() => {
                window.location.reload();
            }, 5000)
         })
        .catch(function (error){
            setModalSuccess('')
            if (error.response == undefined){
                setModalError("Network error connecting to the API, please try again.")
        
            }
            else
            {
                setModalError(error.response.data)
            }
            setDisableButtons(false)
            return
        }); 

    }

   

    const [errorText, setErrorText] = React.useState('');

    const [loading, setLoading] = React.useState(0)
    const [renderedCards, setRenderedCards] = React.useState<any[]>([])

    const [modalContent, setModalContent] = React.useState('')
    const [modalJSX, setModalJSX] = React.useState(<></>) 
    const [modalError, setModalError] = React.useState('')
    const [modalSuccess, setModalSuccess] = React.useState('')
    const [modal, setModal] = React.useState(false)
    const [disableButtons, setDisableButtons] = React.useState(false)

    useEffect (() => {

        if (modalContent == '')
        return

        var indexes = modalContent.split(",")

        
        var slotInfo = eventSlots[parseInt(indexes[1])]
        var eventInfo = cardsFromDb[parseInt(indexes[0])]


        setModalJSX(
            <>
            {modalError != '' &&
                <Alert severity="error">
                    <AlertTitle>{modalError}</AlertTitle>
                </Alert>
            }
            {modalSuccess != '' &&
                <Alert severity="success">
                    <AlertTitle>{modalSuccess}</AlertTitle>
                </Alert>
            }
            <Typography sx={{textDecoration:'underline', fontSize:17}}>Event Info</Typography>
            <br></br>
            <Typography>Event Name: {eventInfo.EventName}</Typography>
            <br></br>
            <Typography>Start Time: {eventInfo.StartTime}</Typography>
            <br></br>
            <Typography>End Time: {eventInfo.EndTime}</Typography>
            <br></br>
            <Typography>Description: {eventInfo.Description}</Typography>
            <br></br>
            <Typography sx={{textDecoration:'underline', fontSize:17}}>Volunteer Information</Typography>
            <br></br>
            {slotInfo.OverrideUsers != null &&
            <>
                 <Typography>Overriden Slot Volunteer: {slotInfo.Name}</Typography>
                 <br></br>
                 <Typography>Misc Info: {slotInfo.ContactInfo}</Typography>
                 <br></br>
                 <Typography>Role Name: {slotInfo.RoleName}</Typography>
                 <br></br>
             </>

            }
            {slotInfo.OverrideUsers == null &&
                <>
                    <Typography>Name of Volunteer: {slotInfo.FirstName} {slotInfo.LastName}</Typography>
                    <br></br>
                    <Typography>Username: {slotInfo.Username}</Typography>
                    <br></br>
                    <Typography>Role Name: {slotInfo.RoleName}</Typography>
                    <br></br>
                    {slotInfo.VerifiedHours == false && slotInfo.NoShow == null &&
                        <>
                        <Typography>Hours Verified: <ClearIcon/></Typography>
                        <br></br>
                        </>
                    }
                    {slotInfo.VerifiedHours == true && slotInfo.NoShow == null &&
                        <>
                        <Typography>Hours Verified: <CheckIcon/></Typography>
                        <br></br>
                        </>
                    }
                    {slotInfo.NoShow == 1 &&
                        <>
                        <Typography>No Show: <CheckIcon/></Typography>
                        <br></br>
                        </>
                    }
                    {slotInfo.NoShow == null &&
                        <>
                        <Typography>No Show: <ClearIcon/></Typography>
                        <br></br>
                        </>
                    }

                    
                    <Button sx={{border:'1px solid gray'}} onClick={() => {setNoShow(slotInfo.Id)}}  disabled={disableButtons}>Change no show to {new Boolean(!slotInfo.NoShow).toString()}</Button>
                    <br></br>
                    {slotInfo.NoShow == null &&
                        <>
                        <Button sx={{border:'1px solid gray', marginTop:'1px'}} onClick={() => {setHoursVerified(slotInfo.Id)}}  disabled={disableButtons}>Change Hours Verified</Button>
                        <br></br>
                        </>
                    }
                    
                </>
            }
            
            <Button sx={{border:'1px solid gray', marginTop:'1px'}} onClick={() => setModal(false)} disabled={disableButtons}>Close</Button>
            <br></br>
        </>
        )
        
        setModal(true)
        

    },[modalContent, modalError, modalSuccess])

    useEffect (() => {
        var eventSlotCopy = eventSlots
        var tempArray = []

        var eventCounter = 0;
        for (var cardIndex = 0; cardIndex < cardsFromDb.length; cardIndex++){

            var renderedSlots = new Array<JSX.Element>

            for (var eventSlotCounter = 0; eventSlotCounter < cardsFromDb[cardIndex].VolunteerLimit; eventSlotCounter++) 
            {
                
                        if (eventSlotCopy[eventSlotCounter].VolunteerId == null && eventSlotCopy[eventSlotCounter].OverrideUsers == null)
                        {

                            if (eventSlotCopy[eventSlotCounter].RoleName != null)
                            {
                                renderedSlots.push(
                                    <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black'}}>
                                        <Typography>Role ({eventSlotCopy[eventSlotCounter].RoleName}) was not signed up for.</Typography>
                                    </Box>)
                            }
                            else
                            {
                                renderedSlots.push(
                                    <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black'}}>
                                        <Typography>Slot was not signed up for.</Typography>
                                    </Box>)

                            }


                           
                        }
                        else
                        {
                 

                            if (eventSlotCopy[eventSlotCounter].VolunteerId != null)
                            {
                                if (eventSlotCopy[eventSlotCounter].RoleName != null)
                                {
                                    renderedSlots.push(
                                        <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black', backgroundColor:'#57eb75'}}>
                                            <Button id={cardIndex + ','+eventCounter} fullWidth onClick={(event) => {setModalContent(event.currentTarget.id), setModal(true)}}>Role ({eventSlotCopy[eventSlotCounter].RoleName}) was fulfilled by: {eventSlotCopy[eventSlotCounter].FirstName} {eventSlotCopy[eventSlotCounter].LastName}</Button>
                                        </Box>)
                                }
                                else
                                {
                                    renderedSlots.push(
                                        <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black', backgroundColor:'#57eb75'}}>
                                            <Button fullWidth id={cardIndex + ','+eventCounter} onClick={(event) => {setModalContent(event.currentTarget.id), setModal(true)}}>Slot was fulfilled by: {eventSlotCopy[eventSlotCounter].FirstName} {eventSlotCopy[eventSlotCounter].LastName}</Button>
                                        </Box>)
                                }
                            }
                            else
                            {

                                if (eventSlotCopy[eventSlotCounter].RoleName != null)
                                {
                                    
                                    renderedSlots.push(
                                        <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black', backgroundColor:'#57eb75'}}>
                                            <Button fullWidth id={cardIndex + ','+eventCounter} onClick={(event) => {setModalContent(event.currentTarget.id), setModal(true)}}>Role ({eventSlotCopy[eventSlotCounter].RoleName}) was fulfilled by: {eventSlotCopy[eventSlotCounter].Name} (Manually added)</Button>
                                        </Box>)
                                }
                                else
                                {
                                    
                                    renderedSlots.push(
                                        <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black', backgroundColor:'#57eb75'}}>
                                            <Button fullWidth id={cardIndex + ','+eventCounter} onClick={(event) => {setModalContent(event.currentTarget.id), setModal(true)}}>Slot was fulfilled by: {eventSlotCopy[eventSlotCounter].Name} (Manually added)</Button>
                                        </Box>)
                                }

                            }
                      
                            
                        }

                        eventCounter++;        
            }

            eventSlotCopy = eventSlotCopy.slice(cardsFromDb[cardIndex].VolunteerLimit)

           
            tempArray.push(
                <Card sx={{marginBottom:'20px'}}>
                    <CardHeader
                    title={cardsFromDb[cardIndex].EventName}
                    />
                    <CardContent sx={{borderTop: '1px solid black'}}>
                        <Typography variant="body2" color="text.secondary">
                                Address: {cardsFromDb[cardIndex].Address}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                                Date: {dayjs(cardsFromDb[cardIndex].Date).format('MM/DD/YYYY')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Start Time: {dayjs('1/1/1 ' + cardsFromDb[cardIndex].StartTime).format('h:mm A')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            End Time: {dayjs('1/1/1 ' + cardsFromDb[cardIndex].EndTime).format('h:mm A')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Event Description: {cardsFromDb[cardIndex].Description}
                        </Typography>
                    </CardContent>
                    {renderedSlots}
                    
    
    
    
    
                </Card>
    
            )
            
        }
        setRenderedCards(tempArray)

    }, [eventSlots]) 


  
    if (loading == 0){
        setLoading(1)
        getEvents()
        return (
            <>
            <p>Loading Events...</p>
            </>
        )
    }
    else{

        
        
       

       return(
            <>
                <OrgNavBar pageName="Past Events"/>
                {renderedCards}
                <Modal open={modal}>
                <Box sx={modalStyle}>
                    {modalJSX}
                </Box>
                </Modal>
                { renderedCards.length == 0 && errorText == '' && 
                    <Alert severity="warning">
                      <AlertTitle>Fetching data from API...</AlertTitle>
                  </Alert>

                }
                {errorText != '' && 
                    
                    <Alert severity="error">
                        <AlertTitle>{errorText}</AlertTitle>
                    </Alert>
                }
            </>

        )

    }


}