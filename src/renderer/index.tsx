import React from "react";
import { createRoot } from "react-dom/client";
import '../globals';
import Button from "@mui/material/Button";
import Login from "./components/generalPages/login";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./components/generalPages/signup";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);



root.render(

<BrowserRouter>
    <Routes>
        <Route key="Login"  path='/' element={<Login />} />
                    
        <Route key="SignUp"  path="/signup" element={<SignUp/>} />

    </Routes>
</BrowserRouter>

);
 