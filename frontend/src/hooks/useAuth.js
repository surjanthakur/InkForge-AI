import { useState } from "react";
import { signupUser, loginUser, logoutUser } from "../services/authServices";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const request_handler = async (func) => {
    setLoading(true);
    try {
      const res = await func();
      if (!res.ok) {
        return res;
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data) => {
    return await request_handler(() => signupUser(data));
  };

  const login = async (data) => {
    return await request_handler(() => loginUser(data));
  };

  const logout = async () => {
    return await logoutUser();
  };

  return {
    signup,
    logout,
    login,
    loading,
  };
};
