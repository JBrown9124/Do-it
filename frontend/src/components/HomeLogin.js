import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import React from 'react'
import Register from './Register'
import Login from './Login'
import Routes from "../services/Routes";
import Navigation from "./NavBar.js";
import Tasks from "./Tasks";
function HomeLogin() {
  const [modalShow, setModalShow] = React.useState(true);
  const [user, setUser] = React.useState(0)
  return (
    <>
      <Tasks user_id= {user}/>
      <Login
        show={modalShow}
        onHide={() => setModalShow(false)}
        backdrop = "static"
        keyboard={false}
        user ={(props)=> setUser(props)}
      />
      
    </>
  );
}



export default HomeLogin;