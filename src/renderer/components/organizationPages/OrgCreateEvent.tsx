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
import connectionString from "../../../../config";
import axios from "axios";
import { start } from "repl";

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
    const [phoneNumber, setPhoneNumber] = React.useState('');

    const maxVolunteers = 15;



    const [optionalRoleInfo, setOptionalRoleInfo] = React.useState<any[]>([null]);


    const [renderedContent, setRenderedContent] = React.useState<JSX.Element>(<></>);

    const processEventCreation = async () => {

        //Need to do some validation here (event name, event description, event date is not less than current one)

        var getEvent, getAddress, getPhone;

        if (email == ''){
            getEvent = sessionStorage.getItem("email")
        }
        else{
            getEvent = email;
        }

        if (address == ''){
            getAddress = sessionStorage.getItem("address")
        }
        else{
            getAddress = address;
        }

        if (phoneNumber == ''){
            getPhone = sessionStorage.getItem("phoneNumber")
        }
        else{
            getPhone = phoneNumber
        }


        await axios.post(connectionString + `/organizationCreateEvent/`, null, { params: {
            eventName: eventName,
            date: date,
            startTime: dayjs(startTime).format('HH:mm:ss'),
            endTime: dayjs(endTime).format('HH:mm:ss'),
            description: description,
            volunteerLimit: volunteerLimit,
            address: getAddress,
            email: getEvent,
            orgId: sessionStorage.getItem("orgId"),
            phoneNumber: getPhone,
            optionalRoleInfo: JSON.stringify(optionalRoleInfo),
            username: sessionStorage.getItem("username"),
            token: sessionStorage.getItem("token"),

          }})
          .then(response => {
            console.log("Event created")
          })
          .catch(err => console.log(err));
    }

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
                <CardHeader title={"Optional Settings"} sx={{borderTop: '1px solid grey'}}/>
                <CardContent sx={{borderTop: '1px solid grey'}}>
                <TextField defaultValue={address} onChange={(event) => setAddress(event.target.value)} label="Alternate Address" sx={{paddingBottom: '8px', minWidth:250}}></TextField>
                <br></br>
                <TextField defaultValue={email} onChange={(event) => setEmail(event.target.value)} label="Alternate Email" sx={{paddingBottom: '8px', minWidth:250}}></TextField> 
                <br></br>
                <TextField defaultValue={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} label="Alternate Phone Number" sx={{paddingBottom: '8px', minWidth:250}}></TextField>     
                </CardContent>
                <CardContent sx={{borderTop: '1px solid grey'}}>

                    <Button onClick={processEventCreation}>Create Event</Button>
                </CardContent>
            </Card>
        </>)

    }, [volunteerLimit, optionalRoleInfo])


   
    return (renderedContent)

}