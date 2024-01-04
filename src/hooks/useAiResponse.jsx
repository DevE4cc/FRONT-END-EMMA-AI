import { useState, useEffect, useRef } from "react";
import axios from "axios";
import useSession from "./useSession";

const useAiResponse = (transcript, platform) => {
  const [aiResponse, setAiResponse] = useState("");
  const [aiArrayResponse, setArrayAiResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isRequestPending = useRef(false);
  const abortController = useRef(new AbortController());
  const [threadId, setThreadId] = useState("");
  const { userData } = useSession();

  useEffect(() => {
    // get thread id
    axios
      .post(import.meta.env.VITE_API_URL + "thread", {
        userStudent: userData.userStudent,
        platform: 'Coach Emma',
        threadType: platform,
      })
      .then((res) => {
        setThreadId(res.data.threadId);
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
      platform: platform,
    };

    if (transcript !== "") {
      isRequestPending.current = true;
      setIsLoading(true);
      axios
        .post(import.meta.env.VITE_API_URL + "thinking", data, {
          signal: abortController.current.signal,
        })
        .then((res) => {
          setAiResponse(res.data);
          setArrayAiResponse(processText(res.data));
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

  const processText = (text) => {
    // Regex para identificar párrafos y listas en Markdown.
    const regex =
      /(\n- .+)|(\n\d+\. .+)|((?:\r?\n|\r).+?)(?=\n\n|\n- |\n\d+\. |$)/gs;
    const matches = text.match(regex) || [];
    const processedText = matches.map((match) => match.trim());

    return processedText;
  };

  return {
    aiResponse,
    isLoading,
    error,
    cancelRequest,
    threadId,
    aiArrayResponse,
  };
};

export default useAiResponse;
