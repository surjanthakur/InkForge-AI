import { useState } from "react";
import { signupUser, loginUser } from "../services/authServices";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  // signup
  const signup = async (data) => {
    setLoading(true);
    try {
      const res = await signupUser(data);
      if (!res.ok) {
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
    try {
      const res = await loginUser(data);
      if (!res.ok) {
        return res;
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  return {
    signup,
    login,
    loading,
  };
};
