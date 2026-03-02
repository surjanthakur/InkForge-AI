import { useState } from "react";
import { signupUser, LoginUser } from "../services/authServices";

export const UseAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // signup user hook
  const Signup = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await signupUser(data);
      return res;
    } catch (err) {
      setError(err.response?.data?.detail || "something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  // login user hook
  const Login = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await LoginUser(data);
      return res;
    } catch (err) {
      setError(err.response?.data?.detail || "something went wrong");
    }
  };
  return { Signup, Login, loading, error };
};
