
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import EmailVerification from './generalPages/emailVerification';
import ForgotPassword from './generalPages/forgotPassword';
import ForgotUsername from './generalPages/forgotUsername';
import ResetPassword from './generalPages/resetPassword';
import SignUp from './generalPages/signup';
import OrgCollegeEvents from './organizationPages/OrgCollegeEvents';
import OrgCreateEvent from './organizationPages/OrgCreateEvent';
import OrgEvents from './organizationPages/OrgEvents';
import OrgPastEvents from './organizationPages/OrgPastEvents';
import OrgProfile from './organizationPages/OrgProfile';
import VolunteerCollegeEvents from './volunteerPages/VolunteerCollegeEvents';
import VolunteerEvents from './volunteerPages/VolunteerEvents';
import VolunteerPastEvents from './volunteerPages/VolunteerPastEvents';
import VolunteerProfile from './volunteerPages/VolunteerProfile';
import VolunteerHome from './volunteerPages/volunteerHome';
import Login from './generalPages/login';

var newRoutes = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
  },
  {
    path: "/signup",
    element: <SignUp/>,
  },
  {
    path: "/emailverification",
    element: <EmailVerification/>,
  },
  {
    path: "/forgotpassword",
    element: <ForgotPassword/>,
  },
  {
    path: "/forgotusername",
    element: <ForgotUsername/>,
  },
  {
    path: "/resetpassword",
    element: <ResetPassword/>,
  },
  {
    path: "/volunteerHome",
    element: <VolunteerHome/>,
  },
  {
    path: "/volunteerEvents",
    element: <VolunteerEvents/>,
  },
  {
    path: "/volunteerPastEvents",
    element: <VolunteerPastEvents/>,
  },
  {
    path: "/volunteerCollegeEvents",
    element: <VolunteerCollegeEvents/>,
  },
  {
    path: "/volunteerProfile",
    element: <VolunteerProfile/>,
  },
  {
    path: "/orgCurrentEvents",
    element: <OrgEvents/>,
  },
  {
    path: "/orgPastEvents",
    element: <OrgPastEvents/>,
  },
  {
    path: "/orgCreateEvents",
    element: <OrgCreateEvent/>,
  },
  {
    path: "/orgCollegeEvents",
    element: <OrgCollegeEvents/>,
  },
  {
    path: "/orgProfile",
    element: <OrgProfile/>,
  },
])

function App() {
  return (
        <RouterProvider router={newRoutes}/>
  );
}

export default App;
