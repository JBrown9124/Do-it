import {
  Modal,
  Button,
  Form,
  ButtonGroup,
  Dropdown,
  Table,
  Card,
  Container,
  Row,
  Col,
  DropdownButton,
  Popover,
  OverlayTrigger,
  FormControl,
  CardColumns,
  Fade,
  Offcanvas,
  ButtonToolbar,
  Navbar,
  Nav,
  Tooltip,
  Toast,
  ToastContainer,
  Alert,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import History from "../../../services/History";
import Routes from "../../../services/Routes";
import { Link } from "react-router-dom";

import Example from "./TaskDeletePopOver";
import moment from "moment";
import CreateTaskModal from "./CreateTaskModal";
import EditTaskModal from "./EditTaskModal";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import CompletedTasks from "../CompletedTasks/CompletedTasks";
import ReactTransitionGroup from "react-transition-group";
import FlipMove from "react-flip-move";
import { Transition } from "react-transition-group";
import { motion } from "framer-motion";
import Draggable from "react-draggable";

import {FaArrowCircleUp} from 'react-icons/fa';
function Tasks(props) {
  const [deleteTaskID, setDeleteTaskID] = useState(null);
  const [deleteTaskName, setDeleteTaskName] = useState(null);
  const [sendEditData, setSendEditData] = useState("");

  const [createModalShow, setcreateModalShow] = useState(false);

  const [editModalShow, setEditModalShow] = useState(false);
  const [animationType, setAnimationType] = useState("delete");
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [flipDisabled, setFlipDisabled] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [showScroll, setShowScroll] = useState(false)
const checkScrollTop = () => {    
   if (!showScroll && window.pageYOffset > 400){
      setShowScroll(true)    
   } else if (showScroll && window.pageYOffset <= 400){
      setShowScroll(false)    
   }  
};
window.addEventListener('scroll', checkScrollTop)
const scrollTop = () =>{
  window.scrollTo({top: 0, behavior: 'smooth'});
};  
useEffect(
    () => setSearchResults(props.incompletedTasksData),
    [props.incompletedTasksData.length]
  );

  useEffect(() => {
    setAnimationType("sort");
    const results = props.incompletedTasksData.filter(
      (task_name) =>
        task_name.task_name.toLowerCase().includes(searchItem) ||
        moment(task_name.task_date_time)
          .format("MMMM DD YYYY hh:mm A")
          .toLowerCase()
          .includes(searchItem)
    );
    setSearchResults(results);
  }, [searchItem]);

  // const handleClose = () => setShowOffCanvas(false);
  // const handleOffCanvasShow = (e) => {
  //   setShowOffCanvas(true);
  //   setDeleteTaskID(e);
  // };
  const handleCreate = (data) => {
    props.incompletedTasksData.unshift(data);

    axios
      .post(`http://127.0.0.1:8000/to_do_list/${props.user_id}/tasks`, data)
      .then((res) => {
        setShowToast(true);
      });
  };
  const handleComplete = (e) => {
    setAnimationType("complete");
    const findTaskByID = props.incompletedTasksData.find(
      ({ task_id }) => task_id === e
    );
    console.log(findTaskByID);
    const data = { completed_task_id: e };
    props.completedTasksData.unshift(findTaskByID);
    axios
      .put(
        `http://127.0.0.1:8000/to_do_list/${props.user_id}/completed-tasks`,
        data
      )
      .then((resp) => {});
    const filterTasksHelper = (task) => {
      return e !== task.task_id;
    };
    filterTasksHelper(props.incompletedTasksData);
    const remainingTasks = props.incompletedTasksData.filter(filterTasksHelper);
    // setSearchResults(remainingTasks);
    props.updateTasks(remainingTasks);
  };

  const handleDelete = (e) => {
    setAnimationType("delete");
    const findTasksByID = (task) => {
      return e !== task.task_id;
    };
    findTasksByID(props.incompletedTasksData);
    const remainingTasks = props.incompletedTasksData.filter(findTasksByID);
    // setSearchResults(remainingTasks);
    props.updateTasks(remainingTasks);
    setShowOffCanvas(false);
    const data = { task_id: e };
    axios
      .delete(`http://127.0.0.1:8000/to_do_list/${props.user_id}/tasks`, {
        data: data,
      })
      .then((resp) => {});
  };
  const handleDeleteOffCanvas = (e) => {
    setDeleteTaskID(e);
    const findTaskByID = props.incompletedTasksData.find(
      ({ task_id }) => task_id === e
    );
    setDeleteTaskName(findTaskByID.task_name);
    setShowOffCanvas(true);
  };
  const handleRetrieveEditData = (data) => {
    const taskByID = props.incompletedTasksData.find(
      ({ task_id }) => task_id === data.task_id
    );
    console.log(taskByID);
    taskByID.task_date_time = data.task_date_time;
    taskByID.task_priority = data.task_priority;
    taskByID.task_description = data.task_description;
    taskByID.task_name = data.task_name;

    axios
      .put(`http://127.0.0.1:8000/to_do_list/${props.user_id}/tasks`, data)
      .then((res) => {});
  };

  const handleSendEditData = (e) => {
    const data = e.split(",");
    setSendEditData(data);
    setEditModalShow(true);
  };

  const sortByHighestPriority = () => {
    setAnimationType("sort");
    // if (searchItem === "") {
    //   const sorted = [...props.incompletedTasksData].sort((a, b) =>
    //     a.task_priority.localeCompare(b.task_priority)
    //   );
    //   return props.updateTasks(sorted);
    // } else {
    const sortedSearch = [...searchResults].sort((a, b) =>
      a.task_priority.localeCompare(b.task_priority)
    );
    return setSearchResults(sortedSearch);
  };
  const sortByLowestPriority = () => {
    setAnimationType("sort");
    // if (searchItem === "") {
    //   const sorted = [...props.incompletedTasksData].sort((a, b) =>
    //     b.task_priority.localeCompare(a.task_priority)
    //   );
    //   return props.updateTasks(sorted);
    // } else {
    const sortedSearch = [...searchResults].sort((a, b) =>
      b.task_priority.localeCompare(a.task_priority)
    );
    return setSearchResults(sortedSearch);
  };
  const sortByFarthestDate = () => {
    setAnimationType("sort");
    // if (searchItem === "") {
    //   const sorted = [...props.incompletedTasksData].sort(
    //     (a, b) => new Date(b.task_date_time) - new Date(a.task_date_time)
    //   );
    //   return props.updateTasks(sorted);
    // } else {
    const sortedSearch = [...searchResults].sort(
      (a, b) => new Date(b.task_date_time) - new Date(a.task_date_time)
    );
    return setSearchResults(sortedSearch);
  };
  const sortByClosestDate = () => {
    setAnimationType("sort");
    // if (searchItem === "") {
    //   const sorted = [...props.incompletedTasksData].sort(
    //     (a, b) => new Date(a.task_date_time) - new Date(b.task_date_time)
    //   );
    //   return props.updateTasks(sorted);
    // } else {
    const sortedSearch = [...searchResults].sort(
      (a, b) => new Date(a.task_date_time) - new Date(b.task_date_time)
    );
    return setSearchResults(sortedSearch);
  };
  const sortByTaskName = () => {
    setAnimationType("sort");
    // if (searchItem === "") {
    //   const sorted = [...props.incompletedTasksData].sort((a, b) =>
    //     a.task_name.toLowerCase().localeCompare(b.task_name.toLowerCase())
    //   );
    //   return props.updateTasks(sorted);
    // } else {
    const sortedSearch = [...searchResults].sort((a, b) =>
      a.task_name.toLowerCase().localeCompare(b.task_name.toLowerCase())
    );
    return setSearchResults(sortedSearch);
  };
  // const popover = (
  //   <Popover id="popover-basic">
  //     <Popover.Header as="h3">Are you sure you want to delete?</Popover.Header>
  //     <Popover.Body>Note: This will be permanent!</Popover.Body>
  //     <ButtonGroup aria-label="Basic example">
  //       <Button onClick={(e) => handleDelete(taskID)} variant="secondary">
  //         Yes
  //       </Button>

  //       <Button variant="secondary" onClick={() => settaskID(null)}>
  //         No
  //       </Button>
  //     </ButtonGroup>
  //   </Popover>
  // );
  const cardBorder = {
    A: "danger",
    B: "warning",
    C: "primary",
    D: "info",
    F: "success",
  };
  const cardAnimation = {
    complete: "accordionHorizontal",
    delete: "elevator",
    sort: "accordionVertical",
  };

  if (props.show === true && props.incompletedTasksData !== null)
    return (
      <>
     
        
     <FaArrowCircleUp 
   className="scrollTop" 
   onClick={scrollTop} 
   style={{height: 40, display: showScroll ? 'flex' : 'none'}}
/>


       
        

        <CreateTaskModal
          show={createModalShow}
          onHide={() => setcreateModalShow(false)}
          user_id={props.user_id}
          createData={(data) => handleCreate(data)}
        />
        <EditTaskModal
          show={editModalShow}
          onHide={() => setEditModalShow(false)}
          targeteditData={sendEditData}
          user_id={sendEditData[0]}
          retrieveEditData={(data) => handleRetrieveEditData(data)}
        />
        <Offcanvas
          show={showOffCanvas}
          onHide={() => setShowOffCanvas(false)}
          placement="bottom"
        >
          <Offcanvas.Header className="tasks-container">
            <Offcanvas.Title>
              Are you sure you want to delete "{deleteTaskName}"?{" "}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <div className="text-center">This will be permanent!</div>
          <Offcanvas.Body className="tasks-container">
            <ButtonGroup aria-label="Basic example">
              <Button
                onClick={(e) => handleDelete(deleteTaskID)}
                variant="danger"
                size="lg"
              >
                Yes
              </Button>

              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowOffCanvas(false)}
              >
                No
              </Button>
            </ButtonGroup>
          </Offcanvas.Body>
        </Offcanvas>
        <h2 className="title">Do or Do not</h2>
        {/* <div className="sticky-top">  */}
        {/* <Button
          // className="create-button"
          className="create-task"
          variant="success"
          size="med"
          onClick={(e) => setcreateModalShow(true)}
        >
          Create
        </Button> */}
        {/* </div>  */}

        <ButtonToolbar
          className="top-tasks-buttons"
          aria-label="Toolbar with button groups"
        >
          <ButtonGroup className="me-2" aria-label="Second group">
            <Form className="d-flex">
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
          </ButtonGroup>

          <ButtonGroup aria-label="Third group">
            <DropdownButton
              size="med"
              variant="secondary"
              id="dropdown-basic-button"
              title="Sort by"
            >
              <Dropdown.Item onClick={() => sortByLowestPriority()}>
                Lowest priority
              </Dropdown.Item>
              <Dropdown.Item onClick={() => sortByHighestPriority()}>
                Highest priority
              </Dropdown.Item>
              <Dropdown.Item onClick={() => sortByClosestDate()}>
                Earliest date/time
              </Dropdown.Item>
              <Dropdown.Item onClick={() => sortByFarthestDate()}>
                Latest date/time
              </Dropdown.Item>

              <Dropdown.Item onClick={() => sortByTaskName()}>
                Name
              </Dropdown.Item>
            </DropdownButton>
          </ButtonGroup>
        </ButtonToolbar>
        {/* <Alert  animation={true} variant="light"  className="toast-container" onClose={() => setShowToast(false)}  show={showToast} delay={3000}  autohide>
  
 
  Saved.


</Alert>  */}

       
          <Toast bg="light" className="toast-container"animation={true}  onClose={() => setShowToast(false)}  show={showToast} delay={3000} autohide >
            <Toast.Body>
            Saved.
            </Toast.Body>
          </Toast>
        
        
        
        {searchResults.map((task) => (
          <div className="tasks-container" key={task.task_id}>
           
            <Card
              className="task-card"
              border={cardBorder[task.task_priority]}
              style={{ width: "22rem" }}
            >
              
              <Card.Header>{task.task_name}</Card.Header>
              <Card.Body>
                <Card.Text>{task.task_description}</Card.Text>

                <ButtonGroup>
                  <Button
                    variant="warning"
                    onClick={(e) => handleSendEditData(e.target.value)}
                    size="med"
                    value={[
                      props.user_id,
                      task.task_priority,
                      task.task_name,
                      task.task_id,
                      task.task_description,
                      task.task_date_time,
                    ]}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="primary"
                    size="med"
                    value={task.task_id}
                    onClick={(e) => handleComplete(e.target.value)}
                  >
                    Complete
                  </Button>
                  <Button
                    value={task.task_id}
                    variant="danger"
                    onClick={(e) => handleDeleteOffCanvas(e.target.value)}
                    size="med"
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </Card.Body>
              <Card.Footer>
                {moment(task.task_date_time).format("MMMM DD YYYY hh:mm A")}
              </Card.Footer>
            </Card>
          </div>
        ))}
        

         <Navbar fixed="bottom" collapseOnSelect className="Navcontainer">
          
          <Button
            // className="create-button"
            className="create-task-nav"
            variant="success"
            size="lg"
            onClick={(e) => setcreateModalShow(true)}
          >
            {createModalShow ? "Creating...": "Create"}
          </Button>
          
        </Navbar> 
      </>
      
    );
  else return null;
}
export default Tasks;
