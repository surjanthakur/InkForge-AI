import { useContext, createContext, useState, useEffect } from "react";
import { CurrentUser } from "../services/authServices";

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [currUser, setCurrUser] = useState(null);
  const [authLoader, setAuthLoader] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  const get_currUser = async () => {
    try {
      const res = await CurrentUser();
      if (res.ok) {
        setIsCurrentUser(true);
        setCurrUser(res.data);
      } else {
        setIsCurrentUser(false);
        setCurrUser(null);
      }
      return res;
    } catch (error) {
      setCurrUser(null);
      throw error;
    } finally {
      setAuthLoader(false);
    }
  };

  useEffect(() => {
    get_currUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ currUser, get_currUser, authLoader, isCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
