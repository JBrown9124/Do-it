import {
  Button,
  Form,
  ButtonGroup,
  Offcanvas,
  OverlayTrigger,
  Popover,
  FormControl,
  ListGroup,
  Tabs,
  Tab,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUserPlus, FiUserMinus } from "react-icons/fi";
import AddFriendModal from "./AddFriendModal";
import url from "../../services/URL";
import { GiThreeFriends } from "react-icons/gi";
function Friends(props) {
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [animationType, setAnimationType] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [deleteFriendID, setDeleteFriendID] = useState("");
  const [showDeletePopOver, setShowDeletePopOver] = useState(false);
  const handleClose = () => props.hideFriends(false);
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

    props.updateAllFriendsData(remainingFriends);
    const data = { to_user_id: friendID };
    axios
      .post(`${url}${props.userID}/remove-friend`, data)
      .then((response) => {});
  };
  const handleReject = (fromUserID) => {
    const findUserByID = props.allReceivedFriendRequestsData.find(
      ({ user_id }) => user_id === fromUserID
    );

    handleRemoveFriendRequest(fromUserID);
    const data = { from_user_id: fromUserID };
    axios
      .post(`${url}${props.userID}/reject-friend`, data)
      .then((res) => {})
      .catch((err) => {});
  };

  const handleAccept = (fromUserID) => {
    const findUserByID = props.allReceivedFriendRequestsData.find(
      ({ user_id }) => user_id === fromUserID
    );
    console.log(findUserByID);
    props.allFriendsData.push(findUserByID);
    handleRemoveFriendRequest(fromUserID);
    const data = { from_user_id: fromUserID };
    axios
      .post(`${url}${props.userID}/accept-friend`, data)
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
      <Popover.Body>This will be permanent!</Popover.Body>
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

  return (
    <>
      <Offcanvas show={props.show} onHide={handleClose} placement="top">
        <Offcanvas.Header
          className="text-center"
          closeButton
          onClick={() => handleClose()}
        >
          <Offcanvas.Title className="completed-title">
            Friends <GiThreeFriends />
          </Offcanvas.Title>
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
              <div className="add-friend-title">
                <Button
                  variant="success"
                  size="lg"
                  onClick={() => setShowAddFriendModal(true)}
                >
                  {showAddFriendModal ? "Adding..." : "Add a friend"}{" "}
                  <FiUserPlus />
                </Button>
              </div>
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

              {searchResults.map((friend) => (
                <div key={friend.user_id}>
                  <ListGroup className="friend-list-container" horizontal="xxl">
                    <Container>
                      <Col>
                        <Row>
                          <ListGroup.Item
                            variant="info"
                            className="friend-list-seperator"
                          >
                            <Row>
                              <Col>
                                <small>
                                  Sharing{" "}
                                  {handleFriendSharedTasksCount(
                                    parseInt(friend.user_id)
                                  )}{" "}
                                  tasks with
                                </small>{" "}
                                <strong>{friend.user_display_name}</strong>
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
                                      handleDeletePopOver(
                                        parseInt(e.target.value)
                                      )
                                    }
                                  >
                                    Remove <FiUserMinus />
                                  </Button>
                                </OverlayTrigger>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        </Row>
                      </Col>
                    </Container>
                  </ListGroup>
                </div>
              ))}
            </Tab>

            <Tab eventKey="Received Requests" title="Received Requests">
              {props.allReceivedFriendRequestsData.map((receivedRequest) => (
                <div key={receivedRequest.user_id}>
                  <ListGroup className="friend-list-container" horizontal="xxl">
                    <ListGroup.Item
                      variant="light"
                      className="friend-list-seperator"
                    >
                      <strong>{receivedRequest.user_display_name} </strong>{" "}
                      <Button
                        className="accept-decline-seperator"
                        variant="success"
                        size="med"
                        value={receivedRequest.user_id}
                        onClick={(e) => handleAccept(parseInt(e.target.value))}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        size="med"
                        value={receivedRequest.user_id}
                        onClick={(e) => handleReject(parseInt(e.target.value))}
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
                      <strong>{sentRequest.user_display_name}'s</strong> request
                      is pending...
                    </ListGroup.Item>
                  </ListGroup>
                </div>
              ))}
            </Tab>
          </Tabs>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Friends;
