import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { EmmaChat } from "./pages/EmmaChat";
import { EmmaConversation } from "./pages/EmmaConversation";
import { EmmaHome } from "./pages/EmmaHome";
import { EmmaLogin } from "./pages/EmmaLogin";
import useSession from "./hooks/useSession";

export const AppRouter = () => {
    const { isSession } = useSession();

    useEffect(() => {
        console.log("isSession", isSession);
    }, [isSession]);
    return (
        <Routes>
            <Route path='/' element={<Navigation />}>
                {/* <Route index element={isSession ? <EmmaHome /> : <EmmaLogin />} /> */}
                <Route index element={<EmmaHome />} />
                <Route path='chat' element={<EmmaChat />} />
                <Route path='conversation' element={<EmmaConversation />} />
            </Route>

            <Route path='*' element={<Navigate to='/' />} />
        </Routes>
    )
}