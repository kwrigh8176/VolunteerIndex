import React from "react";
import { createRoot } from "react-dom/client";
import '../globals';
import Button from "@mui/material/Button";
import getRoutes from "./routing";
import Login from "./components/generalPages/login";
import { Navigate } from "react-router-dom";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

getRoutes()

root.render(<Login />);
 