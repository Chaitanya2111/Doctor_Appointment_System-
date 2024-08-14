import React, { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import { useEffect } from 'react';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import { useNavigate } from "react-router-dom";

const SignUp1 = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [initialRender, setInitialRender] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const Contact_id = sessionStorage.getItem("Contact_id");
    if (!initialRender && Contact_id) {
      navigate("/app/dashboard/default");
    }
    // Set initialRender to false after the first render
    if (initialRender) {
      setInitialRender(false);
    }
  }, [navigate, initialRender]);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3005/patient/logincust", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const responseData = await response.json();
  
        if (responseData.success) {
          const { Contact_id, userEmail } = responseData;
  
          // Save Contact_id in sessionStorage
          sessionStorage.setItem("Contact_id", Contact_id);
  
          // Log success message
          console.log("Login successful!");
  
          // Set session timeout
          const timeoutId = setTimeout(() => {
            console.log("Session has expired. Navigating to NotFoundPage...");
            navigate("/notfoundpage");
            sessionStorage.removeItem("Contact_id");
            sessionStorage.removeItem("SessionTimeoutID");
          }, 600000); // 5 minutes for testing
  
          // Save timeoutId to clear later
          sessionStorage.setItem("SessionTimeoutID", timeoutId);
  
          // Navigate to dashboard
          navigate("/app/dashboard/default", { state: { userEmail, Contact_id } });
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Invalid email or password.");
        }
      } else {
        // Log the response when there's an error
        console.error("Error response from server:", response);
        const errorData = await response.json();
        setError(errorData.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An unexpected error occurred.");
    }
  };
  


  useEffect(() => {
    // Retrieve registration email and password from sessionStorage
    const registrationEmail = sessionStorage.getItem("registrationEmail");
    const registrationPassword = sessionStorage.getItem("registrationPassword");

    // Set email and password in state
    if (registrationEmail && registrationPassword) {
        setEmail(registrationEmail);
        setPassword(registrationPassword);
    }
}, []); // Run only once when component mounts
  

  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless">
            <Row className="align-items-center">
              <Col>
                <Card.Body className="text-center">
                  <div className="mb-4">
                    <i className="feather icon-user-plus auth-icon" />
                  </div>
                  <h3 className="mb-4">Login</h3>

                  <div className="input-group mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="input-group mb-4">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-check text-start mb-4 mt-2">
    <input
        type="checkbox"
        className="form-check-input"
        id="customCheck1"
        defaultChecked={false}
    />
    <label className="form-check-label" htmlFor="customCheck1">
        <Link to="#"> Remember Me</Link>
        <span style={{ marginLeft: '20px' }}>  </span>
        <Link to="/enter-email" style={{ marginLeft: '25px' }}>Forgot Password?</Link>
    </label>
</div>

                  <button className="btn btn-primary mb-4" onClick={handleLogin}>
                    Login
                  </button>
                  {error && <p className="text-danger">{error}</p>}
                  <p className="mb-0 text-muted">
                Don’t have an account?{' '}
                <NavLink to="/Registerform" className="f-w-400">
                  Signup
                </NavLink>
              </p>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignUp1;
