import React, { useState } from "react";
import VoiceRecognitionComponent from "./components/VoiceRecognitionComponent/VoiceRecognitionComponent";
import useAiResponse from "./hooks/useAiResponse";

import useOpenAITTS from "./hooks/useOpenAITTS";
import useElevenLabs from "./hooks/useElevenLabs";
import useElevenLabsHttp from "./hooks/useElevenLabsHttp";

import PulseLoader from "react-spinners/PulseLoader";
import ScaleLoader from "react-spinners/ScaleLoader";
import GridLoader from "react-spinners/GridLoader";

function App() {
  const [transcript, setTranscript] = useState("");
  const resetTranscript = () => setTranscript(""); // Función para resetear el transcript

  const { aiResponse, isLoading, error, cancelRequest } = useAiResponse(
    transcript,
    resetTranscript
  );

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

  return (
    <div className="App h-full w-full">
      <VoiceRecognitionComponent
        onTranscript={handleTranscript}
        handleCancel={handleCancel}
        setIsRecordingApp={setIsRecording}
        isPlaying={isPlaying}
        stopPlayback={stopPlayback}
      />
      <div className="p-4">
        <p className="p-4 pt-6 block relative mx-auto bg-slate-300 rounded-xl text-sm min-h-[4rem] min-w-[80%]">
          <span className="absolute top-[0.4rem] left-[1rem] text-xs text-gray-600">
            Transcript:
          </span>
          {transcript}
        </p>
        <p className="p-4 pt-6 mt-4 block relative mx-auto bg-slate-300 rounded-xl text-sm min-h-[4rem] min-w-[80%]">
          <span className="absolute top-[0.4rem] left-[1rem] text-xs text-gray-600">
            Respuesta de AI:
          </span>
          {aiResponse}
        </p>
        <div className="fixed top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]">
          {isRecording}
          {onResult || isLoading ? (
            <PulseLoader color="#3663d6" />
          ) : isPlaying ? (
            <ScaleLoader color="#3663d6" height={80} />
          ) : isRecording ? (
            <GridLoader color="#3663d6" />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
