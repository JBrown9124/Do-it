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

const Navigation = (props) => {
  const [showLogOutPopOver, setShowLogOutPopOver] = useState(false);

  const LogOutPopOver = (
    <Popover className="tasks-container" id="popover-basic">
      <Popover.Header as="h3">Are you sure you want to leave?</Popover.Header>
      <Popover.Body> Hate to see you go!</Popover.Body>
      <ButtonGroup aria-label="Basic example">
        <Button onClick={() => props.showLoginHideTasks()} variant="warning">
          Sign me out
        </Button>

        <Button variant="info" onClick={() => setShowLogOutPopOver(false)}>
          I'll stay!
        </Button>
      </ButtonGroup>
    </Popover>
  );
  return (
    <>
      <Navbar  expand="lg" fixed="top" bg="light" collapseOnSelect>
      <Container>
      <Navbar.Brand >Slick Doing</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                bg="light"
                className="Navbtn"
                onClick={() => props.showComplete(true)}
              >
                Completed
                <Badge className="completed-badge" bg="secondary">
                  {props.completeCount}
                </Badge>
              </Nav.Link>
             
            </Nav>
            <Nav>
            <Nav.Link bg="light" onClick={() => props.showShared(true)}>
                Shared
                <Badge className="completed-badge" bg="secondary">
                  {props.completeCount}
                </Badge>
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
                  eventKey={2}
                >
                  Sign out
                </Nav.Link>
              </OverlayTrigger>
            </Nav>
          </Navbar.Collapse>
          </Container>
      </Navbar>
    </>
  );
};

export default withRouter(Navigation);
