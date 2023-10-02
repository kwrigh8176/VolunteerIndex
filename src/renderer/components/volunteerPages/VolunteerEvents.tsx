import React from "react"
import Avatar from "@mui/material/Avatar"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import { render } from "react-dom"
import List from "@mui/material/List"



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
        State:'MD'
    },

]

export default function VolunteerEvents() : JSX.Element[] {
    const renderedCards = new Array<JSX.Element> 

    for (let cardIndex = 0; cardIndex < cardsFromDb.length; cardIndex++){
            renderedCards.push(
            <Card sx={{maxWidth: 345}}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="recipe">
                            R
                        </Avatar>
                }
                title={cardsFromDb[cardIndex].EventName}
                subheader={cardsFromDb[cardIndex].OrgName}
                />




            {/*QUERY THE VOLUNTEER SLOTS HERE */}

            </Card>
        )


    } 

    return renderedCards

}