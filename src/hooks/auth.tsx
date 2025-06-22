import React, { createContext, useState, useContext } from "react";
import api from "../services/api";
import SignIn from "../Pages/SignIn";

interface IAuthContext {
  logged: boolean;
  signIn(email: string, password: string): void;
  signOut(): void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

const AuthProvider: React.FC<any> = ({ children }) => {
  const [logged, setLogged] = useState<boolean>(() => {
    const isLogged = localStorage.getItem("@minha-carteira:logged");

    return !!isLogged;
  });

  const signIn = async (email: string, password: string) => {
    let res = await api
      .post("/users/login", { username: email, password: password })
      .then((e) => {
        localStorage.setItem("@minha-carteira:logged", "true");
        localStorage.setItem("@minha-carteira:token", e.data.access_token);
        localStorage.setItem("@minha-carteira:userId", e.data.user.id);
        localStorage.setItem("@minha-carteira:userEmail", e.data.user.email);
        localStorage.setItem("@minha-carteira:name", e.data.user.name);
        window.location.reload();
      });
  };

  const signOut = () => {
    localStorage.removeItem("@minha-carteira:logged");
    localStorage.removeItem("@minha-carteira:token");
    localStorage.removeItem("@minha-carteira:userId");
    localStorage.removeItem("@minha-carteira:userEmail");
    localStorage.removeItem("@minha-carteira:name");
    setLogged(false);
  };

  return (
    <AuthContext.Provider value={{ logged, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): IAuthContext {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
