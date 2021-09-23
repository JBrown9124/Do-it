import { Modal, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import DateTimePicker from "react-datetime-picker";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
function EditTaskModal(props) {
  
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [taskID, settaskID] = useState(null);
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
    
    setdateTime("");
    settaskID(null);
    props.onHide();
  };

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
            <Modal.Title id="contained-modal-title-vcenter">
              Edit{" "}<FiEdit className="task-card-icon-size" />
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

              <div className="form-group">
                <label htmlFor="dateTime" className="mt-2">
                  What day and time are you planning on completing this task?
                </label>

                <DateTimePicker onChange={setdateTime} value={dateTime} />
              </div>

              {isError && (
                <small className="mt-3 d-inline-block text-danger">
                  Invalid Input Format.
                </small>
              )}

              <button
                type="submit"
                className="btn btn-warning mt-3"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Loading..." : "Change"}
              </button>
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
