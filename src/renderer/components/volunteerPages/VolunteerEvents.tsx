import React from "react"
import Avatar from "@mui/material/Avatar"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import { render } from "react-dom"
import List from "@mui/material/List"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { Box, Button, CardActionArea, CardActions, Modal } from "@mui/material"

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
  };

const cardsFromDb = [
    {
        EventName: 'Charity Event',
        Address: '1045 Throwaway Lane',
        Date: '10/29/2023',
        Email: 'blahaow2w@gmail.com',
        PhoneNumber: '4106600252',
        StartTime: '6:00 PM',
        EndTime: '12:00 PM',
        VolunteerLimit: '4',
        OrgId: '3',
        OrgName: 'Kyle\'s Fake Organization',
        State:'MD',
        Description: 'Charity Event, need as much help as possible.'
    }
    

]

const slots = [
    {
        Id: '1',
        VolunteerId: '1',
        VolunteerName: 'Jessica',
        RoleName: 'Stocker'
    },
    {
        Id: '2',
        VolunteerId: 'NULL',
        RoleName: 'Stocker'
    },
    {
        Id: '3',
        VolunteerId: 'NULL',
        RoleName: 'Stocker'
    },
    {
        Id: '4',
        VolunteerId: 'NULL',
        RoleName: 'Stocker'
    },

]




export default function VolunteerEvents() : JSX.Element[] {

    const [confirmationModalOpen, setConfirmationModalOpen] = React.useState(false);
    const [activeSlot, setActiveSlot] = React.useState(-1);


    const renderedCards = new Array<JSX.Element> 
    
    {/*Handles when a slot button is clicked*/}
    const customRoleHandler = (slotIndex : number) : void => {
        setConfirmationModalOpen(true)
        setActiveSlot(slotIndex);

    }

    {/*Appears when a open role is clicked. */}
    const confirmationModal = () : JSX.Element => {
        return (
            <>
                <Modal
                    open={confirmationModalOpen}
                    onClose={() => setConfirmationModalOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalStyle}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Register for this event?
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


    for (let cardIndex = 0; cardIndex < cardsFromDb.length; cardIndex++){

        {/*Query needs to filter the date and time from events, events from different states also shouldn't be shown*/}
        
        const renderedSlots = new Array<JSX.Element>
        
        for (let slotIndex = 0; slotIndex < slots.length; slotIndex++){
            
                if (slots[slotIndex].VolunteerId == 'NULL')
                {
                    renderedSlots.push(
                        <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid gray', backgroundColor:'#fa534d'}}>
                            <Typography>Slot Taken</Typography>
                        </Box>)
                }
                else{
                    renderedSlots.push(
                    <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid gray'}}>
                        <Button fullWidth onClick={() => customRoleHandler(slotIndex)}>Open Role: {slots[slotIndex].RoleName}</Button>
                    </Box>)
                }
                {/*QUERY THE VOLUNTEER SLOTS HERE */}
        }

            renderedCards.push(
            <Card sx={{maxWidth: 345}}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="recipe">
                            {cardsFromDb[cardIndex].OrgName.charAt(0)}
                        </Avatar>
                }
                title={cardsFromDb[cardIndex].EventName}
                subheader={cardsFromDb[cardIndex].OrgName}
                />
                <CardContent sx={{borderTop: '1px solid gray'}}>
                    <Typography variant="body2" color="text.secondary">
                        {cardsFromDb[cardIndex].Description}
                    </Typography>
                </CardContent>
                {renderedSlots}
                




            </Card>
        )

        renderedCards.push(confirmationModal())    
    } 

    return renderedCards

}