import React from "react";
import { createRoot } from "react-dom/client";
import AppRoutes from "./routes";

const root = createRoot(document.body!);

root.render(<AppRoutes />)
