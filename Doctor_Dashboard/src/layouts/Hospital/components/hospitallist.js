import React, { useState, useEffect } from 'react';
import logo2 from './logo4-removebg-preview.png';
import photo1 from './hospital.jpg';
import axios from 'axios';

const HospitalList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [visibleHospitals, setVisibleHospitals] = useState(6); // Initially show 6 hospitals (2 rows)
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [departmentsData, setDepartmentsData] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState({
    name: '',
    speciality: '',
    experience: '',
    education: '',
    contact: '',
    email: '',
    availableTime: '',
    address: '',
    gender: '',
    department: '',
    doctorId: '',
  });

  useEffect(() => {
    // Fetch hospitals from the API
    const fetchHospitals = async () => {
      try {
        const response = await fetch('http://localhost:3005/doctor/get-Hospital');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setHospitals(data); // Update the hospitals state with fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchHospitals();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!selectedHospital) return; // Add this check

      try {
        const hospitalId = selectedHospital.Hospital_id;
        const response = await axios.get(`http://localhost:3005/doctor/departments/${hospitalId}`);
        setDepartmentsData(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, [selectedHospital]); // Add selectedHospital as a dependency

  const loadMore = () => {
    setVisibleHospitals(hospitals.length); // Show all hospitals
  };

  const handleHospitalClick = (hospital) => {
    setSelectedHospital(hospital);
    setShowForm(true);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const doctorId = sessionStorage.getItem('Doctor_id');
    try {
      const response = await fetch('http://localhost:3005/doctor/register-doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hospitalId: selectedHospital.Hospital_id,
          doctorId: doctorId,
          doctorName: doctorInfo.name,
          speciality: doctorInfo.speciality,
          experience: doctorInfo.experience,
          department: doctorInfo.department,
          education: doctorInfo.education,
          contact: doctorInfo.contact,
          email: doctorInfo.email,
          availableTime: doctorInfo.availableTime,
          address: doctorInfo.address,
          gender: doctorInfo.gender,
        }),
      });

      if (!response.ok) {
        throw new Error('Error registering doctor');
      }

      // Assuming success, reset form and hide it
      setDoctorInfo({
        name: '',
        speciality: '',
        experience: '',
        department: '',
        education: '',
        contact: '',
        email: '',
        availableTime: '',
        address: '',
        gender: ''
      });
      setShowForm(false);
      setSelectedHospital(null);
    } catch (error) {
      console.error('Error registering doctor:', error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        {hospitals.slice(0, visibleHospitals).map((hospital, index) => (
          <div key={index} className="col-md-4">
            <div className="card mb-4" style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}>
              <img src={hospital.photo ? `http://localhost:3005${hospital.photo}` : photo1} className="card-img-top" alt="Hospital" />
              <div
                className="card-body"
                style={{ cursor: 'pointer' }}
                onClick={() => handleHospitalClick(hospital)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleHospitalClick(hospital);
                  }
                }}
                role="button"
                tabIndex={0}
              >
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

      {/* Modal Form */}
      {showForm && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Register Doctor at {selectedHospital?.NameofHospital}</h5>
                <button type="button" className="close" aria-label="Close" onClick={() => setShowForm(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="hospitalId">Hospital ID</label>
                    <input type="text" className="form-control" id="hospitalId" value={selectedHospital?.Hospital_id || ''} readOnly />
                  </div>

                  <div className="form-group">
                    <label htmlFor="name">Doctors Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={doctorInfo.name}
                      onChange={(e) => setDoctorInfo({ ...doctorInfo, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="speciality">Speciality</label>
                    <input
                      type="text"
                      className="form-control"
                      id="speciality"
                      value={doctorInfo.speciality}
                      onChange={(e) => setDoctorInfo({ ...doctorInfo, speciality: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="experience">Experience (years)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="experience"
                      value={doctorInfo.experience}
                      onChange={(e) => setDoctorInfo({ ...doctorInfo, experience: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select
                      className="form-control"
                      name="department"
                      onChange={(e) => setDoctorInfo({ ...doctorInfo, department: e.target.value })}
                      required
                      value={doctorInfo.department}
                    >
                      <option value="">Select Department</option>
                      {departmentsData.map((department) => (
                        <option key={department.dep_id} value={department.dep_id}>
                          {department.department_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="education">Education</label>
                    <input
                      type="text"
                      className="form-control"
                      id="education"
                      value={doctorInfo.education}
                      onChange={(e) => setDoctorInfo({ ...doctorInfo, education: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact">Contact Number</label>
                    <input
                      type="text"
                      className="form-control"
                      id="contact"
                      value={doctorInfo.contact}
                      onChange={(e) => setDoctorInfo({ ...doctorInfo, contact: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={doctorInfo.email}
                      onChange={(e) => setDoctorInfo({ ...doctorInfo, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="availableTime">Available Time</label>
                    <input
                      type="text"
                      className="form-control"
                      id="availableTime"
                      value={doctorInfo.availableTime}
                      onChange={(e) => setDoctorInfo({ ...doctorInfo, availableTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      value={doctorInfo.address}
                      onChange={(e) => setDoctorInfo({ ...doctorInfo, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      className="form-control"
                      id="gender"
                      value={doctorInfo.gender}
                      onChange={(e) => setDoctorInfo({ ...doctorInfo, gender: e.target.value })}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Register Doctor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalList;
