import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/chatbot",
  withCredentials: true,
});

// helper function to normalize error
const handleApiError = (err) => {
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

  return { ok: false, error_msg: detail };
};

// ai generated response
export const fetchChatbotResponse = async (data) => {
  try {
    const res = await api.post("/messages", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      ok: true,
      data: res?.data,
      status: res?.status,
    };
  } catch (err) {
    return handleApiError(err);
  }
};
