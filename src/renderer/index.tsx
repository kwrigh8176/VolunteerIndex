import React from "react";
import { createRoot } from "react-dom/client";
import {AppRoutes} from "./components/routes";


createRoot(document.querySelector('app') as HTMLElement).render(
    <React.StrictMode>

        <AppRoutes />
    </React.StrictMode>
)

