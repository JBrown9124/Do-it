import React, { Component } from "react";
import History from "../services/History";
import { Router, Route, Switch, Redirect, Link } from "react-router-dom";
import Register from "../components/Register";
import Login from "../components/Login";
import HomeRegister from "../components/HomeRegister";
import HomeLogin from "../components/HomeLogin";
import { withRouter } from "react-router-dom";

export default class Routes extends Component {
  render() {
    return (
      <Router history={History}>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return <Redirect to="/home-register" />;
            }}
          />
          
          <Route path="/home-register" component={HomeRegister} exact />
          <Route path="/home-login" component={HomeLogin} exact />
        
        </Switch>
      </Router>
    );
  }
}
