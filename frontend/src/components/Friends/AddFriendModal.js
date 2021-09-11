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
    Col
  
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
    const [allUsersData, setAllUsersData] = useState([])
    const [searchItem, setSearchItem] = useState([])
    const [isDoesNotExistError, setIsDoesNotExistError] = useState(false)
    const handleUsers = () =>{
        axios
        .get(`http://127.0.0.1:8000/to_do_list/${props.userID}/users`)
        .then((response) => {
          setAllUsersData(response.data.all_users);
          
          // isLoaded(true);
         
          
          
        });
    }

    const handleRequest = () =>{
      const results = allUsersData.filter(
        (user) =>
          user.user_display_name.toLowerCase()===searchItem ||
          user.user_email.toLowerCase()===searchItem
      );
    
    if (results.length<1){
      setIsDoesNotExistError(true)
    }
    else{setIsDoesNotExistError(false)}
    axios
        .get(`http://127.0.0.1:8000/to_do_list/${props.userID}/users`)
        .then((response) => {
          setAllUsersData(response.data.all_users);
          
          // isLoaded(true);
         
          
          
        });
  }
    if (props.show === true && allUsersData.length<1) {
      handleUsers();
    }
    return (
    <>
    
      
      <Modal
      
        {...props}
        size="large"
       
        centered
      >
       
        <Modal.Header closeButton >
         
          <Modal.Title >
            Add a Friend
          </Modal.Title>
          
        </Modal.Header >
        
        <Modal.Body >
        <Form  className="request-form">
        <Row>
        <Col >
        
                <FormControl
                  onKeyPress={(e) => {
                    e.key === "Enter" && e.preventDefault();
                  }}
                  type="search"
                  placeholder="Username or email"
                  className="friend-search-box"
                  
                  aria-label="Search"
                  variant="primary"
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                />
              
              </Col>
              <Col >
              <Button  onClick={()=>handleRequest()} className="friend-request-button">
                Send request
              </Button>
              </Col>
              </Row>
              {isDoesNotExistError && (
                <small className="mt-3 d-inline-block text-danger">
                Username or email address does not exist.
                </small>
              )}
              </Form>
        </Modal.Body>
       
        
      </Modal>
     
      </>
    );
  }
  
  
  
export default AddFriendModal