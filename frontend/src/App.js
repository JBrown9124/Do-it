import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import React from 'react'
import Register from './components/Register'
import Routes from "./services/Routes";
import Navigation from "./components/NavBar.js";
function App() {
  

  return (
    <>
      
      
      <Navigation />

<Routes />
    </>
  );
}



export default App;
