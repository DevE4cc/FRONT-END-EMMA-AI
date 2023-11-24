import { useState, useEffect, useRef } from "react";
import axios from "axios";

const useOpenAITTS = (aiResponse) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContext = useRef(new AudioContext());
  const sourceNode = useRef(null);
  const [onResult, setOnResult] = useState(false);

  useEffect(() => {
    if (aiResponse) {
      fetchAudio(aiResponse);
    }
  }, [aiResponse]);

  const fetchAudio = async (text) => {
    try {
      // inicia la petición
      setOnResult(true);

      const audioData = await convertTextToAudio(text);

      // termina la petición
      setOnResult(false);
      playAudio(audioData);
    } catch (error) {
      console.error("Error fetching audio:", error);
    }
  };

  const playAudio = async (audioBuffer) => {
    const decodedAudioData = await audioContext.current.decodeAudioData(
      audioBuffer
    );

    if (sourceNode.current) {
      sourceNode.current.disconnect();
    }

    sourceNode.current = audioContext.current.createBufferSource();
    sourceNode.current.buffer = decodedAudioData;
    sourceNode.current.connect(audioContext.current.destination);
    sourceNode.current.start();
    setIsPlaying(true);

    sourceNode.current.onended = () => {
      setIsPlaying(false);
    };
  };

  const stopPlayback = () => {
    if (sourceNode.current) {
      sourceNode.current.stop();
      sourceNode.current.disconnect();
      sourceNode.current = null;
      setIsPlaying(false);
    }
  };

  return { isPlaying, stopPlayback, onResult };
};

// Function to convert text to audio using OpenAI's TTS API
const convertTextToAudio = async (textToConvert) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const requestBody = {
    model: "tts-1",
    input: textToConvert,
    voice: "nova",
  };

  const apiRequestOptions = {
    method: "POST",
    url: `https://api.openai.com/v1/audio/speech`,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    data: requestBody,
    responseType: "arraybuffer",
  };

  const apiResponse = await axios.request(apiRequestOptions);

  return apiResponse.data;
};

export default useOpenAITTS;
