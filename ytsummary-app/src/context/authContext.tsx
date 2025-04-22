import { createContext, useState, ReactNode, useEffect } from "react";
import api from "../Api";

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
    api
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
    api.post("/logout").finally(() => {
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
