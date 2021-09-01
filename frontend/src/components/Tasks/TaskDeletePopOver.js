import {
  Modal,
  Button,
  Form,
  Popover,
  OverlayTrigger,
  ButtonGroup,
} from "react-bootstrap";
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const popover = (
  <Popover id="popover-basic">
    <Popover.Header as="h3">Popover right</Popover.Header>
    <Popover.Body>Are you sure you want to delete?</Popover.Body>
    <ButtonGroup aria-label="Basic example">
      <Button variant="secondary">Yes</Button>

      <Button variant="secondary">No</Button>
    </ButtonGroup>
  </Popover>
);

const Example = () => (
  <OverlayTrigger trigger="click" placement="right" overlay={popover}>
    <Button
      
    >
      Delete Task
    </Button>
  </OverlayTrigger>
);

export default Example;
