import { Modal, Button, Form } from "react-bootstrap";
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DateTimePicker from "react-datetime-picker";
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
import moment from "moment";
function EditTaskModal(props) {
  const taskData = {
    task_id: 53,
    user_id: props.user_id,
    task_name: props.name,
    task_priority: props.priority,
    task_description: props.description,
    task_attendees: props.attendees,
    task_date_time: props.date_time,
  };
  const [name, setName] = useState(taskData.task_name);
  const [priority, setPriority] = useState(taskData.task_priority);
  const [description, setDescription] = useState(taskData.task_description);
  const [attendees, setAttendees] = useState(taskData.task_attendees);
  const [dateTime, setdateTime] = useState(taskData.task_date_time);

  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [data, setData] = useState();

  //   const handleTaskbyID = () => {
  //     const taskID = { task: props.task_id };

  //     axios
  //       .get(
  //         `http://127.0.0.1:8000/to_do_list/${props.user_id}/get-task-by-id`,
  //         taskID
  //       )
  //       .then((res) => {
  //         setTaskData(res.data);
  //       });
  //   };
  const handleSubmit = () => {
    // const dateTimeStr = moment(dateTime).format('YYYY-MM-DD HH:mm:ss')
    const dateTimeStr = moment(dateTime).format("DD. MMMM YYYY HH:mm");
    setLoading(true);
    setIsError(false);
    const data = {
      name: name,
      priority: priority,
      description: description,
      attendees: attendees,
      date_time: dateTimeStr,
      id: props.id,
    };

    axios
      .post(`http://127.0.0.1:8000/to_do_list/${props.user_id}/edit-task`, data)
      .then((res) => {
        setData(res.data);

        setName("");
        setPriority("");
        setDescription("");
        setAttendees("");
        setdateTime("");

        setLoading(false);
        props.onHide();
        return props.user();
      })
      .catch((err) => {
        setLoading(false);
        setIsError(true);
      });
  };

  if (props.show === true) {
    return (
      <Modal
        {...props}
        size="med"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit your Task
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container p-3">
            <div style={{ maxWidth: 350 }}>
              <div classNames="form-group">
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
              <div classNames="form-group">
                <label htmlFor="Priority" className="mt-2">
                  Priority
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="Priority"
                  placeholder="Enter priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                />
              </div>
              <div classNames="form-group">
                <label htmlFor="Description" className="mt-2">
                  Description
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="Description"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div classNames="form-group">
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
              </div>
              <div classNames="form-group">
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
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  } else return null;
}
export default EditTaskModal;