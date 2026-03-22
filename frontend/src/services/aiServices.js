import axios from "axios";
import { cache } from "react";

const API_URL = axios.create({
  baseURL: "http://localhost:8000/api/v1.0/chatbot",
  withCredentials: true,
});

// helper function to normalize error
const handleApiError = (err) => {
  const status = err.response?.status || 500;
  const data = err.response?.data;

  const rawDetail = data?.detail ?? data?.message;
  const detail =
    typeof rawDetail === "string"
      ? rawDetail
      : Array.isArray(rawDetail)
        ? rawDetail
            .map((message) =>
              typeof message === "string" ? message : message?.msg
            )
            .join(", ")
        : "Something went wrong";

  return { ok: false, status, data, detail };
};

// ai generated response
export const fetchChatbotResponse = async (data) => {
  try {
    const res = API_URL.post("/msg/stream", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      ok: true,
      data: (await res).data,
      status: (await res).status,
      detail: null,
    };
  } catch (err) {
    handleApiError(err);
  }
};
