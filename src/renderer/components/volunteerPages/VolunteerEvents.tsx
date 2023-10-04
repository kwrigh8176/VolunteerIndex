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
import db_config from "../../../globals"
import dayjs from "dayjs"
import { useNavigate } from "react-router-dom"

/*
    This is meant to be the main event feed. Where all current events are displayed.

*/


const sql = require('mssql');

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
    
    {/*Event Retrieval*/}

    const getEvents = async () => {
        var currentDate = new Date();
        var currentTime = dayjs(currentDate).format('hh:mm:ss.0000000');

        var state = sessionStorage.getItem("State")

        {/*Get current events that are past the current date, in the current state, and check the time*/}
        await sql.connect(db_config)

        let request = new sql.Request()
        request.input('currentTime_parameter', sql.VarChar, currentTime)
        request.input('state_parameter', sql.VarChar, state)
        let result = await request.query("SELECT EventId,EventName,e.Address,[Date],StartTime,EndTime,VolunteerLimit,[Description],o.OrgName FROM [dbo].[Events] e JOIN Orgs o ON e.OrgId = o.OrgId WHERE CAST(StartTime AS Time) > CAST(@currentTime_parameter AS Time) AND o.State=@state_parameter")
        
        var tempArray: React.SetStateAction<any[]> = []
        if (result.recordset.length == 1){
            for (var eventIndex = 0; eventIndex < result.recordset.length; eventIndex++){
                tempArray.push(result.recordset[eventIndex])

            }
        }
        
        setCardsFromDb(tempArray)
        var tempCardsFromDb = tempArray

        tempArray = []
        for (var i = 0; i < tempCardsFromDb.length; i++)
        {
                {/*Get current events that are past the current date, in the current state, and check the time*/}
                await sql.connect(db_config)

                let request = new sql.Request()
                request.input('eventid_parameter', sql.Int, tempCardsFromDb[i].EventId)
                let results = await request.query("SELECT Id,VolunteerId, RoleName FROM VolunteersToEvents WHERE EventId=@eventid_parameter")
                for (let slotIndex = 0; slotIndex < results.recordset.length; slotIndex++){
                    tempArray.push(results.recordset[slotIndex])
                }
                
            
        }
        setEventSlots(tempArray)

    }

    const eventSignUp = async() => {
        /* Disable buttons */
        setDisableButtons(true);

        /*Query to see if the slot is open*/
        await sql.connect(db_config)

        let request = new sql.Request()
        request.input('slotid_parameter', sql.Int, activeSlot)
        let result = await request.query("SELECT * FROM VolunteersToEvents WHERE Id=@slotid_parameter")

        if (result.recordset[0].VolunteerId != null)
        {
            setErrorText('1')
            setTimeout(() => {
                window.location.reload();
            }, 3000)
            
        }

        /*Check to see if they signed up for other slots*/
        request = new sql.Request()
        request.input('eventid_parameter', sql.Int, activeEventId)
        request.input('volunteerid_parameter', sql.Int, volunteerId)
        result = await request.query("SELECT * FROM VolunteersToEvents WHERE EventId=@eventid_parameter AND VolunteerId=@volunteerid_parameter")

        if (result.recordset.length == 1)
        {
            {/*Already have signed up for this event.*/}
            setErrorText('3')
            setDisableButtons(false);
            
        }
        else{
            request = new sql.Request()
            request.input('volunteerid_parameter', sql.Int, volunteerId)
            request.input('id_parameter', sql.Int, activeSlot)
            result = await request.query("UPDATE VolunteersToEvents SET VolunteerId = @volunteerid_parameter WHERE Id = @id_parameter")
            setErrorText('2')
            setTimeout(() => {
                window.location.reload();
            }, 3000)
        }
        /*If so immediately update, if not display an error */

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



    if (loading==0){
        getEvents()
        setLoading(1)
        return (
            <>
            <p>Loading Events...</p>
            </>
        )
    }
    else if (cardsFromDb.length == 0 || eventSlots.length == 0){
        return (
            <>
            <p>Loading Events...</p>
            </>
        )
    }
    else{
        var fixIncrement = 0;
        

        var eventSlotCopy = eventSlots
        for (var cardIndex = 0; cardIndex < cardsFromDb.length; cardIndex++){

            {/*Query needs to filter the date and time from events, events from different states also shouldn't be shown*/}
           
            
            const renderedSlots = new Array<JSX.Element>

            for (let eventSlotCounter = 0; eventSlotCounter < cardsFromDb[cardIndex].VolunteerLimit; eventSlotCounter++) 
            {
                
                    /*This is for empty slots */
                    if (eventSlotCopy[eventSlotCounter].VolunteerId == 'NULL')
                    {
                        renderedSlots.push(
                            <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black', backgroundColor:'#fa534d'}}>
                                <Typography>Slot Taken</Typography>
                            </Box>)
                    }
                    /*Slots taken by the user already*/
                    else if (eventSlotCopy[eventSlotCounter].VolunteerId == volunteerId){
                        renderedSlots.push(
                            <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black', backgroundColor:'#58cc00'}}>
                                <Typography>Registered for this slot ({eventSlotCopy[eventSlotCounter].RoleName})</Typography>
                            </Box>)
                    }
                    /*Open slots*/ 
                    else{
                        renderedSlots.push(
                        <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black'}}>
                            
                            <Button fullWidth disabled={disableButtons}  id={eventSlotCopy[eventSlotCounter].Id+'_'+eventSlotCopy[eventSlotCounter].RoleName+'_'+cardsFromDb[cardIndex].EventId+'_'+cardsFromDb[cardIndex].EventName}  onClick={(e) => customRoleHandler((e.target as HTMLInputElement).id)}>Open Role: {eventSlotCopy[eventSlotCounter].RoleName}</Button>
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
                {renderedCards}
                <Modal
                        open={confirmationModalOpen}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        
                    >
                        <Box sx={modalStyle}>
                            {errorText.toString() == '1' && 
                                
                                <Alert severity="error">
                                    <AlertTitle>Slot was taken.</AlertTitle>
                                </Alert>
                            }
                            {errorText.toString() == '2' && 
                                
                                <Alert severity='success'>
                                    <AlertTitle>You registered for this slot.</AlertTitle>
                                </Alert>
                            }
                            {errorText.toString() == '3' && 
                                
                                <Alert severity='error'>
                                    <AlertTitle>You have already signed up for this event.</AlertTitle>
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

