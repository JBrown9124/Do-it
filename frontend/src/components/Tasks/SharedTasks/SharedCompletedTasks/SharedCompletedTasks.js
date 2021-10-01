import {
  Button,
  Form,
  ButtonGroup,
  Dropdown,
  Card,
  OverlayTrigger,
  Popover,
  DropdownButton,
  FormControl,
  ToggleButton,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import FlipMove from "react-flip-move";
import { RiDeleteBin2Line } from "react-icons/ri";
import { FaUserAlt, FaUserFriends } from "react-icons/fa";
import { IoIosNuclear } from "react-icons/io";
import { FaUndo } from "react-icons/fa";
import moment from "moment";
import url from "../../../../services/URL";

function SharedCompletedTasks(props) {
  const [animationType, setAnimationType] = useState("sort");
  const [radioValue, setRadioValue] = useState("Solo+Shared");
  const [showDeleteAllPopOver, setShowDeleteAllPopOver] = useState(false);
  const [showDeletePopOver, setShowDeletePopOver] = useState(false);
  const [deleteTaskID, setDeleteTaskID] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (radioValue === "Shared") {
      const results = props.completedSharedTasksData.filter(
        (task_name) =>
          task_name.sharing_with.user_id !== null &&
          (task_name.task.task_name
            .toLowerCase()
            .includes(searchItem.toLowerCase()) ||
            moment(task_name.task.task_date_time)
              .format("MMMM DD YYYY hh:mm A")

              .includes(searchItem) ||
            task_name.sharing_with.user_display_name
              .toLowerCase()
              .includes(searchItem.toLowerCase()))
      );
      setSearchResults(results);
    } else if (radioValue === "Solo") {
      const results = props.completedSharedTasksData.filter(
        (task_name) =>
          task_name.sharing_with.user_id === null &&
          (task_name.task.task_name
            .toLowerCase()
            .includes(searchItem.toLowerCase()) ||
            moment(task_name.task.task_date_time)
              .format("MMMM DD YYYY hh:mm A")

              .includes(searchItem))
      );

      setSearchResults(results);
    } else if (radioValue === "Solo+Shared") {
      const results = props.completedSharedTasksData.filter((task_name) =>
        task_name.sharing_with.user_id === null
          ? task_name.task.task_name
              .toLowerCase()
              .includes(searchItem.toLowerCase()) ||
            moment(task_name.task.task_date_time)
              .format("MMMM DD YYYY hh:mm A")

              .includes(searchItem)
          : task_name.task.task_name
              .toLowerCase()
              .includes(searchItem.toLowerCase()) ||
            moment(task_name.task.task_date_time)
              .format("MMMM DD YYYY hh:mm A")

              .includes(searchItem) ||
            task_name.sharing_with.user_display_name
              .toLowerCase()
              .includes(searchItem.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [searchItem]);
  useEffect(() => {
    if (radioValue === "Shared") {
      const results = props.completedSharedTasksData.filter(
        (task_name) => task_name.sharing_with.user_id !== null
      );
      setSearchResults(results);
    } else if (radioValue === "Solo") {
      const results = props.completedSharedTasksData.filter(
        (task_name) => task_name.sharing_with.user_id === null
      );

      setSearchResults(results);
    } else if (radioValue === "Solo+Shared") {
      setSearchResults(props.completedSharedTasksData);
    }
  }, [radioValue, props.completedSharedTasksData.length]);
  const handleUndo = (e) => {
    setAnimationType("undo");

    props.incompletedSharedTasksData.unshift(e);
    const remainingTasks = props.completedSharedTasksData.filter(function (
      value,
      index,
      arr
    ) {
      return value.task.task_id !== e.task.task_id;
    });

    props.updateTasks(remainingTasks);
    const data = { undo_completed_task_id: e };
    axios
      .put(`${url}${props.userID}/completed-tasks`, data)
      .then((response) => {
        setAnimationType("sort");
      });
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
      return value.task.task_id !== e.task.task_id;
    });

    props.updateTasks(remainingTasks);
    const data = e;
    axios
      .delete(`${url}${props.userID}/completed-tasks`, { data: data })
      .then((response) => {
        setAnimationType("sort");
      });
  };
  const handleDeleteAll = () => {
    setAnimationType("deleteAll");
    setShowDeleteAllPopOver(false);
    props.updateTasks([]);
    const data = props.completedSharedTasksData;
    axios
      .delete(`${url}${props.userID}/completed-tasks`, { data: data })
      .then((response) => {
        setAnimationType("sort");
      });
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
      (a, b) =>
        new Date(b.task.task_date_time) - new Date(a.task.task_date_time)
    );

    return setSearchResults(sortedSearch);
  };
  const sortByClosestDate = () => {
    const sortedSearch = [...searchResults].sort(
      (a, b) =>
        new Date(a.task.task_date_time) - new Date(b.task.task_date_time)
    );
    return setSearchResults(sortedSearch);
  };
  const sortByTaskName = () => {
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
    sort: "elevator",
    undo: "accordionVertical",
    delete: "fade",
    deleteAll: "fade",
  };
  const deleteAllPopover = (
    <Popover className="tasks-container" id="popover-basic">
      <Popover.Header as="h3">Are you sure?</Popover.Header>
      <Popover.Body>All completed tasks will be deleted!</Popover.Body>
      <ButtonGroup aria-label="Basic example">
        <div>
          <Button onClick={(e) => handleDeleteAll()} variant="danger">
            Yes
          </Button>
        </div>
        <div className="card-buttons">
          <Button
            variant="primary"
            onClick={() => setShowDeleteAllPopOver(false)}
          >
            No
          </Button>
        </div>
      </ButtonGroup>
    </Popover>
  );
  const deletePopOver = (
    <Popover className="tasks-container" id="popover-basic">
      <Popover.Header as="h3">Are you sure?</Popover.Header>
      <Popover.Body> This will be permanent!</Popover.Body>
      <ButtonGroup aria-label="Basic example">
        <div>
          <Button onClick={() => handleDelete(deleteTaskID)} variant="danger">
            Yes
          </Button>
        </div>
        <div className="card-buttons">
          <Button variant="primary" onClick={() => setShowDeletePopOver(false)}>
            No
          </Button>
        </div>
      </ButtonGroup>
    </Popover>
  );
  // if (props.show === true && props.completedTasksData !== null) {

  return (
    <>
      <div className="d-grid gap-2">
        <OverlayTrigger
          trigger="focus"
          placement="bottom"
          overlay={deleteAllPopover}
        >
          <Button
            variant="danger"
            size="med"
            className="completed-clear"
            onClick={() => setShowDeleteAllPopOver(true)}
          >
            <IoIosNuclear className="task-card-icon-size" />
          </Button>
        </OverlayTrigger>
      </div>
      <div className="completed-task-top-buttons">
        <ButtonGroup size="lg" className="check-box-button-size">
          <ToggleButton
            key={3}
            id={`radio-${3}`}
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
            key={4}
            id={`radio-${4}`}
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
            key={5}
            id={`radio-${5}`}
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
            disabled={Object.keys(searchResults).length > 0 ? false : true}
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

            <Dropdown.Item onClick={() => sortByTaskName()}>Name</Dropdown.Item>
            <Dropdown.Item
              disabled={radioValue === "Solo"}
              onClick={() => sortByFriendName()}
            >
              Friend name
            </Dropdown.Item>
          </DropdownButton>
        </ButtonGroup>
      </div>
      <FlipMove
        leaveAnimation={cardAnimation[animationType]}
        staggerDelayBy={150}
      >
        {searchResults.map(({ task, sharing_with }) => (
          <div key={task.task_id}>
            <Card
              className="task-card"
              key={task.task_id}
              border={cardBorder[task.task_priority]}
              style={{ width: "20rem" }}
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
                {task.task_name}{" "}
              </Card.Header>
              <Card.Body>
                <Card.Text>{task.task_description}</Card.Text>
                <Card.Img variant="bottom" src={task.task_drawing} />
                <ButtonGroup
                  aria-label="Basic example"
                  className="card-buttons-margin-top"
                >
                  <div className="card-buttons">
                    <Button
                      variant="dark"
                      size="med"
                      value={task.task_id}
                      onClick={(e) => handleUndo({ sharing_with, task })}
                    >
                      <FaUndo className="task-card-icon-size" />
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
                        onClick={(e) =>
                          handleDeletePopOver({ sharing_with, task })
                        }
                        variant="danger"
                        size="med"
                      >
                        <RiDeleteBin2Line className="task-card-icon-size" />
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
      </FlipMove>
    </>
  );
  // } else {
  //   return null;
  // }
}

export default SharedCompletedTasks;
