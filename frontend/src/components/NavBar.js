import React, {useState} from "react";

import { Navbar, Nav, NavDropdown, Form, FormControl, OverlayTrigger, ButtonGroup, Button, Popover} from "react-bootstrap";
import { withRouter } from "react-router-dom";

const Navigation = (props) => {
  const [showLogOutPopOver, setShowLogOutPopOver]=useState(false)
  
  const LogOutPopOver = (
    <Popover className="tasks-container"id="popover-basic">
      <Popover.Header as="h3">Are you sure you want to leave?</Popover.Header>
      <Popover.Body> Hate to see you go!</Popover.Body>
      <ButtonGroup aria-label="Basic example">
        <Button onClick={() => props.showLoginHideTasks()} variant="warning">
          Log me out
        </Button>

        <Button variant="info" onClick={() => setShowLogOutPopOver(false)}>
          I'll stay!
        </Button>
      </ButtonGroup>
    </Popover>
  );
  return (
    
    <Navbar collapseOnSelect className="Navcontainer">
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav>
        <OverlayTrigger
                      trigger="focus"
                      placement="bottom"
                      overlay={LogOutPopOver}
                    >
          <Nav.Link onClick={()=> setShowLogOutPopOver(true)}className="Navbtn">
            Log out

          </Nav.Link>
          </OverlayTrigger>
          <Nav.Link className="Navbtn" onClick={()=>props.showComplete(true)} >
            Completed 
            
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    
  );
};

export default withRouter(Navigation);
