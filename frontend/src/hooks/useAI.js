import { useState } from "react";
import { fetchChatbotResponse } from "../services/aiServices";

export const UseAiHook = () => {
  const [isLoader, setIsLoader] = useState(false);

  const fetchAIResponse = async (data) => {
    setIsLoader(true);
    try {
      const res = await fetchChatbotResponse(data);
      if (!res.ok) return res;
      return res;
    } finally {
      setIsLoader(false);
    }
  };
  return { fetchAIResponse, isLoader };
};
