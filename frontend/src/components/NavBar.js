import React, { useState } from "react";

import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  OverlayTrigger,
  ButtonGroup,
  Button,
  Popover,
  Badge,
  Container,
} from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { BsBell } from "react-icons/bs";

const Navigation = (props) => {
  const [showLogOutPopOver, setShowLogOutPopOver] = useState(false);

  const LogOutPopOver = (
    <Popover className="tasks-container" id="popover-basic">
      <Popover.Header as="h3">Are you sure you want to leave?</Popover.Header>
      <Popover.Body> Hate to see you go!</Popover.Body>
      <ButtonGroup aria-label="Basic example">
        <div>
        <Button onClick={() => props.handleLogOut()} variant="warning">
          Sign me out
        </Button>
        </div>
        <div className="card-buttons">
        <Button variant="info" onClick={() => setShowLogOutPopOver(false)}>
          I'll stay!
        </Button>
        </div>
      </ButtonGroup>
    </Popover>
  );
  return (
    <>
      <Navbar expand="lg" fixed="top" bg="light" collapseOnSelect>
        <Container>
          <Navbar.Brand>Do or Do Not</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                bg="light"
                className="Navbtn"
                onClick={() => props.showComplete(true)}
              >
                Completed
                <Badge className="completed-badge" bg="primary">
                  {props.completeCount}
                </Badge>
              </Nav.Link>
              <Nav.Link onClick={() => props.showFriends(true)}>
                Friends
                <Badge className="completed-badge" bg="info">
                  {props.receivedCount === 0
                    ? null
                    : `${props.receivedCount} friend request received!`}
                </Badge>
              </Nav.Link>
            </Nav>

            <Nav>
              <Nav.Link onClick={() => props.showAlerts(true)} variant="danger" className="position-relative">
                <div className="position-relative">
                  <BsBell />
                  
                  <Badge
                    pill={true}
                    className="badge position-absolute top-0 left-100 translate-middle bg-warning"
                    bg="danger"
                  >{props.alertCount === 0 ? null:props.alertCount}
                  </Badge>
                  
                </div>
              </Nav.Link>
              <OverlayTrigger
                trigger="focus"
                placement="bottom"
                overlay={LogOutPopOver}
              >
                <Nav.Link
                  bg="light"
                  onClick={() => setShowLogOutPopOver(true)}
                  className="Navbtn"
                  
                >
                  Sign out
                </Nav.Link>
                
              </OverlayTrigger>
              <Navbar.Text>
                {props.userDisplayName === undefined || props.userDisplayName === "null"
                  ? `Welcome!${" "}`
                  : `${" "}${props.userDisplayName}`}
                <CgProfile />
              </Navbar.Text>{" "}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

// export default withRouter(Navigation);
export default Navigation
