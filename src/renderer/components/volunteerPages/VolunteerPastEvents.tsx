import React, { useEffect } from "react";
import connectionString from "../../../../config";
import axios from "axios";
import VolunteerNavBar from "./VolunteerNavbar";
import CardHeader from "@mui/material/CardHeader";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { render } from "react-dom";
import Box from "@mui/material/Box";




export default function VolunteerPastEvents() : JSX.Element {

    const [cardsFromDb,setCardsFromDb] = React.useState<any[]>([])
    const [renderedCards, setRenderedCards] = React.useState<any[]>([])

    const [loading, setLoading] = React.useState(0)

    const getPastEvents = async () => {

        var connectionStringWithParams = connectionString + "/getPastEvents/" + sessionStorage.getItem("Id") + '/' + 'placeholdervalue'
        await axios.get(connectionStringWithParams).then(function (response){

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
                
        })
        .catch(function (error){
            
        }); 
    }

    useEffect (() => {
        var tempArray = []
        for (var cardIndex = 0; cardIndex < cardsFromDb.length; cardIndex++)
        {
            tempArray.push(
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
                            Start Time: {dayjs('1/1/1 ' + cardsFromDb[cardIndex].StartTime).format('h:mm A')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            End Time: {dayjs('1/1/1 ' + cardsFromDb[cardIndex].EndTime).format('h:mm A')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Event Description: {cardsFromDb[cardIndex].Description}
                        </Typography>
                    </CardContent>
    
                    <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black'}}>
                        <Typography>Past role: {cardsFromDb[cardIndex].RoleName}</Typography>
                    </Box>
                    
    
    
    
    
                </Card>
            )        
        }
    
        setRenderedCards(tempArray)
    }, [cardsFromDb])


    if (loading == 0){
        setLoading(1)
        getPastEvents()
       
        return(
            <>
            <p>Loading Past Events...</p>
            </>
        )
    }
    else{
        return (
            <>
                <VolunteerNavBar/>
                {renderedCards}
            </>
        )
    }
    

}