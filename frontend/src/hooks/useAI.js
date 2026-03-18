import { useState } from "react";
import { fetchChatbotResponse } from "../services/aiServices";

export const UseAiHook = () => {
  const [isLoader, setIsLoader] = useState(false);

  //   fetch ai respone
  const fetchAIResponse = async (message) => {
    setIsLoader(true);
    try {
      const res = await fetchChatbotResponse(message);
      if (!res.ok) return;
      return res;
    } finally {
      setIsLoader(false);
    }
  };
  return { fetchAIResponse, isLoader };
};
