import React, { useState, useEffect } from 'react';
import axios from 'axios';
import photo1 from './hospital.jpg';
import logo2 from './logo4-removebg-preview.png';

function MyHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [visibleHospitals, setVisibleHospitals] = useState(6); // Initially show 6 hospitals (2 rows)

  useEffect(() => {
    const fetchHospitals = async () => {
      const doctorId = sessionStorage.getItem('Doctor_id');
      try {
        const response = await axios.get(`http://localhost:3005/doctor/myhospitals/${doctorId}`); // Update this endpoint with your actual API endpoint
        setHospitals(response.data);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      }
    };

    fetchHospitals();
  }, []);

  const loadMore = () => {
    setVisibleHospitals(hospitals.length); // Show all hospitals
  };

  return (
    <div className="container">
      <div className="row">
        {hospitals.slice(0, visibleHospitals).map((hospital, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card" style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}>
              <img src={hospital.photo ? `http://localhost:3005${hospital.photo}` : photo1} className="card-img-top" alt="Hospital" />
              <div className="card-body" style={{ cursor: 'pointer' }}>
                <h4 className="card-title text-center">
                  <img
                    src={hospital.logo ? `http://localhost:3005${hospital.logo}` : logo2}
                    alt="Hospital Logo"
                    style={{ height: '50px', width: '50px', marginRight: '5px' }}
                    onError={(e) => {
                      e.target.src = logo2;
                      console.error('Error loading logo:', e);
                      console.log('Logo path:', hospital.logo);
                    }}
                  />
                  {hospital.name}
                </h4>
                <p className="card-text">Location: {hospital.locations}</p>
                <p className="card-text">Hospital Timing: {hospital.timing}</p>
                <a href="#" className="btn btn-primary btn-block" style={{ float: 'right' }}>
                  View Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      {visibleHospitals < hospitals.length && (
        <div className="text-center">
          <button className="btn btn-primary" onClick={loadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default MyHospitals;
