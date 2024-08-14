import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { NavLink,  useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

const SignUp1 = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [initialRender, setInitialRender] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const Hospital_id = sessionStorage.getItem("Hospital_id");
    if (!initialRender && Hospital_id) {
      navigate("/app/dashboard/default");
    }
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
      const response = await fetch("http://localhost:3005/hospital/Hospitallogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const responseData = await response.json();
  
        if (responseData.success) {
          const { Hospital_id, userEmail } = responseData;
  
          sessionStorage.setItem("Hospital_id", Hospital_id);
  
          console.log("Login successful!");
  
          const timeoutId = setTimeout(() => {
            console.log("Session has expired. Navigating to NotFoundPage...");
            navigate("/notfoundpage");
            sessionStorage.removeItem("Hospital_id");
            sessionStorage.removeItem("SessionTimeoutID");
          }, 600000); // 5 minutes for testing
  
          sessionStorage.setItem("SessionTimeoutID", timeoutId);
  
          navigate("/app/dashboard/default", { state: { userEmail, Hospital_id } });
        } else {
          setError(responseData.message || "Invalid email or password.");
        }
      } else {
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
    const registrationEmail = sessionStorage.getItem("registrationEmail");
    const registrationPassword = sessionStorage.getItem("registrationPassword");

    if (registrationEmail && registrationPassword) {
        setEmail(registrationEmail);
        setPassword(registrationPassword);
    }
  }, []);

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
