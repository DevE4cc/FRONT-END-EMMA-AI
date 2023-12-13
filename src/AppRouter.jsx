import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { EmmaChat } from "./pages/EmmaChat";
import { EmmaConversation } from "./pages/EmmaConversation";
import { EmmaHome } from "./pages/EmmaHome";
import { EmmaLogin } from "./pages/EmmaLogin";
import useSession from "./hooks/useSession";
import EmmaTerms from "./pages/EmmaTerms";

export const AppRouter = () => {
    const { isSession } = useSession();
    return (
        <Routes>
            <Route path='/' element={<Navigation />}>
                <Route index element={isSession ? <EmmaHome /> : <EmmaLogin />} />
                {/* <Route index element={<EmmaHome />} /> */}
                <Route path='chat' element={<EmmaChat />} />
                <Route path='terms' element={<EmmaTerms />} />
                <Route path='conversation' element={<EmmaConversation />} />
            </Route>

            <Route path='*' element={<Navigate to='/' />} />
        </Routes>
    )
}