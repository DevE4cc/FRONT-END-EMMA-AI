import { useState, useEffect, useRef } from "react";
import axios from "axios";

const useElevenLabsHttp = (aiResponse) => {
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

// Function to convert text to audio using ElevenLabs API
const convertTextToAudio = async (textToConvert) => {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID;

  const apiRequestOptions = {
    method: "POST",
    url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    headers: {
      accept: "audio/mpeg",
      "content-type": "application/json",
      "xi-api-key": apiKey,
    },
    data: {
      text: textToConvert,
      settings: {
        imilarity_boost: 0.75,
        stability: 0.5,
        style: 0,
        use_speaker_boost: true,
      },
      model_id: "eleven_multilingual_v2",
    },
    responseType: "arraybuffer",
  };

  const apiResponse = await axios.request(apiRequestOptions);
  return apiResponse.data;
};

export default useElevenLabsHttp;
