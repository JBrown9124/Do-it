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
    Container
  } from "react-bootstrap";
  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import History from "../../../services/History";
  import Routes from "../../../services/Routes";
  import { Link } from "react-router-dom";
  // import "./Tasks.css";
  
  import moment from "moment";
  import CreateTaskModal from "../IncompletedTasks/CreateTaskModal";
  import EditTaskModal from "../IncompletedTasks/EditTaskModal";
  import useWindowSize from "react-use/lib/useWindowSize";
 
  import FlipMove from "react-flip-move";
  import { v4 as uuidv4 } from "uuid";
  import { FaArrowCircleUp } from "react-icons/fa";
function AddFriendModal(props) {
    const [allUsers, setAllUsers] = useState([])
    const [searchItem, setSearchItem] = useState([])
    const handleUsers = () =>{
        axios
        .get(`http://127.0.0.1:8000/to_do_list/users`)
        .then((response) => {
          setAllUsers(response.data.complete);
          
          // isLoaded(true);
         
          
          
        });
    }
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Friends
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
            dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
            consectetur ac, vestibulum at eros.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  
  
  
export default AddFriendModal