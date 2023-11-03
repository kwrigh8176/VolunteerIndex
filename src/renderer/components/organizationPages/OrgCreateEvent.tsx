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
import FormLabel from "@mui/material/FormLabel";
import { FormControl, Textarea} from "@mui/joy";
import Button from "@mui/material/Button";
import connectionString from "../../../../config";
import axios from "axios";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";



import validator from "validator";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import InputLabel from "@mui/material/InputLabel";




export default function OrgCreateEvent() : JSX.Element {

    const [confirmationModalOpen, setConfirmationModalOpen] = React.useState(false);

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


    //Required fields
    const [eventName, setEventName] = React.useState('')
    const [date, setDate] = React.useState<Dayjs | null>(dayjs(new Date()));
    const [startTime, setStartTime] = React.useState<Dayjs | null>(dayjs(new Date()).add(1, 'hour'))
    const [endTime, setEndTime] = React.useState<Dayjs | null>(dayjs(new Date()).add(2, 'hour'))
    const [volunteerLimit, setVolunteerLimit] = React.useState(1)
    const [description, setDescription] = React.useState("")

    //Set an alternative address or email (option fields)
    const [address, setAddress] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [collegeVisibility, setCollegeVisibility] = React.useState('Any')

    const maxVolunteers = 15;



    const [optionalRoleInfo, setOptionalRoleInfo] = React.useState<any[]>([null]);


    const [renderedContent, setRenderedContent] = React.useState<JSX.Element>(<></>);

    const [errorModal, setErrorModal] = React.useState<string>("");
    const [successModal, setSuccessModal]  = React.useState<string>("");
    
    const processEventCreation = async () => {

        //Need to do some validation here (event name, event description, event date is not less than current one)

        var getEmail = sessionStorage.getItem("email")
        var getAddress = sessionStorage.getItem("address")

        var getPhone = sessionStorage.getItem("phoneNumber")

        if (email != ''){
            getEmail = email;
        }
 

        if (address != ''){
            getAddress = address;
        }
   

        if (phoneNumber != ''){
            getPhone = phoneNumber
        }
 

        var errMsg = ''
        if (eventName == ''){
            errMsg += 'Event Name is empty. \n'
        }

        if (description == ''){
            errMsg += 'Description is empty. \n'
        }

        if (description == ''){
            errMsg += 'Description is empty. \n'
        }

        var currDate = new Date()

        if (dayjs(date?.format('MM/DD/YYYY 11:11:11')).isBefore(dayjs(dayjs(currDate).format('MM/DD/YYYY 11:11:11')))){
            errMsg += 'Date can\'t be before the current date. \n'

        }

        if (dayjs(date?.format('MM/DD/YYYY 11:11:11')).isSame(dayjs(dayjs(currDate).format('MM/DD/YYYY 11:11:11')))){
            if (dayjs(startTime?.format('[2001-01-01] HH:mm:ss')).isBefore(dayjs(currDate).format('[2001-01-01] HH:mm:ss'))){
                errMsg += 'Start time can\'t be before current time. \n'
            }

        }

        if (getPhone != null)
        {
            if (validator.isMobilePhone(getPhone) == false)
            {
                errMsg += 'Phone Number is not valid. \n'  
            }
        }
        
        if (getEmail != null)
        {
            if (validator.isEmail(getEmail) == false)
            {
                errMsg += 'Email is not valid. \n';
            }
            
        }

        if (dayjs('1/1/1 ' + startTime).isAfter(dayjs('1/1/1 '+ endTime)) ){
            errMsg += 'Start time is after end time. \n';
        }

        if (errMsg != ''){
            setErrorModal(errMsg)
            return
        }

        var getCollegeVisibility = 1;

        if (collegeVisibility == "Any")
            getCollegeVisibility = 0

        //check start time
        await axios.post(connectionString + `/organizationCreateEvent/`, null, { params: {
            eventName: eventName,
            date: date,
            startTime: dayjs(startTime).format('HH:mm:ss'),
            endTime: dayjs(endTime).format('HH:mm:ss'),
            description: description,
            volunteerLimit: volunteerLimit,
            address: getAddress,
            email: getEmail,
            orgId: sessionStorage.getItem("orgId"),
            phoneNumber: getPhone,
            optionalRoleInfo: JSON.stringify(optionalRoleInfo),
            username: sessionStorage.getItem("username"),
            token: sessionStorage.getItem("token"),
            loginType : sessionStorage.getItem("loginType"),
            CollegeEvent: getCollegeVisibility
          }})
          .then(response => {
            setSuccessModal("Success")
          })
          .catch(error => {
            if (error.response == undefined)
            {
                setErrorModal('Error connecting to the API. Please try again.')
            }
            else{
                setErrorModal(error.response.data)
            }
          });
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

            } inputProps={{maxLength:50}}></TextField><br></br></>)
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
        
        {tempElements}
            
        </>)

    }, [volunteerLimit, optionalRoleInfo])



   
    return (
    <>
        <OrgNavBar/>
        <Card sx={{marginBottom:'20px'}}>
                <CardHeader title={"Create Event"} sx={{borderBottom:'1px solid grey'}}/>
                <CardHeader title={"General Info"} sx={{borderBottom: '1px solid grey'}}/>
                <CardContent>
                    <TextField required defaultValue={eventName} onChange={(event) => setEventName(event.target.value)} label="Event Name" sx={{paddingBottom: '8px', minWidth:250}} inputProps={{maxLength:50}}></TextField>
                    <br></br>
                    <LocalizationProvider localeText={{timePickerToolbarTitle: 'Enter Event Start Time'}} dateAdapter={AdapterDayjs} >
                        <DatePicker defaultValue={date} onChange={(event) => setDate(event)} label="Event Date" sx={{paddingBottom: '8px' , minWidth:250}}></DatePicker>
                        <br></br>
                        <FormControl>
                            <FormLabel> Event Description</FormLabel>
                            <Textarea required placeholder="Enter the event description here..." onChange={(event) => {if (event.target.value.length <= 250) setDescription(event.target.value)}} value={description} ></Textarea>
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
                    {renderedContent}
                </CardContent>
                <CardHeader title={"Optional Settings"} sx={{borderTop: '1px solid grey'}}/>
                <CardContent sx={{borderTop: '1px solid grey'}}>
                <TextField defaultValue={address} onChange={(event) => setAddress(event.target.value)} label="Alternate Address" sx={{paddingBottom: '8px', minWidth:250}} inputProps={{maxLength:50}}></TextField>
                <br></br>
                <TextField defaultValue={email} onChange={(event) => setEmail(event.target.value)} label="Alternate Email" sx={{paddingBottom: '8px', minWidth:250}} inputProps={{maxLength:50}}></TextField> 
                <br></br>
                <TextField defaultValue={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} label="Alternate Phone Number" sx={{paddingBottom: '8px', minWidth:250}} inputProps={{maxLength:10}}></TextField>

                {sessionStorage.getItem("collegeOrgs") == "true" &&
                    <>
                        <br></br>
                        <InputLabel id="eventVisibility">Event Visibility</InputLabel>
                        <Select labelId="eventVisibility" defaultValue={"Any"} label="Event Visibility" sx={{marginBottom:'10px'}} onChange={(event) => setCollegeVisibility(event.target.value)}>
                            <MenuItem value={"Any"}>Any</MenuItem>
                            <MenuItem value={"College"}>College</MenuItem>
                        </Select>
                    </>
                }

                </CardContent>
                <CardContent sx={{borderTop: '1px solid grey'}}>
                    <Button onClick={() => {setConfirmationModalOpen(true)}}>Create Event</Button>
                </CardContent>
            </Card>


        <Modal open={confirmationModalOpen}>
            <Box sx={modalStyle}>

            {
                errorModal != "" && 

                <>
                    <Alert severity='error'>
                        <AlertTitle>{errorModal}</AlertTitle>
                    </Alert>
                </>
                
            }

            {
                successModal != "" && 

                <>
                    <Alert severity='success'>
                        <AlertTitle>Event successfully created!</AlertTitle>
                    </Alert>
                </>
                
            }

                <Typography>Are you sure you want to create this event?</Typography>
                <br></br>
                <Typography>Name: {eventName}</Typography>
                <br></br>
                <Typography>Date: {date?.format('MM/DD/YYYY')}</Typography>
                <br></br>
                <Typography>Start Time: {startTime?.format('hh:mm:ss a')}</Typography>
                <br></br>
                <Typography>End Time: {endTime?.format('hh:mm:ss a')}</Typography>
                <br></br>
                <Typography>Description: {description}</Typography>
                <br></br>
                <Typography>Volunteer Slots: {volunteerLimit}</Typography>
                <br></br>
                {
                optionalRoleInfo.map(function(object, index){
                    if (object== null){
                        return (<><Typography>Slot {index+1}: (No role name)</Typography><br></br></>)
                    }
                    else{
                        return (<><Typography>Slot {index+1}: {object} </Typography><br></br></>)
                    }
                    
                })
                }
                <Button onClick={() => {setConfirmationModalOpen(false); setErrorModal(""); setSuccessModal("");}}>Cancel</Button>
                <Button onClick={processEventCreation}>Create</Button>
            </Box>
        </Modal>
    </>)

}