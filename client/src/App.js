import React, { useContext } from "react";
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

function App() {
  const { showLoading } = useContext(LoadingContext);
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

  return (
    <Router>
      <Switch>
        <Route exact path="/login">
          <Login />
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
                      <Home />
                    </ExportBtnContextProvider>
                  </SearchSubsectionContextProvider>
                </Route>
                <Route exact path="/taxreceipt">
                  <UploadTaxReceipt />
                </Route>
                <Route exact path="/taxreceipt/:id/update">
                  <UpdateTaxReceipt />
                </Route>
                <Route exact path="/people/:rfc">
                  <PersonSubsectionContextProvider>
                    <ExportBtnContextProvider>
                      <PersonDetailContextProvider>
                        <PersonDetailPage />
                      </PersonDetailContextProvider>
                    </ExportBtnContextProvider>
                  </PersonSubsectionContextProvider>
                </Route>
                <Route exact path="/people/:rfc/update">
                  <UpdatePage />
                </Route>
                <Route exact path="/create/people">
                  <AddPerson />
                </Route>
                <Route exact path="/departments">
                  <DepartmentSubsectionContextProvider>
                    <Departments />
                  </DepartmentSubsectionContextProvider>
                </Route>
                <Route exact path="/departments/:id/update">
                  <DepartmentUpdate />
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
    </Router>
  );
}

export default App;
