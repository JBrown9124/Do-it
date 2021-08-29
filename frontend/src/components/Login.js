import { Modal, Button, Form } from "react-bootstrap";
import React, { useState } from "react";
import axios from "axios";
import {Link} from 'react-router-dom';
function Login(props) {
  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  
  const [data, setData] = useState(null);

  const handleSubmit = () => {
    setLoading(true);
    setIsError(false);
    const data = {
      
      email: email,
      password: password,
    };
    
      axios
        .post("http://127.0.0.1:8000/to_do_list/log-in/", data)
        .then((res) => {
          setData(res.data);
          
          setEmail("");
          setPassword("");

          setLoading(false);
        props.onHide()
        return props.user(res.data)
          
          
        })
        .catch((err) => {
          setLoading(false);
          setIsError(true);
          
            
        });
    
  };

  return (
    <Modal
      {...props}
      size="med"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Log In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container p-3">
          <div style={{ maxWidth: 350 }}>
            
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
                type="text"
                className="form-control"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {isError && (
              <small className="mt-3 d-inline-block text-danger">
                You have entered an invalid email or password.
              </small>
            )}
            
            <button
              type="submit"
              className="btn btn-primary mt-3"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Loading..." : "Log In"}
            </button>
            {data && <div className="mt-3">
          <strong>Output:</strong><br />
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
        }
        <Link to="/home-register" variant = "body2">
  Not have an account? Sign up here 
</Link>
          </div>
        </div>
      </Modal.Body>
      {/* <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer> */}
    </Modal>
  );
}
export default Login;
