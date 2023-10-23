import React, { useEffect } from "react"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import {Alert, AlertTitle, Box, Button, IconButton } from "@mui/material"
import OrgNavBar from "./OrgNavbar"
import dayjs from "dayjs"
import connectionString from "../../../../config"
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';

/*
    This is meant to be the main event feed. Where all current events are displayed.

*/

export default function OrgEvents() : JSX.Element {

    const [cardsFromDb,setCardsFromDb] = React.useState<any[]>([])
    const [eventSlots,setEventSlots] = React.useState<any[]>([])
    const orgId = sessionStorage.getItem('orgId');

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
            token: sessionStorage.getItem('token')
        }}).then(function (response){
                setCardsFromDb(response.data)
                tempArray.push(response.data) 
        })
        .catch(function (error){
            setErrorText(error.response.data)
            tempText = error.response.data
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
                setErrorText(error.response.data)
                return
            });     

        }
        setEventSlots(holdSlots);
        
       
    

    }

  


   
  

   

    const [errorText, setErrorText] = React.useState('');

    const [loading, setLoading] = React.useState(0)
    const [renderedCards, setRenderedCards] = React.useState<any[]>([])

    

  
    

    useEffect (() => {
        var eventSlotCopy = eventSlots
        var tempArray = []


        for (var cardIndex = 0; cardIndex < cardsFromDb.length; cardIndex++){

            var renderedSlots = new Array<JSX.Element>
            {/*Query needs to filter the date and time from events, events from different states also shouldn't be shown*/}
        
            
            

            for (let eventSlotCounter = 0; eventSlotCounter < cardsFromDb[cardIndex].VolunteerLimit; eventSlotCounter++) 
            {
                
                    /*Empty slots*/
                    if (eventSlotCopy[eventSlotCounter].VolunteerId == null)
                    {
                        renderedSlots.push(
                            <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black'}}>
                                
                                <Button fullWidth>Open Role: {eventSlotCopy[eventSlotCounter].RoleName}</Button>
                            </Box>)
                        
                    }
                    /*Closed slots*/ 
                    else{
                        renderedSlots.push(
                            <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black', backgroundColor:'#fa534d'}}>
                                <Typography>Taken by: {eventSlotCopy[eventSlotCounter].FirstName} {eventSlotCopy[eventSlotCounter].LastName}</Typography>
                            </Box>)
                    }
                    

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
                {renderedCards}
                {errorText != '' && 
                    
                    <Alert severity="error">
                        <AlertTitle>{errorText}</AlertTitle>
                    </Alert>
                }
            </>

        )

    }

}

