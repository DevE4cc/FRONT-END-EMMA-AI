import React from "react";
import Typewriter from "../TypeWriter/TypeWriter";

export const ChatMessaje = ({ message, isEmma }) => {
  const emmaClass = isEmma ? "bg-slate-700 " : "bg-slate-500 ml-auto";
  return (
    <div className={`p-4 w-[90%] pt-2 rounded-xl text-white mb-2 ${emmaClass}`}>
      <div className="chat-message">
        <span className="font-bold text-xs ">{isEmma ? "Emma: " : "Tu: "}</span>
        <br />
        {isEmma ? <Typewriter text={message} delay={200} /> : <>{message}</> }
      </div>
    </div>
  );
};
