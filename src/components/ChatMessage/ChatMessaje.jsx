import React, { useRef, useState } from "react";
import Typewriter from "../TypeWriter/TypeWriter";
import MoonLoader from "react-spinners/MoonLoader";

export const ChatMessaje = ({ message, isEmma, audioData }) => {
  const emmaClass = isEmma ? "bg-slate-700 " : "bg-slate-500 ml-auto";
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = (audioData) => {
    // reproducir audio de audioData e introducirlo en audioRef
    const audioContext = new AudioContext();
    const sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = audioData;
    sourceNode.connect(audioContext.destination);
    sourceNode.start();
    // cuando termine de reproducir, cambiar el estado de isPlaying
    sourceNode.onended = () => {
      setIsPlaying(false);
    };
    audioRef.current = sourceNode;
    setIsPlaying(true);
  }

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.stop();
      audioRef.current.disconnect();
      audioRef.current = null;
    }
    setIsPlaying(false);
  }
  return (
    <div className={`p-4 w-[90%] pt-2 rounded-xl text-white mb-2 ${emmaClass}`}>
      <div className="chat-message">
        <span className="font-bold text-xs ">{isEmma ? "Emma: " : "You: "}</span>
        <br />
        {isEmma ? (
          <div className="relative">
            {isPlaying ? ( 
              <span onClick={() => stopPlayback()} className="w-[1.5em] cursor-pointer bg-white rounded-full aspect-square flex justify-center items-center absolute right-[-0.5rem] top-[-2rem] text-blue-950">
                <i className="fa-solid fa-stop"></i>
              </span>
            ) : (
              <span onClick={() => playAudio(audioData)} className="w-[1.5em] cursor-pointer bg-white rounded-full aspect-square flex justify-center items-center absolute right-[-0.5rem] top-[-2rem] text-blue-950">
                <i className="fa-solid fa-play"></i>
              </span>
            )}

            {!audioData ? (
              <span className="w-[1.5em] cursor-pointer bg-white rounded-full aspect-square flex justify-center items-center absolute right-[-0.5rem] top-[-2rem] text-blue-950">
                <MoonLoader
                  color="#000"
                  size={15}
                />
              </span>
            ) : null}
            <Typewriter text={message} delay={200} />
          </div>
        ) : (
          <>{message}</>
        )}
      </div>
    </div>
  );
};
