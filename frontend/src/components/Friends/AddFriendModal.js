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
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import History from "../../services/History";
import Routes from "../../services/Routes";
import { Link } from "react-router-dom";
// import "./Tasks.css";

import moment from "moment";
import CreateTaskModal from "../Tasks/IncompletedTasks/CreateTaskModal";
import EditTaskModal from "../Tasks/IncompletedTasks/EditTaskModal";
import useWindowSize from "react-use/lib/useWindowSize";

import FlipMove from "react-flip-move";
import { v4 as uuidv4 } from "uuid";
import { FaArrowCircleUp } from "react-icons/fa";
function AddFriendModal(props) {
  const [allUsersData, setAllUsersData] = useState([]);
  const [searchItem, setSearchItem] = useState([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => handleClearInput(), [props.show]);
  const handleClearInput = () => {
    setSearchItem("");
    setIsError(false);
  };
  const handleUsers = () => {
    axios
      .get(`http://127.0.0.1:8000/to_do_list/${props.userID}/users`)
      .then((response) => {
        setAllUsersData(response.data.all_users);

        // isLoaded(true);
      });
  };

  const doesUserExist = () => {
    setLoading(true);
    setIsError(false);
    const findUser = allUsersData.filter(
      (user) =>
        user.user_display_name.toLowerCase() === searchItem ||
        user.user_email.toLowerCase() === searchItem
    );

    if (findUser.length === 0) {
      setIsError(true);
      setLoading(false);
      setErrorMessage("User does not exist");
      return false;
    } else {
      setLoading(false);

      setIsError(false);
      return isUserFriend(findUser[0]);
    }
  };

  const isUserFriend = (user) => {
    const isUserFriend = props.allFriendsData.filter(
      (friend) => friend.user_display_name === user.user_display_name
    );
    if (isUserFriend.length > 0) {
      setIsError(true);
      setLoading(false);
      return setErrorMessage("User is already a friend");
    } else {
      handleFriendRequest(user)
    }
  };
  const handleFriendRequest = (user) =>{
    setIsError(false);
      setErrorMessage("");
      const data = { to_user_id: user.user_id };
      axios
        .post(
          `http://127.0.0.1:8000/to_do_list/${props.userID}/add-friend`,
          data
        )
        .then((response) => {
          setLoading(false);
          setIsError(false);
          // props.allFriendsData.push(user); request pending data

          // isLoaded(true);
        });
  }
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
