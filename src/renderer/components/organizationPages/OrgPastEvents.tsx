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
import { Alert, AlertTitle } from "@mui/material";





export default function OrgPastEvents() : JSX.Element {

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
                setCardsFromDb(response.data)
                tempArray.push(response.data) 
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

        for (var i = 0; i < tempArray[0].length; i++){
            var eventId = tempArray[0][i].EventId

           
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
                
                        if (eventSlotCopy[eventSlotCounter].VolunteerId == null){
                            renderedSlots.push(
                                <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black'}}>
                                    <Typography>Role was not signed up for.</Typography>
                                </Box>)
                        }
                        else{
                            renderedSlots.push(
                                <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black', backgroundColor:'#fa534d'}}>
                                    <Typography>Fufilled by: {eventSlotCopy[eventSlotCounter].FirstName} {eventSlotCopy[eventSlotCounter].LastName}</Typography>
                                </Box>)
                        }
                        
                    
                    

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