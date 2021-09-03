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
  Popover
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import History from "../../../services/History";
import Routes from "../../../services/Routes";
import { Link } from "react-router-dom";
// import "./Tasks.css";
import Example from "../TaskDeletePopOver";
import moment from "moment";
import CreateTaskModal from "../CreateTaskModal";
import EditTaskModal from "../EditTaskModal";
import useWindowSize from "react-use/lib/useWindowSize";
import ReuseTaskModal from "./ReuseTaskModal";


function CompletedTasks(props) {
  const [tasks, setTasks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [show, setShow] = useState(false);
  const [reusemodalShow, setreusemodalShow] = useState(false);
  const [reuseSuccess, setreuseSuccess] = useState(false);
  const [reuseData, setreuseData]=useState("")
  const handleClose = () => props.handleCompletedTasks(false);
  const handleShow = () => setShow(true);
  

  const handlecompletedTasks = () => {
    axios
      .get(`http://127.0.0.1:8000/to_do_list/${props.user_id}/completed-tasks`)
      .then((response) => {
        setTasks(response.data);
      });
  };
  // const handleclearcompletedTasks = () => {
  //   axios
  //     .delete(
  //       `http://127.0.0.1:8000/to_do_list/${props.user_id}/completed-tasks`
  //     )
  //     .then((response) => {
  //       handlecompletedTasks();
  //     });
  // };
  // const handledeletecompletedTask = (e) => {
  //   const data = { task_id: e };
  //   axios
  //     .delete(
  //       `http://127.0.0.1:8000/to_do_list/${props.user_id}/completed-task`, {data:data}
  //     )
  //     .then((response) => {
  //       handlecompletedTasks();
  //     });
  // };
  const handlereuseSuccess = () =>{
    props.handleTasks();
  }
  
  const handleReuse = (e) =>{
    const data = e.split(",")
    setreuseData(data); setreusemodalShow(true)
  }
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
  const cardBorder = {
    A:"danger",
    B:"warning",
    C:"primary",
    D:"info",
    F:"success"
  }
  useEffect(() => handlecompletedTasks(), [props.show]);
  useEffect(()=>props.handleTasks(), [reuseSuccess]);
  if (tasks !== null) {
    return (
      
        <Offcanvas show={props.show} onHide={handleClose}>
          <Offcanvas.Header closeButton onClick={() => handleClose()}>
            <Offcanvas.Title>Completed Tasks</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {/* <Button
              onClick={(e) => handleclearcompletedTasks()}
              variant="danger"
              size="med"
            >
              Clear completed tasks
            </Button> */}

            {tasks.user.map((task) => (
          <li key={task.task_id} className="ulremovebullets">
            
            <div className="task-card-seperator">
            <Card  border={cardBorder[task.task_priority]} style={{ width: "20rem" }}>
              {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
              <Card.Header className="text-center">{task.task_name}</Card.Header>
              <Card.Body>
                {/* <Card.Title ></Card.Title> */}
                <Card.Text>
                  {/* <div >{task.task_priority} </div> */}
                  <div className="text-center">{task.task_description}</div>
                  {/* <div className="text-center">
                  Attending: {task.task_attendees} people
                  </div> */}

                  {/* <div >
                    {moment(task.task_date_time).format("MMMM DD YYYY hh:mm A")}
                  </div> */}
                </Card.Text>
                <div className="d-grid gap-2"></div>
               <div className="text-center">
                <ButtonGroup aria-label="Basic example">
                 
                  
                  
                  <Button
                    variant="primary"
                    size="lg"
                    value={[props.user_id, task.task_priority,task.task_name, task.task_id, task.task_description, task.task_date_time]}
                    onClick={(e) => handleReuse(e.target.value)}

                    
                  >
                    Reuse
                  </Button><Button
                    variant="warning"
                    size="lg"
                    value={task.task_id}
                    onClick={(e) => handleundocompletedTask(parseInt(e.target.value))}
                  >
                    Undo 
                  </Button>
                  {/* <Button
                    value={task.task_id}
                    onClick={(e) => handledeletecompletedTask(parseInt(e.target.value))}
                    variant="danger"
                    size="lg"
                  >
                    Delete
                  </Button> */}
                </ButtonGroup>
                </div>
              </Card.Body>
              <Card.Footer className="text-center">{moment(task.task_date_time).format("MMMM DD YYYY hh:mm A")}</Card.Footer>
            </Card>
            </div>
            
          </li>
        ))}
          </Offcanvas.Body>
          <ReuseTaskModal
                    
                    show={reusemodalShow}
                    onHide={() => setreusemodalShow(false)}
                    user_id={reuseData[0]}
                    targetreuseData={reuseData}
                    // priority={task.task_priority}
                    // name={task.task_name}
                    // id={task.task_id}
                    // description={task.task_description}
                    // attendees={task.task_attendees}
                    // date_time={task.task_date_time}
                    reuseSuccess={() => setreuseSuccess(!reuseSuccess)}
                  />
        </Offcanvas>
      
    );
  } else {
    return null;
  }
}

export default CompletedTasks;
