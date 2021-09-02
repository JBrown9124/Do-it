import { Modal, Button, Form } from "react-bootstrap";
import React, { useState } from "react";
import axios from "axios";
import History from "../../services/History"
import Routes from "../../services/Routes"
import {Link} from 'react-router-dom';

function Register(props) {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [ispassError, setispasssError] = useState(false);
  const [isemailvalidError, setisemailvalidError] = useState(false)
  const [errorMessage, seterrorMessage] = useState("")
  const [data, setData] = useState(null);

  const handleSubmit = () => {
    setLoading(true);
    setIsError(false);
    const data = {
      name: name,
      email: email,
      password: password,
    };
    if (password === password2) {
      axios
        .post("http://127.0.0.1:8000/to_do_list/register/", data)
        .then((res) => {
          setData(res.data);
          setName("");
          setEmail("");
          setPassword("");
          setPassword2("")

          setLoading(false);
          props.onHide();
        
        })
        .catch((err) => {
          setLoading(false);
          seterrorMessage(err.response.data);
          setIsError(true);
          setispasssError(false);
        });
    } else {
      setispasssError(true);
      setLoading(false);
    }
  };

  return (
    <Modal
      {...props}
      size="med"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container p-3">
          <div style={{ maxWidth: 350 }}>
            <div classNames="form-group">
              <label htmlFor="name">Name</label>
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
            <div classNames="form-group">
              <label htmlFor="password" className="mt-2">
                Password
              </label>
              <input
              name="password" autocomplete="off"
                type="text"
                className="form-control"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div classNames="form-group">
              <label htmlFor="password" className="mt-2">
                Type password again
              </label>
              <input
              name="password" autocomplete="off"
                type="text"
                className="form-control"
                id="password2"
                placeholder="Enter password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
            </div>
            {isError && (
              <small className="mt-3 d-inline-block text-danger">
                {errorMessage}
              </small>
            )}
            {ispassError && (
              <small className="mt-3 d-inline-block text-danger">
                Passwords do not match.
              </small>
            )}
            <button
              type="submit"
              className="btn btn-primary mt-3"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Loading..." : "Register"}
            </button>
            <Button onClick={()=>props.onHide()} variant ='link'>
  Already registered? Sign in here.
</Button>
            {/* {data && <div className="mt-3">
          <strong>Output:</strong><br />
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
        } */}
          </div>
        </div>
      </Modal.Body>
      {/* <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer> */}
    </Modal>
  );
}
export default Register;
