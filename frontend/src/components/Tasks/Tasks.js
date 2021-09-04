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
  Fade
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
import ReactTransitionGroup from 'react-transition-group';
import FlipMove from "react-flip-move";


function Tasks(props) {
  // const [userID, setUserID] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [load, isLoaded] = useState(false);
  const [deletepopOver, showdeletepopOver] = useState(false);
  const [taskID, settaskID] = useState(null)
  const [sendEditData, setSendEditData] = useState("")

  const [retrieveEditData, setRetrieveEditData] = useState("")
  const [createmodalShow, setcreateModalShow] = useState(false);
  // const [edittaskID, seteditTaskID] = useState(null);
  const [editModalShow, setEditModalShow] = useState(false);
  // const [confetti, showConfetti] = useState(false);
  // const [completedTasks, showCompletedTasks] = useState(false);
  const[overlayShow,setoverlayShow] = useState(false);
  
  const handleTasks = (order = "tasks") => {
    axios
      .get(`http://127.0.0.1:8000/to_do_list/${props.user_id}/${order}`)
      .then((response) => {
        setTasks(response.data);
        isLoaded(true);
       
        
        
      });
  };
  // useEffect(()=>handleTasks(),[props.user_id]
  // )
  
  useEffect(()=>setTasks(props.tasksData),[props.tasksData]
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
  // const handleDelete = (e) => {
  //   const data = { task_id: e };

  //   axios
  //     .delete(`http://127.0.0.1:8000/to_do_list/${props.user_id}/task`, {
  //       data: data,
  //     })
  //     .then((resp) => {
  //       handleTasks(); settaskID(null); 
  //     });
  // };
  
  // const handleDelete = (e) => {
  //   const data = { task_id: e };
  //   axios
  //     .delete(`http://127.0.0.1:8000/to_do_list/${props.user_id}/task`, {
  //       data: data,
  //     })
  //     .then((resp) => {
  //       handleTasks(); settaskID(null); 
  //     });}
      const handleDelete = (e) => {
      
    const deleteTask=(task)=>{
      return e!==task.task_id
    }
    deleteTask(tasks)
    const remainingTasks = tasks.filter(deleteTask)
    
    console.log(remainingTasks);
    setTasks(remainingTasks);
    console.log(deleteTask)};
    const handleRetrieveEditData =(data) =>{
      const modifiedTask = tasks.filter( (task, index, arr) => {
        if (String(task.task_id) === data.task_id){
        task.task_date_time=data.task_date_time
        task.task_priority=data.task_priority
        task.task_description=data.task_description
        task.task_name=data.task_name}
        // arr[data.task_id]=data
        
      })
      console.log(data)
      console.log(modifiedTask);
      return modifiedTask;
      
    }
    
  
  const handledeleteAll = () =>{
    axios
      .delete(`http://127.0.0.1:8000/to_do_list/${props.user_id}/tasks`)
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
        
        
        
      });
  };
  const handleSendEditData = (e) =>{
    const data = e.split(",")
    setSendEditData(data); setEditModalShow(true)
  }
  const handleCreate = (data) =>{
    tasks.push(data)
  }
  
  const popover = (
    <Popover  id="popover-basic">
      <Popover.Header as="h3">Are you sure you want to delete?</Popover.Header>
      <Popover.Body>Note: This will be permanent!</Popover.Body>
      <ButtonGroup aria-label="Basic example">
        <Button onClick={(e) => handleDelete(taskID)} variant="secondary">Yes</Button>
  
        <Button variant="secondary" onClick={()=>settaskID(null)}>No</Button>
      </ButtonGroup>
    </Popover>
  );
  const cardBorder = {
    A:"danger",
    B:"warning",
    C:"primary",
    D:"info",
    F:"success"
  }
  // if (props.show === false && load === false && props.user_id !== null) {
  //   handleTasks();
  // }
  if (props.completedhandleTasks === true){
    handleTasks(); props.handledcompletedTasks()
  }
  if (tasks !== null && props.show===true && props.taskData !== null)
    return (
      
      <div className="tasks-container">
        <h1 className="top-tasks-buttons" >To-Do List</h1>
        <ButtonGroup >
        <Button variant="success" size="med" onClick={(e) => setcreateModalShow(true)}>
          Create Task
        </Button>
        
        <DropdownButton size ="med"variant='secondary' id="dropdown-basic-button" title="Sort by">
          <Dropdown.Item  onClick={() => handleTasks()}>
            Priority
          </Dropdown.Item>
          <Dropdown.Item
            
            onClick={() => handleTasks("task-by-date")}
          >
            Date and Time
          </Dropdown.Item>
          <Dropdown.Item
            
            onClick={() => handleTasks("task-by-name")}
          >
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

        <CreateTaskModal
          show={createmodalShow}
          onHide={() => setcreateModalShow(false)}
          user_id={props.user_id}
          createData={(data)=> handleCreate(data)}
          user={(props) => handleTasks()}
        />
        <FlipMove duration={250} easing="ease-out">
        {tasks.map((task) => (
          
          <li key={task.task_id} className="ulremovebullets">
            
            
            <div className="task-card-seperator">
            
            <Card className="mx-auto" border={cardBorder[task.task_priority]} style={{ width: "20rem" }}>
              {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
              <Card.Header>{task.task_name}</Card.Header>
              <Card.Body>
                {/* <Card.Title ></Card.Title> */}
                <Card.Text>
                  {/* <div >{task.task_priority} </div> */}
                  <div >{task.task_description}</div>
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
                    value={[props.user_id, task.task_priority,task.task_name, task.task_id, task.task_description, task.task_date_time]}
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
                  
                  <OverlayTrigger   trigger="focus" placement="right" overlay={popover}>
                  <Button
                    onClick={(e)=>settaskID(e.target.value)}
                    value={task.task_id}
                    
                    variant="danger"
                    size="lg"
                  >
                    Delete
                  </Button>
                  </OverlayTrigger>
                  
                </ButtonGroup>
              </Card.Body>
              <Card.Footer>{moment(task.task_date_time).format("MMMM DD YYYY hh:mm A")}</Card.Footer>
            </Card>
            
            </div>
            
          </li>
          
         
        ))}
        </FlipMove>
        <EditTaskModal
                    show={editModalShow}
                    onHide={() => setEditModalShow(false)}
                    targeteditData = {sendEditData}
                    user_id={sendEditData[0]}
                    // priority={task.task_priority}
                    // name={task.task_name}
                    // id={task.task_id}
                    // description={task.task_description}
                    // attendees={task.task_attendees}
                    // date_time={task.task_date_time}
                    user={(props) => handleTasks()}
                    retrieveEditData={(data)=>handleRetrieveEditData(data)}
                  />
      </div>
      
    );
  else return null;
}
export default Tasks;
