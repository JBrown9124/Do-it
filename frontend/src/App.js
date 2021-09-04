import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Row, Container, Col } from "react-bootstrap";
import React, {useEffect} from "react";
import Register from "./components/Home/RegisterModal";
// import Routes from "./services/Routes";
import Navigation from "./components/NavBar.js";
import "bootstrap/dist/css/bootstrap.min.css";

import axios from "axios";

import Login from "./components/Home/LoginModal";



import Tasks from "./components/Tasks/Tasks";
import CompletedTasks from "./components/Tasks/CompletedTasks/CompletedTasks";
function App() {
  const [loginmodalShow, setloginmodalShow] = React.useState(true);
  const [registermodalShow, setregistermodalShow] = React.useState(false);
  const [tasksShow, settasksShow] = React.useState(false);
  const [handleTasks, sethandleTasks] = React.useState(false);
  const [allData, setallData] = React.useState(null)
  const [completeData, setcompleteData] = React.useState(null)
  const [incompleteData, setincompleteData] = React.useState(null)
  const [userID, setUserID] = React.useState(null);
  const [completedTasks, showcompletedTasks] = React.useState(null);
  
  
  // if (loginmodalShow===true && registermodalShow===true){
  //   setregistermodalShow(false)
  // }
  // if (loginmodalShow===false && registermodalShow===true){
  //   setloginmodalShow(false)
  // }
  const handleshowloginhideTasks = () =>{
    setloginmodalShow(true); settasksShow(false);
  }
  useEffect(()=>setloginmodalShow(true),
  [registermodalShow]

  )
  const handleData= (order = "tasks") => {
    axios
      .get(`http://127.0.0.1:8000/to_do_list/${userID}/${order}`)
      .then((response) => {
        setcompleteData(response.data.complete);
        setincompleteData(response.data.incomplete)
        // isLoaded(true);
       console.log(response.data.incomplete);
        
        
      });
  };
  useEffect(()=>handleData(), [userID])
  if (loginmodalShow===false && registermodalShow===false && tasksShow===false){
    
    settasksShow(true);
    
  }
  return (
    <div>
      <Navigation showloginhideTasks={()=>handleshowloginhideTasks()}showComplete={(props) => showcompletedTasks(props)} />
      <div>
      
            <Tasks
              tasksData = {incompleteData}
              user_id={userID}
              show={tasksShow}
              completedhandleTasks={handleTasks}
              handledcompletedTasks ={ () => sethandleTasks(false)}
              
            />
            <CompletedTasks
              tasksData = {completeData}
              user_id={userID}
              show={completedTasks}
              handleCompletedTasks={(props) => showcompletedTasks(props)}
              handleTasks={(props) => sethandleTasks(true)}
            />
          
          <Register show={registermodalShow}
            onHide={() => setregistermodalShow(false)}
            backdrop="static"
            keyboard={false}
            user={(props) => setUserID(props)}
            showLogin={(props)=>setloginmodalShow(props)}
            />
            
          <Login
            show={loginmodalShow}
            onHide={() => setloginmodalShow(false)}
            backdrop="static"
            keyboard={false}
            user={(props) => setUserID(props)}
            showRegister={(props)=>setregistermodalShow(props)}
          />
          
            
            </div>
      

      {/* <Routes /> */}
    </div>
  );
}

export default App;
