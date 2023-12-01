import React, { useState } from "react";
import { Link } from "react-router-dom";

export const EmmaHome = () => {
  const [botones, setBotones] = useState([
    { id: 1, estado: true, url: "/" },
    { id: 2, estado: false, url: "/search" },
    { id: 3, estado: false, url: "/search" },
    { id: 4, estado: false, url: "/search" },
  ]);

  const handleButtonClick = (id) => {
    const updatedBotones = botones.map((boton) => {
      if (boton.id == id) {
        if (boton.estado == false) {
          return { ...boton, estado: !boton.estado };
        } else {
          return { ...boton, estado: boton.estado };
        }
      } else {
        return { ...boton, estado: false };
      }
    });
    setBotones(updatedBotones);
  };

  return (
    <div className="absolute flex flex-col sm:flex-row top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      {/* <Link to="/chat"> */}
        <div className="aspect-square mr-0 mb-4 sm:mr-4 sm:mb-0 flex flex-col justify-center items-center bg-white w-[15rem] h-[15rem] rounded-2xl drop-shadow-[0_25px_25px_rgba(255,255,255,0.25)] transition-all cursor-not-allowed hover:translate-y-[-10px]">
          <span className="font-bold text-2xl">
            Emma Chat
            <span className="ml-2">
              <i className="fa-solid fa-angle-right"></i>
            </span>
          </span>
          <span className="text-xs">Upcomming next...</span>
        </div>
      {/* </Link> */}
      <Link to="/convertations">
        <div className="aspect-square flex justify-center items-center bg-white w-[15rem] h-[15rem] rounded-2xl drop-shadow-[0_25px_25px_rgba(255,255,255,0.25)] transition-all cursor-pointer hover:translate-y-[-10px]">
          <span className="font-bold text-2xl">
            Emma<br/>Convertations
            <span className="ml-2">
              <i className="fa-solid fa-angle-right"></i>
            </span>
          </span>
        </div>
      </Link>
    </div>
  );
};
