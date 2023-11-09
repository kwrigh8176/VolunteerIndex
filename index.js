import React from "react";
// import "./index.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import AppRoutes from "./src/renderer/components/routes";

window.onload = () => {
  const rootElement = document.getElementById("root");
  const root = createRoot(rootElement);
  root.render(<AppRoutes />);
};