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
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import History from "../../services/History";
import Routes from "../../services/Routes";
import { Link } from "react-router-dom";
import AddFriendModal from "./AddFriendModal";
import Requests from "./RecievedRequests";

// import "./Tasks.css";

import moment from "moment";
import CreateTaskModal from "../Tasks/IncompletedTasks/CreateTaskModal";
import EditTaskModal from "../Tasks/IncompletedTasks/EditTaskModal";
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
  const [showDeletePopOver, setShowDeletePopOver] = useState(false);
  const [deleteTaskID, setDeleteTaskID] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleClose = () => props.hideFriends(false);
  const handleShow = () => setShow(true);
  

  const [allReceivedFriendRequestsData, setAllReceivedFriendRequestsData] =
    useState([]);
  
  
  
  
  
  const handleRemoveFriendRequest = (fromUserID) => {
    const remainingRequests = props.allReceivedFriendRequestsData.filter(function(value, index, arr){
      
      return value.user_id !== fromUserID
    });

    console.log(remainingRequests);

    props.updateAllReceivedFriendRequestsData(remainingRequests);
  };
  const handleRemoveFriend = (friendID) =>{
    const remainingFriends = props.allFriendsData.filter(function(value, index, arr){
      
      return value.user_id !== friendID
    });

   

    props.updateAllFriendsData(remainingFriends);
  }
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
        `http://127.0.0.1:8000/to_do_list/${props.userID}/accept-friend`,
        data
      )
      .then((res) => {
        
      })
      .catch((err) => {});
  };
  
  
  
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
    useEffect(
      () => setSearchResults(props.allFriendsData),
      [props.allFriendsData.length]
    );
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
            defaultActiveKey="home"
            transition={false}
            id="noanim-tab-example"
            className="mb-3"
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
                  allFriendsData={props.allFriendsData}
                  userID={props.userID}
                  show={showAddFriendModal}
                  onHide={() => setShowAddFriendModal(false)}
                />
              </div>

              <ButtonGroup className="completed-task-top-buttons">
                <Form className="completed-sort-by">
                  <FormControl
                    onKeyPress={(e) => {
                      e.key === "Enter" && e.preventDefault();
                    }}
                    type="search"
                    placeholder="Search"
                    className="mr-2"
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
              </ButtonGroup>

              {searchResults.map((friend) => (
                <div key={friend.user_id}>
                  <ListGroup className="friend-list-container" horizontal="xxl">
                    <ListGroup.Item>
                      {friend.user_display_name}
                      <Button
                        // className="completed-clear"
                        variant="danger"
                        size="med"
                        value={friend.user_id}
                        onClick={(e) => handleRemoveFriend(parseInt(e.target.value))}
                      >
                        Remove friend
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </div>
              ))}
            </Tab>
            <Tab eventKey="Received Requests" title="Received Requests">
            {props.allReceivedFriendRequestsData.map((receivedRequest) => (
        <div key={receivedRequest.user_id}>
          <ListGroup className="friend-list-container" horizontal="xxl">
            <ListGroup.Item>
              {receivedRequest.user_display_name}{" "}
              <ButtonGroup>
                <Button
                  // className="completed-clear"
                  variant="success"
                  size="med"
                  value={receivedRequest.user_id}
                  onClick={(e) => handleAccept(parseInt(e.target.value))}
                >
                  Accept
                </Button>
                <Button
                  // className="completed-clear"
                  variant="danger"
                  size="med"
                >
                  Decline
                </Button>
              </ButtonGroup>
            </ListGroup.Item>
          </ListGroup>
        </div>
      ))}
            </Tab>
            
            <Tab eventKey="Sent Requests" title="Sent Requests">
              <Requests  
              
              />
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
