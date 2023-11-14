import React from "react";
import Login from "./generalPages/login";
import {Route, Router } from "electron-router-dom";
import SignUp from "./generalPages/signup";
import EmailVerification from "./generalPages/emailVerification";
import VolunteerEvents from "./volunteerPages/VolunteerEvents";
import VolunteerPastEvents from "./volunteerPages/VolunteerPastEvents";
import VolunteerProfile from "./volunteerPages/VolunteerProfile";
import OrgEvents from "./organizationPages/OrgEvents";
import OrgPastEvents from "./organizationPages/OrgPastEvents";
import OrgCreateEvent from "./organizationPages/OrgCreateEvent";
import OrgCollegeEvents from "./organizationPages/OrgCollegeEvents";
import VolunteerCollegeEvents from "./volunteerPages/VolunteerCollegeEvents";
import OrgProfile from "./organizationPages/OrgProfile";
import VolunteerHome from "./volunteerPages/volunteerHome";
import ForgotPassword from "./generalPages/forgotPassword";
import ForgotUsername from "./generalPages/forgotUsername";
import ResetPassword from "./generalPages/resetPassword";


export function AppRoutes(){
  
  return (
        <Router
            main = {
                <>
                    <Route key="Login"  path='/' element={<Login />}/>
                            
                    <Route key="SignUp"  path="/signup" element={<SignUp/>} />

                    <Route key="emailVerification"  path="/emailverification" element={<EmailVerification/>} />
                    
                    <Route key="forgotPassword"  path="/forgotpassword" element={<ForgotPassword/>} />

                    <Route key="forgotUsername"  path="/forgotusername" element={<ForgotUsername/>} />

                    <Route key="resetPassword"  path="/resetpassword" element={<ResetPassword/>} />

                    <Route key="volunteerHome"  path="/volunteerHome" element={<VolunteerHome/> } />

                    <Route key="volunteerEvents"  path="/volunteerEvents" element={<VolunteerEvents />} />

                    <Route key="volunteerPastEvents"  path="/volunteerPastEvents" element={<VolunteerPastEvents />} />


                    <Route key="volunteerCollegeEvents"  path="/volunteerCollegeEvents" element={<VolunteerCollegeEvents />} />


                    <Route key="volunteerProfile"  path="/volunteerProfile" element={<VolunteerProfile />} />

                    <Route key="orgCurrentEvents"  path="/orgCurrentEvents" element={<OrgEvents />} />

                    <Route key="orgPastEvents"  path="/orgPastEvents" element={<OrgPastEvents />} />

                    <Route key="orgCreateEvents"  path="/orgCreateEvents" element={<OrgCreateEvent />} />

                    <Route key="orgCollegeEvents"  path="/orgCollegeEvents" element={<OrgCollegeEvents />} />

                    <Route key="orgHome"  path="/orgProfile" element={<OrgProfile />} />
                </>
                }
        />
  
  )
 
}
