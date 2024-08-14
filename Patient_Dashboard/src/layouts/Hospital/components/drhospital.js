import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const HospitalDoctors = () => {
  const { hospitalId } = useParams();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchApprovedDoctors = async () => {
      try {
        const response = await fetch(`http://localhost:3005/patient/approved-doctors/${hospitalId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchApprovedDoctors();
  }, [hospitalId]);

  return (
    <div className="container">
      <h6>Approved Doctors</h6>
      <div className="row">
        {doctors.map((doctor, index) => (
          <div key={index} className="col-md-4">
            <div className="card mb-4" style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}>
              <div className="card-body">
                <h4 className="card-title">{doctor.DoctorName}</h4>
                <p className="card-text">Speciality: {doctor.Speciality}</p>
                <p className="card-text">Experience: {doctor.Experience} years</p>
                <p className="card-text">Contact: {doctor.Contact}</p>
                <p className="card-text">Email: {doctor.Email}</p>
                <p className="card-text">Available Time: {doctor.AvailableTime}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalDoctors;
