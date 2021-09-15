import {
    Modal,
    Button,
    Form,
    ButtonGroup,
    Dropdown,
    Table,
    Card,
    Offcanvas,
    OverlayTrigger,
    Popover,
    DropdownButton,
    FormControl,
    Container
  } from "react-bootstrap";
  import React, { useState, useEffect } from "react";
  import axios from "axios";

  import { Link } from "react-router-dom";
  // import "./Tasks.css";
  
  import moment from "moment";

  
  
  function SharedCompletedTasks(props) {
    const [show, setShow] = useState(false);
    const [reusemodalShow, setreusemodalShow] = useState(false);
  
    const [reuseData, setreuseData] = useState("");
    const [animationType, setAnimationType] = useState("");
    
    const handleShow = () => setShow(true);
    const [showDeleteAllPopOver, setShowDeleteAllPopOver] = useState(false);
    const [showDeletePopOver, setShowDeletePopOver] = useState(false);
    const [deleteTaskID, setDeleteTaskID] = useState(false);
    const [searchItem, setSearchItem] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const handleClose = () => props.hideCompletedTasks();
    useEffect(
      () => setSearchResults(props.completedSharedTasksData),
      [props.completedSharedTasksData.length]
    );
    useEffect(() => {
      setAnimationType("sort");
      const results = props.completedSharedTasksData.filter(
        (task_name) =>
        task_name.task.task_name.toLowerCase().includes(searchItem) ||
        moment(task_name.task.task_date_time)
          .format("MMMM DD YYYY hh:mm A")
          .toLowerCase()
          .includes(searchItem) || task_name.sharing_with.user_display_name.toLowerCase().includes(searchItem)
    );
      setSearchResults(results);
    }, [searchItem]);
    const handleUndo = (e) => {
      setAnimationType("undo");
      console.log(e);
  
      const findTaskByID = props.completedSharedTasksData.find(
        ({ task }) => task.task_id === e
      );
      console.log(findTaskByID);
  
      props.incompletedSharedTasksData.unshift(findTaskByID);
      const remainingTasks = props.completedSharedTasksData.filter(function (
        value,
        index,
        arr
      ) {
        return value.task.task_id !== e;
      });
      // setSearchResults(remainingTasks);
      props.updateTasks(remainingTasks);
      const data = { undo_completed_task_id: e };
      axios
        .put(
          `http://127.0.0.1:8000/to_do_list/${props.userID}/completed-tasks`,
          data
        )
        .then((response) => {});
    };
    const handleDeletePopOver = (e) => {
      setShowDeletePopOver(true);
      setDeleteTaskID(e);
    };
    const handleDelete = (e) => {
      setAnimationType("delete");
      const remainingTasks = props.completedSharedTasksData.filter(function (
        value,
        index,
        arr
      ) {
        return value.task.task_id !== e;
      });
      // setSearchResults(remainingTasks);
      props.updateTasks(remainingTasks);
      const data = { task_id: e };
      axios
        .delete(
          `http://127.0.0.1:8000/to_do_list/${props.userID}/completed-tasks`,
          { data: data }
        )
        .then((response) => {});
    };
    const handleDeleteAll = () => {
      setAnimationType("deleteAll");
      setShowDeleteAllPopOver(false);
      props.updateTasks([]);
      const data = props.completedSharedTasksData;
      axios
        .delete(
          `http://127.0.0.1:8000/to_do_list/${props.userID}/completed-shared-tasks`,
          { data: data }
        )
        .then((response) => {});
    };
    const sortByHighestPriority = () => {
      const sortedSearch = [...searchResults].sort((a, b) =>
        a.task.task_priority.localeCompare(b.task.task_priority)
      );
      return setSearchResults(sortedSearch);
    };
    const sortByLowestPriority = () => {
      const sortedSearch = [...searchResults].sort((a, b) =>
        b.task.task_priority.localeCompare(a.task.task_priority)
      );
  
      return setSearchResults(sortedSearch);
    };
    const sortByFarthestDate = () => {
      const sortedSearch = [...searchResults].sort(
        (a, b) => new Date(b.task.task_date_time) - new Date(a.task.task_date_time)
      );
  
      return setSearchResults(sortedSearch);
    };
    const sortByClosestDate = () => {
      const sortedSearch = [...searchResults].sort(
        (a, b) => new Date(a.task.task_date_time) - new Date(b.task.task_date_time)
      );
      return setSearchResults(sortedSearch);
    };
    const sortByTaskName = () => {
      const sortedSearch = [...searchResults].sort((a, b) =>
        a.task.task_name.toLowerCase().localeCompare(b.task.task_name.toLowerCase())
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
      undo: "accordionVertical",
      delete: "elevator",
      deleteAll: "elevator",
    };
    const deleteAllPopover = (
      <Popover className="tasks-container" id="popover-basic">
        <Popover.Header as="h3">Are you sure?</Popover.Header>
        <Popover.Body>This will be permanent!</Popover.Body>
        <ButtonGroup aria-label="Basic example">
          <Button onClick={(e) => handleDeleteAll()} variant="danger">
            Yes
          </Button>
  
          <Button
            variant="primary"
            onClick={() => setShowDeleteAllPopOver(false)}
          >
            No
          </Button>
        </ButtonGroup>
      </Popover>
    );
    const deletePopOver = (
      <Popover className="tasks-container" id="popover-basic">
        <Popover.Header as="h3">Are you sure?</Popover.Header>
        <Popover.Body> This will be permanent!</Popover.Body>
        <ButtonGroup aria-label="Basic example">
          <Button onClick={() => handleDelete(deleteTaskID)} variant="danger">
            Yes
          </Button>
  
          <Button variant="primary" onClick={() => setShowDeletePopOver(false)}>
            No
          </Button>
        </ButtonGroup>
      </Popover>
    );
    // if (props.show === true && props.completedTasksData !== null) {
  
    return (
      <>
        {/* <Offcanvas show={props.show} onHide={handleClose}>
          <Offcanvas.Header closeButton onClick={() => handleClose()}>
            
            <Offcanvas.Title >
             
              Completed
            </Offcanvas.Title>
            
          </Offcanvas.Header>
         
          <Offcanvas.Body> */}
           
          <div className="d-grid gap-2">
   
   <OverlayTrigger
         trigger="focus"
         placement="bottom"
         overlay={deleteAllPopover}
       >
         <Button
         // className="completed-clear"
           variant="danger"
           size="med"
           className="completed-clear"
           
           onClick={() => setShowDeleteAllPopOver(true)}
           
         >
           Clear
         </Button>
       </OverlayTrigger>
       </div>
       <div className="completed-task-top-buttons">
            <ButtonGroup className="completed-task-top-buttons">
              <Form>
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
              <DropdownButton
                className="completed-sort-by"
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
              </DropdownButton>
              {/* <Button
                      
                      onClick={() => handledeleteAll()}
                      variant="danger"
                      size="lg"
                    >
                      Delete All
                    </Button> */}
            </ButtonGroup>
  </div>
            {searchResults.map(({task, sharing_with}) => (
              <div  className="tasks-container" key={task.task_id}>
                <Card
                  className="task-card"
                  key={task.task_id}
                  border={cardBorder[task.task_priority]}
                  style={{ width: "20rem" }}
                >
                  <Card.Header>Shared {task.task_name} with {sharing_with.user_display_name} </Card.Header>
                  <Card.Body>
                    
                    <Card.Text>{task.task_description}</Card.Text>
  
                    <ButtonGroup aria-label="Basic example">
                      {/* <Button
                          variant="primary"
                          size="lg"
                          // value={[props.user_id, task.task_priority,task.task_name, task.task_id, task.task_description, task.task_date_time]}
                          value={task.task_id}
                          onClick={(e) => handleReuse(e.target.value)}
                        >
                          Reuse
                        </Button> */}
                        <div className="card-buttons">
                        
                      <Button
                        variant="warning"
                        size="med"
                        value={task.task_id}
                        onClick={(e) => handleUndo(e.target.value)}
                      >
                        Undo
                      </Button>
                      </div>
                      <div className="card-buttons">
                      <OverlayTrigger
                        trigger="focus"
                        placement="left"
                        overlay={deletePopOver}
                      >
                        <Button
                          value={task.task_id}
                          // onClick={(e) => handleDelete(e.target.value)}
                          onClick={(e) => handleDeletePopOver(e.target.value)}
                          variant="danger"
                          size="med"
                        >
                          Delete
                        </Button>
                      </OverlayTrigger>
                      </div>
                    </ButtonGroup>
                  </Card.Body>
                  <Card.Footer>
                    {moment(task.task_date_time).format("MMMM DD YYYY hh:mm A")}
                  </Card.Footer>
                </Card>
              </div>
            ))}
  
            {/* </FlipMove> */}
            
          {/* </Offcanvas.Body>
          
        </Offcanvas> */}
      </>
    );
    // } else {
    //   return null;
    // }
  }
  
  export default SharedCompletedTasks;
  