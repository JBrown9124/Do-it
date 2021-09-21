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
  
  import moment from "moment";
  import { ImCheckmark, ImShare2 } from "react-icons/im";
  import { v4 as uuidv4 } from "uuid";
  
  function FriendShareModal(props) {
    const [allUsersData, setAllUsersData] = useState([]);
    const [searchItem, setSearchItem] = useState([]);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    
  const [searchResults, setSearchResults] = useState([]);
   
 
  
  
  const handleSubmit = (friend) => {
    // const dateTimeStr = moment(dateTime).format('YYYY-MM-DD HH:mm:ss')
    
    
      const dateTimeStr = moment(props.sharedTaskData.task_date_time).format("DD. MMMM YYYY HH:mm");

      setLoading(true);

      const makeID = uuidv4();
      
      const data = {
        task: {
          task_name: props.sharedTaskData.task_name,
          task_priority: props.sharedTaskData.task_priority,
          task_description: props.sharedTaskData.task_description,
          // attendees: attendees,
          task_date_time: dateTimeStr,
          task_completed: false,
          task_drawing:props.sharedTaskData.task_drawing,
          task_id: makeID,
        },
        sharing_with: friend,
      };
      
      props.createData(data);
      
    
      

      props.onHide();
      
      
    };
 

  //   axios
  //     .post(`http://127.0.0.1:8000/to_do_list/${props.user_id}/task`, data)
  //     .then((res) => {
  //       setData(res.data);

  //       setName("");
  //       setPriority("");
  //       setDescription("");
  //       setAttendees("");
  //       setdateTime("");

  //       setLoading(false);
  //       props.onHide();
  //       return props.user();
  //     })
  //     .catch((err) => {
  //   
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
  
  
  
    // .catch((err) => {
    //   setErrorMessage(err.response.data);
    //   setIsError(true);
    //   setLoading(false);
    // });
  
  
    return (
      <>
        <Modal {...props} size="large" centered>
          <Modal.Header closeButton onClick={() =>props.onHide()}>
            <Modal.Title>Friends</Modal.Title>
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
                    <Col>
                    <Row>
                    <ListGroup.Item
                      variant="info"
                      className="friend-list-seperator"
                    >
                      <Row>
                        <Col>
                    
                      <strong >
                        {friend.user_display_name}
                      </strong>
                      </Col>
                      <Col>
                      <Button 
                      onClick= {() => handleSubmit({user_display_name: friend.user_display_name, user_email: friend.user_email, user_id:friend.user_id})}
                      
                      variant="info">
                        <ImShare2/>
                      </Button>
                      
                      </Col>
                      </Row>
                    </ListGroup.Item>
                    </Row>
                    </Col>
                  </ListGroup>
                </div>
              ))}
          </Modal.Body>
        </Modal>
      </>
    );
  }
  
  export default FriendShareModal;
  