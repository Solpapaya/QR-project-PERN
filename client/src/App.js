import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AddPerson from "./routes/AddPerson";
import { MonthsContextProvider } from "./context/MonthsContext";
import { PersonSubsectionContextProvider } from "./context/PersonSubsectionContext";
import { SearchSubsectionContextProvider } from "./context/SearchSubsectionContext";
import { DepartmentSubsectionContextProvider } from "./context/DepartmentSubsectionContext";
import { CurrentSectionContext } from "./context/CurrentSectionContext";
import { CSSTransition } from "react-transition-group";
import { AlertContext } from "./context/AlertContext";
import { LoadingContext } from "./context/LoadingContext";
import Notification from "./components/Notification";
import Warning from "./components/Warning";
import Loading from "./components/Loading";
import { ExportBtnContextProvider } from "./context/ExportBtnContext";
import { PersonDetailContextProvider } from "./context/PersonDetailsContext";

// pages
import Home from "./routes/Home";
import PersonDetailPage from "./routes/PersonDetailPage";
import UpdatePage from "./routes/UpdatePage";
import Departments from "./routes/Departments";
import DepartmentUpdate from "./routes/DepartmentUpdate";
import UploadTaxReceipt from "./routes/UploadTaxReceipt";
import UpdateTaxReceipt from "./routes/UpdateTaxReceipt";
import Login from "./routes/Login";
import { fetchData } from "./functions/fetchData";
import NotFound from "./routes/NotFound";
import Test from "./routes/QRSystem";
import QRSystem from "./routes/QRSystem";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { showLoading } = useContext(LoadingContext);
  //   const [user, setUser] = useState({
  //     isAuth: false,
  //     type: "",
  //   });
  //   const [authIsDone, setAuthIsDone] = useState(false);
  const { user, setUser, authIsDone, setAuthIsDone } = useContext(AuthContext);
  const { currentSection, isEditPersonSection } = useContext(
    CurrentSectionContext
  );
  const { alert, showAlert, setShowAlert, showWarning } =
    useContext(AlertContext);

  const removeNotification = () => {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const isAuth = async () => {
    try {
      const headers = { token: localStorage.token };
      const response = await fetchData("get", "/auth", { headers });
      setUser({ isAuth: response.isAuth, type: response.userType });
    } catch (err) {
      setUser({ isAuth: false, type: "" });
    }
    setAuthIsDone(true);
  };

  const askIsAuth = (time) => {
    const timeInterval = parseInt(time + "000");
    setInterval(() => {
      isAuth();
    }, timeInterval);
  };

  useEffect(() => {
    isAuth();
  }, []);

  return (
    <Router>
      {authIsDone ? (
        <Switch>
          <Route exact path="/login">
            {user.isAuth ? (
              <Redirect to="/" />
            ) : (
              <Login
                setUser={setUser}
                user={user}
                setAuthIsDone={setAuthIsDone}
                askIsAuth={askIsAuth}
              />
            )}
          </Route>
          <Route>
            <QRSystem />
          </Route>
        </Switch>
      ) : (
        ""
      )}
    </Router>
  );
}

export default App;
