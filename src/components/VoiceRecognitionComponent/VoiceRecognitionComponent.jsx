import React, { useState, useEffect } from "react";
import annyang from "annyang";

const VoiceRecognitionComponent = ({
  onTranscript,
  handleCancel,
  isRecordingApp,
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

  useEffect(() => {
    if (!isRecordingApp) {
      annyang.abort();
      setIsRecording(false);
    } else {
      annyang.start({ autoRestart: true, continuous: true });
      setIsRecording(true);
    }
  }
  , [isRecordingApp]);

  return null;
};

export default VoiceRecognitionComponent;
