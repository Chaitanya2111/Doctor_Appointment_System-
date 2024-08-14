import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo2 from './logo4-removebg-preview.png';
import photo1 from './hospital.jpg';

const HospitalList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [visibleHospitals, setVisibleHospitals] = useState(6); 

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch('http://localhost:3005/patient/get-Hospital');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setHospitals(data);
      } catch (error) {
        console.error('Error fetching data:', error);
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
          <div key={index} className="col-md-4">
            <Link to={`/hospital/${hospital.Hospital_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div
                className="card mb-4"
                style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', cursor: 'pointer' }}
                role="button"
                tabIndex={0}
               
              >
                <img src={hospital.photo ? `http://localhost:3005${hospital.photo}` : photo1} className="card-img-top" alt="Hospital" />
                <div className="card-body">
                  <h4 className="card-title" style={{ color: '#0379b0', textAlign: 'center' }}>
                    <img
                      src={hospital.logo ? `http://localhost:3005${hospital.logo}` : logo2}
                      alt="HospitalLogo"
                      style={{ height: '50px', width: '50px', marginRight: '5px' }}
                      onError={(e) => {
                        e.target.src = logo2; // Fallback to default logo if there's an error loading the custom logo
                        console.error('Error loading logo:', e);
                        console.log('Logo path:', hospital.logo);
                        console.log('Full URL:', `http://localhost:3005${hospital.logo}`);
                      }}
                    />
                    <span style={{ fontWeight: '700' }}>{hospital.name}</span>
                  </h4>
                  <br />
                  <p className="card-text">Location: {hospital.locations}</p>
                  <p className="card-text">Hospital Timing: {hospital.timing}</p>

                  <a href="#" className="card-text" style={{ float: 'right' }}>
                    View Details
                  </a>
                </div>
              </div>
            </Link>
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
};

export default HospitalList;
