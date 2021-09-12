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
// import "./Tasks.css";

import moment from "moment";
import CreateTaskModal from "../Tasks/IncompletedTasks/CreateTaskModal";
import EditTaskModal from "../Tasks/IncompletedTasks/EditTaskModal";
import useWindowSize from "react-use/lib/useWindowSize";

import FlipMove from "react-flip-move";
import { v4 as uuidv4 } from "uuid";
import { FaArrowCircleUp } from "react-icons/fa";

function Requests(props) {
  const [allReceivedFriendRequestsData, setAllReceivedFriendRequestsData] =
    useState([]);
  const [setUserID, userID] = useState(null)
  const handleReceivedFriendRequestsData = () => {
    axios
      .get(
        `http://127.0.0.1:8000/to_do_list/${props.userID}/user-friend-requests`
      )
      .then((response) => {
        setAllReceivedFriendRequestsData(response.data.user_friend_requests); 
        // isLoaded(true);
      });
  };
  const MINUTE_MS = 60000;
  
useEffect(() => {
  const interval = setInterval(() => {
   handleReceivedFriendRequestsData();
  }, MINUTE_MS);

  return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
}, [])
  
  
  
  const handleRemove = (fromUserID) => {
    const remainingRequests = allReceivedFriendRequestsData.filter(function(value, index, arr){
      
      return value.user_id !== fromUserID
    });

    console.log(remainingRequests);

    setAllReceivedFriendRequestsData(remainingRequests);
  };

  const handleAccept = (fromUserID) => {
    // setSearchResults(remainingTasks);

    const findUserByID = allReceivedFriendRequestsData.find(
      ({ user_id }) => user_id === fromUserID
    );
    console.log(findUserByID);
    props.allFriendsData.push(findUserByID);
    handleRemove(fromUserID);
    const data = { from_user_id: fromUserID };}
  //   axios
  //     .post(
  //       `http://127.0.0.1:8000/to_do_list/${props.userID}/accept-friend`,
  //       data
  //     )
  //     .then((res) => {
  //       handleRemove(fromUserID);
  //     })
  //     .catch((err) => {});
  // };
  return (
    <>
      {allReceivedFriendRequestsData.map((receivedRequest) => (
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
    </>
  );
  // } else {
  //   return null;
  // }
}

export default Requests;
