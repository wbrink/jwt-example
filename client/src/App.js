import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import Main from './components/Main';
import PrivateRoute from "./components/PrivateRoute";
import Protected from "./components/Protected";
import PageRedirection from "./components/PageRedirection";
// import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/protected">Protected URL</Link>
            </li>
            <li>
              <Link to="/redirected">Redirected URL</Link>
            </li>

          </ul>
        </nav>
  
        <Switch>
          {/* home */}
          <Route exact path="/">
            <Main />
          </Route>

          <Route exact path="/redirected" component={PageRedirection} />

          {/* protected Route */}
          {/* <PrivateRoute exact path="/protected" component={Protected} /> */}

          <PrivateRoute exact path="/protected" component={Protected} />
        </Switch>

      </div>
    </Router>
  );
}

export default App;
