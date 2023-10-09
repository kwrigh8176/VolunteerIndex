import React, { useEffect } from "react"
import Avatar from "@mui/material/Avatar"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import { render } from "react-dom"
import List from "@mui/material/List"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { Alert, AlertTitle, Box, Button, CardActionArea, CardActions, Modal } from "@mui/material"
import VolunteerNavBar from "./VolunteerNavbar"
import dayjs from "dayjs"
import { useNavigate } from "react-router-dom"
import connectionString from "../../../../config"
import axios from 'axios';
import { session } from "electron"

/*
    This is meant to be the main event feed. Where all current events are displayed.

*/

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




export default function VolunteerEvents() : JSX.Element {

    const [cardsFromDb,setCardsFromDb] = React.useState<any[]>([])
    const [eventSlots,setEventSlots] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(0)
    const [volunteerId,setVolunteerId] = React.useState(sessionStorage.getItem('Id'));

    const navigate = useNavigate();
    

    useEffect(() => {
        getEvents()
    }, [])

    {/*Event Retrieval*/}

    const getEvents = async () => {
        var state = sessionStorage.getItem("state")
        var tempArray = new Array()
 
        var connectionStringWithParams = connectionString + "/getEvents/" + state + '/' + 'placeholdervalue'
        await axios.get(connectionStringWithParams).then(function (response){
                setCardsFromDb(response.data)
                tempArray.push(response.data) 
        })
        .catch(function (error){
            setErrorText(error.response.data)
        }); 
        


        var holdSlots = new Array()
        for (var i = 0; i < tempArray.length; i++){
            var eventId = tempArray[0][i].EventId

            connectionStringWithParams = connectionString + "/getEventSlots/" + eventId + '/' + state + '/' + 'placeholdervalue'
            await axios.get(connectionStringWithParams).then(function (response) {
                    holdSlots.push(response.data)
            }).catch(function (error){
                setErrorText(error.response.data)
            });     

        }
        setEventSlots(holdSlots);
        
       
    

    }

  


    const eventSignUp = async() => {
        /* Disable buttons */
        setDisableButtons(true);
        var getValue = '0'
        var connectionStringWithParams = connectionString + "/eventSignUp/" + activeSlot + '/' + activeEventId + '/' +  sessionStorage.getItem('Id') + '/' + sessionStorage.getItem('username') + '/' +'placeholdervalue'
            await axios.get(connectionStringWithParams).then(function (response) {
                    getValue = response.data
            }).catch(function (error){
                setErrorText(error.response.data)
                
            });   

        setErrorText(getValue)
        if (getValue == 'Successfully signed up for the event.')
        {
            setTimeout(() => {
                window.location.reload();
            }, 3000)
        }
        else{
            setDisableButtons(false)
        }
       



    }
    

    const [confirmationModalOpen, setConfirmationModalOpen] = React.useState(false);
    const [activeSlot, setActiveSlot] = React.useState(0);
    const [activeEventId, setActiveEventId] = React.useState(0);
    const [roleName, setRoleName] = React.useState('');
    const [disableButtons, setDisableButtons] = React.useState(false);
    const [errorText, setErrorText] = React.useState('');
    const [eventName, setEventName] = React.useState('');

    const renderedCards = new Array<JSX.Element> 


    {/*Handles when a slot button is clicked*/}
    const customRoleHandler = (slotIndexAndRoleName : string) : void => {
       
        var split = slotIndexAndRoleName.split('_')


        setErrorText('');
        setActiveSlot(parseInt(split[0]));
        setRoleName(split[1])
        setActiveEventId(parseInt(split[2]));
        setEventName(split[3])
                        
        setConfirmationModalOpen(true)
       
        
    }



  
    if (cardsFromDb.length == 0 || eventSlots.length == 0){
        return (
            <>
            <p>Loading Events...</p>
            </>
        )
    }
    else{
        let fixIncrement = 0;
        

        var eventSlotCopy = eventSlots
        for (var cardIndex = 0; cardIndex < cardsFromDb.length; cardIndex++){

            {/*Query needs to filter the date and time from events, events from different states also shouldn't be shown*/}
           
            
            const renderedSlots = new Array<JSX.Element>

            for (let eventSlotCounter = 0; eventSlotCounter < cardsFromDb[cardIndex].VolunteerLimit; eventSlotCounter++) 
            {
                
                    /*This is for empty slots */
                    if (eventSlotCopy[0][eventSlotCounter].VolunteerId == 'NULL')
                    {
                        renderedSlots.push(
                            <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black', backgroundColor:'#fa534d'}}>
                                <Typography>Slot Taken</Typography>
                            </Box>)
                    }
                    /*Slots taken by the user already*/
                    else if (eventSlotCopy[0][eventSlotCounter].VolunteerId == volunteerId){
                        renderedSlots.push(
                            <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black', backgroundColor:'#58cc00'}}>
                                <Typography>Registered for this slot ({eventSlotCopy[0][eventSlotCounter].RoleName})</Typography>
                            </Box>)
                    }
                    /*Open slots*/ 
                    else{
                        renderedSlots.push(
                        <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black'}}>
                            
                            <Button fullWidth disabled={disableButtons}  id={eventSlotCopy[0][eventSlotCounter].Id+'_'+eventSlotCopy[0][eventSlotCounter].RoleName+'_'+cardsFromDb[cardIndex].EventId+'_'+cardsFromDb[cardIndex].EventName}  onClick={(e) => customRoleHandler((e.target as HTMLInputElement).id)}>Open Role: {eventSlotCopy[0][eventSlotCounter].RoleName}</Button>
                        </Box>)
                    }
                    

            }

            eventSlotCopy = eventSlotCopy.slice(cardsFromDb[cardIndex].VolunteerLimit)

            fixIncrement = 1
    
                renderedCards.push(
                <Card sx={{marginBottom:'20px'}}>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="recipe">
                                {cardsFromDb[cardIndex].OrgName.charAt(0)}
                            </Avatar>
                    }
                    title={cardsFromDb[cardIndex].EventName}
                    subheader={cardsFromDb[cardIndex].OrgName}
                    />
                    <CardContent sx={{borderTop: '1px solid black'}}>
                        <Typography variant="body2" color="text.secondary">
                                Address: {cardsFromDb[cardIndex].Address}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                                Date: {dayjs(cardsFromDb[cardIndex].Date).format('MM/DD/YYYY')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Start Time: {dayjs('1/1/1 ' + cardsFromDb[cardIndex].StartTime).format('hh:mm a')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            End Time: {dayjs('1/1/1 ' + cardsFromDb[cardIndex].EndTime).format('hh:mm a')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Event Description: {cardsFromDb[cardIndex].Description}
                        </Typography>
                    </CardContent>
                    {renderedSlots}
                    
    
    
    
    
                </Card>
    
            )
        }
           
       

       return(
            <>
                <VolunteerNavBar/>
                {renderedCards}
                <Modal
                        open={confirmationModalOpen}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        
                    >
                        <Box sx={modalStyle}>
                            {errorText == '1' && 
                                
                                <Alert severity="error">
                                    <AlertTitle>Slot was taken.</AlertTitle>
                                </Alert>
                            }
                            {errorText== '2' && 
                                
                                <Alert severity='success'>
                                    <AlertTitle>You registered for this slot. Refreshing the page.</AlertTitle>
                                </Alert>
                            }
                            {errorText == '3' && 
                                
                                <Alert severity='error'>
                                    <AlertTitle>You have already signed up for this event.</AlertTitle>
                                </Alert>
                            }
                            {errorText == '0' && 
                                
                                <Alert severity='error'>
                                    <AlertTitle>Error has occured. Please try again.</AlertTitle>
                                </Alert>
                            }
                            {errorText == 'Successfully signed up for the event.' && 
                                
                                <Alert severity='success'>
                                    <AlertTitle>Successfully signed up for the event. Reloading.</AlertTitle>
                                </Alert>
                            }
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Registering for event: 
                                <p>{eventName}</p>
                            </Typography>
                            <Typography id="modal-modal-title" variant="h6">
                                Role Name: 
                                <p>{roleName}</p>
                            </Typography>
                            <Typography id="modal-modal-title" variant="h6">
                                By registering for this event, you must adhere to the rules and guidelines set out by the organizing party.
                            </Typography>
                            <Button disabled={disableButtons} onClick={() => setConfirmationModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button disabled={disableButtons} onClick={eventSignUp}>
                                Confirm
                            </Button>
                        </Box>
                </Modal>
                
            </>

        )

    }

}

