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
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import History from "../../services/History";
import Routes from "../../services/Routes";
import { Link } from "react-router-dom";
import "./Tasks.css";
import Example from "./TaskDeletePopOver";
import moment from "moment";
import CreateTaskModal from "./CreateTaskModal";
import EditTaskModal from "./EditTaskModal";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import CompletedTasks from "./CompletedTasks/CompletedTasks";
import ReactTransitionGroup from "react-transition-group";
import FlipMove from "react-flip-move";

function Tasks(props) {
  // const [userID, setUserID] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [load, isLoaded] = useState(false);
  const [deletepopOver, showdeletepopOver] = useState(false);
  const [taskID, settaskID] = useState(null);
  const [sendEditData, setSendEditData] = useState("");
  const [sortType, setSortType] = useState("task_priority")
  const [retrieveEditData, setRetrieveEditData] = useState("");
  const [createmodalShow, setcreateModalShow] = useState(false);
  // const [edittaskID, seteditTaskID] = useState(null);
  const [editModalShow, setEditModalShow] = useState(false);
  // const [confetti, showConfetti] = useState(false);
  // const [completedTasks, showCompletedTasks] = useState(false);
  const [overlayShow, setoverlayShow] = useState(false);
  const [completedTask, setCompletedTask] = useState(null);

  const handleTasks = () => {
    axios
      .get(`http://127.0.0.1:8000/to_do_list/${props.user_id}/tasks`)
      .then((response) => {
        setTasks(response.data);
        isLoaded(true);
      });
  };
  const handleComplete=(e)=>{
    const findTaskByID = (task) =>{
      return e === String(task.task_id);
    };
    findTaskByID(props.incompletedTasksData)
    const foundTask = props.incompletedTasksData.filter(findTaskByID)
    props.completedTasksData.unshift(foundTask[0]);
    handleDelete(e);
  }
    

  
  const handleDelete = (e) => {
    
    const findTasksByID = (task) => {
      return e !== String(task.task_id);
    };
    findTasksByID(props.incompletedTasksData);
    const remainingTasks = props.incompletedTasksData.filter(findTasksByID);
    
    props.updateTasks(remainingTasks);
  };

  const handleRetrieveEditData = (data) => {
    const modifiedTask = props.incompletedTasksData.filter((task, index, arr) => {
      if (String(task.task_id) === data.task_id) {
        task.task_date_time = data.task_date_time;
        task.task_priority = data.task_priority;
        task.task_description = data.task_description;
        task.task_name = data.task_name;
      }
      // arr[data.task_id]=data
    });
    
    
    return modifiedTask;
  };

  // const handleComplete = (e) => {
  //   const data = { task_id: e };

  //   axios
  //     .put(
  //       `http://127.0.0.1:8000/to_do_list/${props.user_id}/completed-tasks`,
  //       data
  //     )
  //     .then((resp) => {
  //       handleTasks();
  //     });
  // };
  const handleSendEditData = (e) => {
    const data = e.split(",");
    setSendEditData(data);
    setEditModalShow(true);
  };
  const handleCreate = (data) => {
    

    // }
    props.incompletedTasksData.unshift(data);
    // sortCall(sortType);
    
    
    

  };
  // const sortCall = (type) => {
  //   const sortProperty = {
  //     lowestpriority:sortByLowestPriority(),
  //     highestpriority:sortByHighestPriority(),
  //     farthestdate:sortByFarthestDate(),
  //     closestdate:sortByClosestDate(),
  //     taskname:sortByTaskName(),}
  //   const sortCallType= sortProperty.[`${type}`];
  //   console.log(sortCallType);
  //   return sortCallType
  // }
  const sortByHighestPriority = () => {
    const sorted = [...props.incompletedTasksData].sort((a, b) =>
      a.task_priority.localeCompare(b.task_priority)
    );
   
    setTasks(sorted);
    setSortType("highestpriority");
  };
  const sortByLowestPriority = () => {
    const sorted = [...props.incompletedTasksData].sort((a, b) =>
      b.task_priority.localeCompare(a.task_priority)
    );
    
    setTasks(sorted);
    setSortType("lowestpriority");
  };
  const sortByFarthestDate = () => {
    const sorted = [...props.incompletedTasksData].sort(
      (a, b) => new Date(b.task_date_time) - new Date(a.task_date_time)
    );
    
    setTasks(sorted);
    setSortType("farthestdate");
  };
  const sortByClosestDate = () => {
    const sorted = [...props.incompletedTasksData].sort(
      (a, b) => new Date(a.task_date_time) - new Date(b.task_date_time)
    );
    setTasks(sorted);
    setSortType("closestdate");
  };
  const sortByTaskName = () => {
    const sorted = [...props.incompletedTasksData].sort((a, b) =>
      a.task_name.toLowerCase().localeCompare(b.task_name.toLowerCase())
    );
    setTasks(sorted);
    setSortType("taskname");
  };
  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Are you sure you want to delete?</Popover.Header>
      <Popover.Body>Note: This will be permanent!</Popover.Body>
      <ButtonGroup aria-label="Basic example">
        <Button onClick={(e) => handleDelete(taskID)} variant="secondary">
          Yes
        </Button>

        <Button variant="secondary" onClick={() => settaskID(null)}>
          No
        </Button>
      </ButtonGroup>
    </Popover>
  );
  const cardBorder = {
    A: "danger",
    B: "warning",
    C: "primary",
    D: "info",
    F: "success",
  };
  // if (props.show === false && load === false && props.user_id !== null) {
  //   handleTasks();
  // }
  

  
  if (props.show === true && props.incompletedTasksData !== null)
    return (
      <div className="tasks-container">
        <h1 className="top-tasks-buttons">To-Do List</h1>
        <ButtonGroup>
          <Button
            variant="success"
            size="med"
            onClick={(e) => setcreateModalShow(true)}
          >
            Create Task
          </Button>
          <CreateTaskModal
            show={createmodalShow}
            onHide={() => setcreateModalShow(false)}
            user_id={props.user_id}
            createData={(data) => handleCreate(data)}
            user={(props) => handleTasks()}
          />
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
        {/* <CompletedTasks
              user_id={props.user_id}
              // show={completedTasks}
              // handlecompletedTasks={(props) => showcompletedTasks(props)}
            /> */}

        {/* <FlipMove > */}
          {props.incompletedTasksData.map((task) => (
            <li key={task.task_id} className="ulremovebullets">
              <div className="task-card-seperator">
                <Card
                  className="mx-auto"
                  border={cardBorder[task.task_priority]}
                  style={{ width: "20rem" }}
                >
                  {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                  <Card.Header>{task.task_name}</Card.Header>
                  <Card.Body>
                    {/* <Card.Title ></Card.Title> */}
                    <Card.Text>
                      {/* <div >{task.task_priority} </div> */}
                      <div>{task.task_description}</div>
                      {/* <div>
                  {task.task_attendees}
                  </div> */}

                      {/* <div >
                    {moment(task.task_date_time).format("MMMM DD YYYY hh:mm A")}
                  </div> */}
                    </Card.Text>

                    <ButtonGroup aria-label="Basic example">
                      <Button
                        variant="warning"
                        onClick={(e) => handleSendEditData(e.target.value)}
                        size="lg"
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
                        size="lg"
                        value={task.task_id}
                        onClick={(e) => handleComplete(e.target.value)}
                      >
                        Complete
                      </Button>

                      <OverlayTrigger
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
                      </OverlayTrigger>
                    </ButtonGroup>
                  </Card.Body>
                  <Card.Footer>
                    {moment(task.task_date_time).format("MMMM DD YYYY hh:mm A")}
                  </Card.Footer>
                </Card>
              </div>
            </li>
          ))}
        {/* </FlipMove> */}
        <EditTaskModal
          show={editModalShow}
          onHide={() => setEditModalShow(false)}
          targeteditData={sendEditData}
          user_id={sendEditData[0]}
          // priority={task.task_priority}
          // name={task.task_name}
          // id={task.task_id}
          // description={task.task_description}
          // attendees={task.task_attendees}
          // date_time={task.task_date_time}
          // user={(props) => handleTasks()}
          retrieveEditData={(data) => handleRetrieveEditData(data)}
        />
      </div>
    );
  else return null;
}
export default Tasks;
