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
  Row,
  Col,
  Toast,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
// import "./Tasks.css";


import url from "../../services/URL"
import FlipMove from "react-flip-move";
import { v4 as uuidv4 } from "uuid";
import { FaArrowCircleUp } from "react-icons/fa";
function AddFriendModal(props) {
  const [allUsersData, setAllUsersData] = useState([]);
  const [searchItem, setSearchItem] = useState([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  useEffect(() => handleClearInput(), [props.show]);
  function simulateNetworkRequest() {
    return new Promise((resolve) => setTimeout(resolve, 100));
  }
  
  
    
  
    useEffect(() => {
      if (loading) {
        simulateNetworkRequest().then(() => {
          setLoading(false);
        });
      }
    }, [loading]);


  const handleClearInput = () => {
    setSearchItem("");
    setIsError(false);
  };
  const handleUsers = () => {
    axios
      .get(`${url}${props.userID}/users`)
      .then((response) => {
        setAllUsersData(response.data.all_users);

        // isLoaded(true);
      });
  };
  const MINUTE_MS = 30000;
  useEffect(() => {
    const interval = setInterval(() => {
      handleUsers(props.userID);
    }, MINUTE_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [props.userID]);
  const doesUserExist = () => {
    setLoading(true);
    setIsError(false);
    const findUser = allUsersData.filter(
      (user) =>
        user.user_display_name === searchItem ||
        user.user_email === searchItem
    );

    if (findUser.length === 0) {
      setIsError(true);
      
      setErrorMessage("User does not exist");
      return false;
    } else {
     

      setIsError(false);
      return isUserFriend(findUser[0]);
    }
  };

  const isUserFriend = (user) => {

    const isUserFriend = props.allFriendsData.filter(
      (friend) => friend.user_id === user.user_id
    );
    if (isUserFriend.length > 0) {
      setIsError(true);
      
      return setErrorMessage("User is already a friend");
    } else {
      isUserInReceived(user);
    }
  };
  const isUserInReceived = (user) => {
    const userInReceived = props.allReceivedFriendRequestsData.filter(
      (friend) => friend.user_id === user.user_id
    );

    if (userInReceived.length > 0) {
      setIsError(true);
      
      return setErrorMessage("User's friend request is in your recieved inbox");
    } else {
      isUserInSent(user);
    }
  };
  const isUserInSent = (user) => {
    const userInSent = props.allSentFriendRequestsData.filter(
      (friend) => friend.user_id === user.user_id
    );

    if (userInSent.length > 0) {
      setIsError(true);
      
      return setErrorMessage("User's friend request is sent and pending");
    } else {
      handleFriendRequest(user);
      props.allSentFriendRequestsData.push(user);
    }
  };

  const handleFriendRequest = (user) => {
    const data = { to_user_id: user.user_id };
    axios
      .post(`${url}${props.userID}/add-friend`, data)
      .then((response) => {
        setShowSuccessToast(true);
        
        setIsError(false);
        setErrorMessage("");

        // props.allFriendsData.push(user); request pending data

        // isLoaded(true);
      });
  };

  // .catch((err) => {
  //   setErrorMessage(err.response.data);
  //   setIsError(true);
  //   setLoading(false);
  // });

  if (props.show === true && allUsersData.length < 1) {
    handleUsers();
  }
  return (
    <>
      <Modal {...props} size="large" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add a Friend</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Toast
            bg="light"
            className="toast-container"
            animation={true}
            onClose={() => setShowSuccessToast(false)}
            show={showSuccessToast}
            delay={3000}
            autohide
          >
            <Toast.Body>Friend request sent!</Toast.Body>
          </Toast>
          <Form className="request-form">
            <Row>
              <Col>
                <FormControl
                  onKeyPress={(e) => {
                    e.key === "Enter" && e.preventDefault();
                  }}
                  placeholder="Username or email"
                  className="friend-search-box"
                  variant="primary"
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                />
              </Col>
              <Col>
                <Button
                  onClick={() => doesUserExist()}
                  disabled={loading}
                  className="friend-request-button"
                >
                  {loading ? "Sending..." : "Send request"}
                 
                </Button>
              </Col>
            </Row>
            {isError && (
              <small className="mt-3 d-inline-block text-danger">
                {errorMessage}
              </small>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddFriendModal;
