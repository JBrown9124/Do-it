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
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import History from "../../services/History";
import Routes from "../../services/Routes";
import { Link } from "react-router-dom";

import Example from "./TaskDeletePopOver";
import moment from "moment";
import CreateTaskModal from "./CreateTaskModal";
import EditTaskModal from "./EditTaskModal";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import CompletedTasks from "./CompletedTasks/CompletedTasks";
import ReactTransitionGroup from "react-transition-group";
import FlipMove from "react-flip-move";
import { Transition } from "react-transition-group";
import { motion } from "framer-motion";
function Tasks(props) {
  const [deleteTaskID, setDeleteTaskID] = useState(null);
  const [sendEditData, setSendEditData] = useState("");

  const [createmodalShow, setcreateModalShow] = useState(false);

  const [editModalShow, setEditModalShow] = useState(false);
  const [animationType, setAnimationType] = useState("delete");
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [searchResults, setSearchResults] = useState([])
  useEffect(()=>setSearchResults(props.incompletedTasksData),[props.incompletedTasksData])
  useEffect(() => {
    const results = props.incompletedTasksData.filter(task_name =>
      task_name.task_name.toLowerCase().includes(searchItem)
    );
    setSearchResults(results);
  }, [searchItem]);

  // const handleClose = () => setShowOffCanvas(false);
  const handleOffCanvasShow = (e) => {
    setShowOffCanvas(true);
    setDeleteTaskID(e);
  };
  const handleCreate = (data) => {
    props.incompletedTasksData.unshift(data);
    
    axios
      .post(`http://127.0.0.1:8000/to_do_list/${props.user_id}/tasks`, data)
      .then((res) => {})
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
    props.updateTasks(remainingTasks);
  };

  const handleDelete = (e) => {
    setAnimationType("delete");
    const findTasksByID = (task) => {
      return e !== task.task_id;
    };
    findTasksByID(props.incompletedTasksData);
    const remainingTasks = props.incompletedTasksData.filter(findTasksByID);

    props.updateTasks(remainingTasks);
    setShowOffCanvas(false);
    const data = { task_id: e };
    axios
      .delete(`http://127.0.0.1:8000/to_do_list/${props.user_id}/tasks`, {
        data: data,
      })
      .then((resp) => {
         
      });
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
    const sorted = [...props.incompletedTasksData].sort((a, b) =>
      a.task_priority.localeCompare(b.task_priority)
    );
    props.updateTasks(sorted);
  };
  const sortByLowestPriority = () => {
    const sorted = [...props.incompletedTasksData].sort((a, b) =>
      b.task_priority.localeCompare(a.task_priority)
    );

    props.updateTasks(sorted);
  };
  const sortByFarthestDate = () => {
    const sorted = [...props.incompletedTasksData].sort(
      (a, b) => new Date(b.task_date_time) - new Date(a.task_date_time)
    );

    props.updateTasks(sorted);
  };
  const sortByClosestDate = () => {
    const sorted = [...props.incompletedTasksData].sort(
      (a, b) => new Date(a.task_date_time) - new Date(b.task_date_time)
    );
    props.updateTasks(sorted);
  };
  const sortByTaskName = () => {
    const sorted = [...props.incompletedTasksData].sort((a, b) =>
      a.task_name.toLowerCase().localeCompare(b.task_name.toLowerCase())
    );
    props.updateTasks(sorted);
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
  };

  if (props.show === true && props.incompletedTasksData !== null)
    return (
      
      <div className="tasks-container">
        <CreateTaskModal
          show={createmodalShow}
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
            <Offcanvas.Title >Are you sure you want to delete? </Offcanvas.Title>
          </Offcanvas.Header>
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
        <h1 className="top-tasks-buttons">Do or Do Not</h1>
        <ButtonGroup className="top-tasks-buttons">
          <Button
            variant="success"
            size="med"
            onClick={(e) => setcreateModalShow(true)}
          >
            Create Task
          </Button>
          <Form className="d-flex">
      <FormControl
        onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
        type="search"
        placeholder="Search name"
        className="mr-2"
        aria-label="Search"
        variant = "primary"
        value={searchItem}
        onChange={(e)=>setSearchItem(e.target.value)}
      />
      {/* <Button variant="outline-primary">Search</Button> */}
    </Form>
          <DropdownButton
            size="med"
            variant="secondary"
            id="dropdown-basic-button"
            title="Sort by"
          >
            <Dropdown.Item onClick={() => sortByLowestPriority()}>
              Lowest Priority
            </Dropdown.Item>
            <Dropdown.Item onClick={() => sortByHighestPriority()}>
              Highest Priority
            </Dropdown.Item>
            <Dropdown.Item onClick={() => sortByClosestDate()}>
              Closest Date
            </Dropdown.Item>
            <Dropdown.Item onClick={() => sortByFarthestDate()}>
              Farthest Date
            </Dropdown.Item>

            <Dropdown.Item onClick={() => sortByTaskName()}>
              Task Name
            </Dropdown.Item>
          </DropdownButton>
          {/* <Button
                    
                    onClick={() => handledeleteAll()}
                    variant="danger"
                    size="lg"
                  >
                    Delete All
                  </Button> */}
        </ButtonGroup>
        <FlipMove
        typeName={null}
          staggerDelayBy={150}
          leaveAnimation={cardAnimation[animationType]}
        >
          {searchResults.map((task) => (
            // <li  className="ulremovebullets">
            <ul key={task.task_id} className="task-card-seperator">
              <Card
                className="mx-auto"
                border={cardBorder[task.task_priority]}
                style={{ width: "22rem" }}
              >
                <Card.Header>{task.task_name}</Card.Header>
                <Card.Body>
                  <Card.Text>{task.task_description}</Card.Text>

                  <ButtonGroup aria-label="Basic example">
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
                      onClick={(e) => handleOffCanvasShow(e.target.value)}
                      size="med"
                    >
                      Delete
                    </Button>

                    {/* <OverlayTrigger
                      trigger="focus"
                      placement="right"
                      overlay={popover}
                    >
                      <Button
                        onClick={(e) => settaskID(e.target.value)}
                        value={task.task_id}
                        variant="danger"
                        size="lg"
                      >
                        Delete
                      </Button>
                    </OverlayTrigger> */}
                  </ButtonGroup>
                </Card.Body>
                <Card.Footer>
                  {moment(task.task_date_time).format("MMMM DD YYYY hh:mm A")}
                </Card.Footer>
              </Card>
            </ul>
            // {/* </li> */}
          ))}
        </FlipMove>
      </div>
      
    );
  else return null;
}
export default Tasks;
