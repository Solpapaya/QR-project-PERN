import React, { useContext } from "react";
import { Route, Switch } from "react-router";
import { CSSTransition } from "react-transition-group";
import Loading from "../components/Loading";
import Notification from "../components/Notification";
import Sidebar from "../components/Sidebar";
import Warning from "../components/Warning";
import { AlertContext } from "../context/AlertContext";
import { CurrentSectionContext } from "../context/CurrentSectionContext";
import { DepartmentSubsectionContextProvider } from "../context/DepartmentSubsectionContext";
import { ExportBtnContextProvider } from "../context/ExportBtnContext";
import { LoadingContext } from "../context/LoadingContext";
import { MonthsContextProvider } from "../context/MonthsContext";
import { PersonDetailContextProvider } from "../context/PersonDetailsContext";
import { PersonSubsectionContextProvider } from "../context/PersonSubsectionContext";
import { SearchSubsectionContextProvider } from "../context/SearchSubsectionContext";
import AddPerson from "./AddPerson";
import Departments from "./Departments";
import DepartmentUpdate from "./DepartmentUpdate";
import Home from "./Home";
import PersonDetailPage from "./PersonDetailPage";
import UpdatePage from "./UpdatePage";
import UpdateTaxReceipt from "./UpdateTaxReceipt";
import UploadTaxReceipt from "./UploadTaxReceipt";

const Routes = () => {
  const { showLoading } = useContext(LoadingContext);
  const { alert, showAlert, setShowAlert, showWarning } =
    useContext(AlertContext);

  const { currentSection, isEditPersonSection } = useContext(
    CurrentSectionContext
  );

  const removeNotification = () => {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <Switch>
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
        </div>
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
  );
};

export default Routes;
