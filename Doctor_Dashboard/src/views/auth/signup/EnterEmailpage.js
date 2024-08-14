import React, { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

const EnterEmailPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [showOtpInput, setShowOtpInput] = useState(false); // State to control visibility of OTP input box
  const [showPasswordInput, setShowPasswordInput] = useState(false); // State to control visibility of password input box

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3005/doctor/changepassword/requestotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        // If reset password request is successful, show OTP input box
        setShowOtpInput(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "An error occurred while processing your request.");
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      setError("An unexpected error occurred.");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
  
    try {
        const response = await fetch("http://localhost:3005/doctor/changepassword/verifyotp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }), 
        });
      
        if (response.ok) {
          const responseData = await response.json();
          if (responseData.message === "OTP verified successfully") {
            setShowPasswordInput(true);
            setError(null);
          } else {
            setError("Invalid OTP.");
          }
        } else {
          // Handle non-JSON response here
          if (response.status === 401) {
            setError("Invalid OTP.");
          } else {
            setError("An error occurred while verifying OTP.");
          }
        }
      } catch (error) {
        console.error("Error during OTP verification:", error);
        setError("An unexpected error occurred.");
      }
    };      
  
    const handleChangePassword = async (e) => {
        e.preventDefault();
      
        try {
          const response = await fetch("http://localhost:3005/doctor/changepassword", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, newPassword, otp }),
          });
      
          if (response.ok) {
            // Password changed successfully
            console.log("Password changed successfully");
            setError(null); // Clear any previous errors
          } else {
            const errorData = await response.json();
            setError(errorData.message || "An error occurred while changing the password.");
          }
        } catch (error) {
          console.error("Error during password change:", error);
          setError("An unexpected error occurred.");
        }
      };
      

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
                    <i className="feather icon-mail auth-icon" />
                  </div>
                  <h3 className="mb-4">Reset Password</h3>

                  <div className="input-group mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Show OTP input box if showOtpInput is true */}
                  {showOtpInput && (
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Show password input box if showPasswordInput is true */}
                  {showPasswordInput && (
                    <div className="input-group mb-3">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Show appropriate button based on current step */}
                  {!showPasswordInput ? (
                    <button className="btn btn-primary mb-4" onClick={showOtpInput ? handleVerifyOTP : handleResetPassword}>
                      {showOtpInput ? "Verify OTP" : "Reset Password"}
                    </button>
                  ) : (
                    <button className="btn btn-primary mb-4" onClick={handleChangePassword}>
                      Change Password
                    </button>
                  )}

                  {/* Show error message */}
                  {error && <p className="text-danger">{error}</p>}

                  <p className="mb-0 text-muted">
                    Remember your password?{' '}
                    <NavLink to="/login" className="f-w-400">
                      Login
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

export default EnterEmailPage;