import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1.0/users",
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

// signup user
export const signupUser = async (data) => {
  try {
    const res = await api.post("/signup", data);

    return {
      ok: true,
      status: res.status,
      data: res.data,
      detail: null,
    };
  } catch (err) {
    return handleApiError(err);
  }
};

// login user
export const loginUser = async (data) => {
  try {
    const res = await api.post("/login", data);

    return {
      ok: true,
      status: res.status,
      data: res.data,
      detail: null,
    };
  } catch (err) {
    return handleApiError(err);
  }
};

// api call to get current user
export const CurrentUser = async () => {
  try {
    const res = await api.get("/me");

    return {
      ok: true,
      status: res.status,
      data: res.data,
    };
  } catch (err) {
    return handleApiError(err);
  }
};

// api call to logout user
export const LogoutUser = async () => {
  try {
    const res = await api.post("/logout");
    return {
      ok: true,
      status: res.status,
      data: res.data,
    };
  } catch (err) {
    return handleApiError(err);
  }
};
