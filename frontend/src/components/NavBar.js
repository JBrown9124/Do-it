import React from "react";

import { Navbar, Nav} from "react-bootstrap";
import { withRouter } from "react-router-dom";

const Navigation = (props) => {
  console.log(props);
  return (
    <Navbar collapseOnSelect className="Navcontainer">
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav>
          <Nav.Link className="Navbtn" href="/register">
            Register
          </Nav.Link>
          <Nav.Link className="Navbtn" href="/home-login">
            Log Out
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default withRouter(Navigation);
