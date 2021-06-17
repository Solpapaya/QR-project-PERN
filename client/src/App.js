import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Sidebar from "./components/Sidebar";
// import { PeopleContextProvider } from "./context/PeopleContext";
import AddPerson from "./routes/AddPerson";
import { MonthsContextProvider } from "./context/MonthsContext";
import { PersonSubsectionContextProvider } from "./context/PersonSubsectionContext";
import { SearchSubsectionContextProvider } from "./context/SearchSubsectionContext";
import { DepartmentSubsectionContextProvider } from "./context/DepartmentSubsectionContext";
import { CurrentSectionContext } from "./context/CurrentSectionContext";
import { CSSTransition } from "react-transition-group";
import Notification from "./components/Notification";

// pages
import Home from "./routes/Home";
import PersonDetailPage from "./routes/PersonDetailPage";
import UpdatePage from "./routes/UpdatePage";
import Departments from "./routes/Departments";
import DepartmentUpdate from "./routes/DepartmentUpdate";
import UploadTaxReceipt from "./routes/UploadTaxReceipt";
import UpdateTaxReceipt from "./routes/UpdateTaxReceipt";
import { ExportBtnContextProvider } from "./context/ExportBtnContext";
import { PersonDetailContextProvider } from "./context/PersonDetailsContext";
import { AlertContext } from "./context/AlertContext";

function App() {
  const { currentSection, isEditPersonSection } = useContext(
    CurrentSectionContext
  );
  const { response, showAlert, setShowAlert } = useContext(AlertContext);

  const removeNotification = () => {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };
  return (
    <Router>
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
          {/* <PeopleContextProvider> */}
          <MonthsContextProvider>
            <div className="main-content-container">
              <Switch>
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
              </Switch>
            </div>
          </MonthsContextProvider>
          {/* </PeopleContextProvider> */}
          <CSSTransition
            in={showAlert}
            timeout={300}
            classNames="alert"
            unmountOnExit
            onEnter={() => removeNotification()}
          >
            {response.success ? (
              <Notification
                header="Operación Exitosa"
                msg={response.msg}
                success={true}
                setShowAlert={setShowAlert}
              />
            ) : (
              <Notification
                header="Error"
                msg={response.msg}
                success={false}
                setShowAlert={setShowAlert}
              />
            )}
          </CSSTransition>
        </div>
      </div>
    </Router>
  );
}

export default App;
