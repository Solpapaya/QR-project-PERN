import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AddPerson from "./users/admin/routes/AddPerson";
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
import UpdatePage from "./routes/admin/UpdatePage";
import Departments from "./routes/Departments";
import DepartmentUpdate from "./routes/DepartmentUpdate";
import UploadTaxReceipt from "./routes/UploadTaxReceipt";
import UpdateTaxReceipt from "./routes/admin/UpdateTaxReceipt";
import Login from "./routes/Login";
import { fetchData } from "./functions/fetchData";
import NotFound from "./routes/NotFound";

function App() {
  const { showLoading } = useContext(LoadingContext);
  const [user, setUser] = useState({
    isAuth: false,
    type: "",
  });
  const [authIsDone, setAuthIsDone] = useState(false);
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
          <div className="main-layout">
            <Sidebar />
            <div
              className={
                currentSection === 1 && !isEditPersonSection
                  ? "main-content search"
                  : currentSection === 2
                  ? "main-content upload-tax"
                  : "main-content"
              }
            >
              <MonthsContextProvider>
                <div className="main-content-container">
                  <Route exact path="/">
                    <SearchSubsectionContextProvider>
                      <ExportBtnContextProvider>
                        {user.isAuth ? <Home /> : <Redirect to="/login" />}
                      </ExportBtnContextProvider>
                    </SearchSubsectionContextProvider>
                  </Route>
                  <Route exact path="/taxreceipt">
                    {user.isAuth ? (
                      <UploadTaxReceipt />
                    ) : (
                      <Redirect to="/login" />
                    )}
                  </Route>
                  <Route exact path="/taxreceipt/:id/update">
                    {user.isAuth ? (
                      <UpdateTaxReceipt />
                    ) : (
                      <Redirect to="/login" />
                    )}
                  </Route>
                  <Route exact path="/people/:rfc">
                    <PersonSubsectionContextProvider>
                      <ExportBtnContextProvider>
                        <PersonDetailContextProvider>
                          {user.isAuth ? (
                            <PersonDetailPage />
                          ) : (
                            <Redirect to="/login" />
                          )}
                        </PersonDetailContextProvider>
                      </ExportBtnContextProvider>
                    </PersonSubsectionContextProvider>
                  </Route>
                  <Route exact path="/people/:rfc/update">
                    {user.isAuth ? <UpdatePage /> : <Redirect to="/login" />}
                  </Route>
                  <Route exact path="/create/people">
                    {user.isAuth ? <AddPerson /> : <Redirect to="/login" />}
                  </Route>
                  <Route exact path="/departments">
                    <DepartmentSubsectionContextProvider>
                      {user.isAuth ? <Departments /> : <Redirect to="/login" />}
                    </DepartmentSubsectionContextProvider>
                  </Route>
                  <Route exact path="/departments/:id/update">
                    {user.isAuth ? (
                      <DepartmentUpdate />
                    ) : (
                      <Redirect to="/login" />
                    )}
                  </Route>
                  <Route path="*" exact>
                    <NotFound />
                  </Route>
                </div>
              </MonthsContextProvider>
              <CSSTransition
                in={showAlert}
                timeout={300}
                classNames="alert"
                unmountOnExit
                onEnter={alert.removeOnEnter ? () => removeNotification() : ""}
              >
                {alert.success ? (
                  <Notification header="Operación Exitosa" success={true} />
                ) : (
                  <Notification header="Error" success={false} />
                )}
              </CSSTransition>
            </div>

            {showWarning && <Warning />}

            <CSSTransition
              in={showLoading}
              timeout={300}
              classNames="loading"
              unmountOnExit
            >
              <Loading />
            </CSSTransition>
          </div>
        </Switch>
      ) : (
        ""
      )}
    </Router>
  );
}

export default App;
