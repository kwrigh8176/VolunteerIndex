import React from "react";
import { createRoot } from "react-dom/client";
import '../globals';
import Button from "@mui/material/Button";
import getRoutes from "./routing";
import Login from "./generalPages/login";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);



root.render(getRoutes());
