import axios from "axios";

const API_URL = axios.create({
  baseURL: "http://localhost:5173",
  withCredentials: true,
});

// api call for signup user
const signupUser = async (data) => {
  const res = await API_URL.post("/signup", data);
  return res.data;
};

// api call for login user
const LoginUser = async (data) => {
  const res = await API_URL.post("/login", data);
  return res.data;
};

export { signupUser, LoginUser };
