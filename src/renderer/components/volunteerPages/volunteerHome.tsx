import * as React from 'react'
import VolunteerNavBar from './VolunteerNavbar'
import { useEffect } from 'react';
import connectionString from '../../../../config';
import axios from 'axios';
import { PieChart } from '@mui/x-charts/PieChart';
import dayjs from 'dayjs';
import { Select } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';




const VolunteerHome = () : JSX.Element => {
    {/*Should be able to see events in a day, a week, or a month*/}

    {/*Should be able to switch between verified hours and all hours */}

    const [allData, setAllData] = React.useState<any[]>([]);
    const [pieChartData, setPieChartData] = React.useState<JSX.Element>(<p>Loading pie chart...</p>)
    const [loading, setLoading] = React.useState(0);
    const [pieChartSettings, setPieChartSettings] = React.useState({
        timeSetting: "day",
        hours: "all"
    })

    const fetchEvents = async () => {
        var getValue: any[] = [];
        var formattedData = [];
        var connectionStringWithParams = connectionString + "/fetchVolunteerHome/" + sessionStorage.getItem("Id") + '/' + sessionStorage.getItem("state") + '/' + 'placeholdervalue'
        await axios.get(connectionStringWithParams).then(function (response) {
            getValue = response.data
        }).catch(function (error){
            console.log(error.response.data)
        });  

        for (let index = 0;  index < getValue.length; index++){
            var currLine = getValue[index];

            var duration = currLine.Duration
            var getLabel = currLine.EventName + ': ' +  Math.floor(currLine.Duration/60) + ' hours ' + currLine.Duration%60 + ' minutes'

            formattedData.push({value: duration, label: getLabel, verifiedHours: currLine.VerifiedHours, Date: currLine.Date})
        }

        setAllData(formattedData)
   
    }

    const pieChartStylings = {
        legend: { hidden: true }
    };


    useEffect (() => {
        var data = allData

        if (pieChartSettings.hours == "verified"){
            data = allData.filter((data) => data.verifiedHours==true)
        }

        if (data.length == 0)
        {
            setPieChartData(<p>No events retrieved with the settings.</p>)
            return
        }

        if (pieChartSettings.timeSetting == "day"){
            var date = new Date();
            var currDate = dayjs(date).format('YYYY-MM-DD')
            data = data.filter((data) => data.Date===currDate)
            if (data.length == 0)
            {
                setPieChartData(<p>No events retrieved with the settings.</p>)
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


            var chartData = []

            {/*If the day is not a sunday */}
            var dateDiff =  date.getDate() - date.getDay();
            
            date = new Date(date.setDate(dateDiff));

            var dataAmt = 0
            for (let day = 0; day < 7; day++){
                var getProperDateFormat = dayjs(date).format('YYYY-MM-DD')

                data = data.filter((obj) => obj.Date===getProperDateFormat)

                if (data.length != 0){


                    dataAmt+= 1
                    var totalHoursOnDay = data.reduce( function(prev,curr){ return prev + curr.value; }, 0)
                    var minutes = totalHoursOnDay%60
                    if (minutes != 0)
                    {
                        var getLabel =  '('+Math.floor(totalHoursOnDay/60) + ' hrs ' + minutes + ' m)'
                    }
                    else{
                        var getLabel = '('+Math.floor(totalHoursOnDay/60) + ' hrs) '
                    }
                    

                    chartData.push({value: totalHoursOnDay, label: dayjs(getProperDateFormat).format('MM-DD-YYYY') + ' ' + getLabel})
                }

                date.setDate(date.getDate() + 1)
            }

            if (dataAmt == 0)
            {
                setPieChartData(<p>No events retrieved with the settings.</p>)
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
        else{

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
                
                data = data.filter((obj) => dayjs(obj.Date).month()===month)

                if (data.length != 0){


                    dataAmt += 1
                    var totalHoursOnDay = data.reduce( function(prev,curr){ return prev + curr.value; }, 0)
                    var minutes = totalHoursOnDay%60
                    if (minutes != 0)
                    {
                        var getLabel =  '('+Math.floor(totalHoursOnDay/60) + ' hrs ' + minutes + ' m)'
                    }
                    else{
                        var getLabel =  '('+Math.floor(totalHoursOnDay/60) + ' hrs) '
                    }
                    

                    chartData.push({value: totalHoursOnDay, label: months[month] + ' ' + getYear + ' ' + getLabel})
                }

            }

            if (dataAmt == 0)
            {
                setPieChartData(<p>No events retrieved with the settings.</p>)
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
    }, [allData])

    useEffect (() => {
        var data = allData

        if (pieChartSettings.hours == "verified"){
            data = allData.filter((data) => data.verifiedHours==true)
        }

        if (data.length == 0)
        {
            setPieChartData(<p>No events retrieved with the settings.</p>)
            return
        }

        if (pieChartSettings.timeSetting == "day"){
            var date = new Date();
            var currDate = dayjs(date).format('YYYY-MM-DD')
            data = data.filter((data) => data.Date===currDate)
            if (data.length == 0)
            {
                setPieChartData(<p>No events retrieved with the settings.</p>)
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


            var chartData = []

            {/*If the day is not a sunday */}
            var dateDiff =  date.getDate() - date.getDay();
            
            date = new Date(date.setDate(dateDiff));

            var dataAmt = 0
            for (let day = 0; day < 7; day++){
                var getProperDateFormat = dayjs(date).format('YYYY-MM-DD')

                var tempData = data.filter((obj) => obj.Date===getProperDateFormat)

                if (tempData.length != 0){


                    dataAmt+= 1
                    var totalHoursOnDay = tempData.reduce( function(prev,curr){ return prev + curr.value; }, 0)
                    var minutes = totalHoursOnDay%60
                    if (minutes != 0)
                    {
                        var getLabel =  '('+Math.floor(totalHoursOnDay/60) + ' hrs ' + minutes + ' m)'
                    }
                    else{
                        var getLabel = '('+Math.floor(totalHoursOnDay/60) + ' hrs) '
                    }
                    

                    chartData.push({value: totalHoursOnDay, label: dayjs(getProperDateFormat).format('MM-DD-YYYY') + ' ' + getLabel})
                }

                date.setDate(date.getDate() + 1)
            }

            if (dataAmt == 0)
            {
                setPieChartData(<p>No events retrieved with the settings.</p>)
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
        else{

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
                        var getLabel =  '('+Math.floor(totalHoursOnDay/60) + ' hrs ' + minutes + ' m)'
                    }
                    else{
                        var getLabel =  '('+Math.floor(totalHoursOnDay/60) + ' hrs) '
                    }
                    

                    chartData.push({value: totalHoursOnDay, label: months[month] + ' ' + getYear + ' ' + getLabel})
                }

            }

            if (dataAmt == 0)
            {
                setPieChartData(<p>No events retrieved with the settings.</p>)
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

    }, [pieChartSettings])

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
                <VolunteerNavBar/>
                {pieChartData}
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={pieChartSettings.timeSetting}
                    label="Time Frame"
                    onChange={(event) => setPieChartSettings({timeSetting: event.target.value, hours: pieChartSettings.hours})}
                >
                    <MenuItem value={"day"}>Day</MenuItem>
                    <MenuItem value={"week"}>Week</MenuItem>
                    <MenuItem value={"months"}>Month</MenuItem>
                </Select>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={pieChartSettings.hours}
                    label="Verification?"
                    onChange={(event) => setPieChartSettings({timeSetting: pieChartSettings.timeSetting, hours: event.target.value})}
                >
                    <MenuItem value={"all"}>All</MenuItem>
                    <MenuItem value={"verified"}>Verified</MenuItem>
                </Select>
            </>
        )
    }
    
}

export default VolunteerHome