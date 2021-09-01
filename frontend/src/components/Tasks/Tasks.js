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
import CompletedTasks from "./CompletedTasks";
function Tasks(props) {
  const [userID, setUserID] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [load, isLoaded] = useState(false);

  const [createmodalShow, setcreateModalShow] = useState(false);
  const [edittaskID, seteditTaskID] = useState(null);
  const [editModalShow, seteditModalShow] = useState(false);
  const [confetti, showConfetti] = useState(false);
  const [completedTasks, showCompletedTasks] = useState(false);

  const handleTasks = (order = "tasks") => {
    axios
      .get(`http://127.0.0.1:8000/to_do_list/${props.user_id}/${order}`)
      .then((response) => {
        setTasks(response.data);
        isLoaded(true);
      });
  };
  useEffect(()=>handleTasks(),[props.user_id]
  )
  // const handlecompletedTasks = () => {
  //   axios
  //     .get(`http://127.0.0.1:8000/to_do_list/${props.user_id}/completed-task`)
  //     .then((response) => {
  //       setTasks(response.data);

  //     });
  // };
  // const handleCreate = () => {
  //   setcreateModalShow(true);
  // };
  const handleDelete = (e) => {
    const data = { task_id: e };

    axios
      .delete(`http://127.0.0.1:8000/to_do_list/${props.user_id}/task`, {
        data: data,
      })
      .then((resp) => {
        handleTasks();
      });
  };

  const handleComplete = (e) => {
    const data = { task_id: e };

    axios
      .put(
        `http://127.0.0.1:8000/to_do_list/${props.user_id}/completed-tasks`,
        data
      )
      .then((resp) => {
        handleTasks();
        // showCompletedTasks(true);
        
      });
  };
  // if (props.show === false && load === false && props.user_id !== null) {
  //   handleTasks();
  // }

  if (tasks !== null)
    return (
      <div className="taskCard">
        <h1 className="text-center">To-Do List</h1>
        <ButtonGroup>
        <Button variant="success" onClick={(e) => setcreateModalShow(true)}>
          Create Task
        </Button>

        <DropdownButton variant='secondary' id="dropdown-basic-button" title="Sort by">
          <Dropdown.Item href="#/action-1" onClick={() => handleTasks()}>
            Priority
          </Dropdown.Item>
          <Dropdown.Item
            href="#/action-2"
            onClick={() => handleTasks("task-by-date")}
          >
            Date and Time
          </Dropdown.Item>
          <Dropdown.Item
            href="#/action-3"
            onClick={() => handleTasks("task-by-name")}
          >
            Task Name
          </Dropdown.Item>
        </DropdownButton>
        </ButtonGroup>
        {/* <CompletedTasks
              user_id={props.user_id}
              // show={completedTasks}
              // handlecompletedTasks={(props) => showcompletedTasks(props)}
            /> */}

        <CreateTaskModal
          show={createmodalShow}
          onHide={() => setcreateModalShow(false)}
          user_id={props.user_id}
          user={(props) => handleTasks()}
        />
        {tasks.user.map((task) => (
          <li key={task.task_id} className="ulremovebullets">
            
            <Card  style={{ width: "20rem" }}>
              {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
              <Card.Body>
                <Card.Title className="text-center">{task.task_name}</Card.Title>
                <Card.Text>
                  <div className="text-center">{task.task_priority} </div>
                  <div className="text-center">{task.task_description}</div>
                  <div className="text-center">
                  {task.task_attendees}
                  </div>

                  <div className="text-center">
                    {moment(task.task_date_time).format("MMMM DD YYYY hh:mm A")}
                  </div>
                </Card.Text>
                <div className="d-grid gap-2"></div>
                <ButtonGroup aria-label="Basic example">
                  <Button
                    variant="warning"
                    onClick={(e) => seteditModalShow(true)}
                    size="lg"
                  >
                    Edit
                  </Button>
                  <EditTaskModal
                    show={editModalShow}
                    onHide={() => seteditModalShow(false)}
                    user_id={props.user_id}
                    priority={task.task_priority}
                    name={task.task_name}
                    id={task.task_id}
                    description={task.task_description}
                    attendees={task.task_attendees}
                    date_time={task.task_date_time}
                    user={(props) => handleTasks()}
                  />
                  <Button
                    variant="primary"
                    size="lg"
                    value={task.task_id}
                    onClick={(e) => handleComplete(parseInt(e.target.value))}
                  >
                    Complete
                  </Button>
                  <Button
                    value={task.task_id}
                    onClick={(e) => handleDelete(parseInt(e.target.value))}
                    variant="danger"
                    size="med"
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </Card.Body>
            </Card>
          </li>
        ))}
      </div>
    );
  else return null;
}
export default Tasks;
