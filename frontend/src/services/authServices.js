import axios from "axios";

const API_URL = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1.0/users",
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

// api call to get current user
const CurrentUser = async() =>{
  const res = await API_URL.get("/me")
  return res.data

}

export { signupUser, LoginUser , CurrentUser };
