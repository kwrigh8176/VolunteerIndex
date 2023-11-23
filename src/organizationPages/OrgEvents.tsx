import React, { useEffect } from "react"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import {Alert, AlertTitle, Box, Button, Checkbox, FormControlLabel, FormGroup, IconButton, Modal, TextField } from "@mui/material"
import OrgNavBar from "./OrgNavbar"
import dayjs from "dayjs"
import connectionString from "../config";
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import Textarea from "@mui/joy/Textarea"
import moment from "moment"



/*
    This is meant to be the main event feed. Where all current events are displayed.

*/

export default function OrgEvents() : JSX.Element {

    sessionStorage.setItem("currRoute", "/orgCurrentEvents")

    const [cardsFromDb,setCardsFromDb] = React.useState<any[]>([])
    const [eventSlots,setEventSlots] = React.useState<any[]>([])
    const orgId = sessionStorage.getItem('orgId');

    const [kickUserModal, setKickUserModal] = React.useState(false);
    const [kickModalContent, setKickModalContent] =  React.useState('')
    const [kickModalJSX, setKickModalJSX] =  React.useState<JSX.Element>(<></>)
    const [kickModalError, setKickModalError] = React.useState('')
    const [kickModalSuccess, setKickModalSuccess] = React.useState('')
    const [disableButtons, setDisableButtons] = React.useState(false)


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

    useEffect(() => {
        getEvents()
    }, [])

    {/*Event Retrieval*/}

    const getEvents = async () => {
        var tempArray = new Array()

        var tempText = '';
     
        await axios.get(connectionString + "/getOrganizationCurrentEvents/",{params:{
            orgId: orgId,
            username: sessionStorage.getItem('username'),
            token: sessionStorage.getItem('token'),
            getCollegeEvents: "0",
            locale:  moment.tz.guess(true)
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
            if (error.response == undefined){
                setErrorText("Network error connecting to the API, please try again.")
                tempText = "Network error connecting to the API, please try again."
            }
            else
            {
                setErrorText(error.response.data)
                tempText = error.response.data
            }
            return
        }); 
        
        var holdSlots = new Array()


        if (tempText != ''){
            return 
        }
            
        for (var i = 0; i < tempArray.length; i++){
            var eventId = tempArray[i].EventId

           
            await axios.get(connectionString + "/getOrganizationEventSlots/",{params:{
                eventId: eventId,
                username: sessionStorage.getItem("username"),
                token: sessionStorage.getItem("token"),
                loginType: sessionStorage.getItem("loginType")
            }}).then(function (response) {
                if (response.data.length >= 1){
                    for (var dataindex = 0; dataindex < response.data.length; dataindex++){
                        holdSlots.push(response.data[dataindex])
                    }
                }
                
                   
            }).catch(function (error){
                if (error.response == undefined){
                    setErrorText("Network error connecting to the API, please try again.")
                }
                else
                {
                    setErrorText(error.response.data)
                }
                return
            });     

        }
        setEventSlots(holdSlots);
        
       
    

    }

    const kickUser = async (Id : number) => {
        setKickModalError('')
        setKickModalSuccess('')

        await axios.post(connectionString + "/organizationKickIndividual/", null, {params:{
            slotId: Id,
            username: sessionStorage.getItem("username"),
            token: sessionStorage.getItem("token"),
            loginType: sessionStorage.getItem("loginType")
        }}).then(function (response) {
            setKickModalSuccess(response.data)
            getEvents();
   
        }).catch(function (error){
            if (error.response == undefined){
                setKickModalError("Network error connecting to the API, please try again.")
            }
            else{
                setKickModalError(error.response.data)
            }
            
            
            return
        })
        setDisableButtons(false)
    }

    const overrideUser = async (Id : number) => {
        setKickModalError('')
        setKickModalSuccess('')

        await axios.post(connectionString + "/organizationOverrideIndividual/", null, {params:{
            slotId: Id,
            username: sessionStorage.getItem("username"),
            token: sessionStorage.getItem("token"),
            loginType: sessionStorage.getItem("loginType"),
            overriddenName: overriddenName,
            overriddenMisc: overriddenMisc
        }}).then(function (response) {
            setKickModalSuccess(response.data)
            getEvents();
   
        }).catch(function (error){
            if (error.response == undefined){
                setKickModalError("Network error connecting to the API, please try again.")
            }
            else{
                setKickModalError(error.response.data)
            }
            
            
            return
        })

        setDisableButtons(false)
    }

    const [errorText, setErrorText] = React.useState('');

    const [loading, setLoading] = React.useState(0)
    const [renderedCards, setRenderedCards] = React.useState<any[]>([])

    
    const [overriddenName, setOverridenName] = React.useState('');
    const [overriddenMisc, setOveriddenMisc] = React.useState("");
    const [overiddenValue, setOveriddenValue] = React.useState(false);
    

    useEffect (() => {
        var eventSlotCopy = eventSlots
        var tempArray = []

        var eventCounter = 0;
        for (var cardIndex = 0; cardIndex < cardsFromDb.length; cardIndex++){

            var renderedSlots = new Array<JSX.Element>
            {/*Query needs to filter the date and time from events, events from different states also shouldn't be shown*/}
        
            
            

            for (let eventSlotCounter = 0; eventSlotCounter < cardsFromDb[cardIndex].VolunteerLimit; eventSlotCounter++) 
            {
                
                    /*Empty slots*/
                    if (eventSlotCopy[eventSlotCounter].VolunteerId == null && eventSlotCopy[eventSlotCounter].OverrideUsers == null)
                    {   
                        if (eventSlotCopy[eventSlotCounter].RoleName == null)
                        {
                            renderedSlots.push(
                                <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black', backgroundColor:'white'}}>
                                    
                                    <Button fullWidth id={cardIndex + ','+eventCounter} onClick={(event) => {setKickModalContent(event.currentTarget.id); setKickUserModal(true)}}>Open Slot</Button>
                                </Box>)
                        }
                        else
                        {
                            renderedSlots.push(
                                <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black', backgroundColor:'white'}}>
                                    <Button fullWidth id={cardIndex + ','+eventCounter} onClick={(event) => {setKickModalContent(event.currentTarget.id); setKickUserModal(true)}}>Open Role: {eventSlotCopy[eventSlotCounter].RoleName}</Button>
                                </Box>)
                        }
                        
                        
                    }
                    /*Closed slots*/ 
                    else{
           
                        if (eventSlotCopy[eventSlotCounter].OverrideUsers != null)
                        {
                            renderedSlots.push(
                                <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black', backgroundColor:'#fa534d'}}>
                                    <Button fullWidth id={cardIndex + ','+eventCounter} onClick={(event) => {setKickModalContent(event.currentTarget.id); setKickModalError(''); setKickModalSuccess(''); setKickUserModal(true);}} >Taken by: {eventSlotCopy[eventSlotCounter].Name}</Button>
                                </Box>)
                        }
                        else{
                            renderedSlots.push(
                                <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black', backgroundColor:'#fa534d'}}>
                                    <Button fullWidth id={cardIndex + ','+eventCounter} onClick={(event) => {setKickModalContent(event.currentTarget.id); setKickModalError(''); setKickModalSuccess('');  setKickUserModal(true)}}>Taken by: {eventSlotCopy[eventSlotCounter].FirstName} {eventSlotCopy[eventSlotCounter].LastName}</Button>
                                </Box>)
                        }
                        
                    }
                    
                    eventCounter++;
            }

            eventSlotCopy = eventSlotCopy.slice(cardsFromDb[cardIndex].VolunteerLimit)

           
            tempArray.push(
                <Card sx={{marginBottom:'20px', border:1}}>
                    <CardHeader

                    title={cardsFromDb[cardIndex].EventName}
                    action={
                        <IconButton aria-label="settings">
                          <EditIcon />
                        </IconButton>
                      }
                     
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
                        <Typography variant="body2" color="text.secondary">
                            Email: {cardsFromDb[cardIndex].Email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Phone Number: {cardsFromDb[cardIndex].PhoneNumber}
                        </Typography>
                    </CardContent>
                    {renderedSlots}
    
                </Card>
    
            )
            
        }
        setRenderedCards(tempArray)

    }, [eventSlots]) 

    useEffect(() => {

        if (kickModalContent == '')
        return

        var indexes = kickModalContent.split(",")

        
        var slotInfo = eventSlots[parseInt(indexes[1])]
        var eventInfo = cardsFromDb[parseInt(indexes[0])]

        setKickModalJSX(
        <>
            {kickModalError != '' &&
                <Alert severity="error">
                    <AlertTitle>{kickModalError}</AlertTitle>
                </Alert>
            }
            {kickModalSuccess != '' &&
                <Alert severity="success">
                    <AlertTitle>{kickModalSuccess}</AlertTitle>
                </Alert>
            }
            <Typography sx={{textDecoration:'underline', fontSize:17}}>Event Info</Typography>
            <br></br>
            <Typography>Event Name: {eventInfo.EventName}</Typography>
            <br></br>
            <Typography>Start Time: {dayjs('1/1/1 ' + eventInfo.StartTime).format('h:mm:ss a')}</Typography>
            <br></br>
            <Typography>End Time: {dayjs('1/1/1 ' + eventInfo.EndTime).format('h:mm:ss a')}</Typography>
            <br></br>
            <Typography>Description: {eventInfo.Description}</Typography>
            <br></br>
            <Typography sx={{textDecoration:'underline', fontSize:17}}>Volunteer Information</Typography>
            <br></br>
            {slotInfo.Username != null &&
            
                <>

                    <Typography>Name of Volunteer: {slotInfo.FirstName} {slotInfo.LastName}</Typography>
                    <br></br>
                    <Typography>Username: {slotInfo.Username}</Typography>
                    <br></br>
                </>
            }
            {slotInfo.Username == null &&
                <>
                    <Typography>Overriden Slot Volunteer: {slotInfo.Name}</Typography>
                    <br></br>
                    <Typography>Misc Info: {slotInfo.ContactInfo}</Typography>
                    <br></br>
                </>

            }
            {slotInfo.RoleName != null &&
                <>
                    <Typography>Role Name: {slotInfo.RoleName}</Typography>
                    <br></br>
                </>
            }
            <Button onClick={() => setKickUserModal(false)} disabled={disableButtons}>Close</Button>

            {slotInfo.Username != null &&
            
            <Button onClick={() => {setDisableButtons(true); kickUser(slotInfo.Id)}} disabled={disableButtons}>Kick</Button>
    
            }
            <FormGroup>
                <FormControlLabel control={<Checkbox />} label="Override Slot?" onChange={(event,checked) => {
                    setOveriddenValue(checked)
                    if (checked){
                        setDisableButtons(true)
                    }
                    else{
                        setDisableButtons(false)
                    }
                
                }}/>
            </FormGroup>
            { overiddenValue &&
                <Box>
                    <TextField onChange={(event) => setOverridenName(event.target.value)} label="Volunteer Name" sx={{paddingBottom: '8px', minWidth:250}} inputProps={{maxLength:50}}></TextField>
                    <Textarea required placeholder="Enter misc info... (contact info)" onChange={(event) => {if (event.target.value.length <= 250) setOveriddenMisc(event.target.value)}} value={overriddenMisc}></Textarea>
                    <Button sx={{color:'red', border:'1px solid black', marginTop:'2px'}} onClick={() => overrideUser(slotInfo.Id)}>Override User</Button>
                </Box>
            }
        </>
        )

        setKickUserModal(true)
    },[kickModalContent, kickModalError, kickModalSuccess, overiddenValue, overriddenMisc, eventSlots])

  
    if (loading == 0){
        setLoading(1)
        getEvents()
        return (
            <>
            </>
        )
    }
    else{

        
        
       

       return(
            <>
                <OrgNavBar pageName="All Events"/>
                { renderedCards.length == 0 && errorText == '' && 
                    <Alert severity="warning">
                      <AlertTitle>Fetching data from API...</AlertTitle>
                  </Alert>

                }
                {renderedCards}
                {errorText != '' && 
                    
                    <Alert severity="error">
                        <AlertTitle>{errorText}</AlertTitle>
                    </Alert>
                }
                <Modal open={kickUserModal}>
                <Box sx={modalStyle}>
                    {kickModalJSX}
                </Box>
                </Modal>
            </>

        )

    }

}

