import React, { useEffect } from "react"
import connectionString from "../../../../config"
import axios from "axios"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardContent from "@mui/material/CardContent"
import VolunteerNavBar from "./VolunteerNavbar"
import Button from "@mui/material/Button"

export default function VolunteerProfile() : JSX.Element {

    const [loading, setLoading] = React.useState(0)
    const [loadedInfo, setLoadedInfo] = React.useState<any[]>([])
    const [loadedInfoJSX, setLoadedInfoJSX]= React.useState<JSX.Element>(<p></p>)

    const getLoadedInfo = async () => {
        
        var connectionStringWithParams = connectionString + "/getVolunteerProfile/" + sessionStorage.getItem("Id") + '/' + 'placeholdervalue'
        await axios.get(connectionStringWithParams).then(function (response) {
            setLoadedInfo(response.data)
            
         }).catch(function (error){
            setLoadedInfoJSX(<p>Data could not be retrieved. Try restarting the app.</p>)
        
         });  
    }

    useEffect(() => {
        

        if (loadedInfo.length != 0){



            setLoadedInfoJSX(
                <>
                    <Box>
                        
                        <Card>
                            <CardHeader title={"Welcome, " + loadedInfo[0].FirstName} >
                            </CardHeader>
                            <CardHeader title="Your Info" subheader="Click on a field to edit. Click the save button below to save." subheaderTypographyProps={{ color: 'black' }}  sx={{borderTop:'1px solid black'}} >
                            </CardHeader>
                            <CardContent sx={{borderBottom:'1px white'}}>
                                <TextField defaultValue={loadedInfo[0].Username} label='Username' sx={{marginRight:'5px'}} InputLabelProps={{style: { color: 'black' }}} inputProps={{ maxLength: 15 }}></TextField>

                                <TextField defaultValue={loadedInfo[0].Email} label='Email'  sx={{marginRight:'5px'}} InputLabelProps={{style: { color: 'black' }}} inputProps={{ maxLength: 50 }}></TextField>
                                <TextField defaultValue={loadedInfo[0].PhoneNumber} label='Phone Number (No Spaces)' sx={{ marginRight:'5px'}} InputLabelProps={{style: { color: 'black' }}} inputProps={{ maxLength: 10 }}></TextField>
                            </CardContent>
              
                            <CardHeader title="Bio" subheader="Feel free to describe yourself here. (250 characters max)" subheaderTypographyProps={{ color: 'black' }}  sx={{borderTop:'1px solid black'}}>
                            </CardHeader>
                            <CardContent>
                                <textarea defaultValue={loadedInfo[0].Bio}  maxLength={250}></textarea>
                            </CardContent>
                            <CardContent sx={{borderTop:'1px solid black'}}>
                                <Button sx={{border:'1px solid black'}}>Save </Button>
                            </CardContent>
                        </Card>
                    </Box>
                </>
                
            )
        }
        else{
            setLoadedInfoJSX(<p>Data is being retrieved...</p>)
        }
        

    }, [loadedInfo])



    if (loading == 0){
        setLoading(1)
        getLoadedInfo()
        {/*Just a temporary message for signaling data is being retrieved */}
        return (
            <>
                <p>
                </p>
            </>
        )
    }
    else{
        return (<>
        <VolunteerNavBar/>
            {loadedInfoJSX}
            </>
        
            )
    }

    
    

}