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
import FlipMove from "react-flip-move";
import vuid from 'vuid'


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
  

  const handleUndo = (e) => {
console.log(e)
    // const findTaskByID = (task) =>{
    //   return e === String(task.task_id);
    // };
    // findTaskByID(props.completedTasksData)
    // const foundTask = props.completedTasksData.filter(findTaskByID)
    const findTaskByID = props.completedTasksData.find(({task_id}) => String(task_id) === e);
    console.log(findTaskByID);
    
    props.incompletedTasksData.unshift(findTaskByID);
    handleDelete(e);
    

  }
  const handleDelete = (e) => {
    
    const findTasksByID = (task) => {
      return e !== String(task.task_id);
    };
    findTasksByID(props.completedTasksData);
    const remainingTasks = props.completedTasksData.filter(findTasksByID);
    
    props.updateTasks(remainingTasks);
  };
 
  const handleReuse = (e) =>{
    const makeID =vuid()
      
    
    const findTaskByID = props.completedTasksData.find(({task_id}) => String(task_id) === e);
    console.log(findTaskByID);
    const task ={...findTaskByID};
    task.task_id =makeID;
    if (findTaskByID === undefined){return null}
    
    props.incompletedTasksData.unshift(task);
  }
  const handleSendReuseData = (e) =>{
    const data = e.split(",")
    setreuseData(data); setreusemodalShow(true)
  }
  const handleRetrieveReuseData = (data) => {
    console.log(data)
    props.incompletedTasksData.unshift(data)
  };
  
  const cardBorder = {
    A:"danger",
    B:"warning",
    C:"primary",
    D:"info",
    F:"success"
  }
  
  
  
    
  
  // if (props.show === true && props.completedTasksData !== null) {
    
    return (
      
        <Offcanvas show={props.show} onHide={handleClose}>
          <Offcanvas.Header closeButton onClick={() => handleClose()}>
            <Offcanvas.Title>Completed Tasks</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
          {/* <FlipMove duration={250} easing="ease-out"> */}

            {props.completedTasksData.map((task) => (
          <li key={task.task_id} className="ulremovebullets">
            <div className="task-card-seperator">
            
            <Card  border={cardBorder[task.task_priority]} style={{ width: "20rem" }}>
              
              <Card.Header className="text-center">{task.task_name}</Card.Header>
              <Card.Body>
                
                <Card.Text>
                  
                  <div className="text-center">{task.task_description}</div>
                  
                </Card.Text>
                <div className="d-grid gap-2"></div>
               <div className="text-center">
                <ButtonGroup aria-label="Basic example">
                 
                  
                  
                  <Button
                    variant="primary"
                    size="lg"
                    // value={[props.user_id, task.task_priority,task.task_name, task.task_id, task.task_description, task.task_date_time]}
                    value = {task.task_id}
                    onClick={(e) => handleReuse(e.target.value)}

                    
                  >
                    Reuse
                  </Button>
                  <Button
                    variant="warning"
                    size="lg"
                    value={task.task_id}
                    onClick={(e) => handleUndo(e.target.value)}
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
        {/* </FlipMove> */}
          </Offcanvas.Body>
          <ReuseTaskModal
                    
                    show={reusemodalShow}
                    onHide={() => setreusemodalShow(false)}
                    user_id={reuseData[0]}
                    targetReuseData={reuseData}
                    // priority={task.task_priority}
                    // name={task.task_name}
                    // id={task.task_id}
                    // description={task.task_description}
                    // attendees={task.task_attendees}
                    // date_time={task.task_date_time}
                    retrieveReuseData={(data) => handleRetrieveReuseData(data)}
                  />
        </Offcanvas>
      
    );
  // } else {
  //   return null;
  // }
}

export default CompletedTasks;
