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
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";




export default function VolunteerPastEvents() : JSX.Element {

    sessionStorage.setItem("currRoute", "/volunteerPastEvents")
    
    const [cardsFromDb,setCardsFromDb] = React.useState<any[]>([])
    const [renderedCards, setRenderedCards] = React.useState<any[]>([])
    const [errorText, setErrorText] = React.useState('');
    const [loading, setLoading] = React.useState(0)
    const [warningJSX, setWarningJSX] = React.useState(<></>)

    const getPastEvents = async () => {

        await axios.get(connectionString + "/getPastEvents/", {params:{
            volunteerId: sessionStorage.getItem("Id"),
            username: sessionStorage.getItem("username"),
            token: sessionStorage.getItem("token"),
            loginType: sessionStorage.getItem("loginType")
        }}).then(function (response){

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
                    setErrorText('Events not found.')
                }
                
        })
        .catch(function (error){
            if (error.response == undefined){
                setErrorText("Network error connecting to the API, please try again.")
            }
            else
            {
                setErrorText(error.response.data)
            }
        }); 
    }

    useEffect (() => {
        var tempArray = []

        setWarningJSX(<></>)
        
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
    
         
                        {cardsFromDb[cardIndex].VerifiedHours == 0 && cardsFromDb[cardIndex].NoShow == null &&
                          <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black',backgroundColor:'#f7ec6d'}}>
                            <Typography>Past role: {cardsFromDb[cardIndex].RoleName} (Not Verified)</Typography>
                          </Box>
                        }
                        {cardsFromDb[cardIndex].VerifiedHours == 1 && cardsFromDb[cardIndex].NoShow == null &&
                            <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black',backgroundColor:'#5bf74d'}}>
                            <Typography>Past role: {cardsFromDb[cardIndex].RoleName} (Verified)</Typography>
                            </Box>
                        }
                        {cardsFromDb[cardIndex].NoShow != null &&
                            <Box sx={{justifyContent:"center", display:'flex', borderTop: '1px solid black',backgroundColor:'#f74d4d'}}>
                                <Typography>Past role: {cardsFromDb[cardIndex].RoleName} (Marked as no show.)</Typography>
                            </Box>
                        }
                        
                  
                    
                    
    
    
    
                </Card>
            )        
        }
        if (cardsFromDb.length == 0){
            setWarningJSX(<Alert severity="warning">
            <AlertTitle>No past data found.</AlertTitle>
        </Alert>)
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
                {errorText != '' && 
                                
                    <Alert severity="error">
                        <AlertTitle>{errorText}</AlertTitle>
                    </Alert>
                }
                {warningJSX}
                {renderedCards}
            </>
        )
    }
    

}