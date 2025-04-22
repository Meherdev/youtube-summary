// src/context/AuthContext.tsx
import axios from "axios";
import { createContext, useState, ReactNode, useEffect } from "react";

type AuthContextType = {
  logout: () => void; 
  username: string | null;
  setUserName: (userName: string | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined); // ✅ correct casing

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);


  useEffect(() => {
    axios
      .get("/me")
      .then((res) => {
        setUsernameState(res.data.username);
        setIsLoggedIn(true);
      })
      .catch(() => {
        setUsernameState(null);
      });
  }, []);


  const setUsernameState = (name: string | null) => {
    setUserName(name);
  };

  const logout = () => {
    axios.post("/logout").finally(() => {
      setUsernameState(null);
      setIsLoggedIn(false);
    });
  };
  
  return (
    <AuthContext.Provider value={{ setUserName, logout, username, isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
