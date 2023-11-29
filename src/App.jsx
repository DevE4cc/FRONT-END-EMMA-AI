import React, { useEffect, useState } from "react";

// components
import VoiceRecognitionComponent from "./components/VoiceRecognitionComponent/VoiceRecognitionComponent";
import TypeWriter from "./components/TypeWriter/TypeWriter";

// hooks
import useAiResponse from "./hooks/useAiResponse";
import useOpenAITTS from "./hooks/useOpenAITTS";

// spinners
import PulseLoader from "react-spinners/PulseLoader";
import ScaleLoader from "react-spinners/ScaleLoader";
import GridLoader from "react-spinners/GridLoader";
import PacmanLoader from "react-spinners/PacmanLoader";

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [transcript, setTranscript] = useState("");
  const resetTranscript = () => setTranscript(""); // Función para resetear el transcript

  const processText = (text) => {
    const regex = /(\n- .+)|([^.!?]+[.!?])/g; // Regex para identificar listas y oraciones.
    const matches = text.match(regex) || [];
    const processedText = [];

    let currentText = "";

    matches.forEach((match) => {
      if (match.trim().startsWith("-")) {
        if (currentText.split(" ").length >= 10) {
          processedText.push(currentText.trim());
          currentText = "";
        }
        processedText.push(match.trim());
      } else {
        const wordCount =
          currentText.split(" ").length + match.split(" ").length;
        if (wordCount >= 10) {
          processedText.push(currentText.trim() + " " + match.trim());
          currentText = "";
        } else {
          currentText += " " + match;
        }
      }
    });

    if (currentText.trim()) {
      if (processedText.length > 0) {
        processedText[processedText.length - 1] += " " + currentText.trim();
      } else {
        processedText.push(currentText.trim());
      }
    }
    return processedText;
  };

  const { aiResponse, isLoading, error, cancelRequest, threadId } =
    useAiResponse(transcript, resetTranscript);

  const [isRecording, setIsRecording] = useState(false);
  // Utiliza el hook useElevenLabs
  const { stopPlayback, onResult, isPlaying } = useOpenAITTS(aiResponse);

  const handleTranscript = (newTranscript) => {
    resetTranscript();
    setTranscript((prevTranscript) => newTranscript);
  };

  const handleCancel = () => {
    cancelRequest();
    stopPlayback(); // Detiene la reproducción del audio
    resetTranscript(); // Reinicia el transcript
  };

  const handleToggleRecording = () => {
    setIsInitialized(true);
    setIsRecording(!isRecording);
  };

  useEffect(() => {
    if (!isInitialized) return; // No ejecutar hasta que isInitialized sea true

    if (isPlaying) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
    }
  }, [isPlaying, isInitialized]);

  return (
    <div className="App h-full w-full">
      <VoiceRecognitionComponent
        onTranscript={handleTranscript}
        handleCancel={handleCancel}
        isRecordingApp={isRecording}
        setIsRecordingApp={setIsRecording}
        isPlaying={isPlaying}
        stopPlayback={stopPlayback}
      />
      <div className="p-4">
        <p className="p-4 pt-6 block relative mx-auto bg-slate-700 text-white rounded-xl text-sm min-h-[4rem] min-w-[80%]">
          <span className="absolute top-[0.4rem] left-[1rem] text-xs text-gray-300">
            Transcript:
          </span>
          <span className="text-white">{transcript}</span>
        </p>
        <p className="p-4 pt-6 mt-4 block relative mx-auto bg-slate-700 text-white rounded-xl text-sm min-h-[4rem] min-w-[80%] max-h-[55vh] overflow-auto">
          <span className="absolute top-[0.4rem] left-[1rem] text-xs text-gray-300">
            Respuesta de Emma:
          </span>
          <span className="text-white markdown">
            <TypeWriter text={aiResponse} delay={200} />
          </span>
        </p>
        <div className="bottom-[10rem] fixed left-[50%] translate-x-[-50%]">
          {isRecording}
          {onResult || isLoading ? (
            <PulseLoader color="#ffffff" />
          ) : isPlaying ? (
            <ScaleLoader color="#ffffff" height={80} />
          ) : isRecording ? (
            <GridLoader color="#ffffff" />
          ) : null}
        </div>
      </div>

      {isPlaying ? (
        <div className="fixed bottom-[3.6rem] left-[25%] sm:left-[35%] translate-x-[-50%]">
          <div
            className="border-[3px] text-white w-[2.5rem] aspect-square flex justify-center items-center text-sm rounded-full cursor-pointer"
            onClick={() => stopPlayback()}
          >
            <p className="text-center">
              <i className="fa-solid fa-stop"></i>
            </p>
            <span className="text-slate-400 text-xs absolute w-[4rem] text-center bottom-[-2.1rem] left-[50%] translate-x-[-50%]">
              Stop Emma
            </span>
          </div>
        </div>
      ) : null}

      <div></div>
      <div className="z-[100]">
        {threadId != "" ? (
          <div className="fixed bottom-[3rem] left-[50%] translate-x-[-50%]">
            <div className="relative">
              {isRecording || (isPlaying && !isRecording) ? (
                <>
                  <button
                    className="bg-red-700 text-white text-3xl w-[4rem] font-bold rounded-full aspect-square"
                    onClick={() => handleToggleRecording()}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                  <span className="text-slate-400 text-xs absolute w-[10rem] text-center bottom-[-1.5rem] left-[50%] translate-x-[-50%]">
                    Finish conversation
                  </span>
                </>
              ) : null}

              {!isRecording && !isPlaying ? (
                <>
                  <button
                    className="bg-blue-700 text-white text-3xl w-[4rem] font-bold rounded-full aspect-square"
                    onClick={() => handleToggleRecording()}
                  >
                    <i className="fa-solid fa-play"></i>
                  </button>
                  <span className="text-slate-400 text-xs absolute w-[10rem] text-center bottom-[-1.5rem] left-[50%] translate-x-[-50%]">
                    Start
                  </span>
                </>
              ) : null}
            </div>
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
}

export default App;
