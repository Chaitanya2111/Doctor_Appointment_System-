import { Card, Image, Row, Col } from 'react-bootstrap';
import '../css/Hprofile.css';
import React, { useState, useEffect } from 'react';
import logo2 from './logo4-removebg-preview.png'
import photo1 from './hospital.jpg'
import Navbar from './Nav';

function Profile() {

  const [formData, setFormData] = useState({
    logo: '',
    photo: '',
    name: '',
   
  });
  useEffect(() => {
    // Fetch existing hospital profile data based on Hospital_id
    fetchHospitalProfile();
  }, []); // Run once on component mount

  const fetchHospitalProfile = async () => {
    try {
      const hospitalId = sessionStorage.getItem('Hospital_id');
      const response = await fetch(`http://localhost:3005/hospital/profile/${hospitalId}`); // Replace with your endpoint to fetch hospital profile
      if (!response.ok) {
        throw new Error('Failed to fetch hospital profile');
      }
      const data = await response.json();
      setFormData(data); // Update form data with fetched data
    } catch (error) {
      console.error('Error fetching hospital profile:', error);
    }
  };

  return (
    <>
      {/* Manipal Hospital */}
      <Card>
        <Card.Body>
          <Row>
            <Col>
            <Image
                     
                      fluid id="himg"
                      src={formData.photo ? `http://localhost:3005${formData.photo }`: photo1}
                      alt="HospitalPhoto"
                      onError={(e) => {
                        console.error('Error loading photo:', e);
                        console.log('Photo path:', formData.photo);
                        console.log('Full URL:', `http://localhost:3005${formData.photo}`);
                      }}
                    />
           
            </Col>
          </Row>
          <Row>
            <Col md={2} xs={6}>
            <Image
            className="mx-3 border" roundedCircle id="hlogo" 
                      width="100"
                      height="100"
                      src={formData.logo ? `http://localhost:3005${formData.logo}` : logo2}
                      alt="HospitalLogo"
                      onError={(e) => {
                        console.error('Error loading logo:', e);
                        console.log('Logo path:', formData.logo);
                        console.log('Full URL:', `http://localhost:3005${formData.logo}`);
                      }}
                    />
             
            </Col>
           
            <Col md={3} xs={12} className="py-2">
            <br></br>
              <h5 style={{fontWeight:'600'}} className="text-success">{formData.name}</h5>
              <h5  className="text-secondary">{formData.locations}</h5>
            </Col>
            <Col md={3} xs={12} className="py-2">
            <br></br>
              <h5>rashmi1121@gmail.com</h5>
              <h5 className="text-secondary">Email</h5>
            </Col>
            <Col md={2} xs={2}></Col>
            <Col md={2} xs={4} className="text-end">
           
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {/* Follower */}
      <Row>
       
        <Col md={12}>
            <Card>
                <Card.Body>
                    <Navbar />
                </Card.Body>
            </Card>
        </Col>
      </Row>
    </>
  );
}
export default Profile;
