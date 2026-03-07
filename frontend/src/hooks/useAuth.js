import { useState } from "react";
import { signupUser, LoginUser, CurrentUser } from "../services/authServices";

export const UseAuth = () => {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  // signup user hook
  const Signup = async (data) => {
    try {
      setLoading(true);
      setAuthError(null);
      const res = await signupUser(data);
      if (!res || res.success === false) {
        setAuthError(res?.detail || "Signup failed");
      }
      return res;
    } catch (err) {
      setAuthError(
        err.response?.data?.detail || "something went wrong try again"
      );
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
      const detail = err.response?.data?.detail || "something went wrong";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  // curr user hook
  const CurrUser = async () => {
    try {
      const res = await CurrentUser();
      setIsCurrentUser(true);
      return res;
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "you are not authenticated to access resource!"
      );
      setIsCurrentUser(false);
    }
  };
  return { Signup, Login, CurrUser, loading, authError, isCurrentUser };
};
