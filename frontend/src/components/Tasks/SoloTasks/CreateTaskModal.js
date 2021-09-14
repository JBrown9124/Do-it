import { Modal, Button, Form, Container} from "react-bootstrap";
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DateTimePicker from "react-datetime-picker";
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';
import randomWords from "random-words"
function CreateTaskModal(props) {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [attendees, setAttendees] = useState("");
  const [dateTime, setdateTime] = useState(new Date());

  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [data, setData] = useState(null);
  
  const handleSubmit = () => {
    // const dateTimeStr = moment(dateTime).format('YYYY-MM-DD HH:mm:ss')
    const dateTimeStr = moment(dateTime).format('DD. MMMM YYYY HH:mm')
    
    setLoading(true);
    
    const makeID = uuidv4()
    
    const data = {
      task_name: name===""?randomWords():name,
      task_priority: priority===""?"A":priority,
      task_description: description===""?randomWords({exactly: 5, join: ' '  }):description,
      // attendees: attendees,
      task_date_time: dateTimeStr,
      task_completed: false,
      task_id: makeID,
    };
   
    props.createData(data);
    
    setName("");
    setPriority("");
    setDescription("");
    setAttendees("");
    setdateTime(new Date());
    
    props.onHide();
    setLoading(false);
    
    
    
  };

  //   axios
  //     .post(`http://127.0.0.1:8000/to_do_list/${props.user_id}/task`, data)
  //     .then((res) => {
  //       setData(res.data);

  //       setName("");
  //       setPriority("");
  //       setDescription("");
  //       setAttendees("");
  //       setdateTime("");

  //       setLoading(false);
  //       props.onHide();
  //       return props.user();
  //     })
  //     .catch((err) => {
  //       setLoading(false);
  //       setIsError(true);
  //     });
  // };
  
  return (
    
    <div>
      
      <Modal
        {...props}
        size="med"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Create your Task
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ maxWidth: 350 }}>
            <div className="form-group">
              <label htmlFor="name" className="mt-2">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="Priority" className="mt-2">
                Priority
              </label>
              <select
                type="text"
                className="form-control"
                id="Priority"
                placeholder="Enter priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option >Select type </option>
                <option value="A">High</option>
                <option value="B">Above Normal</option>
                <option value="C">Normal</option>
                <option value="D">Below Normal</option>
                <option value="F">Low</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="Description" className="mt-2">
                Description
              </label>
              <textarea
                type="text"
                className="form-control"
                rows="3"
                id="Description"
                height="23rem"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            {/* <div classNames="form-group">
              <label htmlFor="Attendees" className="mt-2">
                Attendees
              </label>
              <input
                type="text"
                className="form-control"
                id="Attendees"
                placeholder="Enter amount of attendees"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
              />
            </div> */}
            <div className="form-group">
              <label htmlFor="dateTime" className="mt-2">
                What day and time are you planning on completing this task?
              </label>
              {/* <input
                type="text"
                className="form-control"
                id="dateTime"
                placeholder="Enter date and time"
                value={dateTime}
                onChange={(e) => setdateTime(e.target.value)}
              /> */}
              <DateTimePicker onChange={setdateTime} value={dateTime} />
            </div>

            {isError && (
              <small className="mt-3 d-inline-block text-danger">
                Invalid Input Format.
              </small>
            )}

            <button
              type="submit"
              className="btn btn-primary mt-3"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Loading..." : "Create"}
            </button>
            {/* {data && (
              <div className="mt-3">
                <strong>Output:</strong>
                <br />
                <pre>{JSON.stringify(data, null, 2)}</pre>
              </div>
            )} */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default CreateTaskModal;
