import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Carousel, Offcanvas } from "react-bootstrap";

import React, { useEffect, useState } from "react";
import Register from "./components/Home/RegisterModal";

import Navigation from "./components/NavBar.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./components/Tasks/SoloTasks/Tasks.css";
import { css } from "@emotion/react";
import ClockLoader from "react-spinners/ClockLoader";
import axios from "axios";
import "./components/Friends/Friends.css";
import Login from "./components/Home/LoginModal";
import "./components/Home/Home.css";
import "./components/NavBar.css";
import "./components/Tasks/SoloTasks/CompletedTasks/CompletedTasks.css";
import "./components/Tasks/SharedTasks/SharedTasks.css";
import SharedTasks from "./components/Tasks/SharedTasks/SharedTasks.js";

import Friends from "./components/Friends/Friends.js";
import SharedCompletedTasks from "./components/Tasks/SharedTasks/SharedCompletedTasks/SharedCompletedTasks";
import url from "./services/URL";
import { GiFinishLine } from "react-icons/gi";
function App() {
  // const [loginmodalShow, setloginmodalShow] = useState(true);
  // const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [tasksShow, settasksShow] = useState(false);
  const [handleTasks, sethandleTasks] = useState(false);

  const [userDisplayName, setUserDisplayName] = useState();
  const [userID, setUserID] = useState();
  const [showFriends, setShowFriends] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allFriendsData, setAllFriendsData] = useState([]);
  const [allCompletedData, setAllCompletedData] = useState([]);
  const [allIncompletedData, setAllIncompletedData] = useState([]);

  const [allReceivedFriendRequestsData, setAllReceivedFriendRequestsData] =
    useState([]);
  const [allSentFriendRequestsData, setAllSentFriendRequestsData] = useState(
    []
  );

  const [loginRegisterCarouselIndex, setloginRegisterCarouselIndex] =
    useState(0);

  const [modalShow, setModalShow] = useState(true);

  useEffect(() => handleFriendsData(), [userID]);
  useEffect(() => handleSentFriendRequestsData(), [userID]);
  useEffect(() => handleTasksData(), [userID]);
  useEffect(() => handleReceivedFriendRequestsData(), [userID]);
  const MINUTE_MS = 30000;
  useEffect(() => {
    const interval = setInterval(() => {
      handleTasksData();
      handleFriendsData();
      handleSentFriendRequestsData();
      handleReceivedFriendRequestsData();
    }, MINUTE_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [userID]);

  const handleShowLoginHideTasks = () => {
    setModalShow(true);
    settasksShow(false);
  };
  const handleReceivedFriendRequestsData = () => {
    axios
      .get(`${url}${userID}/user-received-friend-requests`)
      .then((response) => {
        setAllReceivedFriendRequestsData(response.data.user_friend_requests);
      });
  };
  const handleSentFriendRequestsData = () => {
    axios.get(`${url}${userID}/user-sent-friend-requests`).then((response) => {
      setAllSentFriendRequestsData(response.data.user_sent_friend_requests);
      // isLoaded(true);
    });
  };

  const handleTasksData = () => {
    axios.get(`${url}${userID}/tasks`).then((response) => {
      setAllCompletedData(response.data.complete);
      setAllIncompletedData(response.data.incomplete);
      setLoading(false);
    });
  };
  const handleFriendsData = () => {
    axios.get(`${url}${userID}/user-friends`).then((response) => {
      setAllFriendsData(response.data.user_friends);
    });
  };
  const spinnerOverride = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  margin-top: 130px;
`;
  if (modalShow === false && tasksShow === false) {
    setLoading(true); settasksShow(true);
  }

  return (
    <div>
      <Navigation
        userDisplayName={userDisplayName}
        showFriends={() => setShowFriends(true)}
        completeCount={tasksShow ? Object.keys(allCompletedData).length : null}
        showLoginHideTasks={() => handleShowLoginHideTasks()}
        showComplete={(props) => setShowCompletedTasks(props)}
        userID={userID}
        receivedCount={Object.keys(allReceivedFriendRequestsData).length}
      />

      <SharedTasks
        
        updateTasks={(props) => setAllIncompletedData(props)}
        incompletedSharedTasksData={allIncompletedData}
        completedSharedTasksData={allCompletedData}
        allFriendsData={allFriendsData}
        userID={userID}
        show={tasksShow}
        completedhandleTasks={handleTasks}
        handledcompletedTasks={() => sethandleTasks(false)}
      />
<ClockLoader  loading={loading} css={spinnerOverride} size={125} />
      <Offcanvas
        show={showCompletedTasks}
        onHide={() => setShowCompletedTasks(false)}
      >
        <Offcanvas.Header
          closeButton
          onClick={() => setShowCompletedTasks(false)}
        >
          <Offcanvas.Title className="completed-title">
            Completed <GiFinishLine />
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <SharedCompletedTasks
            updateTasks={(props) => setAllCompletedData(props)}
            completedSharedTasksData={allCompletedData}
            incompletedSharedTasksData={allIncompletedData}
            userID={userID}
            show={showCompletedTasks}
            hideCompletedTasks={(props) => setShowCompletedTasks(false)}
          />
        </Offcanvas.Body>
      </Offcanvas>
      <Friends
        incompletedSharedTasksData={allIncompletedData}
        allReceivedFriendRequestsData={allReceivedFriendRequestsData}
        allSentFriendRequestsData={allSentFriendRequestsData}
        allFriendsData={allFriendsData}
        updateAllReceivedFriendRequestsData={(data) =>
          setAllReceivedFriendRequestsData(data)
        }
        updateAllFriendsData={(data) => setAllFriendsData(data)}
        userID={userID}
        show={showFriends}
        hideFriends={(props) => setShowFriends(false)}
      />
      <Modal
        show={modalShow}
        size="sm"
        keyboard={false}
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Title className="app-modal" id="contained-modal-title-vcenter">
          {loginRegisterCarouselIndex === 1 ? "Create an account" : "Sign in"}
        </Modal.Title>
        <p className="text-center"> to continue to Do or Do Not</p>

        <Carousel
          touch={true}
          keyboard={true}
          interval={null}
          indicators={false}
          controls={false}
          activeIndex={loginRegisterCarouselIndex}
        >
          <Carousel.Item>
            <Login
              hideModal={() => setModalShow(false)}
              userDisplayName={(props) => setUserDisplayName(props)}
              userID={(props) => setUserID(props)}
              showRegister={(props) => setloginRegisterCarouselIndex(1)}
            />
          </Carousel.Item>
          <Carousel.Item>
            <Register
              hideModal={() => setModalShow(false)}
              userDisplayName={(props) => setUserDisplayName(props)}
              userID={(props) => setUserID(props)}
              showLogin={(props) => setloginRegisterCarouselIndex(0)}
            />
          </Carousel.Item>
        </Carousel>
      </Modal>
    </div>
  );
}

export default App;
