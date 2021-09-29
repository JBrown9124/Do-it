import {
  Modal,
  Button,
  Form,
  FormControl,
  ListGroup,
  Row,
  Col,
  OverlayTrigger,
  ButtonGroup,
  Popover,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { FaUserFriends } from "react-icons/fa";
import moment from "moment";
import { IoIosNuclear } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import { ImCheckmark, ImShare2 } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";
import { CgGoogleTasks } from "react-icons/cg";
import { AiFillAlert } from "react-icons/ai";
import { FaUndo } from "react-icons/fa";
import axios from "axios";
import url from "../../services/URL.js"
function AlertsModal(props) {
  const [showDeleteAllPopOver, setShowDeleteAllPopOver] = useState(false);
  const handleDeleteAll=()=>{
    props.updateAlerts([]);
    axios
      .delete(`${url}${props.userID}/alerts`)
      .then((response) => {props.onHide()
        
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
          {/* <Form>
              <FormControl
                onKeyPress={(e) => {
                  e.key === "Enter" && e.preventDefault();
                }}
                type="search"
                placeholder="Friend filter"
                className="friend-search-container"
                aria-label="Search"
                variant="primary"
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
              />
            </Form> */}

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
                    {moment.utc(alert.created_date).local().format("MMMM DD YYYY hh:mm A")}
                     
                      {/* <Button
                              onClick={() =>
                                handleSubmit({
                                  user_display_name: friend.user_display_name,
                                  user_email: friend.user_email,
                                  user_id: friend.user_id,
                                })
                              }
                              variant="info"
                            >
                              <ImShare2 />
                            </Button> */}
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
