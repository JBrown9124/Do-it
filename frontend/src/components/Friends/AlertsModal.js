import {
  Modal,
  Button,
  ListGroup,
  Col,
  OverlayTrigger,
  ButtonGroup,
  Popover,
} from "react-bootstrap";
import React, { useState } from "react";
import moment from "moment";
import { IoIosNuclear } from "react-icons/io";
import { ImCheckmark, ImShare2 } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";
import { AiFillAlert } from "react-icons/ai";
import { FaUndo } from "react-icons/fa";
import axios from "axios";
import url from "../../services/URL.js";
function AlertsModal(props) {
  const [showDeleteAllPopOver, setShowDeleteAllPopOver] = useState(false);
  const handleDeleteAll = () => {
    props.updateAlerts([]);
    axios.delete(`${url}${props.userID}/alerts`).then((response) => {
      props.onHide();
    });
  };

  const deleteAllPopover = (
    <Popover className="tasks-container" id="popover-basic">
      <Popover.Header as="h3">Are you sure?</Popover.Header>
      <Popover.Body>All alerts will be deleted!</Popover.Body>
      <ButtonGroup aria-label="Basic example">
        <div>
          <Button onClick={(e) => handleDeleteAll()} variant="danger">
            Yes
          </Button>
        </div>
        <div className="card-buttons">
          <Button
            variant="primary"
            onClick={() => setShowDeleteAllPopOver(false)}
          >
            No
          </Button>
        </div>
      </ButtonGroup>
    </Popover>
  );

  return (
    <>
      <Modal {...props} size="large" centered>
        <Modal.Header closeButton onClick={() => props.onHide()}>
          <Modal.Title>
            Alerts <AiFillAlert className="task-card-icon-size" />
          </Modal.Title>
        </Modal.Header>
        <OverlayTrigger
          trigger="focus"
          placement="bottom"
          overlay={deleteAllPopover}
        >
          <Button
            variant="danger"
            size="med"
            className="alert-clear"
            onClick={() => setShowDeleteAllPopOver(true)}
          >
            <IoIosNuclear className="task-card-icon-size" />
          </Button>
        </OverlayTrigger>
        <Modal.Body>
          {props.allAlertsData.map((alert) => (
            <div key={alert.alert_id}>
              <ListGroup className="friend-list-container" horizontal="xxl">
                <Col>
                  <ListGroup.Item
                    variant={
                      alert.alert_type === "Completed"
                        ? "primary"
                        : alert.alert_type === "Editted"
                        ? "warning"
                        : alert.alert_type === "Shared"
                        ? "info"
                        : alert.alert_type === "Deleted"
                        ? "danger"
                        : alert.alert_type === "Undid"
                        ? "dark"
                        : ""
                    }
                    className="friend-list-seperator"
                  >
                    <Col>
                      {alert.alert_type === "Completed" ? (
                        <ImCheckmark className="alert-icon-size" />
                      ) : alert.alert_type === "Editted" ? (
                        <FiEdit className="alert-icon-size" />
                      ) : alert.alert_type === "Shared" ? (
                        <ImShare2 className="alert-icon-size" />
                      ) : alert.alert_type === "Deleted" ? (
                        <RiDeleteBin2Line className="alert-icon-size" />
                      ) : alert.alert_type === "Undid" ? (
                        <FaUndo className="alert-icon-size" />
                      ) : (
                        ""
                      )}
                    </Col>
                    <Col>
                      <strong>{alert.message} </strong>
                    </Col>
                    <Col>
                      {moment
                        .utc(alert.created_date)
                        .local()
                        .format("MMMM DD YYYY hh:mm A")}
                    </Col>
                  </ListGroup.Item>
                </Col>
              </ListGroup>
            </div>
          ))}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AlertsModal;
