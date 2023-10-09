import React from "react";
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
    const renderedCards = new Array<JSX.Element> 
    const [loading, setLoading] = React.useState(0)

    var state = sessionStorage.getItem("state")

    const getPastEvents = async () => {

        var connectionStringWithParams = connectionString + "/getPastEvents/" + sessionStorage.getItem("Id") + '/' + 'placeholdervalue'
        await axios.get(connectionStringWithParams).then(function (response){
                setCardsFromDb(response.data)
        })
        .catch(function (error){
            
        }); 
        setLoading(2)
    }

    if (loading == 0){
        getPastEvents()
        setLoading(1)
        return(
            <>
            <p>Loading Past Events...</p>
            </>
        )
    }
    else if (loading == 1){
        return(
            <>
            <p>Loading Past Events...</p>
            </>
        )
    }
    else{
        for (var cardIndex = 0; cardIndex < cardsFromDb.length; cardIndex++)
    {
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

                <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black'}}>
                    <Typography>Past role: {cardsFromDb[cardIndex].RoleName}</Typography>
                </Box>
                




            </Card>
        )

    }

        return (
            <>
                <VolunteerNavBar/>
                {renderedCards}
            </>
        )
    }
    

}