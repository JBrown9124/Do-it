import { Button, Form, Placeholder } from "react-bootstrap";
import React, { useState } from "react";
import axios from "axios";

import url from "../../services/URL";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [data, setData] = useState(null);
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setPasswordShown(!passwordShown);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setIsError(false);
    const data = {
      email: email,
      password: password,
    };

    axios
      .post(`${url}log-in/`, data)
      .then((res) => {
        setData(res.data);

        setEmail("");
        setPassword("");

        setLoading(false);
        props.hideModal();
        props.userDisplayName(res.data.user_display_name);
        props.userID(res.data.user_id);
      })
      .catch((err) => {
        setLoading(false);
        setIsError(true);
      });
  };
  const handleGuest = () => {
    setGuestLoading(true);
    setIsError(false);
    const data = {
      email: email,
      password: password,
    };

    axios
      .get(`${url}log-in/`, data)
      .then((res) => {
        setData(res.data);

        setEmail("");
        setPassword("");

        setGuestLoading(false);
        props.hideModal();
        props.userDisplayName(res.data.user_display_name);
        props.userID(res.data.user_id);
      })
      .catch((err) => {
        setGuestLoading(false);
      });
  };
  return (
    <>
      <div className="container p-3">
        <div style={{ maxWidth: 350 }}>
          <div className="form-group">
            <label htmlFor="email" className="mt-2">
              Email
            </label>
            <input
              type="text"
              className="form-control"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <label htmlFor="password" className="mt-2">
            Password
          </label>

          <form onSubmit={handleSubmit}>
            <input
              name="password"
              autoComplete="off"
              type={passwordShown ? "text" : "password"}
              className="form-control"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="register-login-password" key={`default-checkbox`}>
              <Form.Check
                className="log-modal-pw"
                onClick={togglePassword}
                type="checkbox"
                id={`default-checkbox`}
                label="Show password"
              />
            </div>
          </form>
          {isError && (
            <small className="mt-3 d-inline-block text-danger">
              Invalid email or password.
            </small>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-3"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Loading..." : "Let's go!"}
        </button>

        <Button
          onClick={() => props.showRegister()}
          className="sign-in-register-link"
          variant="link"
        >
          Create account
        </Button>
      </div>
      <div className="sign-in-placeholder">
        <Placeholder size="sm" as="p" animation="glow">
          <Placeholder
            bg="secondary"
            className="placeholder-right"
            size="xs"
            xs={5}
          />{" "}
          Or{" "}
          <Placeholder
            bg="secondary"
            className="placeholder-right"
            size="xs"
            xs={5}
          />
        </Placeholder>
      </div>
      <div className="sign-in-as-guest">
        <Button onClick={() => handleGuest()} disabled={guestLoading}>
          {guestLoading ? "Loading..." : "Sign in as a guest!"}
        </Button>
      </div>
    </>
  );
}
export default Login;
