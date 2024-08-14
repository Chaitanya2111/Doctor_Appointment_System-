import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
// import '../css/OTPVerification.css';
import '../css/OTPVerification.css'
import { Card, Row, Col } from 'react-bootstrap'; // Importing Card, Row, Col from react-bootstrap

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const registrationEmail = sessionStorage.getItem('registrationEmail');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(null);

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post('http://localhost:3005/hospital/verify_otp', { email: registrationEmail, otp });
      if (response.status === 200) {
        // OTP verification successful
        setIsVerified(true);
        navigate('/TermsAndConditions');
        window.alert('OTP verification successful. Redirecting to login page.');
      } else {
        // OTP verification failed
        setError('OTP verification failed');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      setError('An unexpected error occurred.');
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
          <Card className="borderless" style={{ height: "400px" }}>
            <Row className="align-items-center">
              <Col>
                <Card.Body className="text-center">
                  <h3 className="mb-3">OTP Verification</h3>
                  <div className="mb-0 d-flex align-items-center justify-content-center">
                    <i className="feather icon-user-plus auth-icon mr-2" style={{ padding: '5px' }} />
                    <br></br>
                    
                  </div>
                  <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>
                  <div className="otp-verification-container" style={{marginTop:"70px"}}>
                    {isVerified ? (
                      <h3 className="verified-heading">Verified</h3>
                    ) : (
                      <div>
                        <button className="btn btn-primary mb-4" onClick={handleVerifyOTP}>Verify OTP</button>
                        {error && <p className="text-danger">{error}</p>}
                      </div>
                    )}
                    <p className="professional-message">Please enter the OTP you received to verify your account.</p>
                  </div>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default OTPVerification;
