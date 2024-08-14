import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap'; // Assuming you're using Bootstrap components
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import '../css/TermsAndConditions.css';

const TermsAndConditions = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();

  const handleAcceptTerms = () => {
    setAcceptedTerms(true);
  };

  const handleNext = () => {
    if (acceptedTerms) {
      // If terms are accepted, navigate to login page
      navigate('/login');
    } else {
      // If terms are not accepted, show an alert
      window.alert('Please accept the terms and conditions.');
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
          <Card className="borderless" style={{ width:"550px" ,height:"550px"}}>
            <Row className="align-items-center">
              <Col>
                <Card.Body className="text-center">
                  <h3 className="mb-3">Terms and Conditions</h3>
                  <div className="mb-0 d-flex align-items-center justify-content-center">
                    <i className="feather icon-user-plus auth-icon mr-2" style={{ padding: '5px' }} />
                  </div>
                  <div className="terms-container">
                    <p className="terms-text">
                      Please read these terms and conditions carefully before using our website.
                      <br />
                      <br />
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis vel erat bibendum faucibus.
                      <br />
                      Duis auctor interdum nulla, ut vehicula nulla interdum eget. Nam id dui ut mi vestibulum lobortis.
                      <br />
                      Sed ultrices id velit id interdum. Donec id arcu non est maximus bibendum vel vitae magna.
                      <br />
                      Integer auctor ipsum ut finibus malesuada. In id nunc nec nibh dictum vulputate non ac enim.
                    </p>
                    <label>
                      <input type="checkbox" checked={acceptedTerms} onChange={handleAcceptTerms} />
                      I accept the terms and conditions
                    </label>
                    <br></br>
                    <button className="btn btn-primary mb-4" onClick={handleNext}>Next</button>
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

export default TermsAndConditions;
