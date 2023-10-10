import * as React from 'react'
import VolunteerEvents from './VolunteerEvents'
import VolunteerNavBar from './VolunteerNavbar'
import { useEffect } from 'react';
import connectionString from '../../../../config';
import axios from 'axios';
import { PieChart } from '@mui/x-charts/PieChart';
import dayjs from 'dayjs';



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
            data = allData.filter((data) => data.verifiedHours!=0)
        }


        if (pieChartSettings.timeSetting == "day"){
            var date = new Date();
            var currDate = dayjs(date).format('YYYY-MM-DD')
            data = allData.filter((data) => data.Date===currDate)


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

        }
        else{

        }

    }, [allData])

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
            </>
        )
    }
    
}

export default VolunteerHome