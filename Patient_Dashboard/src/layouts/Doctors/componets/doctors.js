import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import img1 from './dr.jpg';
import '../css/doctors.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
function Doctors() {
  const [doctorsData, setDoctorsData] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchDoctors();
  }, []);
  const handleDoctorSelect = (doctorId, departmentId) => {
    navigate(`/addappointments?doctor=${doctorId}&department=${departmentId}`);
  };
  
  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:3005/api/doctorss');
      setDoctorsData(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };


  const handleLoadMore = () => {
    setShowAll(true);
  };
  const [departmentsData, setDepartmentsData] = useState([]);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:3005/api/departments');
        setDepartmentsData(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const filteredDoctors = selectedDepartment
    ? doctorsData.filter(doctor => doctor.department === selectedDepartment)
    : doctorsData;

  const visibleData = showAll ? filteredDoctors : filteredDoctors.slice(0, 8);

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-3 col-6">
          <select className="form-control select" onChange={handleDepartmentChange}>
            <option value="">-- Select Department --</option>
            {departmentsData.map(department => (
              <option key={department.dep_id} value={department.dep_id}>{department.department_name}</option>
            ))}
          </select>
        </div>
        <div className="col-9 text-right m-b-20 d-flex justify-content-end">
          
        </div>
      </div>
      <br></br>
      <div className="row doctor-grid">
        {Array.isArray(visibleData) && visibleData.length > 0 ? (
          visibleData.map((doctor, index) => (
            <div key={index} className="col-md-4 col-sm-6 col-lg-3">
              <div className="card-doctor" >
                <div className="doctor-img">
                <a className="card-doctor" href="#!" onClick={() => handleDoctorSelect(doctor.id, doctor.department)}>

                    {doctor.avatar ? (
                      <img alt="" src={`http://localhost:3005${doctor.avatar}`} />
                    ) : (
                      <img alt="" src={img1} />
                    )}

                    <div className="social-icons">
                      <div className='iconss'> <FaFacebook className="icon" /></div>

                      <div className='iconss'>  <FaTwitter className="icon" /></div>
                      <div className='iconss'> <FaLinkedin className="icon" /></div>
                      < div className='iconss'>  <FaInstagram className="icon" /></div>
                    </div>
                  </a>
                </div>
                <div className="card-body-doctor">
                  <h4 className="card-title-dr">{`${doctor.first_name} ${doctor.last_name}`}</h4>
                  <p className="card-title-doctor">{doctor.department_name}</p>
                  <p className="card-title-doctor"><i className="fa fa-map-marker" style={{ marginRight: '8px' }}></i>{doctor.address}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-sm-12 d-flex justify-content-center">
            <p>No doctors available</p>
          </div>
        )}
      </div>
      {!showAll && (
        <div className="row">
          <div className="col-sm-12 d-flex justify-content-center">
            <div className="see-all">
              <button type="button" className="btn btn-primary" onClick={handleLoadMore}>Load More</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctors;
