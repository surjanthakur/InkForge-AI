import { useContext, createContext } from "react";

export const AuthContext = createContext({
  currUser: null,
  get_currUser: () => {},
});

export const AuthContextProvider = AuthContext.Provider;

export const useAuthContext = () => {
  return useContext(AuthContext);
};
