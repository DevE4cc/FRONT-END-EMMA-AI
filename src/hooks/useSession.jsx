import { useState, useEffect } from "react";
import axios from "axios";

const useSession = () => {
  const [isSession, setIsSession] = useState(false);
  const [state, setState] = useState([
    {
      state: "initial",
      current: false,
      message: ""
    },
    {
      state: "loading",
      current: false,
      message: ""
    },
    {
      state: "error",
      current: false,
      message: ""
    },
    {
      state: "success",
      current: false,
      message: ""
    },
  ]);

  const handleState = (state, mensaje) => {
    setState((prevState) => {
      return prevState.map((item) => {
        if (item.state === state) {
          return { ...item, current: true, mensaje: mensaje };
        }
        return { ...item, current: false, mensaje: mensaje };
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
      const { Estado, mensaje } = response.data[0];

      if (Estado === 1) {
        localStorage.setItem("userData", JSON.stringify({ userStudent: username }));

        handleState("success", mensaje);
      } else {
        // message error
        console.log(mensaje);
        handleState("error", mensaje);
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
