import React, { useEffect } from "react";
import OrgNavBar from "./OrgNavbar";
import dayjs, { Dayjs } from "dayjs";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import { DatePicker, LocalizationProvider, StaticTimePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Textarea from "@mui/joy/Textarea";
import FormLabel from "@mui/material/FormLabel";
import { FormControl } from "@mui/joy";
import Button from "@mui/material/Button";


export default function OrgCreateEvent() : JSX.Element {
    //Required fields
    const [eventName, setEventName] = React.useState('')
    const [date, setDate] = React.useState<Dayjs | null>(dayjs(new Date()));
    const [startTime, setStartTime] = React.useState<Dayjs | null>(dayjs(new Date()).add(1, 'hour'))
    const [endTime, setEndTime] = React.useState<Dayjs | null>(dayjs(new Date()).add(2, 'hour'))
    const [volunteerLimit, setVolunteerLimit] = React.useState(1)
    const [description, setDescription] = React.useState('')

    //Set an alternative address or email (option fields)
    const [address, setAddress] = React.useState('');
    const [email, setEmail] = React.useState('');
    const maxVolunteers = 15;


    const [optionalRoleInfo, setOptionalRoleInfo] = React.useState<any[]>([null]);


    const [renderedContent, setRenderedContent] = React.useState<JSX.Element>(<></>);

    

    useEffect(() =>  {



        let tempElements = [];
        let tempValues = [];
        for (let i = 0; i < volunteerLimit; i++){
            tempElements.push(<><TextField defaultValue={null} label={'Slot ' +  (i+1) +  ' Role Name (Optional)'} sx={{paddingBottom: '4px', minWidth:250}} onChange={
                (event) => {
                    var temp = optionalRoleInfo
                    temp[i] = event.target.value
                    setOptionalRoleInfo(temp)

                }

            }></TextField><br></br></>)
            if (optionalRoleInfo.length >= i+1)
            {
                tempValues.push(optionalRoleInfo[i])
            }
            else{
                tempValues.push(null)
            }
        }
        
        //Only really used to prevent constant rendering
        if (JSON.stringify(tempValues) != JSON.stringify(optionalRoleInfo))
        {
            setOptionalRoleInfo(tempValues)
        }
        


       setRenderedContent(<>
        <OrgNavBar/>
        <Card sx={{marginBottom:'20px'}}>
                <CardHeader title={"Create Event"} sx={{borderBottom:'1px solid grey'}}/>
                <CardHeader title={"General Info"} sx={{borderBottom: '1px solid grey'}}/>
                <CardContent>
                    <TextField defaultValue={eventName} onChange={(event) => setEventName(event.target.value)} label="Event Name" sx={{paddingBottom: '8px', minWidth:250}}></TextField>
                    <br></br>
                    <LocalizationProvider localeText={{timePickerToolbarTitle: 'Enter Event Start Time'}} dateAdapter={AdapterDayjs} >
                        <DatePicker defaultValue={date} onChange={(event) => setDate(event)} label="Event Date" sx={{paddingBottom: '8px' , minWidth:250}}></DatePicker>
                        <br></br>
                        <FormControl>
                            <FormLabel> Event Description</FormLabel>
                            <Textarea placeholder="Enter the event description here..."  onChange={(event) => {setDescription(event.target.value as string)}}/>
                        </FormControl>
                        <br></br>
                        <StaticTimePicker defaultValue={startTime} onChange={(event) => setStartTime(event)}  sx={{paddingBottom: '8px'}} slotProps={{actionBar:{actions:[]}}}/>
                        <br></br>
                    </LocalizationProvider>
                    <LocalizationProvider localeText={{timePickerToolbarTitle: 'Enter Event End Time'}} dateAdapter={AdapterDayjs}>
                        <StaticTimePicker defaultValue={endTime} onChange={(event) => setEndTime(event)}  sx={{paddingBottom: '8px'}} slotProps={{actionBar:{actions:[]}}}/>
                        <br></br>
                    </LocalizationProvider>
                </CardContent>
                <CardHeader title={"Volunteer Slots"} sx={{borderTop: '1px solid grey'}}/>
                <CardContent sx={{borderTop: '1px solid grey'}}>
                    <Select defaultValue={volunteerLimit} value={volunteerLimit} sx={{marginBottom:'10px'}} onChange={(event) => setVolunteerLimit(event.target.value as number)}>
                        
                        {(() => {
                            const renderedDropDownElements = [];
                            for (let i = 1; i < maxVolunteers+1; i++){
                                renderedDropDownElements.push(<MenuItem value={i} >{i}</MenuItem>)
                            }
                            return renderedDropDownElements
                        })()}
                    </Select>

                    <br></br>
                    {tempElements}
                </CardContent>
                <CardContent sx={{borderTop: '1px solid grey'}}>

                    <Button>Create Event</Button>
                </CardContent>
            </Card>
        </>)

    }, [volunteerLimit, optionalRoleInfo])


   
    return (renderedContent)

}