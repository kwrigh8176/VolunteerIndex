import React from "react";
import { createRoot } from "react-dom/client";
import Button from "@mui/material/Button";
import Login from "./components/generalPages/login";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./components/generalPages/signup";
import EmailVerification from "./components/generalPages/emailVerification";
import VolunteerEvents from "./components/volunteerPages/VolunteerEvents";
import VolunteerHome from "./components/volunteerPages/VolunteerHome";
import OrgHome from "./components/organizationPages/OrgHome";
import VolunteerPastEvents from "./components/volunteerPages/VolunteerPastEvents";

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

        <Route key="orgHome"  path="/orgHome" element={<OrgHome />} />

    </Routes>
</BrowserRouter>

);
 