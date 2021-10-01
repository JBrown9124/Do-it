import {
  Modal,
  Button,
  Form,
  ButtonGroup,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import DateTimePicker from "react-datetime-picker";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import randomWords from "random-words";
import { SketchField, Tools } from "react-sketch2";
import { CgGoogleTasks } from "react-icons/cg";
import { GiPaintBrush } from "react-icons/gi";
import { FcCollaboration } from "react-icons/fc";
import { AiOutlineClear } from "react-icons/ai";
import { fabric } from "fabric";
import FileBase64 from "react-file-base64";
import { FaUndo, FaRedo } from "react-icons/fa";
import { MdPhotoSizeSelectLarge } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
function SharedCreateModal(props) {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [friend, setFriend] = useState(NaN);
  const [drawnImage, setDrawnImage] = useState();
  const [color, setColor] = useState("#563d7c");
  const [dateTime, setdateTime] = useState(new Date(tomorrowDate()));
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [importedImage, setImportedImage] = useState();
  const [isImported, setIsImported] = useState(false);
  const [lineSketchWidth, setLineSketchWidth] = useState(2);
  const [showClearPopover, setShowClearPopover] = useState(false);
  const [sketchTool, setSketchTool] = useState(Tools.Select);
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
  function tomorrowDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    return tomorrow.setDate(tomorrow.getDate() + 1);
  }
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
  const setBackgroundFromDataUrl = (dataUrl, options = {}) => {
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
  if (importedImage !== undefined && isImported) {
    setBackgroundFromDataUrl(importedImage);
    setIsImported(false);
  }
  function simulateNetworkRequest() {
    return new Promise((resolve) => setTimeout(resolve, 100));
  }

  useEffect(() => {
    if (loading) {
      simulateNetworkRequest().then(() => {
        setLoading(false);
      });
    }
  }, [loading]);

  const handleSubmit = () => {
    const findFriendByID = props.allFriendsData.find(
      (user) => user.user_id === friend
    );

    const dateTimeStr = moment(dateTime).format("DD. MMMM YYYY HH:mm");

    setLoading(true);

    const makeID = uuidv4();
    const convertedImage = drawnImage.toDataURL();
    const data = {
      task: {
        task_name: name === "" ? randomWords() : name,
        task_priority: priority === "" ? "A" : priority,
        task_description:
          description === ""
            ? randomWords({ exactly: 5, join: " " })
            : description,

        task_date_time: dateTimeStr,
        task_completed: false,
        task_drawing: convertedImage,
        task_id: makeID,
      },
      sharing_with: isNaN(friend)
        ? { user_id: null, user_display_name: null, user_email: null }
        : findFriendByID,
    };

    props.createData(data);

    props.onHide();

    setErrorMessage("");
    setName("");
    setPriority("");
    setDescription("");
    setFriend(NaN);
  };
  const clear = (propertiesToInclude) => {
    propertiesToInclude._fc.clear();
    propertiesToInclude._history.clear();
  };
  const handleImport = (base64) => {
    setImportedImage(base64);
    setIsImported(true);
  };
  const handleLineWidth = (e) => {
    setLineSketchWidth(e);
    setSketchTool(Tools.Select);
    if (sketchTool === Tools.Select) {
      return setSketchTool(Tools.Pencil);
    }
  };

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
            Create <CgGoogleTasks />
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
              <label htmlFor="friend" className="mt-2">
                Collaborator (optional) <FcCollaboration />
              </label>
              <select
                type="text"
                className="form-control"
                id="Collaborator"
                placeholder="Enter priority"
                value={friend}
                onChange={(e) => setFriend(parseInt(e.target.value))}
              >
                <option>Select friend </option>
                {props.allFriendsData.map((friendData) => (
                  <option key={friendData.user_id} value={friendData.user_id}>
                    {friendData.user_display_name}
                  </option>
                ))}
              </select>
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
                <option>Select type </option>
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
                Import an image
              </Form.Label>
              <Form.Group controlId="formFile">
                <FileBase64
                  type="file"
                  multiple={false}
                  onDone={({ base64 }) => handleImport(base64)}
                />
              </Form.Group>
            </div>

            <div className="create-modal-image-buttons">
              <label htmlFor="dateTime" className="mt-2">
                Date/time you are planning on completing this task?
              </label>

              <DateTimePicker onChange={setdateTime} value={dateTime} />
            </div>
            <div>
              {isError && (
                <small className="mt-3 d-inline-block text-danger">
                  {errorMessage}
                </small>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-success mt-3"
              onClick={(e) => handleSubmit()}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default SharedCreateModal;
