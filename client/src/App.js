import React, { useState, useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { PeopleContextProvider } from "./context/PeopleContext";
import AddPerson from "./routes/AddPerson";
import { MonthsContextProvider } from "./context/MonthsContext";
import { PersonTaxReceiptsContextProvider } from "./context/PersonTaxReceiptsContext";
import { PersonSubsectionContextProvider } from "./context/PersonSubsectionContext";
import { PersonStatusLogsContextProvider } from "./context/PersonStatusLogsContext";

// pages
import Home from "./routes/Home";
import PersonDetailPage from "./routes/PersonDetailPage";
import UpdatePage from "./routes/UpdatePage";
import { SearchSubsectionContextProvider } from "./context/SearchSubsectionContext";

function App() {
  const [isInitialSearch, setIsInitialSearch] = useState(false);
  return (
    <Router>
      <div className="main-layout">
        <Sidebar />
        <div className="main-content">
          <PeopleContextProvider>
            <MonthsContextProvider>
              <div className="main-content-container">
                <Switch>
                  <Route exact path="/">
                    <SearchSubsectionContextProvider>
                      <Home
                        isInitialSearch={isInitialSearch}
                        setIsInitialSearch={setIsInitialSearch}
                      />
                    </SearchSubsectionContextProvider>
                  </Route>
                  <Route exact path="/people/:rfc">
                    <PersonSubsectionContextProvider>
                      <PersonTaxReceiptsContextProvider>
                        <PersonStatusLogsContextProvider>
                          <PersonDetailPage />
                        </PersonStatusLogsContextProvider>
                      </PersonTaxReceiptsContextProvider>
                    </PersonSubsectionContextProvider>
                  </Route>
                  <Route exact path="/create/people">
                    <AddPerson />
                  </Route>
                </Switch>
              </div>
            </MonthsContextProvider>
          </PeopleContextProvider>
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
