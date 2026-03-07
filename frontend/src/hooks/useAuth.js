import { useState } from "react";
import { signupUser, loginUser, CurrentUser } from "../services/authServices";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  // signup
  const signup = async (data) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await signupUser(data);
      if (!res.ok) {
        setAuthError(res.detail);
        return res;
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  // login
  const login = async (data) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await loginUser(data);
      if (!res.ok) {
        setAuthError(res.detail);
        return res;
      }
      setIsCurrentUser(true);
      return res;
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
      setAuthError(
        err.response?.data?.detail ||
          "you are not authenticated to access resource!"
      );
      setIsCurrentUser(false);
    }
  };

  return {
    signup,
    login,
    CurrUser,
    loading,
    authError,
    isCurrentUser,
  };
};
