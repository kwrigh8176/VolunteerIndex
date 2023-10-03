import React, { useEffect } from "react"
import Avatar from "@mui/material/Avatar"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import { render } from "react-dom"
import List from "@mui/material/List"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { Box, Button, CardActionArea, CardActions, Modal } from "@mui/material"
import VolunteerNavBar from "./VolunteerNavbar"
import db_config from "../../../globals"
import dayjs from "dayjs"

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
  };




export default function VolunteerEvents() : JSX.Element {

    const [cardsFromDb,setCardsFromDb] = React.useState<any[]>([])
    const [eventSlots,setEventSlots] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(0)

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

    const [confirmationModalOpen, setConfirmationModalOpen] = React.useState(false);
    const [activeSlot, setActiveSlot] = React.useState(0);
    const [activeEventId, setActiveEventId] = React.useState(0);
    const [roleName, setRoleName] = React.useState('');

    const renderedCards = new Array<JSX.Element> 

 
    
    {/*Handles when a slot button is clicked*/}
    const customRoleHandler = (slotIndex : number, eventId : number, getRoleName : string) : void => {
        setActiveSlot(slotIndex);
        setActiveEventId(eventId);
        setRoleName(getRoleName)
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

            for (let eventSlotCounter = 0; eventSlotCounter < cardsFromDb[cardIndex].VolunteerLimit; eventSlotCounter++){
                
                    
                    if (eventSlotCopy[eventSlotCounter].VolunteerId == 'NULL')
                    {
                        renderedSlots.push(
                            <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black', backgroundColor:'#fa534d'}}>
                                <Typography>Slot Taken</Typography>
                            </Box>)
                    }
                    else{
                        renderedSlots.push(
                        <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black'}}>
                            <Button fullWidth id={eventSlotCopy[eventSlotCounter].Id} className={eventSlotCopy[eventSlotCounter].RoleName} onClick={(e) => customRoleHandler(parseInt(e.currentTarget.dataset.id!), activeEventId,e.currentTarget.dataset.className!)}>Open Role: {eventSlotCopy[eventSlotCounter].RoleName}</Button>
                        </Box>)
                    }
                    {/*QUERY THE VOLUNTEER SLOTS HERE */}

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
                                Date: {cardsFromDb[cardIndex].Date}
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
                        onClose={() => setConfirmationModalOpen(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={modalStyle}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Registering for event: 
                                <p>{cardsFromDb[activeEventId].EventName}</p>
                            </Typography>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Role Name: 
                                <p>{roleName}</p>
                            </Typography>
                            <Button onClick={() => setConfirmationModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button>
                                Confirm
                            </Button>
                        </Box>
                </Modal>
                
            </>

        )

    }

}

