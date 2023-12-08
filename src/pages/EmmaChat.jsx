import React, { useEffect, useState } from "react";

// hooks
import useAiResponse from "../hooks/useAiResponse";
import useOpenAITTS from "../hooks/useOpenAITTS";

// spinners
import SyncLoader from "react-spinners/SyncLoader";
import ScaleLoader from "react-spinners/ScaleLoader";
import GridLoader from "react-spinners/GridLoader";
import PacmanLoader from "react-spinners/PacmanLoader";

// css
import "./EmmaChat.css";
import { ChatMessaje } from "../components/ChatMessage/ChatMessaje";

export const EmmaChat = () => {
  const [transcript, setTranscript] = useState("");
  const resetTranscript = () => setTranscript(""); // Función para resetear el transcript
  const [conversations, setConversations] = useState([]); // Lista de convertaciones
  const [loadingEmma, setLoadingEmma] = useState(false); // Estado de carga de Emma

  const { aiResponse, isLoading, error, cancelRequest, threadId } =
    useAiResponse(transcript, resetTranscript);

  // Utiliza el hook useElevenLabs
  const { stopPlayback, onResult, isPlaying, audioData } =
    useOpenAITTS(aiResponse);

  const sentUserPromp = () => {
    // get user input in textarea
    const inputUser = document.getElementById("input-user");

    // get text from textarea
    const textUser = inputUser.value;

    // clear textarea
    inputUser.value = "";

    // crear objeto de conversación
    const conversation = {
      id: conversations.length + 1,
      text: textUser,
      isEmma: false,
    };

    // agregar conversación a la lista
    setConversations([...conversations, conversation]);

    // enviar texto a AI
    setTranscript(textUser);

    // set loading
    setLoadingEmma(true);
  };

  useEffect(() => {
    if (aiResponse) {
      const newConversations = [
        {
          id: conversations.length + 1,
          text: aiResponse,
          isEmma: true,
        },
      ];
      setConversations([...conversations, ...newConversations]);
    }
  }, [aiResponse]);

  useEffect(() => {
    // si el audioData no es null entonces enviar el audio al último mensaje de conversación
    if (audioData) {
      const lastConversation = conversations[conversations.length - 1];
      lastConversation.audioData = audioData;
      setConversations([...conversations]);
    }
  }, [audioData]);
  
  const reloadPage = () => {
    window.location.reload();
  };

  const returnToHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col h-full w-full p-4">
      <header className="w-full p-4 flex justify-between">
        <h1 className="text-white text-xl font-bold">Emma Chat</h1>
        <div className="buttons flex flex-row space-x-2">
          <span
            className="text-white aspect-square h-[2rem] flex justify-center items-center text-xl cursor-pointer"
            onClick={() => returnToHome()}
          >
            <i className="fa-solid fa-left"></i>
          </span>
          <span
            className="text-white aspect-square h-[2rem] flex justify-center items-center text-xl cursor-pointer"
            onClick={() => reloadPage()}
          >
            <i className="fa-solid fa-arrow-rotate-right"></i>
          </span>
        </div>
      </header>

      <div className="w-[100%] h-full bg-slate-900 mb-5 rounded-2xl p-4 overflow-auto">
        {conversations.map((conversation) => (
          <ChatMessaje
            key={conversation.id}
            message={conversation.text}
            isEmma={conversation.isEmma}
            audioData={conversation.audioData}
          />
        ))}

        {isLoading && (
          <div
            className={`p-4 w-[90%] pt-2 rounded-xl text-white mb-2 bg-slate-700`}
          >
            <div className="chat-message">
              <span className="font-bold text-xs ">Emma: </span>
              <br />
              <SyncLoader
                color="#ffffff"
                cssOverride={{}}
                margin={3}
                size={6}
              />
            </div>
          </div>
        )}
      </div>
      <div className="z-[100] w-[100%]">
        {threadId != "" ? (
          <div className="relative">
            <textarea
              type="text"
              id="input-user"
              className="border-2 mb-6 border-white bg-black text-white rounded-2xl h-[4rem] w-full p-2 pr-14 ring-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            ></textarea>
            {isPlaying ? (
              <button
                onClick={() => stopPlayback()}
                className="text-white bg-black text-xs rounded-xl border-2 border-white h-8 aspect-square absolute bottom-[50%rem] translate-y-[50%] right-[3%]"
              >
                <i className="fa-solid fa-stop"></i>
              </button>
            ) : (
              <button
                onClick={() => sentUserPromp()}
                className="text-white bg-black text-xs rounded-xl border-2 border-white h-8 aspect-square absolute bottom-[50%rem] translate-y-[50%] right-[3%]"
              >
                <i className="fa-solid fa-paper-plane-top"></i>
              </button>
            )}
          </div>
        ) : (
          <div className="fixed bottom-[2rem] left-[50%] translate-x-[-50%] flex flex-col justify-center">
            <div className="min-w-[6.8rem]">
              <PacmanLoader color="#fff" />
            </div>
            <p className="text-white text-center mt-2">Cargando...</p>
          </div>
        )}
      </div>
    </div>
  );
};
