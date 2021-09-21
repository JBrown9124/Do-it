import { Modal, Button, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DateTimePicker from "react-datetime-picker";
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
import moment from "moment";
function EditTaskModal(props) {
  const [taskData, settaskData] = useState(null);
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [taskID, settaskID] = useState(null);
  // const [attendees, setAttendees] = useState(taskData.task_attendees);
  const [dateTime, setdateTime] = useState("");
  const [drawing, setDrawing] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleseteditData = () => {
    settaskID(props.editData.task_id);
    setName(props.editData.task_name);
    setPriority(props.editData.task_priority);
    setDrawing(props.editData.task_drawing);
    setDescription(props.editData.task_description);
    setdateTime(props.editData.task_date_time);
  };
  useEffect(() => handleseteditData(), [props.show]);

  const handleSubmit = () => {
    // const dateTimeStr = moment(dateTime).format('YYYY-MM-DD HH:mm:ss')
    const dateTimeStr = moment(dateTime).format("DD. MMMM YYYY HH:mm");
    setLoading(true);
    setIsError(false);
    const data = {
      task_name: name,
      task_priority: priority,
      task_description: description,
      // attendees: attendees,
      task_date_time: dateTimeStr,
      task_id: taskID,
      task_drawing: drawing,
    };
    props.retrieveEditData(data);
    setLoading(false);
    setName("");
    setPriority("");
    setDescription("");
    // setAttendees("");
    setdateTime("");
    settaskID(null);
    props.onHide();
  };

  //   axios
  //     .put(`http://127.0.0.1:8000/to_do_list/${props.user_id}/task`, data)
  //     .then((res) => {
  //       // setData(res.data);

  //       setName("");
  //       setPriority("");
  //       setDescription("");
  //       // setAttendees("");
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

  if (props.show === true) {
    return (
      <div>
        <Modal
          {...props}
          size="med"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">Edit</Modal.Title>
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
                  <option selected>Select level</option>
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
                {loading ? "Loading..." : "Change"}
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
  } else return null;
}
export default EditTaskModal;
