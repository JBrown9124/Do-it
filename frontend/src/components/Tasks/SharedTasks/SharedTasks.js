import {
  Modal,
  Button,
  Form,
  ButtonGroup,
  Dropdown,
  Table,
  Card,
  Container,
  Row,
  Col,
  DropdownButton,
  Popover,
  OverlayTrigger,
  FormControl,
  CardColumns,
  Fade,
  Offcanvas,
  ButtonToolbar,
  Navbar,
  Nav,
  Tooltip,
  Toast,
  ToastContainer,
  Alert,
  Tabs,
  Tab,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import History from "../../../services/History";
import Routes from "../../../services/Routes";
import { Link } from "react-router-dom";

import moment from "moment";
import SharedCreateModal from "./SharedCreateModal";

import EditTaskModal from "../SoloTasks/EditTaskModal";




import { FaArrowCircleUp } from "react-icons/fa";
function SharedTasks(props) {
  const [deleteTaskID, setDeleteTaskID] = useState(null);
  const [deleteTaskName, setDeleteTaskName] = useState(null);
  const [sendEditData, setSendEditData] = useState("");

  const [createModalShow, setcreateModalShow] = useState(false);

  const [editModalShow, setEditModalShow] = useState(false);
  const [animationType, setAnimationType] = useState("delete");
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [flipDisabled, setFlipDisabled] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Saved.")
  const [toastColor, setToastColor] = useState("Light")
  const [showScroll, setShowScroll] = useState(false);
  const [tabKey, setTabKey] = useState("Shared");
  const handleTabSelect = (key) => {
    setTabKey(key);
    if (key === "Solo") {
      setTabKey("Shared");
      return props.handleSoloSelected();
    }
  };

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
  useEffect(
    () => setSearchResults(props.incompletedSharedTasksData),
    [props.incompletedSharedTasksData.length]
  );

  useEffect(() => {
    setAnimationType("sort");
    const results = props.incompletedSharedTasksData.filter(
      (task_name) =>
        task_name.task.task_name.toLowerCase().includes(searchItem) ||
        moment(task_name.task.task_date_time)
          .format("MMMM DD YYYY hh:mm A")
          .toLowerCase()
          .includes(searchItem) || task_name.sharing_with.user_display_name.toLowerCase().includes(searchItem)
    );
    setSearchResults(results);
  }, [searchItem]);

  // const handleClose = () => setShowOffCanvas(false);
  // const handleOffCanvasShow = (e) => {
  //   setShowOffCanvas(true);
  //   setDeleteTaskID(e);
  // };
  const handleCreate = (data) => {
    props.incompletedSharedTasksData.unshift(data);
    setToastMessage("Saved.");
    setToastColor("light");
    axios
      .post(
        `http://127.0.0.1:8000/to_do_list/${props.userID}/shared-tasks`,
        data
      )
      .then((res) => {
        setShowToast(true);
      });
  };
  const handleComplete = (e) => {
    setAnimationType("complete");
    const findTaskByID = props.incompletedSharedTasksData.find(
      ({ task }) => task.task_id === e
    );
    console.log(findTaskByID);
    const data = { completed_task_id: e };
    props.completedSharedTasksData.unshift(findTaskByID);
    setToastColor("info");
    setToastMessage("Completed!");
    axios
      .put(
        `http://127.0.0.1:8000/to_do_list/${props.userID}/completed-tasks`,
        data
      )
      .then((resp) => {setShowToast(true)});
    const remainingTasks = props.incompletedSharedTasksData.filter(function (
      value,
      index,
      arr
    ) {
      return value.task.task_id !== e;
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
      return value.task.task_id !== e;
    });
    // setSearchResults(remainingTasks);
    props.updateTasks(remainingTasks);
    setShowOffCanvas(false);
    setToastMessage("Deleted.");
    setToastColor("danger");
    const data = { task_id: e };
    axios
      .delete(`http://127.0.0.1:8000/to_do_list/${props.userID}/shared-tasks`, {
        data: data,
      })
      .then((resp) => {setShowToast(true)});
  };
  const handleDeleteOffCanvas = (e) => {
    setDeleteTaskID(e);
    const findTaskByID = props.incompletedSharedTasksData.find(
      ({ task }) => task.task_id === e
    );
    setDeleteTaskName(findTaskByID.task_name);
    setShowOffCanvas(true);
  };
  const handleRetrieveEditData = (data) => {
    const taskByID = props.incompletedSharedTasksData.find(
      ({ task }) => task.task_id === data.task_id
    );
    console.log(taskByID);
    taskByID.task.task_date_time = data.task_date_time;
    taskByID.task.task_priority = data.task_priority;
    taskByID.task.task_description = data.task_description;
    taskByID.task.task_name = data.task_name;
    setToastMessage("Saved.");
    setToastColor("warning");
    axios
      .put(
        `http://127.0.0.1:8000/to_do_list/${props.userID}/shared-tasks`,
        data
      )
      .then((res) => {setShowToast(true)});
  };

  const handleSendEditData = (e) => {
    const data = e.split(",");
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
  const sortByFriendName = () => {
    setAnimationType("sort");

    const sortedSearch = [...searchResults].sort((a, b) =>
      a.sharing_with.user_display_name
        .toLowerCase()
        .localeCompare(b.sharing_with.user_display_name.toLowerCase())
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
    delete: "elevator",
    sort: "accordionVertical",
  };

  if (props.show === true && searchResults !== null)
    return (
      <div>
        <FaArrowCircleUp
          className="scrollTop"
          onClick={scrollTop}
          style={{ height: 40, display: showScroll ? "flex" : "none" }}
        />
        <div className="create-task">
          <div className="d-grid gap-2">
            <Button
              // className="create-button"\

              variant="success"
              size="lg"
              onClick={(e) => setcreateModalShow(true)}
            >
              {createModalShow ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
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
          targeteditData={sendEditData}
          userID={sendEditData[0]}
          retrieveEditData={(data) => handleRetrieveEditData(data)}
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
              <Button
                onClick={(e) => handleDelete(deleteTaskID)}
                variant="danger"
                size="lg"
              >
                Yes
              </Button>

              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowOffCanvas(false)}
              >
                No
              </Button>
            </ButtonGroup>
          </Offcanvas.Body>
        </Offcanvas>

        {/* <div className="sticky-top">  */}
        {/* <Button
          // className="create-button"
          className="create-task"
          variant="success"
          size="med"
          onClick={(e) => setcreateModalShow(true)}
        >
          Create
        </Button> */}
        {/* </div>  */}
        {/* <Tabs variant='pills' 
        activeKey={tabKey}
  onSelect={(k)=>handleTabSelect(k)}
  id="noanim-tab-example"
  className="tasks-tab">
        <Tab eventKey="Solo" title="Solo" ></Tab>
        
        <Tab eventKey="Shared" title="Shared"  ></Tab>
        </Tabs> */}

        <ButtonToolbar
          className="top-tasks-buttons"
          aria-label="Toolbar with button groups"
        >
          <ButtonGroup className="me-2" aria-label="Second group">
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
          </ButtonGroup>

          <ButtonGroup aria-label="Third group">
            <DropdownButton
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
              <Dropdown.Item onClick={() => sortByFriendName()}>
                Friend name
              </Dropdown.Item>

            </DropdownButton>
          </ButtonGroup>
        </ButtonToolbar>
        {/* <Alert  animation={true} variant="light"  className="toast-container" onClose={() => setShowToast(false)}  show={showToast} delay={3000}  autohide>
  
 
  Saved.


</Alert>  */}

<Toast bg={toastColor} className="toast-container"animation={true}  onClose={() => setShowToast(false)}  show={showToast} delay={3000} autohide >
            <Toast.Body>
            {toastMessage}
            </Toast.Body>
          </Toast>

        {searchResults.map(({ task, sharing_with }) => (
          <div className="tasks-container" key={task.task_id}>
            <Card
              className="task-card"
              border={cardBorder[task.task_priority]}
              style={{ width: "22rem" }}
            >
              <Card.Header>Sharing {task.task_name} with {sharing_with.user_display_name}</Card.Header>
              <Card.Body>
  
                
                <Card.Text>{task.task_description}</Card.Text>
                <ButtonGroup>
                  
                  <div className="card-buttons">
                    <Button
                      variant="primary"
                      size="med"
                      value={task.task_id}
                      onClick={(e) => handleComplete(e.target.value)}
                    >
                      Complete
                    </Button>
                  </div>
                  <div className="card-buttons">
                    <Button
                      variant="warning"
                      onClick={(e) => handleSendEditData(e.target.value)}
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
                      Edit
                    </Button>
                  </div>
                  <div className="card-buttons">
                    <Button
                      value={task.task_id}
                      variant="danger"
                      onClick={(e) => handleDeleteOffCanvas(e.target.value)}
                      size="med"
                    >
                      Delete
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

        {/* <Navbar fixed="bottom" collapseOnSelect className="Navcontainer">
          
          <Button
            // className="create-button"
            className="create-task-nav"
            variant="success"
            size="lg"
            onClick={(e) => setcreateModalShow(true)}
          >
            {createModalShow ? "Creating...": "Create"}
          </Button>
          
        </Navbar>  */}
      </div>
    );
  else return null;
}
export default SharedTasks;
