import React, { useContext } from "react";
import { Redirect } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { CurrentSectionContextProvider } from "../context/CurrentSectionContext";
import { LoadingContextProvider } from "../context/LoadingContext";
import Admin from "./admin/Admin";
import Master from "./master/Master";
import OnlyView from "./onlyView/OnlyView";
import Routes from "./Routes";

const QRSystem = () => {
  const { user } = useContext(AuthContext);
  return (
    <CurrentSectionContextProvider>
      <LoadingContextProvider>
        {user.type === "Master" && <Master />}
        {(user.type === "Admin" || user.type === "Master") && <Admin />}
        {user.type === "Consulta" && <OnlyView />}
      </LoadingContextProvider>
    </CurrentSectionContextProvider>
  );
};

export default QRSystem;
