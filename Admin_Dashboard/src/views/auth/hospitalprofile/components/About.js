import { Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
function About() {
  const [formData, setFormData] = useState({
    logo: '',
    photo: '',
    name: '',
    locations: '',
    departments: '',
    timing: '',
    facilities: '',
    about:''
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
      <Row>
        {/* about me  */}
        <Col md={12}>

          <h4 className="text-success my-2" >About {formData.name}</h4>
          <p className="my-4">
         {formData.about}
          </p>
        
        </Col>
      </Row>
     
    </>
  );
}
export default About;
