import {
  Modal,
  Button,
  Form,
  ButtonGroup,
  Dropdown,
  Table,
  Card,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import History from "../services/History";
import Routes from "../services/Routes";
import { Link } from "react-router-dom";
import "./Tasks.css";
import Example from "./DeletePopOver";
import moment from "moment";
import CreateTaskModal from "./CreateTaskModal";
import EditTaskModal from "./EditTaskModal";
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
function Tasks(props) {
  const [userID, setUserID] = React.useState(null);
  const [tasks, setTasks] = React.useState(null);
  const [load, isLoaded] = React.useState(false);
  
  const [createmodalShow, setcreateModalShow] = React.useState(false);
  const [edittaskID, seteditTaskID] = React.useState(null);
  const [editModalShow, seteditModalShow] = React.useState(false);
  const [confetti, showConfetti] = React.useState(false)

  const handleTasks = (order = "tasks") => {
    axios
      .get(`http://127.0.0.1:8000/to_do_list/${props.user_id}/${order}`)
      .then((response) => {
        setTasks(response.data);
        isLoaded(true);
      });
  };
  // const handleCreate = () => {
  //   setcreateModalShow(true);
  // };
  const handleDelete = (e) => {
    const data = { task_id: e };

    axios
      .post(
        `http://127.0.0.1:8000/to_do_list/${props.user_id}/delete-task`,
        data
      )
      .then((resp) => {
        
      });
    handleTasks();
  };

  const handleComplete = (e) => {
     
    handleDelete(e);
    
  }
  if (props.show === false && load === false && props.user_id !== null) {
    handleTasks();
  }


  if (tasks !== null)
    return (
      <div>
        <Confetti
      run={confetti}
    />
        <h1 className="text-center">To-Do List</h1>
        <Button variant="success" onClick={(e) => setcreateModalShow(true)}>
          Create Task
        </Button>
        <Dropdown>
          <Dropdown.Toggle variant="Secondary" id="dropdown-basic">
            Sort by
          </Dropdown.Toggle>

          <Dropdown.Menu>
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
          </Dropdown.Menu>
        </Dropdown>
        <CreateTaskModal
          show={createmodalShow}
          onHide={() => setcreateModalShow(false)}
          user_id={props.user_id}
          user={(props) => handleTasks()}
        />
        {tasks.user.map((task) => (
          <li key={task.task_id} className="ulremovebullets">
            <div className="text-center">
              {/* <div>
                <div className="text-center">{task.task_name} </div>
                <div className="text-center">{task.task_priority} </div>
                <div className="text-center">{task.task_description}</div>
                {task.task_attendees}
              </div>
              <div className="text-center">
                {moment(task.task_date_time).format("MMMM DD YYYY hh:mm A")}
              </div> */}
              <div
                class="btn-group"
                role="group"
                aria-label="Basic mixed styles example"
              >
                <Card style={{ width: "25rem" }}>
                  <Card.Img variant="top" src="holder.js/100px180" />
                  <Card.Body>
                    <Card.Title>{task.task_name}</Card.Title>
                    <Card.Text>
                      <div className="text-center">{task.task_priority} </div>
                      <div className="text-center">{task.task_description}</div>
                      {task.task_attendees}

                      <div className="text-center">
                        {moment(task.task_date_time).format(
                          "MMMM DD YYYY hh:mm A"
                        )}
                      </div>
                    </Card.Text>
                    <div className="d-grid gap-2">
                      <Button variant="primary" size="lg"value={task.task_id} onClick={(e) => handleComplete(parseInt(e.target.value))}>
                        Complete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
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
                    value={task.task_id}
                    onClick={(e) => handleDelete(parseInt(e.target.value))}
                    variant="danger"
                    size="med"
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </li>
        ))}
      </div>
    );
  else return null;
  // return(<h1></h1>)
}
export default Tasks;
