import React, { useEffect } from "react"
import Avatar from "@mui/material/Avatar"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { Alert, AlertTitle, Box, Button, Modal } from "@mui/material"
import VolunteerNavBar from "./VolunteerNavbar"
import dayjs from "dayjs"
import connectionString from '../../../../config';
import axios from 'axios';


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




export default function VolunteerCollegeEvents() : JSX.Element {
 

    const [cardsFromDb,setCardsFromDb] = React.useState<any[]>([])
    const [eventSlots,setEventSlots] = React.useState<any[]>([])
    const volunteerId = sessionStorage.getItem('Id');

    

    {/*Event Retrieval*/}

    const getEvents = async () => {
        var state = sessionStorage.getItem("state")
        var tempArray = new Array()
        setErrorText('')

        var tempText = '';
        await axios.get(connectionString + "/getEvents/", {
            params:{
                state: state,
                username: sessionStorage.getItem("username"),
                token: sessionStorage.getItem("token"),
                loginType: sessionStorage.getItem("loginType")
            }
        }).then(function (response){
            if (response.data.length != 0){
                    const sorted = response.data.sort((objA : any,objB:any)=>{
                    const dateA = new Date(`${objA.Date}`).valueOf();
                    const dateB = new Date(`${objB.Date}`).valueOf();
                    if(dateA > dateB){
                      return 1
                    }
                    return -1
                });
                setCardsFromDb(sorted.filter((item: { CollegeEvent: number }) => item.CollegeEvent == 1))
                tempArray.push(sorted.filter((item: { CollegeEvent: number }) => item.CollegeEvent == 1)) 
            }
            else
            {
                
                setErrorText("No college events found.")
            }
            })
        .catch(function (error){
            tempText = "error";
            if (error.response == undefined){
                setErrorText("Network error connecting to the API, please try again.")
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

        if (tempArray[0] == undefined)
        {
            return
        }
        
        for (var i = 0; i < tempArray[0].length; i++){
            var eventId = tempArray[0][i].EventId

    
            await axios.get(connectionString + "/getEventSlots/", {
                params:{
                    eventId: eventId,
                    username: sessionStorage.getItem("username"),
                    token: sessionStorage.getItem("token"),
                    loginType: sessionStorage.getItem("loginType")
                }
            }).then(function (response) {
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
            });     

        }
        setEventSlots(holdSlots);

       
    

    }

  
    const eventSignUp = async() => {
        /* Disable buttons */
        setDisableButtons(true);

        var getValue = '0'


        await axios.post(connectionString + "/eventSignUp/", null, {
            params:{
                activeSlot: activeSlot,
                activeEventId: activeEventId,
                volunteerId: sessionStorage.getItem('Id'),
                username: sessionStorage.getItem('username'),
                token: sessionStorage.getItem('token'),
                loginType: sessionStorage.getItem("loginType")
            }
        }).then(function (response) {
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
            }
            else{
                setCardsFromDb(response.data)
            }
            setSuccessfulText('Successful sign up!')
            getValue = 'Successfully signed up for the event.'
        }).catch(function (error){
            if (error.response == undefined){
                setErrorText("Network error connecting to the API, please try again.")
            }
            else
            {
                setErrorText(error.response.data)
            }
            
        });   

        

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
    
    const eventWithdrawal = async() => {

        setDisableButtons(true);
        var getValue;
        
        await axios.post(connectionString + "/withdrawFromEvents/", null,{params:{
            activeSlotId: activeSlot,
            username: sessionStorage.getItem('username'),
            token: sessionStorage.getItem('token'),
            loginType: sessionStorage.getItem('loginType')
        }}).then(function (response) {
                getValue = response.data
        }).catch(function (error){
            if (error.response == undefined){
                setErrorText("Network error connecting to the API, please try again.")
            }
            else
            {
                setErrorText(error.response.data)
            }
            
        });  

        if (getValue == 'Withdraw successful.'){
            setWithdrawalModalText('Successfully withdrew from event. Refreshing...')
            setTimeout(() => {
                window.location.reload();
            }, 3000)

        }
        else{
            setWithdrawalModalText('Error occurred. Please try again.')
            setDisableButtons(false)
        }
        

    }

    const [confirmationModalOpen, setConfirmationModalOpen] = React.useState(false);
    const [withdrawModalOpen, setWithdrawModalOpen] = React.useState(false);
    const [activeSlot, setActiveSlot] = React.useState(0);
    const [activeEventId, setActiveEventId] = React.useState(0);
    const [roleName, setRoleName] = React.useState('');
    const [disableButtons, setDisableButtons] = React.useState(false);

    const [errorText, setErrorText] = React.useState('');
    const [withdrawalModalText, setWithdrawalModalText] = React.useState('');
    const [eventName, setEventName] = React.useState('');
    const [loading, setLoading] = React.useState(0)
    const [renderedCards, setRenderedCards] = React.useState<any[]>([])
    const [successfulText, setSuccessfulText] = React.useState('');
    

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

    const customWithdrawHandler = (slotIndexAndEventName : string) : void => {
       
        var split = slotIndexAndEventName.split('_')


        setWithdrawalModalText('');
        setActiveSlot(parseInt(split[0]));
        setEventName(split[1])

        setWithdrawModalOpen(true)
        
    }

    useEffect (() => {
        var eventSlotCopy = eventSlots
        var tempArray = []
        setErrorText("")
        

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
                                <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black'}}>
                                    
                                    <Button fullWidth disabled={disableButtons}  id={eventSlotCopy[eventSlotCounter].Id+'_'+eventSlotCopy[eventSlotCounter].RoleName+'_'+cardsFromDb[cardIndex].EventId+'_'+cardsFromDb[cardIndex].EventName}  onClick={(e) => customRoleHandler((e.target as HTMLInputElement).id)}>Open Slot</Button>
                                </Box>)
                        }
                        else
                        {
                            renderedSlots.push(
                                <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black'}}>
                                    
                                    <Button fullWidth disabled={disableButtons}  id={eventSlotCopy[eventSlotCounter].Id+'_'+eventSlotCopy[eventSlotCounter].RoleName+'_'+cardsFromDb[cardIndex].EventId+'_'+cardsFromDb[cardIndex].EventName}  onClick={(e) => customRoleHandler((e.target as HTMLInputElement).id)}>Open Role: {eventSlotCopy[eventSlotCounter].RoleName}</Button>
                                </Box>)
                        }
                    }
                    /*Slots taken by the user already*/
                    else if (eventSlotCopy[eventSlotCounter].VolunteerId == volunteerId){
                        renderedSlots.push(
                            <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black', backgroundColor:'#58cc00'}}>
                                <Button fullWidth disabled={disableButtons}  id={eventSlotCopy[eventSlotCounter].Id+'_'+cardsFromDb[cardIndex].EventName}  onClick={(e) => customWithdrawHandler((e.target as HTMLInputElement).id)}>Registered for this slot: {eventSlotCopy[eventSlotCounter].RoleName}</Button>
                            </Box>)
                    }
                    /*Closed slots*/ 
                    else{
                        renderedSlots.push(
                            <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black', backgroundColor:'#fa534d'}}>
                                <Typography>Slot Taken</Typography>
                            </Box>)
                    }
                    

            }

            eventSlotCopy = eventSlotCopy.slice(cardsFromDb[cardIndex].VolunteerLimit)

            var connString = connectionString + "/getProfilePicture/?username=" + cardsFromDb[cardIndex].Username +  "&" + "loginType=Organization"
           
            tempArray.push(
                <Card sx={{marginBottom:'20px'}}>

                    
                    {cardsFromDb[cardIndex].ProfilePicture != null && 
                    <>
                            <CardHeader
                            avatar={
                                <Avatar src={connString}>
                                    {cardsFromDb[cardIndex].OrgName.charAt(0)}
                                </Avatar>
                            }
                            title={cardsFromDb[cardIndex].EventName}
                            subheader={cardsFromDb[cardIndex].OrgName}
                            />
                            </>
                    }
                    {cardsFromDb[cardIndex].ProfilePicture == null &&
                        <CardHeader
                        avatar={
                            <Avatar aria-label="recipe">
                                {cardsFromDb[cardIndex].OrgName.charAt(0)}
                            </Avatar>
                        }
                        title={cardsFromDb[cardIndex].EventName}
                        subheader={cardsFromDb[cardIndex].OrgName}
                        />
                    }
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
                            Phone Number: {cardsFromDb[cardIndex].PhoneNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Email: {cardsFromDb[cardIndex].Email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Event Description: {cardsFromDb[cardIndex].Description}
                        </Typography>
                        {cardsFromDb[cardIndex].Club != null &&
                            <Typography variant="body2" color="text.secondary" style={{textDecoration:'underline'}}>
                                Club: {cardsFromDb[cardIndex].Club}
                            </Typography>
                        }
                    </CardContent>
                    {renderedSlots}
                    
    
    
    
    
                </Card>
    
            )
            
        }

        if (cardsFromDb.length != 0)
        {
            setRenderedCards(tempArray)
        }


     

    }, [eventSlots]) 

    
  
    if (loading == 0){
        setLoading(1)
        getEvents()
        return (
            <Alert severity="warning">
                <AlertTitle>Fetching data from API...</AlertTitle>
            </Alert>
            
        )
    }
    else{
       return(
            <>
                <VolunteerNavBar pageName="College Events"/>
                {renderedCards}
                {renderedCards.length == 0 && errorText == '' && 
                    <Alert severity="warning">
                      <AlertTitle>Fetching data from API...</AlertTitle>
                  </Alert>

                }

                { errorText != '' && 
                    <Alert severity="error">
                      <AlertTitle>{errorText}</AlertTitle>
                  </Alert>

                }
                {/*This is the confirmation modal. */}
                <Modal
                        open={confirmationModalOpen}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        
                    >
                        <Box sx={modalStyle}>
                            {errorText != '' && 
                                
                                <Alert severity="error">
                                    <AlertTitle>{errorText}</AlertTitle>
                                </Alert>
                            }
                            {successfulText != '' && 
                                
                                <Alert severity='success'>
                                    <AlertTitle>Successfully signed up for the event. Reloading.</AlertTitle>
                                </Alert>
                            }
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Registering for event: {eventName}
                            </Typography>
                            {roleName != 'null' &&
                                <Typography id="modal-modal-title" variant="h6">
                                    Role Name: {roleName}
                                </Typography>
                            }
                            <Typography id="modal-modal-title" variant="h6" sx={{color:'red'}}>
                                By registering for this event, you must adhere to the rules and guidelines set out by the organizing party.
                            </Typography>
                            <Button disabled={disableButtons} onClick={() => setConfirmationModalOpen(false)} variant="outlined" sx={{marginRight:'5px'}}>
                                Cancel
                            </Button>
                            <Button disabled={disableButtons} onClick={eventSignUp} variant="contained">
                                Confirm
                            </Button>
                        </Box>
                </Modal>

                {/*This is the withdrawal modal. */}
                <Modal
                        open={withdrawModalOpen}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        
                    >
                        <Box sx={modalStyle}>
                            {withdrawalModalText != '' && 
                                
                                <Alert severity='success'>
                                    <AlertTitle>Successfully withdrew from the event. Refreshing...</AlertTitle>
                                </Alert>
                            }
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Do you want to withdraw this event? 
                                <p>{eventName}</p>
                            </Typography>
                            <Button disabled={disableButtons} onClick={() => setWithdrawModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button disabled={disableButtons} onClick={eventWithdrawal}>
                                Confirm
                            </Button>
                        </Box>
                </Modal>
                
            </>

        )

    }

}

