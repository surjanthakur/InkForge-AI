import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1.0/users",
  withCredentials: true,
});

// helper function to normalize error messages from server
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

// helper function to handle structure response
const request_handler = async (func) => {
  try {
    const res = await func();
    return {
      ok: true,
      status: res.status,
      data: res.data,
      detail: null,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// signup user
export const signupUser = async (data) => {
  return await request_handler(() => api.post("/signup", data));
};

// login user
export const loginUser = async (data) => {
  return await request_handler(() => api.post("/login", data));
};

//current user
export const CurrentUser = async () => {
  return await request_handler(() => api.get("/me"));
};

//logout user
export const LogoutUser = async () => {
  return await request_handler(() => api.post("/logout"));
};
