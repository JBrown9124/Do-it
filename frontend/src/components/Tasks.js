import { Modal, Button, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import History from "../services/History";
import Routes from "../services/Routes";
import { Link } from "react-router-dom";
import "./Tasks.css";
import Example from "./DeletePopOver";
import CreateTaskModal from "./CreateTaskModal";
function Tasks(props) {
  const [userID, setUserID] = React.useState(null);
  const [tasks, setTasks] = React.useState(null);
  const [load, isLoaded] = React.useState(false);
  const [taskID, setTaskID] = React.useState(null);
  const [createmodalShow, setcreateModalShow] = React.useState(false);

  // GET request using axios inside useEffect React hook
  const handleTasks = () => {
    axios
      .get(`http://127.0.0.1:8000/to_do_list/${props.user_id}/tasks`)
      .then((response) => {
        setTasks(response.data);
        isLoaded(true);
      });
  };
  const handleCreate = () => {
    setcreateModalShow(true);
  };
  const handleDelete = () => {
    const data = { task_id: taskID };

    axios
      .post(
        `http://127.0.0.1:8000/to_do_list/${props.user_id}/delete-task`,
        data
      )
      .then((resp) => {
        setTaskID(null);
      });
    handleTasks();
  };
  // empty dependency array means this effect will only run once (like componentDidMount in classes)
  if (props.show === false && load === false && props.user_id !== null) {
    handleTasks();
  }
  if (taskID !== null) {
    handleDelete();
  }

  if (tasks !== null)
    return (
      <div>
        <h1 className="text-center">To-Do List</h1>
        <Button variant="success" onClick={(e) => handleCreate()}>
          Create Task
        </Button>{" "}
        <CreateTaskModal
          show={createmodalShow}
          onHide={() => setcreateModalShow(false)}
          user_id={props.user_id}
          user ={(props)=> handleTasks()}
          
        />
        {tasks.user.map((task) => (
          <li key={task.task_id} className="ulremovebullets">
            <div className="text-center">
              <div>
                <div className="text-center">{task.task_name} </div>
                <div className="text-center">{task.task_priority} </div>
                <div className="text-center">{task.task_description}</div>
                {task.task_attendees}
              </div>
              <div className="text-center">{task.task_date_time}</div>
              <div
                class="btn-group"
                role="group"
                aria-label="Basic mixed styles example"
              >
                <Button
                  value={task.task_id}
                  onClick={(e) => setTaskID(parseInt(e.target.value))}
                  variant="danger"
                >
                  Delete Task
                </Button>
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
