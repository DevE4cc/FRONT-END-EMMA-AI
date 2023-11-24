import { useState, useEffect, useRef } from "react";
import axios from "axios";

const useAiResponse = (transcript) => {
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isRequestPending = useRef(false);
  const abortController = useRef(new AbortController());
  const [threadId, setThreadId] = useState("");

  useEffect(() => {
    // get thread id
    axios
      .get(import.meta.env.VITE_API_URL2 + "thread")
      .then((res) => {
        setThreadId(res.data.id);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const data = {
      text: transcript,
      threadId: threadId,
      assistantId: import.meta.env.VITE_ASSISTANT_ID,
    };

    if (transcript !== "") {
      isRequestPending.current = true;
      setIsLoading(true);
      axios
        .post(import.meta.env.VITE_API_URL2 + "thinking", data, {
          signal: abortController.current.signal,
        })
        .then((res) => {
          console.log("res", res);
          setAiResponse(res.data);
          setIsLoading(false);
          isRequestPending.current = false;
        })
        .catch((err) => {
          if (err.name === "AbortError") {
            console.log("Petición abortada");
          } else {
            console.log(err);
            setError(err);
            setIsLoading(false);
            isRequestPending.current = false;
          }
        });
    }
  }, [transcript]); // Solo depende de 'transcript'

  const cancelRequest = () => {
    if (isRequestPending.current) {
      abortController.current.abort();
      abortController.current = new AbortController();
      isRequestPending.current = false;
      console.log("Petición cancelada");
    }
  };

  return { aiResponse, isLoading, error, cancelRequest };
};

export default useAiResponse;
