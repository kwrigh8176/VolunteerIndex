import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from "react-router-dom";
    
  // import Login component
  import Login from "./components/generalPages/login";

  // import orgSignUp component
  import OrgSignUp from "./components/organizationPages/orgSignUp";

  import VolunteerSignUp from "./components/volunteerPages/volunteerSignUp";

  function getRoutes() {
    return (
        <Router>
            <Routes>
                <Route key="Login"  path='/' element={<Login />} />
              
                <Route key="orgSignUp"  path="/OrgSignUp" element={<OrgSignUp/>} />

                <Route key="volunteerSignUp"  path="/VolunteerSignUp" element={<VolunteerSignUp/>} />
            </Routes>
        </Router>
    );
}

    
  export default getRoutes;