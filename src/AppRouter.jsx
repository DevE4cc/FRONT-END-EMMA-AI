import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { EmmaChat } from "./pages/EmmaChat";
import { EmmaConversation } from "./pages/EmmaConversation";
import { EmmaHome } from "./pages/EmmaHome";

export const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigation />}>
                <Route index element={<EmmaConversation />} />
                <Route path='chat' element={<EmmaChat />} />
                <Route path='conversation' element={<EmmaConversation />} />
            </Route>

            <Route path='*' element={<Navigate to='/' />} />
        </Routes>
    )
}