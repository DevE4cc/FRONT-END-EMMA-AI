import { useState, useEffect, useRef } from "react";
import axios from "axios";

const useSession = (username) => {
    const [isSession, setIsSession] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (userData) {
            setUserData(JSON.parse(userData));
            setIsSession(true);
        }

        const isSession = localStorage.getItem("isSession");
        if (isSession) {
            setIsSession(isSession);
        }
    }, []);

    const login = async (username) => {
        const api_key = import.meta.env.VITE_E4CC_API_KEY;
        try {
            setIsLoading(true);
            const response = await axios.get(
                `https://e4cc-dev.com/API_E4CC/index.php/API/Login/${username}?X-API-KEY=${api_key}`
            );
            setUserData(response.data);
            setIsSession(true);
            setIsLoading(false);

            // save user data in local storage
            localStorage.setItem("userData", JSON.stringify(response.data));

            // save isSession in local storage
            localStorage.setItem("isSession", true);
            // redirect to home
        } catch (error) {
            console.error("Error fetching user data:", error);
            setIsLoading(false);
        }
    };

    const logout = () => {
        setIsSession(false);
        setUserData(null);
        localStorage.removeItem("userData");
    };

    return { isSession, userData, isLoading, login, logout };
};

export default useSession;