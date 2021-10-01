import {
  Modal,
  Button,
  Form,
  ButtonGroup,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import DateTimePicker from "react-datetime-picker";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import { GiPaintBrush } from "react-icons/gi";
import { SketchField, Tools } from "react-sketch2";
import { AiOutlineClear } from "react-icons/ai";
import { fabric } from "fabric";
import { MdPhotoSizeSelectLarge } from "react-icons/md";
import FileBase64 from "react-file-base64";
import { FaUndo, FaRedo } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
function EditTaskModal(props) {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [taskID, settaskID] = useState(null);
  const [dateTime, setdateTime] = useState(new Date());
  const [userID, setUserID] = useState("");
  const [drawnImage, setDrawnImage] = useState();
  const [color, setColor] = useState("#563d7c");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [importedImage, setImportedImage] = useState();
  const [isImported, setIsImported] = useState(false);
  const [lineSketchWidth, setLineSketchWidth] = useState(2);
  const [showClearPopover, setShowClearPopover] = useState(false);

  const [backgroundFromOriginalImported, setbackgroundFromOriginalImported] =
    useState(false);
  const [sketchTool, setSketchTool] = useState(Tools.Select);

  const handleImport = (base64) => {
    setImportedImage(base64);
    setIsImported(true);
  };

  const handleSetEditData = () => {
    settaskID(props.editData.task_id);
    setName(props.editData.task_name);
    setPriority(props.editData.task_priority);

    setDescription(props.editData.task_description);

    setdateTime(props.editData.task_date_time);

    setUserID(props.editData.user_id);
  };
  useEffect(() => handleSetEditData(), [props.show]);
  const clearPopover = (
    <Popover className="tasks-container" id="popover-basic">
      <Popover.Header as="h3">
        Are you sure you want to clear your drawing?
      </Popover.Header>
      <Popover.Body> </Popover.Body>
      <ButtonGroup aria-label="Basic example">
        <div>
          <Button onClick={() => clear(drawnImage)} variant="danger">
            Yes
          </Button>
        </div>
        <div className="card-buttons">
          <Button variant="success" onClick={() => setShowClearPopover(false)}>
            No
          </Button>
        </div>
      </ButtonGroup>
    </Popover>
  );
  const canUndo = () => {
    if (drawnImage !== undefined) {
      return drawnImage._history.canUndo();
    }
  };
  const canRedo = () => {
    if (drawnImage !== undefined) {
      return drawnImage._history.canRedo();
    }
  };
  const undo = () => {
    if (canUndo()) {
      let history = drawnImage._history;
      let [obj, prevState, currState] = history.getCurrent();
      history.undo();
      if (obj.__removed) {
        this.setState({ action: false }, () => {
          drawnImage._fc.add(obj);
          obj.__version -= 1;
          obj.__removed = false;
        });
      } else if (obj.__version <= 1) {
        drawnImage._fc.remove(obj);
      } else {
        obj.__version -= 1;
        obj.setOptions(JSON.parse(prevState));
        obj.setCoords();
        drawnImage._fc.renderAll();
      }
      if (props.onChange) {
        props.onChange();
      }
    }
  };
  const redo = () => {
    let history = drawnImage._history;
    if (history.canRedo()) {
      let canvas = drawnImage._fc;
      //noinspection Eslint
      let [obj, prevState, currState] = history.redo();
      if (obj.__version === 0) {
        drawnImage.setState({ action: false }, () => {
          canvas.add(obj);
          obj.__version = 1;
        });
      } else {
        obj.__version += 1;
        obj.setOptions(JSON.parse(currState));
      }
      obj.setCoords();
      canvas.renderAll();
      if (props.onChange) {
        props.onChange();
      }
    }
  };
  const setBackgroundFromDataUrlImport = (dataUrl, options = {}) => {
    let canvas = drawnImage._fc;
    fabric.Image.fromURL(dataUrl, (oImg) => {
      let opts = {
        left: Math.random() * (canvas.getWidth() - oImg.width * 0.5),
        top: Math.random() * (canvas.getHeight() - oImg.height * 0.5),
        scale: 0.2,
      };
      // Object.assign(opts, options);
      oImg.scale(opts.scale);
      // oImg.set({
      //   left: opts.left,
      //   top: opts.top,
      // });
      canvas.add(oImg);
      setSketchTool(Tools.Select);
    });
  };

  const setBackgroundFromDataUrl = (dataUrl, options = {}) => {
    let canvas = drawnImage._fc;
    fabric.Image.fromURL(dataUrl, (oImg) => {
      let opts = {
        left: canvas.getWidth() - oImg.width * 0.5,
        top: canvas.getHeight() - oImg.height * 0.5,
        scale: 1.0,
      };
      // Object.assign(opts, options);
      // oImg.scale(opts.scale);
      // oImg.set({
      //   left: opts.left,
      //   top: opts.top,
      // });
      canvas.add(oImg);
    });
  };
  const handleClose = () => {
    setLoading(false);
    setName("");
    setPriority("");
    setDescription("");
    setUserID("");
    setdateTime(new Date());
    settaskID(null);
    setDrawnImage(null);
    setbackgroundFromOriginalImported(false);

    return props.onHide();
  };

  const handleSubmit = () => {
    const dateTimeStr = moment(dateTime).format("DD. MMMM YYYY HH:mm");
    const convertedImage = drawnImage.toDataURL();
    setLoading(true);
    setIsError(false);
    const data = {
      task_name: name,
      task_priority: priority,
      task_description: description,

      task_date_time: dateTimeStr,
      task_id: taskID,
      task_drawing: convertedImage,
      user_id: userID,
    };
    props.retrieveEditData(data);
    setLoading(false);
    setName("");
    setPriority("");
    setDescription("");
    setUserID("");
    setdateTime("");
    settaskID(null);
    setDrawnImage(null);
    setbackgroundFromOriginalImported(false);

    props.onHide();
  };
  const clear = (propertiesToInclude) => {
    propertiesToInclude._fc.clear();
    propertiesToInclude._history.clear();
  };
  const handleLineWidth = (e) => {
    setSketchTool(Tools.Select);
    setLineSketchWidth(e);
  };
  if (
    drawnImage !== undefined &&
    props.show &&
    drawnImage !== null &&
    backgroundFromOriginalImported === false
  ) {
    setBackgroundFromDataUrl(props.editData.task_drawing);
    setbackgroundFromOriginalImported(true);
  }

  if (importedImage !== undefined && isImported) {
    setBackgroundFromDataUrlImport(importedImage);
    setIsImported(false);
  }

  if (props.show === true) {
    return (
      <div>
        <Modal
          {...props}
          size="med"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          keyboard={false}
          backdrop="static"
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Edit <FiEdit className="task-card-icon-size" />
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
              <label htmlFor="Description" className="mt-2">
                Draw <GiPaintBrush />
              </label>
              <SketchField
                width="350px"
                height="200px"
                className="sketch-border"
                tool={sketchTool}
                lineColor={color}
                lineWidth={lineSketchWidth}
                onChange={(e) => {
                  setDrawnImage(e.target.value);
                }}
                ref={(view) => {
                  setDrawnImage(view);
                }}
              />
              <div>
                <Form.Label htmlFor="Description" className="mt-2">
                  Tools
                </Form.Label>
              </div>

              <ButtonGroup className="create-modal-image-buttons">
                <div>
                  <Button
                    size="sm"
                    variant="light"
                    onClick={() => setSketchTool(Tools.Select)}
                  >
                    {" "}
                    <MdPhotoSizeSelectLarge />
                  </Button>
                </div>
                <div className="card-buttons">
                  <Button
                    size="sm"
                    variant="light"
                    onClick={() => setSketchTool(Tools.Pencil)}
                  >
                    {" "}
                    <BsPencilSquare />
                  </Button>
                </div>

                <Form.Label htmlFor="exampleColorInput"></Form.Label>
                <Form.Control
                  className="card-buttons"
                  type="color"
                  id="exampleColorInput"
                  defaultValue="#563d7c"
                  title="Choose your color"
                  onChange={(e) => setColor(e.target.value)}
                />
              </ButtonGroup>
              <div>
                <Form.Label className="create-modal-image-buttons">
                  Line width
                </Form.Label>
                <Form.Range
                  min={1}
                  max={10}
                  value={lineSketchWidth}
                  onChange={(e) => handleLineWidth(parseInt(e.target.value))}
                />
              </div>
              <ButtonGroup className="create-modal-image-buttons">
                <div>
                  <Button onClick={() => undo()} variant="dark">
                    <FaUndo />
                  </Button>
                </div>
                <div className="card-buttons">
                  <Button onClick={() => redo()} variant="warning">
                    <FaRedo />
                  </Button>
                </div>

                <div className="card-buttons">
                  <OverlayTrigger
                    trigger="focus"
                    placement="bottom"
                    overlay={clearPopover}
                  >
                    <Button
                      onClick={() => setShowClearPopover(true)}
                      variant="danger"
                    >
                      <AiOutlineClear />
                    </Button>
                  </OverlayTrigger>
                </div>
              </ButtonGroup>
              <div className="create-modal-image-buttons">
                <Form.Label className="create-modal-image-buttons">
                  Import an image{" "}
                </Form.Label>
                <Form.Group controlId="formFile">
                  <FileBase64
                    type="file"
                    multiple={false}
                    onDone={({ base64 }) => handleImport(base64)}
                  />
                </Form.Group>
              </div>
              <div className="form-group">
                <label htmlFor="dateTime" className="mt-2">
                  What day and time are you planning on completing this task?
                </label>

                <DateTimePicker
                  onChange={(e) => setdateTime(e)}
                  value={dateTime}
                />
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
            <Button onClick={() => handleClose()}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  } else return null;
}
export default EditTaskModal;
