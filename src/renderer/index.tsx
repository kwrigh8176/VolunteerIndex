import React from "react";
import { createRoot } from "react-dom/client";
import Login from "./generalPages/login";


const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);
root.render(Login());
