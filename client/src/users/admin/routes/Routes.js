import React, { useContext } from "react";
import { Route, Switch } from "react-router";
import { CSSTransition } from "react-transition-group";
import { AlertContext } from "../../../global/context/AlertContext";
import { CurrentSectionContext } from "../context/CurrentSectionContext";
import { LoadingContext } from "../context/LoadingContext";
import Sidebar from "../components/Sidebar";
import { MonthsContextProvider } from "../../../global/context/MonthsContext";
import { SearchSubsectionContextProvider } from "../context/SearchSubsectionContext";
import { ExportBtnContextProvider } from "../context/ExportBtnContext";
import UploadTaxReceipt from "./UploadTaxReceipt";
import UpdateTaxReceipt from "./UpdateTaxReceipt";
import { PersonSubsectionContextProvider } from "../context/PersonSubsectionContext";
import { PersonDetailContextProvider } from "../context/PersonDetailsContext";
import PersonDetailPage from "./PersonDetailPage";
import UpdatePage from "./UpdatePage";
import { DepartmentSubsectionContextProvider } from "../context/DepartmentSubsectionContext";
import Departments from "./Departments";
import DepartmentUpdate from "./DepartmentUpdate";
import Notification from "../../../global/components/Notification";
import Warning from "../../../global/components/Warning";
import Loading from "../components/Loading";
import Home from "./Home";
import AddSection from "./AddSection";
import { AddPersonSubsectionContextProvider } from "../context/AddPersonSubsectionContext";
import Deleted from "./Deleted";
import { DeletedSubsectionContextProvider } from "../context/DeletedSubsectionContext";

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
                <AddPersonSubsectionContextProvider>
                  <AddSection />
                </AddPersonSubsectionContextProvider>
              </Route>
              <Route exact path="/deleted">
                <DeletedSubsectionContextProvider>
                  <Deleted />
                </DeletedSubsectionContextProvider>
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
