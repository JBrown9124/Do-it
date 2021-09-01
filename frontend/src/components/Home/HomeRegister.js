

import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import React from 'react'
import Register from './RegisterModal'
import Routes from "../../services/Routes";
import Navigation from "../NavBar.js";
function HomeRegister() {
  const [modalShow, setModalShow] = React.useState(true);

  return (
    <>
      
      <Register
        show={modalShow}
        onHide={() => setModalShow(false)}
        backdrop = "static"
        keyboard={false}
      />
      
    </>
  );
}



export default HomeRegister;