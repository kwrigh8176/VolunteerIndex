import React from "react";
import { createRoot } from "react-dom/client";
import Button from "@mui/material/Button";
import Login from "./components/generalPages/login";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./components/generalPages/signup";
import EmailVerification from "./components/generalPages/emailVerification";
import VolunteerEvents from "./components/volunteerPages/VolunteerEvents";
import VolunteerHome from "./components/volunteerPages/VolunteerHome";
import OrgHome from "./components/organizationPages/OrgEvents";
import VolunteerPastEvents from "./components/volunteerPages/VolunteerPastEvents";
import VolunteerProfile from "./components/volunteerPages/VolunteerProfile";
import OrgEvents from "./components/organizationPages/OrgEvents";
import OrgPastEvents from "./components/organizationPages/OrgPastEvents";
import OrgCreateEvent from "./components/organizationPages/OrgCreateEvent";
import OrgCollegeEvents from "./components/organizationPages/OrgCollegeEvents";
import VolunteerCollegeEvents from "./components/volunteerPages/VolunteerCollegeEvents";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);



root.render(

<BrowserRouter>
    <Routes>
        <Route key="Login"  path='/' element={<Login />} />
                    
        <Route key="SignUp"  path="/signup" element={<SignUp/>} />

        <Route key="emailVerification"  path="/emailverification" element={<EmailVerification/>} />
        
        <Route key="volunteerHome"  path="/volunteerHome" element={<VolunteerHome />} />

        <Route key="volunteerEvents"  path="/volunteerEvents" element={<VolunteerEvents />} />

        <Route key="volunteerPastEvents"  path="/volunteerPastEvents" element={<VolunteerPastEvents />} />


        <Route key="volunteerCollegeEvents"  path="/volunteerCollegeEvents" element={<VolunteerCollegeEvents />} />


        <Route key="volunteerProfile"  path="/volunteerProfile" element={<VolunteerProfile />} />

        <Route key="orgCurrentEvents"  path="/orgCurrentEvents" element={<OrgEvents />} />

        <Route key="orgPastEvents"  path="/orgPastEvents" element={<OrgPastEvents />} />

        <Route key="orgCurrentEvents"  path="/orgCreateEvents" element={<OrgCreateEvent />} />

        <Route key="orgCollegeEvents"  path="/orgCollegeEvents" element={<OrgCollegeEvents />} />
    </Routes>
</BrowserRouter>

);
 