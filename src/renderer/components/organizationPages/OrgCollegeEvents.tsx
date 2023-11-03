import React, { useEffect } from "react"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import {Alert, AlertTitle, Box, Button, IconButton, Modal } from "@mui/material"
import OrgNavBar from "./OrgNavbar"
import dayjs from "dayjs"
import connectionString from "../../../../config"
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';

/*
    This is meant to be the main event feed. Where all current events are displayed.

*/

export default function orgCollegeEvents() : JSX.Element {
    sessionStorage.setItem("currRoute", "/orgCollegeEvents")

    const [cardsFromDb,setCardsFromDb] = React.useState<any[]>([])
    const [eventSlots,setEventSlots] = React.useState<any[]>([])
    const orgId = sessionStorage.getItem('orgId');

    const [kickUserModal, setKickUserModal] = React.useState(false);
    const [kickModalContent, setKickModalContent] =  React.useState<any>()
    const [kickModalJSX, setKickModalJSX] =  React.useState<JSX.Element>(<></>)
    const [kickModalError, setKickModalError] = React.useState('')
    const [kickModalSuccess, setKickModalSuccess] = React.useState('')

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
            getCollegeEvents: "1"
        }}).then(function (response){
                setCardsFromDb(response.data)
                tempArray.push(response.data) 
                if (response.data.length == 0)
                {
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
            
        for (var i = 0; i < tempArray[0].length; i++){
            var eventId = tempArray[0][i].EventId

           
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
        await axios.post(connectionString + "/organizationKickIndividual/", null, {params:{
            slotId: Id,
            username: sessionStorage.getItem("username"),
            token: sessionStorage.getItem("token"),
            loginType: sessionStorage.getItem("loginType")
        }}).then(function (response) {
            setKickModalSuccess(response.data)
            setTimeout(() => {
                window.location.reload();
            }, 5000)
        }).catch(function (error){
            
            if (error.response == undefined){
                setKickModalError("Network error connecting to the API, please try again.")
            }
            else{
                setKickModalError(error.response.data)
            }
            
            
            return
        })
    }

    const [errorText, setErrorText] = React.useState('');

    const [loading, setLoading] = React.useState(0)
    const [renderedCards, setRenderedCards] = React.useState<any[]>([])

    

  
    

    useEffect (() => {
        var eventSlotCopy = eventSlots
        var tempArray = []

        var counter = 0;
        for (var cardIndex = 0; cardIndex < cardsFromDb.length; cardIndex++){

            var renderedSlots = new Array<JSX.Element>
            {/*Query needs to filter the date and time from events, events from different states also shouldn't be shown*/}
        
            
            

            for (let eventSlotCounter = 0; eventSlotCounter < cardsFromDb[cardIndex].VolunteerLimit; eventSlotCounter++) 
            {
                
                    /*Empty slots*/
                    if (eventSlotCopy[eventSlotCounter].VolunteerId == null && eventSlotCopy[eventSlotCounter].OverrideUsers == null)
                    {
                        renderedSlots.push(
                            <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black'}}>
                                
                                <Typography>Open Role: {eventSlotCopy[eventSlotCounter].RoleName}</Typography>
                            </Box>)
                        
                    }
                    /*Closed slots*/ 
                    else{
                        var getCard = cardsFromDb[cardIndex]
                        var getEventSlot = eventSlotCopy[eventSlotCounter]
                        if (eventSlotCopy[eventSlotCounter].VolunteerId != null)
                        {
                            renderedSlots.push(
                                <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black', backgroundColor:'#fa534d'}}>
                                    <Button fullWidth onClick={() => {setKickModalContent([getCard,getEventSlot])}}>Taken by: {eventSlotCopy[eventSlotCounter].FirstName} {eventSlotCopy[eventSlotCounter].LastName}</Button>
                                </Box>)
                        }
                        else
                        {
                            renderedSlots.push(
                                <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black', backgroundColor:'#fa534d'}}>
                                    <Button fullWidth onClick={() => {setKickModalContent([getCard,getEventSlot])}}>Taken by: {eventSlotCopy[eventSlotCounter].Name} </Button>
                                </Box>)
                        }
                        
                    }
                    
                    counter++;
            }

            eventSlotCopy = eventSlotCopy.slice(cardsFromDb[cardIndex].VolunteerLimit)

           
            tempArray.push(
                <Card sx={{marginBottom:'20px'}}>
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
                    </CardContent>
                    {renderedSlots}
                    
    
    
    
    
                </Card>
    
            )
            
        }
        setRenderedCards(tempArray)

    }, [eventSlots]) 

    useEffect(() => {

        if (kickModalContent == undefined)
        return

        if (kickModalContent[0] == undefined)
        return

        var eventInfo = kickModalContent[0]
        var slotInfo = kickModalContent[1]

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
            <Typography>Start Time: {eventInfo.StartTime}</Typography>
            <br></br>
            <Typography>End Time: {eventInfo.EndTime}</Typography>
            <br></br>
            <Typography>Description: {eventInfo.Description}</Typography>
            <br></br>
            <Typography sx={{textDecoration:'underline', fontSize:17}}> Would you like to kick this user from the event?</Typography>
            <br></br>
            <Typography>Name of Individual: {slotInfo.FirstName} {slotInfo.LastName}</Typography>
            <br></br>
            <Typography>Username: {slotInfo.Username}</Typography>
            <br></br>
            <Typography>Role Name: {slotInfo.RoleName}</Typography>
            <br></br>
            <Button onClick={() => setKickUserModal(false)}>Cancel</Button>
            <Button onClick={() => {kickUser(slotInfo.Id)}}>Submit</Button>
        </>
        )

        setKickUserModal(true)
    },[kickModalContent, kickModalError, kickModalSuccess])

  
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
                <OrgNavBar/>
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

