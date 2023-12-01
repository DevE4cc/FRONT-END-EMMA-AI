import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { EmmaChat } from "./pages/EmmaChat";
import { EmmaConvertations } from "./pages/EmmaConvertations";
import { EmmaHome } from "./pages/EmmaHome";

export const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigation />}>
                <Route index element={<EmmaHome />} />
                <Route path='chat' element={<EmmaChat />} />
                <Route path='convertations' element={<EmmaConvertations />} />
            </Route>

            <Route path='*' element={<Navigate to='/' />} />
        </Routes>
    )
}