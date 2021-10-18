import {
  Modal,
  Button,
  Form,
  FormControl,
  ListGroup,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { FaUserFriends } from "react-icons/fa";
import moment from "moment";
import { ImShare2 } from "react-icons/im";
import { v4 as uuidv4 } from "uuid";

function FriendShareModal(props) {
  const [searchItem, setSearchItem] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const handleSubmit = (friend) => {
    const dateTimeStr = moment(props.sharedTaskData.task_date_time).format(
      "DD. MMMM YYYY HH:mm"
    );

    setLoading(true);

    const makeID = uuidv4();

    const data = {
      task: {
        task_name: props.sharedTaskData.task_name,
        task_priority: props.sharedTaskData.task_priority,
        task_description: props.sharedTaskData.task_description,

        task_date_time: dateTimeStr,
        task_completed: false,
        task_drawing: props.sharedTaskData.task_drawing,
        task_id: makeID,
      },
      sharing_with: friend,
    };

    props.createData(data);

    props.onHide();
  };

  function simulateNetworkRequest() {
    return new Promise((resolve) => setTimeout(resolve, 100));
  }

  useEffect(
    () => setSearchResults(props.allFriendsData),
    [props.allFriendsData.length]
  );
  useEffect(() => {
    const results = props.allFriendsData.filter((friend) =>
      friend.user_display_name.toLowerCase().includes(searchItem)
    );
    setSearchResults(results);
  }, [searchItem]);

  useEffect(() => {
    if (loading) {
      simulateNetworkRequest().then(() => {
        setLoading(false);
      });
    }
  }, [loading]);

  return (
    <>
      <Modal {...props} size="large" centered>
        <Modal.Header closeButton onClick={() => props.onHide()}>
          <Container>
            <Modal.Title>
              Share <FaUserFriends />
            </Modal.Title>
          </Container>
        </Modal.Header>

        <Modal.Body>
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
              <Container>
                <ListGroup className="friend-list-container" horizontal="xxl">
                  <Col>
                    <Row>
                      <ListGroup.Item
                        variant="info"
                        className="friend-list-seperator"
                      >
                        <Row>
                          <Col>
                            <strong>{friend.user_display_name}</strong>
                          </Col>
                          <Col>
                            <Button
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
                            </Button>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    </Row>
                  </Col>
                </ListGroup>
              </Container>
            </div>
          ))}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default FriendShareModal;
