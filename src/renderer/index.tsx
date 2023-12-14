import React from "react";
import { createRoot } from "react-dom/client";
import {AppRoutes} from "./components/routes";
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux';
import { Provider } from "react-redux";


createRoot(document.querySelector('app') as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AppRoutes />
            </PersistGate>
        </Provider>
    </React.StrictMode>
)

