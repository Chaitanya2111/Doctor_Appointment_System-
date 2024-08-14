import React, { useState, useEffect } from 'react';
import axios from 'axios';
import himg from './dr.jpg'; // Ensure this path is correct

function MyDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      const HospitalId = sessionStorage.getItem("Hospital_id");
      if (!HospitalId) {
        setError(new Error("Hospital ID not found in session storage"));
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3005/hospital/approved-doctors/${HospitalId}`);
        setDoctors(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='container'>
      <h5>Approved Doctors</h5>
      <div className='row'>
        {doctors.map(doctor => (
          <div className='col-md-3' key={doctor.id}>
            <div className='card'>
              <img src={himg} className='card-img-top' alt='Doctor' />
              <div className='card-body'>
                <h5 className='card-title'> Name : {doctor.DoctorName}</h5>
                <p className='card-text'>Available Time : {doctor.AvailableTime}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyDoctors;
