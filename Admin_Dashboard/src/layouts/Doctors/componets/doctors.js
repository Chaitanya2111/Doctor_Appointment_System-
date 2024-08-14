import React, { useState, useEffect } from 'react';
import img1 from './dr.jpg';
import '../css/doctors.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { useNavigate } from 'react-router-dom'; 
function Doctors() {
  
  const [doctorsData, setDoctorsData] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(''); 
  const navigate = useNavigate();
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:3005/hospital/doctorss');
      setDoctorsData(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleLoadMore = () => {
    setShowAll(true);
  };

  const handleEditDoctor = (id) => {
    navigate(`/adddoctors/${id}`);
  };

  const handleDeleteDoctor = async (id) => {
    try {
      await axios.delete(`http://localhost:3005/hospital/doctors/delete/${id}`);
    
      setDoctorsData(doctorsData.filter(doctor => doctor.id !== id));
      console.log('Doctor deleted successfully');
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
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

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const filteredDoctors = selectedDepartment
    ? doctorsData.filter(doctor => doctor.department === selectedDepartment)
    : doctorsData;

  const visibleData = showAll ? filteredDoctors : filteredDoctors.slice(0, 8);


  return (
    <div className="container">
      <div className="row ">
        <div className="col-lg-3 col-6">
        <select className="form-control select" onChange={handleDepartmentChange}>
            <option value="">-- Select Department --</option>
            {departmentsData.map(department => (
              <option key={department.dep_id} value={department.dep_id}>{department.department_name}</option>
            ))}
          </select>


        </div>
       
        <div className="col-lg-9 col-6 text-right m-b-20 d-flex justify-content-end">
          <Link to={'/adddoctors'} className="btn btn btn-success btn-rounded float-right">
            <i className="fa fa-plus"></i> Add Doctors
           
          </Link>
          {/* <input type='color'/> */}
        </div>
      </div>
      <div className="row doctor-grid">
      {Array.isArray(visibleData) && visibleData.length > 0 ? (
          visibleData.map((doctor, index) => (

            <div key={index} className="col-md-4 col-sm-4 col-lg-3">
              <div className="profile-widget" style={{ backgroundColor: 'white' }}>
                <div className="dropdown profile-action">
                  <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false" style={{color:'#00b38f'}}>
                    <i className="fa fa-ellipsis-v" style={{color:'#00b38f'}}></i>
                  </a>
                  <div className="dropdown-menu dropdown-menu-right" style={{color:'#00b38f'}}>
                  <a className="dropdown-item" href="#" onClick={() => handleEditDoctor(doctor.id)}>
  <i className="fa fa-pencil m-r-5"></i> Edit
</a>

<a className="dropdown-item" href="#" onClick={() => handleDeleteDoctor(doctor.id)}>
                      <i className="fa fa-trash-o m-r-5"></i> Delete
                    </a>
                  </div>
                </div>
                <div className="doctor-img">
                  <a className="avatar" href="profile.html">
                  {doctor.avatar ? (
                      <img alt="" src={`http://localhost:3005${doctor.avatar}`} className="rounded-circle" />
                    ) : (
                      <img alt="" src={img1} className="rounded-circle" />
                    )}

                  </a>
                </div>
                <h4 className="doctor-name text-ellipsis d-flex justify-content-center" >
                  <a  style={{color:'#00b38f'}} href="profile.html">{`${doctor.first_name} ${doctor.last_name}`}</a>
                </h4>
                <div className="doc-prof d-flex justify-content-center">{doctor.department_name}</div>
                <div className="user-country d-flex justify-content-center">
                <i className="fa fa-map-marker" aria-hidden="true"  style={{ marginRight: '8px' ,color:'green' }}> </i> {doctor.address}
                </div>
                <br />
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
              <button type="button" className="btn btn-success" onClick={handleLoadMore}>Load More</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctors;

