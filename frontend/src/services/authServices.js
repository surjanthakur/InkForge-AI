import axios from "axios";

const API_URL = axios.create({
  baseURL: "http://localhost:8000/api/v1.0/users",
  withCredentials: true,
});

// helper function to normalize error
const handleApiError = (err) => {
  const status = err.response?.status || 500;
  const data = err.response?.data ?? {};

  const rawDetail = data?.detail ?? data?.message;

  const detail =
    typeof rawDetail === "string"
      ? rawDetail
      : Array.isArray(rawDetail)
        ? rawDetail.map((m) => (typeof m === "string" ? m : m?.msg)).join(", ")
        : "Something went wrong";

  return { ok: false, status, data, detail };
};

// signup user
export const signupUser = async (data) => {
  try {
    const res = await API_URL.post("/signup", data);

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
    const res = await API_URL.post("/login", data);

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
const CurrentUser = async () => {
  const res = await API_URL.get("/me");
  return { status: res.status, data: res.data };
};

export { signupUser, loginUser, CurrentUser };
