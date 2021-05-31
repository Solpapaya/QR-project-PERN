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

// pages
import Home from "./routes/Home";
import PersonDetailPage from "./routes/PersonDetailPage";
import UpdatePage from "./routes/UpdatePage";
import Departments from "./routes/Departments";
import DepartmentUpdate from "./routes/DepartmentUpdate";
import UploadTaxReceipt from "./routes/UploadTaxReceipt";

function App() {
  const { currentSection } = useContext(CurrentSectionContext);
  return (
    <Router>
      <div className="main-layout">
        <Sidebar />
        <div
          className={
            currentSection === 2 ? "main-content upload-tax" : "main-content"
          }
        >
          {/* <PeopleContextProvider> */}
          <MonthsContextProvider>
            <div className="main-content-container">
              <Switch>
                <Route exact path="/">
                  <SearchSubsectionContextProvider>
                    <Home />
                  </SearchSubsectionContextProvider>
                </Route>
                <Route exact path="/taxreceipt">
                  <UploadTaxReceipt />
                </Route>
                <Route exact path="/people/:rfc">
                  <PersonSubsectionContextProvider>
                    <PersonDetailPage />
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
        </div>
      </div>
    </Router>
  );
}

export default App;

{
  /* <div className="container">
        <Router>
          <Switch>
            <Route exact path="/">
              <Home
                isInitialSearch={isInitialSearch}
                setIsInitialSearch={setIsInitialSearch}
              />
            </Route>
            <Route exact path="/people/:rfc/update">
              <UpdatePage />
            </Route>
            <Route exact path="/create/people">
              <AddPerson />
            </Route>
            <Route exact path="/people/:rfc">
              <PersonDetailPage />
            </Route>
          </Switch>
        </Router>
      </div> */
}
