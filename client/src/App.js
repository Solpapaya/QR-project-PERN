import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { PeopleContextProvider } from "./context/PeopleContext";
import AddPerson from "./routes/AddPerson";

// pages
import Home from "./routes/Home";
import PersonDetailPage from "./routes/PersonDetailPage";
import UpdatePage from "./routes/UpdatePage";

function App() {
  const [isInitialSearch, setIsInitialSearch] = useState(false);
  return (
    <Router>
      <div className="main-layout">
        <Sidebar />
        <div className="main-content">
          <PeopleContextProvider>
            <div className="main-content-container">
              <Switch>
                <Route exact path="/">
                  <Home
                    isInitialSearch={isInitialSearch}
                    setIsInitialSearch={setIsInitialSearch}
                  />
                </Route>
                <Route exact path="/create/people">
                  <AddPerson />
                </Route>
              </Switch>
            </div>
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
