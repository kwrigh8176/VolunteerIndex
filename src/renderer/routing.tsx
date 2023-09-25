import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from "react-router-dom";
    
  // import Home component
  import Login from "./generalPages/login";
  // import About component
  import OrgSignUp from "./organizationPages/orgSignUp";


  function getRoutes() {
    return (
        <Router>
            <Routes>
                <Route key="Login"  path='/' element={<Login />} />
              
                <Route key="orgSignUp"  path="/OrgSignUp" element={<OrgSignUp/>} />

            </Routes>
        </Router>
    );
}

    
  export default getRoutes;