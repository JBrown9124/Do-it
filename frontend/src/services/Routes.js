import React, { Component } from "react";
import History from "../services/History";
import { Router, Route, Switch, Redirect, Link } from "react-router-dom";
import Register from "../components/Home/RegisterModal";
import Login from "../components/Home/LoginModal";
import HomeRegister from "../components/Home/HomeRegister";
import HomeLogin from "../components/Home/HomeLogin";
import { withRouter } from "react-router-dom";

// export default class Routes extends Component {
//   render() {
//     return (
//       <Router history={History}>
//         <Switch>
//           <Route
//             exact
//             path="/"
//             render={() => {
//               return <Redirect to="/register" />;
//             }}
//           /> 
          
//          <Route path="/register" component={Register} exact />
//           <Route path="/home-login" component={Login} exact />
         
//         </Switch>
//       </Router>
//     );
//   }
// }
