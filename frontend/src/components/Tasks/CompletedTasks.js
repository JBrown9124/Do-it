import {
  Modal,
  Button,
  Form,
  ButtonGroup,
  Dropdown,
  Table,
  Card,
  Offcanvas,
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

function CompletedTasks(props) {
  const [tasks, setTasks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => props.handleCompletedTasks(false);
  const handleShow = () => setShow(true);

  const handlecompletedTasks = () => {
    axios
      .get(`http://127.0.0.1:8000/to_do_list/${props.user_id}/completed-tasks`)
      .then((response) => {
        setTasks(response.data);
      });
  };
  const handleclearcompletedTasks = () => {
    axios
      .delete(
        `http://127.0.0.1:8000/to_do_list/${props.user_id}/completed-tasks`
      )
      .then((response) => {
        handlecompletedTasks();
      });
  };
  const handledeletecompletedTask = (e) => {
    const data = { task_id: e };
    axios
      .delete(
        `http://127.0.0.1:8000/to_do_list/${props.user_id}/completed-task`, {data:data}
      )
      .then((response) => {
        handlecompletedTasks();
      });
  };
  const handleundocompletedTask = (e) => {
    const data = { task_id: e };
    axios
      .put(
        `http://127.0.0.1:8000/to_do_list/${props.user_id}/completed-task`, data
      )
      .then((response) => {
        handlecompletedTasks();props.handleTasks()

      });
  };
  useEffect(() => handlecompletedTasks(), [props.show]);
  if (tasks !== null) {
    return (
      <div>
        <Offcanvas show={props.show} onHide={handleClose}>
          <Offcanvas.Header closeButton onClick={() => handleClose()}>
            <Offcanvas.Title>Comepleted Tasks</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Button
              onClick={(e) => handleclearcompletedTasks()}
              variant="danger"
              size="med"
            >
              Clear completed tasks
            </Button>

            {tasks.user.map((task) => (
          <li key={task.task_id} className="ulremovebullets">
            
            <Card className="taskCard" style={{ width: "20rem" }}>
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
                    // onClick={(e) => seteditModalShow(true)}
                    size="lg"
                  >
                    Edit
                  </Button>
                  
                  <Button
                    variant="primary"
                    size="lg"
                    value={task.task_id}
                    onClick={(e) => handleundocompletedTask(parseInt(e.target.value))}
                  >
                    Undo 
                  </Button>
                  <Button
                    value={task.task_id}
                    onClick={(e) => handledeletecompletedTask(parseInt(e.target.value))}
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
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    );
  } else {
    return null;
  }
}

export default CompletedTasks;
