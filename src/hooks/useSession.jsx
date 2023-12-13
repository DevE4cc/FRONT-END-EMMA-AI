import { useState, useEffect } from "react";
import axios from "axios";

const useSession = () => {
  const [isSession, setIsSession] = useState(false);
  const [state, setState] = useState([
    {
      state: "initial",
      current: false,
    },
    {
      state: "loading",
      current: false,
    },
    {
      state: "error",
      current: false,
    },
    {
      state: "success",
      current: false,
    },
  ]);

  const handleState = (state) => {
    setState((prevState) => {
      return prevState.map((item) => {
        if (item.state === state) {
          return { ...item, current: true };
        }
        return { ...item, current: false };
      });
    });
  };

  const login = async (username) => {
    const api_key = import.meta.env.VITE_E4CC_API_KEY;
    handleState("loading");

    try {
      const response = await axios.get(
        `https://e4cc-dev.com/API_E4CC/index.php/API/Login/${username}?X-API-KEY=${api_key}`
      );
      const { Estado } = response.data[0];

      if (Estado === 1) {
        localStorage.setItem("userData", JSON.stringify({ userStudent: username }));

        handleState("success");
      } else {
        handleState("error");
      }
    } catch (error) {
      handleState("error");
    }
  };

  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    if (localStorage.getItem("userData")) {
      setIsSession(true);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("userData");
    // redirect to login
    window.location.href = "/";
  };

  return {
    isSession,
    userData,
    login,
    logout,
    state,
  };
};

export default useSession;
