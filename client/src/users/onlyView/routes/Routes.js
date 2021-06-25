import React, { useContext } from "react";
import { Route, Switch } from "react-router";
import { MonthsContextProvider } from "../../../global/context/MonthsContext";
import { SearchSubsectionContextProvider } from "../context/SearchSubsectionContext";
import Sidebar from "../components/Sidebar";
import { CurrentSectionContext } from "../context/CurrentSectionContext";
import Home from "./Home";
import { PersonSubsectionContextProvider } from "../context/PersonSubsectionContext";
import { PersonDetailContextProvider } from "../context/PersonDetailsContext";
import PersonDetailPage from "./PersonDetailPage";

const Routes = () => {
  const { currentSection, isEditPersonSection } = useContext(
    CurrentSectionContext
  );
  return (
    <Switch>
      <div className="main-layout">
        <Sidebar />
        <div
          className={
            currentSection === 1 ? "main-content search" : "main-content"
          }
        >
          <MonthsContextProvider>
            <div className="main-content-container">
              <Route exact path="/">
                <SearchSubsectionContextProvider>
                  <Home />
                </SearchSubsectionContextProvider>
              </Route>
              <Route exact path="/people/:rfc">
                <PersonSubsectionContextProvider>
                  <PersonDetailContextProvider>
                    <PersonDetailPage />
                  </PersonDetailContextProvider>
                </PersonSubsectionContextProvider>
              </Route>
            </div>
          </MonthsContextProvider>
        </div>
        {/* <CSSTransition
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
        </CSSTransition> */}
      </div>
    </Switch>
  );
};

export default Routes;
