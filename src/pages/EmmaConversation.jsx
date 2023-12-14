import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dropdown, ToggleSwitch } from "flowbite-react";
import { Link } from "react-router-dom";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import useSession from "../hooks/useSession";

// components
import VoiceRecognitionComponent from "../components/VoiceRecognitionComponent/VoiceRecognitionComponent";
import TypeWriter from "../components/TypeWriter/TypeWriter";

// hooks
import useAiResponse from "../hooks/useAiResponse";
import useOpenAITTS from "../hooks/useOpenAITTS";
import { useAudioRecorder } from "react-audio-voice-recorder";

// spinners
import PulseLoader from "react-spinners/PulseLoader";
import ScaleLoader from "react-spinners/ScaleLoader";
import GridLoader from "react-spinners/GridLoader";
import PacmanLoader from "react-spinners/PacmanLoader";

export const EmmaConversation = () => {
  const [openModal, setOpenModal] = useState(false);
  const { logout } = useSession();
  const [isInitialized, setIsInitialized] = useState(false);
  const [transcript, setTranscript] = useState("");
  const resetTranscript = () => setTranscript(""); // Función para resetear el transcript
  const [statusAnnyang, setStatusAnnyang] = useState(false); // Estado para saber si annyang es compatible con el navegador
  const [toggleAnnyang, setToggleAnnyang] = useState(false); // Estado para Activar/Desactivar annyang
  const [pressRecording, setPressRecording] = useState(false); // Estado para saber si se está presionando el botón de grabar

  const { startRecording, stopRecording, recordingBlob, mediaRecorder } =
    useAudioRecorder();
  // guardar en localStorage toggleAnnyang
  useEffect(() => {
    // verifica si existe el valor en localStorage
    // si no existe, lo crea
    if (!localStorage.getItem("toggleAnnyang")) {
      localStorage.setItem("toggleAnnyang", JSON.stringify(toggleAnnyang));
    } else {
      // si existe, lo actualiza
      setToggleAnnyang(JSON.parse(localStorage.getItem("toggleAnnyang")));
    }
  }, []);

  useEffect(() => {
    // actualiza el valor en localStorage
    localStorage.setItem("toggleAnnyang", JSON.stringify(toggleAnnyang));
  }, [toggleAnnyang]);

  const { aiResponse, isLoading, error, cancelRequest, threadId } =
    useAiResponse(transcript, "voice");

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

  const reloadPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    // Si annyang es compatible con el navegador
    if (statusAnnyang) {
      // inicializar statusAnnyang desde localStorage
      // verifica si existe el valor en localStorage
      const toggleAnnyang = localStorage.getItem("toggleAnnyang");
      if (toggleAnnyang) {
        setToggleAnnyang(JSON.parse(toggleAnnyang));
      } else {
        setToggleAnnyang(true);
      }
    }
  }, [statusAnnyang]);

  useEffect(() => {
    if (!isInitialized) return; // No ejecutar hasta que isInitialized sea true

    if (isPlaying) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
    }
  }, [isPlaying, isInitialized]);

  useEffect(() => {
    let audio;
    stopPlayback();
    cancelRequest();

    // Función para reproducir el audio
    const playAudio = (blob) => {
      audio = new Audio(URL.createObjectURL(blob));
    };

    if (pressRecording) {
      startRecording();
    } else {
      stopRecording();
      // Detiene la reproducción del audio
      if (audio) {
        audio.pause();
      }
    }

    // Efecto secundario para manejar la reproducción
    if (!pressRecording && recordingBlob) {
      // Retraso para asegurar que el blob esté listo
      const timer = setTimeout(() => {
        playAudio(recordingBlob);
        handleUploadAndTranscribe();
      }, 1000);

      // Limpieza
      return () => {
        clearTimeout(timer);
        if (audio) {
          audio.pause();
        }
      };
    }
  }, [pressRecording, recordingBlob]); // Incluye recordingBlob en las dependencias

  const handleUploadAndTranscribe = async () => {
    if (!recordingBlob) {
      console.log("No recording to upload");
      return;
    }

    let data = new FormData();
    data.append("file", recordingBlob, "recording.m4a"); // Agrega el nombre del archivo y la extensión
    data.append("model", "whisper-1");
    data.append("response_format", "text");

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.openai.com/v1/audio/transcriptions",
      headers: {
        Authorization: "Bearer " + import.meta.env.VITE_OPENAI_API_KEY,
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      setTranscript(response.data); // Actualiza el estado con la transcripción
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <VoiceRecognitionComponent
        onTranscript={handleTranscript}
        handleCancel={handleCancel}
        isRecordingApp={isRecording}
        setIsRecordingApp={setIsRecording}
        isPlaying={isPlaying}
        stopPlayback={stopPlayback}
        setStatusAnnyang={setStatusAnnyang}
      />
      <header className="w-full p-4 flex justify-between">
        <h1 className="text-white text-xl font-bold">Emma Conversations</h1>
        <div className="buttons flex flex-row space-x-2">
          <Link to="/">
            <span className="text-white aspect-square h-[2rem] flex justify-center items-center text-xl cursor-pointer">
              <i className="fa-solid fa-left"></i>
            </span>
          </Link>
          <span
            className="text-white aspect-square h-[2rem] flex justify-center items-center text-xl cursor-pointer"
            onClick={() => reloadPage()}
          >
            <i className="fa-solid fa-arrow-rotate-right"></i>
          </span>
          <Dropdown
            label=""
            dismissOnClick={false}
            placement="left-start"
            renderTrigger={() => (
              <span className="text-white aspect-square h-[2rem] flex justify-center items-center text-xl cursor-pointer">
                <i className="fa-solid fa-sliders"></i>
              </span>
            )}
          >
            <Dropdown.Item as="a">
              <ToggleSwitch
                label="Speech Recognition"
                checked={toggleAnnyang && statusAnnyang}
                onChange={() => setToggleAnnyang(!toggleAnnyang)}
                disabled={!statusAnnyang}
              />
            </Dropdown.Item>
          </Dropdown>
          <span
            className="text-white aspect-square h-[2rem] flex justify-center items-center text-xl cursor-pointer"
            onClick={() => setOpenModal(true)}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
          </span>
        </div>
      </header>
      <div className="p-4 grow flex flex-col w-full">
        <div className="grow w-full pb-8">
          <p className="p-4 pt-6 block relative mx-auto bg-slate-700 text-white rounded-xl text-sm min-h-[4rem] min-w-[100%]">
            <span className="absolute top-[0.4rem] left-[1rem] text-xs text-gray-300">
              Transcript:
            </span>
            <span className="text-white">{transcript}</span>
          </p>
          <p className="p-4 pt-6 mt-4 block relative mx-auto bg-slate-700 text-white rounded-xl text-sm min-h-[4rem] min-w-[100%] max-h-[55vh] overflow-auto">
            <span className="absolute top-[0.4rem] left-[1rem] text-xs text-gray-300">
              Emma's response:
            </span>
            <span className="text-white markdown">
              <TypeWriter text={aiResponse} delay={200} />
            </span>
          </p>
        </div>
        <div className="mx-auto">
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

      <div className="z-[100] flex-none h-[8rem] relative">
        {threadId != "" ? (
          <div className="">
            {toggleAnnyang && statusAnnyang ? (
              <div className="relative flex flex-row items-end justify-center">
                <div className="flex h-[100%] w-[33.33%] justify-center items-center">
                  {isPlaying ? (
                    <div className="flex flex-col justify-center items-center">
                      <div
                        className="border-[3px] text-white w-[2.5rem] aspect-square flex justify-center items-center text-sm rounded-full cursor-pointer"
                        onClick={() => stopPlayback()}
                      >
                        <p className="text-center">
                          <i className="fa-solid fa-stop"></i>
                        </p>
                      </div>
                      <span className="text-slate-400 text-xs text-center mt-2">
                        Stop Emma
                      </span>
                    </div>
                  ) : null}
                </div>
                <div className="w-[33.33%] flex flex-col items-center">
                  {isRecording || (isPlaying && !isRecording) ? (
                    <>
                      <button
                        className="bg-red-700 text-white text-3xl w-[4rem] font-bold rounded-full aspect-square"
                        onClick={() => handleToggleRecording()}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                      <span className="text-slate-400 text-xs text-center mt-2">
                        Finish
                        <br />
                        conversation
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
                      <span className="text-slate-400 text-xs text-center mt-2">
                        Start
                      </span>
                    </>
                  ) : null}
                </div>
                <div className="flex h-[100%] w-[33.33%]"></div>
              </div>
            ) : (
              <>
                <div className="relative flex flex-row items-end">
                  <div className="flex h-[100%] w-[33.33%] justify-center items-center">
                    {isPlaying ? (
                      <div className="flex flex-col justify-center items-center">
                        <div
                          className="border-[3px] text-white w-[2.5rem] aspect-square flex justify-center items-center text-sm rounded-full cursor-pointer"
                          onClick={() => stopPlayback()}
                        >
                          <p className="text-center">
                            <i className="fa-solid fa-stop"></i>
                          </p>
                        </div>
                        <span className="text-slate-400 text-xs text-center mt-2">
                          Stop Emma
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-center w-[33.33%]">
                    <button
                      className={`bg-red-700 text-white text-3xl w-[4rem] font-bold rounded-full aspect-square z-10 ${
                        pressRecording ? "scale-125" : ""
                      } transition-all duration-300 ease-in-out transform`}
                      onMouseDown={() => setPressRecording(true)}
                      onMouseUp={() => setPressRecording(false)}
                      onTouchStart={() => setPressRecording(true)}
                      onTouchEnd={() => setPressRecording(false)}
                    >
                      <i className="fa-solid fa-microphone"></i>
                    </button>
                    <span className="text-slate-400 text-xs text-center mt-2">
                      Push
                    </span>
                  </div>
                  <div className="flex h-[100%] w-[33.33%]"></div>
                </div>
              </>
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
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to log out?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => logout()}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
