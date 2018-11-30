import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Login from './Login/index';
import Table from './Table/index';

function App() {
  return (
    <Router>
      <div style={{ width: "100%", height: "100%" }}>
        <Route exact path="/" render={() => <Redirect to="/login" />} />
        <Route path="/login" component={Login} />
        <Route path="/table" component={Table} />
      </div>
    </Router>
  );
}

export default App;
