import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Button, Container } from 'react-bootstrap';// Import Bootstrap components
import './css/dashboard.css'; // Import custom CSS file
import doctor from './doctor.png';
import { FaHeart, FaFlask, FaXRay } from 'react-icons/fa';// Import Font Awesome icons
import { FaThermometerHalf, FaNetworkWired, FaHeartbeat, FaLungs, FaExclamationCircle } from 'react-icons/fa'; // Import necessary icons from react-icons library
import { FcCircuit } from "react-icons/fc";
import { FaRulerVertical, FaWeight, FaTint } from 'react-icons/fa';
import axios from 'axios';
import AppointmentCard from '../../layouts/Appointments/componets/appointmentcard';



const Index = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emergencyClicked, setEmergencyClicked] = useState(false); // State to track emergency button click

  const [appointments, setAppointments] = useState([]);

  const [contactId, setContactId] = useState('');

  useEffect(() => {
    fetchAppointments();
    const contactIdFromSession = sessionStorage.getItem('Contact_id');
    setContactId(contactIdFromSession);
  }, []);

  useEffect(() => {
    if (contactId) {
      fetchAppointments();
    }
  }, [contactId]);

  const fetchAppointments = async () => {
    try {

      const response = await fetch(`http://localhost:3005/patient/getappointment/${contactId}`);
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);

    }
  };



  const [appointmentDetails, setAppointmentDetails] = useState({
    date: '',
    time: '',
    address: '',

  });


  const handleAppointmentSubmit = () => {

    console.log('Appointment details submitted:', appointmentDetails);
  };

  useEffect(() => {
    fetchProfileData();

  }, []);

  const fetchProfileData = async () => {
    try {
      const contactId = sessionStorage.getItem('Contact_id');
      const response = await axios.get(`http://localhost:3005/patient/profile/${contactId}`);
      setProfileData(response.data);
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };
  const adjustTimeWithTimeZone = (timeString) => {
    const time = new Date(timeString);
    const offset = time.getTimezoneOffset() / 60;
    const adjustedTime = new Date(time.getTime() + offset * 60 * 60 * 1000);
    return adjustedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container>
      <Row>
        <Col className="text-right mb-3" style={{ float: "right" }}>
          <Button className="zigzag-button" variant="danger" onClick={() => setEmergencyClicked(true)} style={{ width: "200px", float: "right", backgroundColor: "#ff0000", position: "relative", border: "none", padding: "0", cursor: "pointer", outlineOffset: "4px", transition: "filter 250ms", userSelect: "none", touchAction: "manipulation" }}>
            <div className="shadow"></div>
            <div className="edge"></div>
            <div className="front">
              <FaExclamationCircle /> Emergency
            </div>
          </Button>
        </Col>
      </Row>

      {emergencyClicked && (
        <Col md={12} className='info' style={{ marginTop: "20px" }}>
          <Card className='information' style={{ width: "100%", height: "100px", backgroundColor: "#f8d7da", border: "2px solid #f5c6cb" }}>
            <Card.Body>
              <h6 style={{ marginTop: "-10px", fontSize: "18px", color: "red" }}>Emergency Alert!</h6>
              <p style={{ margin: "0", fontSize: "16px" }}>This is an emergency alert. Please seek immediate medical attention.</p>
            </Card.Body>
          </Card>
        </Col>
      )}

      {/* Welcome Card */}
      <Row>
        <Col md={8}> {/* Specify width for medium screens */}
          <Card className="welcome-card"> {/* Add custom CSS class */}
            <Card.Body className="d-flex align-items-center position-relative"> {/* Align card body content vertically */}
              <div>

                <h2 style={{ fontWeight: "bolder", color: "white" }}>Welcome, {profileData && `${profileData.FirstName} ${profileData.LastName}`}</h2>
                <h5 style={{ fontWeight: "bolder", color: "white" }}>Find the best doctor with Health Care</h5>
              </div>
              <div className="image-container"> {/* Container for the image */}
                {/* Add your image here */}
                <img src={doctor} alt="" className="doctor-image" />
              </div>
            </Card.Body>
          </Card>
          <Row>
            <Col md={6}>
              <Card className='information'>
                <Card.Body>
                  <h6 style={{ marginTop: "-12px", fontSize: "18px" }}>Body Temperature</h6>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FaThermometerHalf style={{ marginRight: "5px", fontSize: "22px", color: 'blue' }} /> {/* Assuming you have an icon for temperature */}
                    <p style={{ margin: "0", fontSize: "21px", fontWeight: "600" }}>36°C</p> {/* Display temperature here */}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className='information' >
                <Card.Body>
                  <h6 style={{ marginTop: "-10px", fontSize: "18px" }}>Pluses</h6>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FaNetworkWired style={{ marginRight: "5px", fontSize: "22px", color: 'green' }} /> {/* Icon for network */}
                    <p style={{ margin: "0", fontSize: "21px", fontWeight: "600" }}> 85 bpm</p> {/* Display "Plus 85 mbps" here */}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className='information' >
                <Card.Body>
                  <h6 style={{ marginTop: "-10px", fontSize: "18px" }}>Blood Pressure</h6>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FaHeartbeat style={{ marginRight: "5px", fontSize: "22px", color: 'red' }} /> {/* Icon for heart or heartbeat */}
                    <p style={{ margin: "0", fontSize: "21px", fontWeight: "600" }}>80/70 mm/HG </p> {/* Display blood pressure here */}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className='information'>
                <Card.Body>
                  <h6 style={{ marginTop: "-10px", fontSize: "18px" }}>Breathing Rate</h6>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FaLungs style={{ marginRight: "5px", fontSize: "22px", color: 'orange' }} /> {/* Icon for lungs or breathing */}
                    <p style={{ margin: "0", fontSize: "20px", fontWeight: "600" }}>15 breaths/min</p> {/* Display breathing rate here */}
                  </div>
                </Card.Body>
              </Card>
            </Col>




          </Row>


        </Col>

        <Col md={4}> {/* Specify width for medium screens */}
          <Card className='report'>
            <Card.Header>
              <h4 style={{ fontWeight: "bolder", color: "black" }}>My Reports</h4>
            </Card.Header>
            <Card.Body>
              {/* Render dates and reports dynamically */}
              {[
                { date: '2024-04-30', report: 'Blood' },
                { date: '2024-04-29', report: 'Urine' },
                { date: '2024-04-28', report: 'Calcium' },
                { date: '2024-04-27', report: 'Body X-ray' },
                { date: '2024-04-26', report: 'Glucose' },
                // Add more dates and reports as needed
              ].map((item, index) => (
                <Row key={index} >
                  <Col xs={6}>
                    <Card className='report' >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {item.report === 'Blood' && <FaHeart style={{ color: 'red', marginRight: '7px', marginLeft: '5px', fontSize: '16px' }} />}
                        {item.report === 'Urine' && <FcCircuit style={{ color: 'blue', marginRight: '7px', marginLeft: '5px', fontSize: '16px' }} />}
                        {item.report === 'Calcium' && <FaFlask style={{ color: 'green', marginRight: '7px', marginLeft: '5px', fontSize: '16px' }} />}
                        {item.report === 'Body X-ray' && <FaXRay style={{ color: 'purple', marginRight: '7px', marginLeft: '5px', fontSize: '16px' }} />}
                        {item.report === 'Glucose' && <FaFlask style={{ color: 'orange', marginRight: '7px', marginLeft: '5px', fontSize: '16px' }} />}
                        <p style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '16px' }}>{item.report}</p>
                      </div>
                    </Card>
                    <div className="mt-3"></div>
                  </Col>

                  <Col xs={6}>
                    <p>{item.date}</p>
                  </Col>
                </Row>
              ))}
            </Card.Body>
          </Card>

        </Col>



      </Row>

      <Row>
        <Col md={4} className='info' >
          <Card className='information' >
            <Card.Body>
              <h6 style={{ marginTop: "-10px", fontSize: "18px" }}>Height</h6>
              <div style={{ display: "flex", alignItems: "center" }}>
                <FaRulerVertical style={{ marginRight: "5px", color: "blue", fontSize: "22px", width: "auto" }} />
                <p style={{ margin: "0", fontSize: "20px", fontWeight: "600" }}>{loading ? 'Loading...' : (profileData && profileData.Height)}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className='info'>
          <Card className='information' >
            <Card.Body>
              <h6 style={{ marginTop: "-10px", fontSize: "18px" }}>Weight</h6>
              <div style={{ display: "flex", alignItems: "center" }}>
                <FaWeight style={{ marginRight: "10px", color: "green", fontSize: "22px", width: "auto" }} />
                <p style={{ margin: "0", fontSize: "20px", fontWeight: "600" }}>{loading ? 'Loading...' : (profileData && profileData.Weight)}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className='info'>
          <Card className='information' >
            <Card.Body>
              <h6 style={{ marginTop: "-10px", fontSize: "18px" }}>Blood Group</h6>
              <div style={{ display: "flex", alignItems: "center" }}>
                <FaTint style={{ marginRight: "10px", color: "red", fontSize: "22px" }} />
                <p style={{ margin: "0", fontSize: "20px", fontWeight: "600" }}>{loading ? 'Loading...' : (profileData && profileData.BloodGroup)}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
        <AppointmentCard></AppointmentCard>
        </Col>
      
      </Row>

      <Row>


        <Col md={8}>
          <Card className='information' style={{ borderRadius: "10px" }}>
            <Card.Header>
              <h3 style={{ fontWeight: "bolder", color: "blue" }}>Appointments</h3>
            </Card.Header>
            <Card.Body>
              <Table responsive striped hover className="appointments-table">
                <thead>
                  <tr>
                    <th style={{ fontSize: "19px", fontWeight: "550" }}>Patient Name</th>
                    <th style={{ fontSize: "19px", fontWeight: "550" }}>Doctor Name</th>
                    <th style={{ fontSize: "19px", fontWeight: "550" }}>Specification</th>
                    <th style={{ fontSize: "19px", fontWeight: "550" }}>Date</th>
                    <th style={{ fontSize: "19px", fontWeight: "550" }}>Time</th>
                    <th style={{ fontSize: "19px", fontWeight: "550" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Map through appointment data and generate table rows */}
                  {appointments.map((appointment, index) => (
                    <tr key={index}>
                      <td>{appointment.patientName}</td>
                      <td>{appointment.first_name} {" "}{appointment.last_name}</td>
                      <td>{appointment.department_name}</td>
                      <td>{new Date(appointment.date).toLocaleDateString()}</td>
                      <td>{adjustTimeWithTimeZone(appointment.time_slot)}</td>
                      <td>
                        <span className={`custom-badge status-${appointment.status.toLowerCase()}`}>
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}> {/* Control the width using the md={4} */}
          <Card className='information' style={{ borderRadius: "10px", backgroundColor: "#8ab0e9" }}>
            <Card.Header>
              <h4 className="card-title" style={{ fontWeight: "bolder", color: "black" }}>Get Doctor Home Visit</h4>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleAppointmentSubmit}>
                <div className="form-group">
                  <label>Date:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={appointmentDetails.date}
                    onChange={(e) =>
                      setAppointmentDetails({
                        ...appointmentDetails,
                        date: e.target.value,
                      })
                    }
                  />
                </div>
                <br></br>
                <div className="form-group">
                  <label>Time:</label>
                  <input
                    type="time"
                    className="form-control"
                    value={appointmentDetails.time}
                    onChange={(e) =>
                      setAppointmentDetails({
                        ...appointmentDetails,
                        time: e.target.value,
                      })
                    }
                  />
                </div><br></br>
                <div className="form-group">
                  <label>Address:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={appointmentDetails.address}
                    onChange={(e) =>
                      setAppointmentDetails({
                        ...appointmentDetails,
                        address: e.target.value,
                      })
                    }
                  />
                </div><br></br>
                <br />
                <button type="submit" className="btn btn-primary">
                  Schedule Appointment
                </button>
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>


    </Container>


  );
};

export default Index;
