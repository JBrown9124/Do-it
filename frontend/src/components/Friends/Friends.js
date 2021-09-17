import {
  Modal,
  Button,
  Form,
  ButtonGroup,
  Dropdown,
  Table,
  Card,
  Offcanvas,
  OverlayTrigger,
  Popover,
  DropdownButton,
  FormControl,
  Container,
  ListGroup,
  Tabs,
  Tab,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import AddFriendModal from "./AddFriendModal";
import Requests from "./RecievedRequests";
import url from "../../services/URL"
// import "./Tasks.css";

import moment from "moment";
import CreateTaskModal from "../Tasks/SoloTasks/CreateTaskModal";
import EditTaskModal from "../Tasks/SoloTasks/EditTaskModal";
import useWindowSize from "react-use/lib/useWindowSize";

import FlipMove from "react-flip-move";
import { v4 as uuidv4 } from "uuid";
import { FaArrowCircleUp } from "react-icons/fa";

function Friends(props) {
  const [show, setShow] = useState(false);
  const [reusemodalShow, setreusemodalShow] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);

  const [reuseData, setreuseData] = useState("");
  const [animationType, setAnimationType] = useState("");

  const [showDeleteAllPopOver, setShowDeleteAllPopOver] = useState(false);

  const [deleteTaskID, setDeleteTaskID] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [deleteFriendID, setDeleteFriendID] = useState("");
  const [showDeletePopOver, setShowDeletePopOver] = useState(false);
  const handleClose = () => props.hideFriends(false);
  const handleShow = () => setShow(true);

  const [allReceivedFriendRequestsData, setAllReceivedFriendRequestsData] =
    useState([]);

  useEffect(
    () => setSearchResults(props.allFriendsData),
    [props.allFriendsData.length]
  );

  useEffect(() => {
    setAnimationType("sort");
    const results = props.allFriendsData.filter((friend) =>
      friend.user_display_name.toLowerCase().includes(searchItem)
    );
    setSearchResults(results);
  }, [searchItem]);

  const handleRemoveFriendRequest = (fromUserID) => {
    const remainingRequests = props.allReceivedFriendRequestsData.filter(
      function (value, index, arr) {
        return value.user_id !== fromUserID;
      }
    );

    console.log(remainingRequests);

    props.updateAllReceivedFriendRequestsData(remainingRequests);
  };
  const handleRemoveFriend = (friendID) => {
    const remainingFriends = props.allFriendsData.filter(function (
      value,
      index,
      arr
    ) {
      return value.user_id !== friendID;
    });

    console.log(remainingFriends);

    props.updateAllFriendsData(remainingFriends);
    const data = { to_user_id: friendID };
    axios
      .post(
        `${url}${props.userID}/remove-friend`,
        data
      )
      .then((response) => {
        // props.allFriendsData.push(user); request pending data
        // isLoaded(true);
      });
  };
  const handleReject = (fromUserID) => {
    const findUserByID = props.allReceivedFriendRequestsData.find(
      ({ user_id }) => user_id === fromUserID
    );
    console.log(findUserByID);

    handleRemoveFriendRequest(fromUserID);
    const data = { from_user_id: fromUserID };
    axios
      .post(
        `${url}${props.userID}/reject-friend`,
        data
      )
      .then((res) => {})
      .catch((err) => {});
  };

  const handleAccept = (fromUserID) => {
    // setSearchResults(remainingTasks);

    const findUserByID = props.allReceivedFriendRequestsData.find(
      ({ user_id }) => user_id === fromUserID
    );
    console.log(findUserByID);
    props.allFriendsData.push(findUserByID);
    handleRemoveFriendRequest(fromUserID);
    const data = { from_user_id: fromUserID };
    axios
      .post(
        `${url}${props.userID}/accept-friend`,
        data
      )
      .then((res) => {})
      .catch((err) => {});
  };
  const handleFriendSharedTasksCount = (friendID) => {
    const friendTasksCount = props.incompletedSharedTasksData.filter(function (
      value,
      index,
      arr
    ) {
      return value.sharing_with.user_id === friendID;
    });

    return friendTasksCount.length;
  };
  const handleDeletePopOver = (e) => {
    setShowDeletePopOver(true);
    setDeleteFriendID(e);
  };
  const deletePopOver = (
    <Popover className="tasks-container" id="popover-basic">
      <Popover.Header as="h3">Are you sure?</Popover.Header>
      <Popover.Body>
        This will be permanent!
      </Popover.Body>
      <ButtonGroup aria-label="Basic example">
        <div>
        <Button
          onClick={() => handleRemoveFriend(deleteFriendID)}
          variant="danger"
        >
          Yes
        </Button>
        </div>
        <div className="card-buttons">
        <Button variant="primary" onClick={() => setShowDeletePopOver(false)}>
          No
        </Button>
        </div>
      </ButtonGroup>
    </Popover>
  );

  // if (props.show === true && props.completedTasksData !== null) {
  // const handleRemove = (friendID) => {
  //   console.log(friendID)
  //   // const filterFriendsHelper = (user) => {
  //   //   return friendID !== user.user_id;
  //   // };
  //   // filterFriendsHelper(props.allFriendsData);
  //   const remainingFriends = props.allFriendsData.filter(function(value, index, arr){
  //     console.log(value.user_id)
  //     return value.user_id !== friendID
  //   });

  //   console.log(remainingFriends);

  //   props.updateAllFriendsData(remainingFriends);
  // };

  return (
    <>
      <Offcanvas show={props.show} onHide={handleClose} placement="top">
        <Offcanvas.Header
          className="text-center"
          closeButton
          onClick={() => handleClose()}
        >
          <Offcanvas.Title className="completed-title">Friends</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Tabs
            defaultActiveKey="Friends"
            fill
            variant="tabs"
            id="noanim-tab-example"
            className="friend-tabs-container"
          >
            <Tab eventKey="Friends" title="Friends">
              <div className="d-grid gap-2">
                <Button
                  // className="completed-clear"
                  variant="success"
                  size="med"
                  className="completed-clear"
                  onClick={() => setShowAddFriendModal(true)}
                >
                  Add Friend
                </Button>

                <AddFriendModal
                  allReceivedFriendRequestsData={
                    props.allReceivedFriendRequestsData
                  }
                  allSentFriendRequestsData={props.allSentFriendRequestsData}
                  allFriendsData={props.allFriendsData}
                  userID={props.userID}
                  show={showAddFriendModal}
                  onHide={() => setShowAddFriendModal(false)}
                />
              </div>

              <Form>
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
              </Form>

              {/* <Button
                      
                      onClick={() => handledeleteAll()}
                      variant="danger"
                      size="lg"
                    >
                      Delete All
                    </Button> */}

              {searchResults.map((friend) => (
                <div key={friend.user_id}>
                  <ListGroup className="friend-list-container" horizontal="xxl">
                    <ListGroup.Item
                      variant="info"
                      className="friend-list-seperator"
                    >
                      <Row>
                        <Col>
                      <small >
                        Sharing{" "}
                        {handleFriendSharedTasksCount(parseInt(friend.user_id))}{" "}
                        tasks with
                      </small>{" "}
                      <strong >
                        {friend.user_display_name}
                      </strong>
                      </Col>
                      <Col>
                      <OverlayTrigger
                        trigger="focus"
                        placement="bottom"
                        overlay={deletePopOver}
                      >
                        <Button
                          className="remove-friend-button"
                          variant="danger"
                          size="sm"
                          value={friend.user_id}
                          onClick={(e) =>
                            handleDeletePopOver(parseInt(e.target.value))
                          }
                        >
                          Remove friend
                        </Button>
                      </OverlayTrigger>
                      </Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                </div>
              ))}
            </Tab>

            <Tab eventKey="Received Requests" title="Received Requests" 
            
            >
              {props.allReceivedFriendRequestsData.map((receivedRequest) => (
                <div key={receivedRequest.user_id}>
                  <ListGroup className="friend-list-container" horizontal="xxl">
                    <ListGroup.Item
                      variant="light"
                      className="friend-list-seperator"
                    >
                      <strong>{receivedRequest.user_display_name} </strong>{" "}
                     
                        <Button
                          // className="completed-clear"
                          className="accept-decline-seperator"
                          variant="success"
                          size="med"
                          value={receivedRequest.user_id}
                          onClick={(e) =>
                            handleAccept(parseInt(e.target.value))
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          
                          
                          variant="danger"
                          size="med"
                          value={receivedRequest.user_id}
                          onClick={(e) =>
                            handleReject(parseInt(e.target.value))
                          }
                        >
                          Decline
                        </Button>
                    
                    </ListGroup.Item>
                  </ListGroup>
                </div>
              ))}
            </Tab>

            <Tab eventKey="Sent Requests" title="Sent Requests">
              {props.allSentFriendRequestsData.map((sentRequest) => (
                <div key={sentRequest.user_id}>
                  <ListGroup className="friend-list-container" horizontal="xxl">
                    <ListGroup.Item
                      variant="secondary"
                      className="friend-list-seperator"
                    >
                      <strong>{sentRequest.user_display_name}'s</strong> request is pending...
                    </ListGroup.Item>
                  </ListGroup>
                </div>
              ))}
            </Tab>
          </Tabs>

          {/* </FlipMove> */}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
  // } else {
  //   return null;
  // }
}

export default Friends;
