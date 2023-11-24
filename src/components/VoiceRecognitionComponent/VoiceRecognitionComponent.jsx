import React, { useState, useEffect } from "react";
import annyang from "annyang";

const VoiceRecognitionComponent = ({
  onTranscript,
  handleCancel,
  setIsRecordingApp,
  isPlaying,
  stopPlayback,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  // Estado para almacenar el transcript
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    if (!isPlaying) {
      onTranscript(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (annyang) {
      // Configura el idioma a español
      annyang.setLanguage(
        "es-SV,es-MX, en-US,es-CO, es-VE, es-AR,es-CL,es-GT,es-NI, es-HN"
      );

      // Añade los comandos a annyang
      annyang.addCommands({
        "stop": () => {
          handleCancel();
        },
        "*transcript": (allSpeech) => {
          setTranscript(allSpeech);
        },
      });
    } else {
      console.error("El navegador no soporta annyang");
    }

    return () => {
      // Detiene annyang cuando el componente se desmonta
      if (annyang) {
        annyang.abort();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      annyang.abort(); // Detiene annyang
    } else {
      annyang.start({ autoRestart: true, continuous: true }); // Inicia annyang
    }
    setIsRecording(!isRecording);
  };

  useEffect(() => {
    setIsRecordingApp(isRecording);
  }, [isRecording]);

  return (
    <div className="z-[100]">
      {
        isPlaying ? (
          <div className="fixed bottom-[7rem] left-[50%] translate-x-[-50%]">
            <div className="p-4 bg-red-500 text-white rounded cursor-pointer" onClick={() => stopPlayback()}>
              <p className="text-center">Parar audio <i class="fa-solid fa-circle-stop"></i></p>
            </div>
          </div>
        ) : null
      }
      <button
        className="bg-blue-500 text-white p-4 font-bold rounded fixed bottom-[2rem] left-[50%] translate-x-[-50%]"
        onClick={toggleRecording}
      >
        {isRecording ? "Detener Grabación" : "Iniciar Grabación"}
      </button>
    </div>
  );
};

export default VoiceRecognitionComponent;
