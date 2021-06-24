import React, { useState, createContext } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  const [user, setUser] = useState({
    isAuth: false,
    type: "",
  });
  const [authIsDone, setAuthIsDone] = useState(false);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        authIsDone,
        setAuthIsDone,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
