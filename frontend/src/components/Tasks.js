import { Modal, Button, Form } from "react-bootstrap";
import React, { useState, useEffect  } from "react";
import axios from "axios";
import History from "../services/History"
import Routes from "../services/Routes"
import {Link} from 'react-router-dom';
function Tasks(props) {
    const[userID, setUserID] = React.useState(props)
    const [tasks, setTasks] = React.useState(null)
    useEffect(() => {
        // GET request using axios inside useEffect React hook
        axios.get(`http://127.0.0.1:8000/to_do_list/${userID}/tasks`)
            .then(response => setTasks(response.data));
    
    // empty dependency array means this effect will only run once (like componentDidMount in classes)
    }, []);

    return(<h1>{tasks}</h1>)
}
export default Tasks;
