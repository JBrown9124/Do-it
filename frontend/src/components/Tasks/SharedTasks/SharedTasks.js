import {
  Button,
  Form,
  ButtonGroup,
  Dropdown,
  Card,
  DropdownButton,
  OverlayTrigger,
  FormControl,
  Offcanvas,
  ButtonToolbar,
  Navbar,
  Tooltip,
  Toast,
  ToggleButton,
} from "react-bootstrap";
import { FaUserAlt, FaUserFriends } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ImCheckmark, ImShare2 } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";
import { CgGoogleTasks } from "react-icons/cg";
import moment from "moment";
import SharedCreateModal from "./SharedCreateModal";
import url from "../../../services/URL";
import EditTaskModal from "./EditTaskModal";
import FlipMove from "react-flip-move";
import { FaArrowCircleUp } from "react-icons/fa";
import FriendShareModal from "../../Friends/FriendShareModal";

function SharedTasks(props) {
  const [radioValue, setRadioValue] = useState("Solo+Shared");
  const [deleteTaskID, setDeleteTaskID] = useState(null);
  const [deleteTaskName, setDeleteTaskName] = useState(null);
  const [sendEditData, setSendEditData] = useState("");
  const [createModalShow, setcreateModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [animationType, setAnimationType] = useState("sort");
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [showFriendShareModal, setShowFriendShareModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("Saved.");
  const [toastColor, setToastColor] = useState("Light");
  const [showScroll, setShowScroll] = useState(false);
  const [sharedTaskData, setSharedTaskData] = useState([]);

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };
  window.addEventListener("scroll", checkScrollTop);
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // useEffect(
  //   () => setSearchResults(props.incompletedSharedTasksData),
  //   [props.incompletedSharedTasksData.length]
  // );

  useEffect(() => {
    if (radioValue === "Shared") {
      const results = props.incompletedSharedTasksData.filter(
        (task_name) =>
          task_name.task.task_name.toLowerCase().includes(searchItem) ||
          moment(task_name.task.task_date_time)
            .format("MMMM DD YYYY hh:mm A")
            .toLowerCase()
            .includes(searchItem) ||
          task_name.sharing_with.user_display_name
            .toLowerCase()
            .includes(searchItem)
      );
      setSearchResults(results);
    } else if (radioValue === "Solo") {
      const results = props.incompletedSharedTasksData.filter(
        (task_name) =>
          task_name.sharing_with.user_id === null &&
          (task_name.task.task_name.toLowerCase().includes(searchItem) ||
            moment(task_name.task.task_date_time)
              .format("MMMM DD YYYY hh:mm A")
              .toLowerCase()
              .includes(searchItem))
      );

      setSearchResults(results);
    } else if (radioValue === "Solo+Shared") {
      const results = props.incompletedSharedTasksData.filter((task_name) =>
        task_name.task.task_name.toLowerCase().includes(searchItem) ||
        moment(task_name.task.task_date_time)
          .format("MMMM DD YYYY hh:mm A")
          .toLowerCase()
          .includes(searchItem) ||
        task_name.sharing_with.user_display_name === null
          ? "z"
          : task_name.sharing_with.user_display_name
              .toLowerCase()
              .includes(searchItem)
      );
      setSearchResults(results);
    }
  }, [searchItem]);
  useEffect(() => {
    if (radioValue === "Shared") {
      const results = props.incompletedSharedTasksData.filter(
        (task_name) => task_name.sharing_with.user_id !== null
      );
      setSearchResults(results);
    } else if (radioValue === "Solo") {
      const results = props.incompletedSharedTasksData.filter(
        (task_name) => task_name.sharing_with.user_id === null
      );

      setSearchResults(results);
    } else if (radioValue === "Solo+Shared") {
      setSearchResults(props.incompletedSharedTasksData);
    }
  }, [radioValue, props.incompletedSharedTasksData.length]);

  // const handleClose = () => setShowOffCanvas(false);
  // const handleOffCanvasShow = (e) => {
  //   setShowOffCanvas(true);
  //   setDeleteTaskID(e);
  // };
  const handleCreate = (data) => {
    props.incompletedSharedTasksData.unshift(data);
    setToastMessage("Saved.");
    setToastColor("success");
    axios.post(`${url}${props.userID}/tasks`, data).then((res) => {
      setShowToast(true);
    });
  };
  const handleComplete = (e) => {
    console.log(e);
    setAnimationType("complete");

    const data = { completed_task_id: e };
    props.completedSharedTasksData.unshift(e);
    setToastColor("primary");
    setToastMessage("Completed!");
    axios.put(`${url}${props.userID}/completed-tasks`, data).then((resp) => {
      setShowToast(true);
      setAnimationType("sort");
    });
    const remainingTasks = props.incompletedSharedTasksData.filter(function (
      value,
      index,
      arr
    ) {
      return value.task.task_id !== e.task.task_id;
    });
    // setSearchResults(remainingTasks);
    props.updateTasks(remainingTasks);
  };

  const handleDelete = (e) => {
    setAnimationType("delete");
    const remainingTasks = props.incompletedSharedTasksData.filter(function (
      value,
      index,
      arr
    ) {
      return value.task.task_id !== e.task.task_id;
    });
    // setSearchResults(remainingTasks);
    props.updateTasks(remainingTasks);
    setShowOffCanvas(false);
    setToastMessage("Deleted.");
    setToastColor("danger");
    const data = e;
    axios
      .delete(`${url}${props.userID}/tasks`, {
        data: data,
      })
      .then((resp) => {
        setShowToast(true);
        setAnimationType("sort");
      });
  };
  const handleDeleteOffCanvas = (e) => {
    setDeleteTaskID(e);

    setDeleteTaskName(e.task.task_name);
    setShowOffCanvas(true);
  };
  const handleRetrieveEditData = (data) => {
    const taskByID = props.incompletedSharedTasksData.find(
      ({ task }) => task.task_id === data.task_id
    );
    taskByID.task.task_drawing = data.task_drawing;
    taskByID.task.task_date_time = data.task_date_time;
    taskByID.task.task_priority = data.task_priority;
    taskByID.task.task_description = data.task_description;
    taskByID.task.task_name = data.task_name;

    setToastMessage("Saved.");
    setToastColor("warning");
    axios.put(`${url}${props.userID}/tasks`, taskByID).then((res) => {
      setShowToast(true);
    });
  };

  const handleSendEditData = (data) => {
    setSendEditData(data);
    setEditModalShow(true);
  };

  const sortByHighestPriority = () => {
    setAnimationType("sort");

    const sortedSearch = [...searchResults].sort((a, b) =>
      a.task.task_priority.localeCompare(b.task.task_priority)
    );
    return setSearchResults(sortedSearch);
  };
  const sortByLowestPriority = () => {
    setAnimationType("sort");

    const sortedSearch = [...searchResults].sort((a, b) =>
      b.task.task_priority.localeCompare(a.task.task_priority)
    );
    return setSearchResults(sortedSearch);
  };
  const sortByFarthestDate = () => {
    setAnimationType("sort");

    const sortedSearch = [...searchResults].sort(
      (a, b) =>
        new Date(b.task.task_date_time) - new Date(a.task.task_date_time)
    );
    return setSearchResults(sortedSearch);
  };
  const sortByClosestDate = () => {
    setAnimationType("sort");

    const sortedSearch = [...searchResults].sort(
      (a, b) =>
        new Date(a.task.task_date_time) - new Date(b.task.task_date_time)
    );
    return setSearchResults(sortedSearch);
  };
  const sortByTaskName = () => {
    setAnimationType("sort");

    const sortedSearch = [...searchResults].sort((a, b) =>
      a.task.task_name
        .toLowerCase()
        .localeCompare(b.task.task_name.toLowerCase())
    );
    return setSearchResults(sortedSearch);
  };
  const handleShare = (e) => {
    setShowFriendShareModal(true);
    setSharedTaskData(e);
  };
  const sortByFriendName = () => {
    setAnimationType("sort");

    const sortedSearch = [...searchResults].sort((a, b) =>
      a.sharing_with.user_display_name === null
        ? "z"
        : a.sharing_with.user_display_name
            .toLowerCase()
            .localeCompare(
              b.sharing_with.user_display_name === null
                ? "z"
                : b.sharing_with.user_display_name.toLowerCase()
            )
    );
    return setSearchResults(sortedSearch);
  };
  const cardBorder = {
    A: "danger",
    B: "warning",
    C: "primary",
    D: "info",
    F: "success",
  };
  const cardAnimation = {
    complete: "accordionHorizontal",
    delete: "fade",
    sort: "elevator",
  };

  if (props.show === true && searchResults !== null)
    return (
      <div>
        <FaArrowCircleUp
          className="scrollTop"
          onClick={scrollTop}
          style={{ height: 40, display: showScroll ? "flex" : "none" }}
        />

        <SharedCreateModal
          allFriendsData={props.allFriendsData}
          show={createModalShow}
          onHide={() => setcreateModalShow(false)}
          userID={props.userID}
          createData={(data) => handleCreate(data)}
        />
        <EditTaskModal
          show={editModalShow}
          onHide={() => setEditModalShow(false)}
          editData={sendEditData}
          retrieveEditData={(data) => handleRetrieveEditData(data)}
        />
        <FriendShareModal
          createData={(data) => handleCreate(data)}
          show={showFriendShareModal}
          allFriendsData={props.allFriendsData}
          onHide={() => setShowFriendShareModal(false)}
          sharedTaskData={sharedTaskData}
        />
        <Offcanvas
          show={showOffCanvas}
          onHide={() => setShowOffCanvas(false)}
          placement="bottom"
        >
          <Offcanvas.Header className="tasks-container">
            <Offcanvas.Title>
              Are you sure you want to delete "{deleteTaskName}"?{" "}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <div className="text-center">This will be permanent!</div>
          <Offcanvas.Body className="tasks-container">
            <ButtonGroup aria-label="Basic example">
              <div>
                <Button
                  onClick={(e) => handleDelete(deleteTaskID)}
                  variant="danger"
                  size="lg"
                >
                  Yes
                </Button>
              </div>
              <div className="card-buttons">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setShowOffCanvas(false)}
                >
                  No
                </Button>
              </div>
            </ButtonGroup>
          </Offcanvas.Body>
        </Offcanvas>
        <div className="check-box-container">
          <ButtonGroup size="lg" className="check-box-button-size">
            <ToggleButton
              key={0}
              id={`radio-${0}`}
              type="radio"
              variant="secondary"
              name="radio"
              value={"Solo"}
              checked={radioValue === "Solo"}
              onChange={(e) => setRadioValue(e.currentTarget.value)}
            >
              <FaUserAlt />
            </ToggleButton>
            <ToggleButton
              key={1}
              id={`radio-${1}`}
              type="radio"
              variant="secondary"
              name="radio"
              value={"Solo+Shared"}
              checked={radioValue === "Solo+Shared"}
              onChange={(e) => setRadioValue(e.currentTarget.value)}
            >
              <FaUserAlt />+<FaUserFriends />
            </ToggleButton>

            <ToggleButton
              key={2}
              id={`radio-${2}`}
              type="radio"
              variant="secondary"
              name="radio"
              value={"Shared"}
              checked={radioValue === "Shared"}
              onChange={(e) => setRadioValue(e.currentTarget.value)}
            >
              <FaUserFriends />
            </ToggleButton>
          </ButtonGroup>
        </div>
        <ButtonToolbar
          className="top-tasks-buttons"
          aria-label="Toolbar with button groups"
        >
          <ButtonGroup className="me-2" aria-label="Second group">
            <OverlayTrigger
              trigger="hover"
              placement="top"
              overlay={
                <Tooltip id="tooltip-disabled">
                  Search by task name, friend username, or date/time.
                </Tooltip>
              }
            >
              <span className="d-inline-block">
                <Form className="d-flex">
                  <FormControl
                    onKeyPress={(e) => {
                      e.key === "Enter" && e.preventDefault();
                    }}
                    type="search"
                    placeholder="Search"
                    className="mr-2"
                    aria-label="Search"
                    variant="primary"
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                  />
                </Form>
              </span>
            </OverlayTrigger>
          </ButtonGroup>

          <ButtonGroup aria-label="Third group">
            <DropdownButton
              disabled={Object.keys(searchResults).length > 0 ? false : true}
              size="med"
              variant="secondary"
              id="dropdown-basic-button"
              title="Sort by"
            >
              <Dropdown.Item onClick={() => sortByLowestPriority()}>
                Lowest priority
              </Dropdown.Item>
              <Dropdown.Item onClick={() => sortByHighestPriority()}>
                Highest priority
              </Dropdown.Item>
              <Dropdown.Item onClick={() => sortByClosestDate()}>
                Earliest date/time
              </Dropdown.Item>
              <Dropdown.Item onClick={() => sortByFarthestDate()}>
                Latest date/time
              </Dropdown.Item>

              <Dropdown.Item onClick={() => sortByTaskName()}>
                Name
              </Dropdown.Item>
              <Dropdown.Item
                disabled={radioValue === "Solo"}
                onClick={() => sortByFriendName()}
              >
                Friend name
              </Dropdown.Item>
            </DropdownButton>
          </ButtonGroup>
        </ButtonToolbar>

        <Toast
          bg={toastColor}
          className="toast-container"
          animation={true}
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Body>Saved.</Toast.Body>
        </Toast>
        <FlipMove
          leaveAnimation={cardAnimation[animationType]}
          staggerDelayBy={150}
        >
          {searchResults.map(({ task, sharing_with }) => (
            <div className="tasks-container" key={task.task_id}>
              <Card
                className="task-card"
                border={cardBorder[task.task_priority]}
                style={{ width: "22rem" }}
              >
                <Card.Header>
                  {sharing_with.user_display_name === null ? (
                    <div className="card-social-icon">
                      <FaUserAlt />
                    </div>
                  ) : (
                    <div className="card-social-icon">
                      {sharing_with.user_display_name}{" "}
                      <FaUserFriends className="card-social-icon" />
                    </div>
                  )}
                  {task.task_name}
                </Card.Header>

                <Card.Body>
                  <Card.Text>{task.task_description}</Card.Text>
                  <Card.Img variant="bottom" src={task.task_drawing} />
                  <ButtonGroup>
                    <div>
                      <Button
                        variant="info"
                        size="med"
                        onClick={() =>
                          handleShare({
                            user_id: props.userID,
                            task_priority: task.task_priority,
                            task_name: task.task_name,

                            task_description: task.task_description,
                            task_date_time: task.task_date_time,
                            task_drawing: task.task_drawing,
                          })
                        }
                      >
                        <ImShare2 className="task-card-icon-size" />
                      </Button>
                    </div>
                    <div className="card-buttons">
                      <Button
                        variant="primary"
                        size="med"
                        value={task.task_id}
                        onClick={(e) => handleComplete({ sharing_with, task })}
                      >
                        <ImCheckmark className="task-card-icon-size" />
                      </Button>
                    </div>
                    <div className="card-buttons">
                      <Button
                        variant="warning"
                        onClick={(e) =>
                          handleSendEditData({
                            user_id: props.userID,
                            task_priority: task.task_priority,
                            task_name: task.task_name,
                            task_id: task.task_id,
                            task_description: task.task_description,
                            task_date_time: task.task_date_time,
                            task_drawing: task.task_drawing,
                          })
                        }
                        size="med"
                        value={[
                          props.userID,
                          task.task_priority,
                          task.task_name,
                          task.task_id,
                          task.task_description,
                          task.task_date_time,
                        ]}
                      >
                        <FiEdit className="task-card-icon-size" />
                      </Button>
                    </div>
                    <div className="card-buttons">
                      <Button
                        value={task.task_id}
                        variant="danger"
                        onClick={(e) =>
                          handleDeleteOffCanvas({ sharing_with, task })
                        }
                        size="med"
                      >
                        <RiDeleteBin2Line className="task-card-icon-size" />
                      </Button>
                    </div>
                  </ButtonGroup>
                </Card.Body>
                <Card.Footer>
                  {moment(task.task_date_time).format("MMMM DD YYYY hh:mm A")}
                </Card.Footer>
              </Card>
            </div>
          ))}
        </FlipMove>
        <Navbar fixed="bottom" collapseOnSelect className="Navcontainer">
          <Button
            // className="create-button"
            className="create-task-nav"
            variant="success"
            size="lg"
            onClick={(e) => setcreateModalShow(true)}
          >
            {createModalShow ? "Creating..." : "Create"} <CgGoogleTasks />
          </Button>
        </Navbar>
      </div>
    );
  else return null;
}
export default SharedTasks;
