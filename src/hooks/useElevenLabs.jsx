import { useState, useEffect, useRef } from "react";

const useElevenLabs = (aiResponse) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioChunks = useRef([]);
  const audioContext = useRef(new AudioContext());
  const sourceNode = useRef(null);
  const webSocket = useRef(null);
  const playTimer = useRef(null);
  
  const [onResult, setOnResult] = useState(false);

  const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID;
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const modelId = import.meta.env.VITE_ELEVENLABS_MODEL_ID;

  useEffect(() => {
    if (aiResponse) {
      // Inicia una nueva conexión WebSocket
      webSocket.current = new WebSocket(
        `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=${modelId}&optimize_streaming_latency=4`
      );

      webSocket.current.onopen = () => {
        // Enviar la respuesta de la AI
        const bosMessage = {
          text: " ",
          voice_settings: {
            stability: 0.5,
            similarity_boost: true,
          },
          optimize_streaming_latency: 4,
          xi_api_key: apiKey,
        };
        webSocket.current.send(JSON.stringify(bosMessage));

        // Enviar la respuesta de la AI
        if (aiResponse) {
          const textMessage = {
            text: aiResponse,
            try_trigger_generation: true,
          };
          webSocket.current.send(JSON.stringify(textMessage));
          setOnResult(true);

          // Mensaje final (End of Speech)
          const eosMessage = {
            text: "",
          };
          webSocket.current.send(JSON.stringify(eosMessage));
        }
      };

      webSocket.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.audio) {
          audioChunks.current.push(data.audio);
          playAudioChunks();
          setOnResult(false);
        }
      };
  

      webSocket.current.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };
    }

    return () => {
      // Limpiar el temporizador si está activo
      if (playTimer.current) {
        clearTimeout(playTimer.current);
      }
    };
  }, [aiResponse, voiceId]);

  const playAudioChunks = async () => {
    if (audioChunks.current.length > 0 && !isPlaying) {
      setIsPlaying(true);
      playNextChunk();
    }
  };

  const playNextChunk = async () => {
    if (audioChunks.current.length > 0) {
      const audioChunk = audioChunks.current.shift();
      await playAudio(audioChunk);
    } else {
      setIsPlaying(false);
    }
  };

  const playAudio = async (audioData) => {
    const audioBuffer = base64ToArrayBuffer(audioData);
    const decodedAudioData = await audioContext.current.decodeAudioData(audioBuffer);

    if (sourceNode.current) {
      sourceNode.current.disconnect();
    }

    sourceNode.current = audioContext.current.createBufferSource();
    sourceNode.current.buffer = decodedAudioData;
    sourceNode.current.connect(audioContext.current.destination);
    sourceNode.current.start();

    return new Promise((resolve) => {
      sourceNode.current.onended = () => {
        resolve();
        playNextChunk();
      };
    });
  };


  // Función para convertir base64 a ArrayBuffer
  function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  const stopPlayback = () => {
    if (sourceNode.current) {
      sourceNode.current.stop();
      sourceNode.current.disconnect();
      sourceNode.current = null;
    }
    audioChunks.current = [];
    setIsPlaying(false);
    // Reiniciar la conexión WebSocket
    if (webSocket.current) {
      webSocket.current.close();
      webSocket.current = null;
    }
  };

  return { isPlaying, stopPlayback, onResult };
};

export default useElevenLabs;
