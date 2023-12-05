import * as React from 'react'
import VolunteerNavBar from './VolunteerNavbar'
import { useEffect } from 'react';
import connectionString from '../../../../config';
import axios from 'axios';
import { PieChart } from '@mui/x-charts/PieChart';
import dayjs from 'dayjs';
import { Alert, AlertTitle, TextField, styled } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import moment from 'moment';


const StyledInput = styled(TextField)`
& .MuiOutlinedInput-notchedOutline {
    border-color: white;
 }
 & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: white;
 }
 & .MuiSvgIcon-root : {
    color: 'white',
 }
`;

const VolunteerHome = () : JSX.Element => {

    sessionStorage.setItem("currRoute", "/volunteerHome")

    {/*Should be able to see events in a day, a week, or a month*/}

    {/*Should be able to switch between verified hours and all hours */}

    const [allData, setAllData] = React.useState<any[]>([]);
    const [pieChartData, setPieChartData] = React.useState<JSX.Element>(<p>Loading pie chart...</p>)
    const [loading, setLoading] = React.useState(0);
    const [errorText, setErrorText] = React.useState('');
    var warningJSX = (<Alert severity="warning" sx={{marginTop:'5px'}}><AlertTitle>No data found based on the above settings.</AlertTitle></Alert>);
    const [pieChartSettings, setPieChartSettings] = React.useState({
        timeSetting: "day",
        hours: "All",
        collegeFlag : "0"
    })

    const fetchEvents = async () => {
        var getValue: any[] = [];
        var formattedData = [];
        
        var tempText = '';
        await axios.get(connectionString + "/fetchVolunteerHome/",{params:{
            volunteerId: sessionStorage.getItem("Id"),
            state: sessionStorage.getItem("state"),
            username: sessionStorage.getItem('username'),
            token: sessionStorage.getItem('token'),
            loginType: sessionStorage.getItem('loginType'),
            locale:  moment.tz.guess(true)
        }}).then(function (response) {
            getValue = response.data
        }).catch(function (error){
            tempText = "error"
            if (error.response == undefined){
                setErrorText("Network error connecting to the API, please try again.")
            }
            else
            {
                setErrorText(error.response.data)
            }
            
        });  

        if (tempText != ''){
            return 
        }
        
        for (let index = 0;  index < getValue.length; index++){
            var currLine = getValue[index];

            var duration = currLine.Duration
            var getLabel = currLine.EventName + ': ' +  Math.floor(currLine.Duration/60) + ' hours ' + currLine.Duration%60 + ' minutes'

            formattedData.push({value: duration, label: getLabel, verifiedHours: currLine.VerifiedHours, Date: currLine.Date, CollegeEvent: currLine.CollegeEvent, NoShow:currLine.NoShow})
        }

        setAllData(formattedData)
   
    }

    const pieChartStylings = {
        legend: { hidden: true }
    };


  

    useEffect (() => {
        setErrorText('')
        var data = allData.filter((data) => data.NoShow==null)

        if (pieChartSettings.hours == "Verified"){
            data = data.filter((data) => data.verifiedHours==true)
        }

        if (pieChartSettings.collegeFlag == "1")
        {
            data = data.filter((data) => data.CollegeEvent==true)
        }

        if (data.length == 0)
        {
            setPieChartData(warningJSX)
            return
        }

        if (pieChartSettings.timeSetting == "day"){
            var date = new Date();
            var currDate = dayjs(date).format('YYYY-MM-DD')
            data = data.filter((data) => data.Date===currDate)
            if (data.length == 0)
            {
                setPieChartData(warningJSX)
                return
            }
   
            
                setPieChartData(
                    <>
                         <PieChart
                            series={[
                                {
                                arcLabel: (item) => `${item.label}`,
                                highlightScope: { faded: 'global', highlighted: 'item' },
                                arcLabelMinAngle: 45,
                                data,
                                
                                },
                            ]}
                            {...pieChartStylings}
                        />
                    </>
    
                )
            
            
        }
        else if (pieChartSettings.timeSetting == "week"){
            var date = new Date();


            var chartData: any[] = []

            {/*If the day is not a sunday */}
            var weekFromToday =  dayjs(date).subtract(7,'day');
            
            

            var dataAmt = 0
            for (let day = 0; day < 7; day++){
                var getProperDateFormat = dayjs(weekFromToday.add(day,'day')).format('YYYY-MM-DD')

                var tempData = data.filter((obj) => obj.Date===getProperDateFormat)

                if (tempData.length != 0){


                    dataAmt+= 1
                    var totalHoursOnDay = tempData.reduce( function(prev,curr){ return prev + curr.value; }, 0)
                    var minutes = totalHoursOnDay%60
                    if (minutes != 0)
                    {
                        if (Math.floor(totalHoursOnDay/60) == 1)
                        {
                            var getLabel =  '('+Math.floor(totalHoursOnDay/60) + ' hr ' + minutes + ' m)'
                        }
                        else
                        {
                            var getLabel =  '('+Math.floor(totalHoursOnDay/60) + ' hrs ' + minutes + ' m)'
                        }
                    }
                    else{
                        if (Math.floor(totalHoursOnDay/60) == 1)
                        {
                            var getLabel = '('+Math.floor(totalHoursOnDay/60) + ' hr) '
                        }
                        else
                        {
                            var getLabel = '('+Math.floor(totalHoursOnDay/60) + ' hrs) '
                        }
                        
                    }
                    

                    chartData.push({value: totalHoursOnDay, label: dayjs(getProperDateFormat).format('MM-DD-YYYY') + ' ' + getLabel})
                }

                date.setDate(date.getDate() + 1)
            }

            if (dataAmt == 0)
            {
                setPieChartData(warningJSX)
                return
            }

            data = chartData

            setPieChartData(
                <>
                     <PieChart
                        series={[
                            {
                            arcLabel: (item) => `${item.label}`,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            arcLabelMinAngle: 45,
                            data,
                            
                            },
                        ]}
                        {...pieChartStylings}
                    />
                </>

            )
        }
        else if (pieChartSettings.timeSetting == "month"){
            var date = new Date();
            data = data.filter((obj) => dayjs(obj.Date).month()===dayjs(date).month())
            var chartData = []

            if (data.length != 0){


                    
                    var totalHoursOnDay = data.reduce( function(prev,curr){ return prev + curr.value; }, 0)
                    var minutes = totalHoursOnDay%60
                    if (minutes != 0)
                    {
                        if (Math.floor(totalHoursOnDay/60) == 1)
                        {
                            var getLabel =  '('+Math.floor(totalHoursOnDay/60) + ' hr ' + minutes + ' m)'
                        }
                        else
                        {
                            var getLabel =  '('+Math.floor(totalHoursOnDay/60) + ' hrs ' + minutes + ' m)'
                        }
                    }
                    else{
                        if (Math.floor(totalHoursOnDay/60) == 1)
                        {
                            var getLabel = '('+Math.floor(totalHoursOnDay/60) + ' hr) '
                        }
                        else
                        {
                            var getLabel = '('+Math.floor(totalHoursOnDay/60) + ' hrs) '
                        }
                    }
                    

                    chartData.push({value: totalHoursOnDay, label: dayjs(date).format('MMMM') + ' ' + getLabel})
               
                
            }
            else
            {

                    setPieChartData(warningJSX)
                    return
                
            }

            data = chartData
            
            setPieChartData(
                <>
                     <PieChart
                        series={[
                            {
                            arcLabel: (item) => `${item.label}`,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            arcLabelMinAngle: 45,
                            data,
                            
                            },
                        ]}
                        {...pieChartStylings}
                    />
                </>

            )

        }
        else if (pieChartSettings.timeSetting == "year"){

            var date = new Date();


            var chartData = []

            var getYear = dayjs(date).year()

            var months = new Array(12);
            months[0] = "January";
            months[1] = "February";
            months[2] = "March";
            months[3] = "April";
            months[4] = "May";
            months[5] = "June";
            months[6] = "July";
            months[7] = "August";
            months[8] = "September";
            months[9] = "October";
            months[10] = "November";
            months[11] = "December";

            var dataAmt = 0;

            for (let month = 0; month < 12; month++)
            {
                
                var tempData = data.filter((obj) => dayjs(obj.Date).month()===month)

                if (tempData.length != 0){


                    dataAmt += 1
                    var totalHoursOnDay = tempData.reduce( function(prev,curr){ return prev + curr.value; }, 0)
                    var minutes = totalHoursOnDay%60
                    if (minutes != 0)
                    {
                        if (Math.floor(totalHoursOnDay/60) == 1)
                        {
                            var getLabel =  '('+Math.floor(totalHoursOnDay/60) + ' hr ' + minutes + ' m)'
                        }
                        else
                        {
                            var getLabel =  '('+Math.floor(totalHoursOnDay/60) + ' hrs ' + minutes + ' m)'
                        }
               
                    }
                    else{
                        if (Math.floor(totalHoursOnDay/60) == 1)
                        {
                            var getLabel = '('+Math.floor(totalHoursOnDay/60) + ' hr) '
                        }
                        else
                        {
                            var getLabel = '('+Math.floor(totalHoursOnDay/60) + ' hrs) '
                        }
                    }
                    

                    chartData.push({value: totalHoursOnDay, label: months[month] + ' ' + getYear + ' ' + getLabel})
                }

            }

            if (dataAmt == 0)
            {
                setPieChartData(warningJSX)
                return
            }

            data = chartData

            setPieChartData(
                <>
                     <PieChart
                        series={[
                            {
                            arcLabel: (item) => `${item.label}`,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            arcLabelMinAngle: 45,
                            data,
                            
                            },
                        ]}
                        {...pieChartStylings}
                    />
                </>

            )
        }

    }, [allData, pieChartSettings])

    if (loading == 0){
        setLoading(1)
        fetchEvents()
       
        return (
            <>
                <VolunteerNavBar/>
            </>
        )
    }
    else{
        return (
            <>
                <VolunteerNavBar pageName="Home"/>
                {errorText != '' && 
                                
                    <Alert severity="error">
                        <AlertTitle>{errorText}</AlertTitle>
                    </Alert>
                }
                <StyledInput select variant={"outlined"}
                    value={pieChartSettings.timeSetting}
                    label="Time Frame"
                    onChange={(event) => setPieChartSettings({timeSetting: event.target.value, hours: pieChartSettings.hours, collegeFlag: pieChartSettings.collegeFlag})}

                    InputProps={{sx : {color : "white"}  }}
                    sx={{input: {color: 'white'},marginRight: '10px', minWidth: 125, borderColor:'white'}}
                    InputLabelProps={{ sx: {color: "white"}}}
                >
                    <MenuItem value={"day"}>Today</MenuItem>
                    <MenuItem value={"week"}>Past Week</MenuItem>
                    <MenuItem value={"month"}>Past Month</MenuItem>
                    <MenuItem value={"year"}>Past Year</MenuItem>
                </StyledInput>
                
                <StyledInput
                    select
                    value={pieChartSettings.hours}
                    label="Verified Hours?"
                    onChange={(event) => setPieChartSettings({timeSetting: pieChartSettings.timeSetting, hours: event.target.value, collegeFlag: pieChartSettings.collegeFlag})}
                    InputProps={{sx : {color : "white"}  }}
                    sx={{input: {color: 'white'},marginRight: '10px', minWidth: 150, borderColor:'white'}}
                    InputLabelProps={{ sx: {color: "white"}}}
                >
                    <MenuItem value={"All"}>No</MenuItem>
                    <MenuItem value={"Verified"}>Yes</MenuItem>
                </StyledInput>
               
                {sessionStorage.getItem("collegeStudent") == "true" &&

                    <StyledInput 
                        select
                        value={pieChartSettings.collegeFlag}
                        label="College Related?"
                        onChange={(event) => setPieChartSettings({timeSetting: pieChartSettings.timeSetting, hours: pieChartSettings.hours, collegeFlag: event.target.value})}
                        InputProps={{sx : {color : "white"}  }}
                        sx={{input: {color: 'white'},marginRight: '10px', minWidth: 125, borderColor:'white'}}
                        InputLabelProps={{ sx: {color: "white"}}}
                    >
                        <MenuItem value={"0"}>No</MenuItem>
                        <MenuItem value={"1"}>Yes</MenuItem>
                        
                    </StyledInput>

                }
                
                {pieChartData}

            </>
        )
    }
    
}

export default VolunteerHome