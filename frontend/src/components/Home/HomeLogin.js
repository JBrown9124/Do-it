import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Row, Container, Col } from "react-bootstrap";
import React from "react";
import Register from "./RegisterModal";
import Login from "./LoginModal";
import Routes from "../../services/Routes";
import Navigation from "../NavBar.js";
import Tasks from "../Tasks/Tasks";
import CompletedTasks from "../Tasks/CompletedTasks";
function HomeLogin() {
  const [modalShow, setModalShow] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [completedTasks, showcompletedTasks] = React.useState(null);
  return (
    
      <div className="App">
            <Tasks
              user_id={user}
              show={modalShow}
              handlecompletedTasks={(props) => showcompletedTasks(props)}
            />
            <CompletedTasks
              user_id={user}
              // show={completedTasks}
              // handleCompletedTasks={(props) => showcompletedTasks(props)}
            />
          
          
          <Login
            show={modalShow}
            onHide={() => setModalShow(false)}
            backdrop="static"
            keyboard={false}
            user={(props) => setUser(props)}
          />
          
            
            </div>
          
     
    
  );
}

// export default HomeLogin;
