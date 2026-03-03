import { useState } from "react";
import { signupUser, LoginUser , CurrentUser } from "../services/authServices";

export const UseAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCurrentUser , setIsCurrentUser] = useState(false)


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
  const Login = async(data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await LoginUser(data);
      return res;
    } catch (err) {
      setError(err.response?.data?.detail || "something went wrong");
    }
  };

  // curr user hook
  const CurrUser = async() =>{
    try {
      const res = await CurrentUser()
      setIsCurrentUser(true)
      return res
    }catch(err){
      setError(err.response?.data?.detail || "you are not authenticated to access resource!")
      setIsCurrentUser(false)
    }

  }
  return { Signup, Login, CurrUser , loading, error ,  isCurrentUser };
};
