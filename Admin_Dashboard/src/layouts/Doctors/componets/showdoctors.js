import React, { useState, useEffect } from 'react';
import axios from 'axios';
import himg from './dr.jpg';
import himg2 from './dr.jpg';

const imageMap = {
  'doctorsimg.webp': himg,
  'doctorsimg2.jpg': himg2,
};

function Showdoctors() {
  const [doctors, setdoctors] = useState([]);
  const [visibledoctors, setVisibledoctors] = useState(6); // Initially show 6 doctors (2 rows)
  const [selecteddoctors, setSelecteddoctors] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState({
    role: '',
    experience: '',
    education: '',
    contact: '',
    email: '',
    workingTime: '',
    address: '',
    message: '',
    doctorId: '',
  });

  useEffect(() => {
    const fetchdoctors = async () => {
      try {
        const response = await axios.get('http://localhost:3005/hospital/get-showdr');
        const doctorsData = response.data.map((doctor) => ({
          ...doctor,
          img: imageMap[doctor.image] || himg, // Default image if not found
        }));
        setdoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchdoctors();
  }, []);

  const loadMore = () => {
    setVisibledoctors(doctors.length); // Show all doctors
  };

  const handledoctorsClick = (doctor) => {
    setSelecteddoctors(doctor);
    setShowForm(true);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const hospitalId = sessionStorage.getItem('Hospital_id');
    try {
      const response = await fetch('http://localhost:3005/hospital/request-doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: selecteddoctors.Doctor_id,
          hospitalId:hospitalId,
          role: doctorInfo.role,
          experience: doctorInfo.experience,
          education: doctorInfo.education,
          contact: doctorInfo.contact,
          email: doctorInfo.email,
          workingTime: doctorInfo.workingTime,
          address: doctorInfo.address,
          message: doctorInfo.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Error registering doctor');
      }

      // Assuming success, reset form and hide it
      setDoctorInfo({
        role: '',
        experience: '',
        education: '',
        contact: '',
        email: '',
        workingTime: '',
        address: '',
        message: '',
        doctorId: '',
      });
      setShowForm(false);
      setSelecteddoctors(null);
    } catch (error) {
      console.error('Error registering doctor:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="container">
      <div className="row">
        {doctors.slice(0, visibledoctors).map((doctor, index) => (
          <div key={index} className="col-md-3">
            <div className="card mb-4" style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}>
              <img src={doctor.img} className="card-img-top" alt={doctor.name} />
              <div
                className="card-body"
                style={{ cursor: 'pointer' }}
                onClick={() => handledoctorsClick(doctor)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handledoctorsClick(doctor);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <h4 className="card-title" style={{ color: '#0379b0', textAlign: 'center' }}>
                  <span style={{ fontWeight: '700' }}>
                    {doctor.firstName} {doctor.lastName}
                  </span>
                </h4>
                <br />
               
                <p className="card-text">Specialization :  {doctor.specialities}</p>
         
                <a href="#" className="card-text" style={{ float: 'right' }}>
                  View Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      {visibledoctors < doctors.length && (
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
                <h5 className="modal-title">Send request to doctor {selecteddoctors?.Nameofdoctors}</h5>
                <button type="button" className="close" aria-label="Close" onClick={() => setShowForm(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="doctorId">Doctor ID</label>
                    <input
                      type="text"
                      className="form-control"
                      id="doctorId"
                      value={selecteddoctors?.Doctor_id || ''}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <input
                      type="text"
                      className="form-control"
                      id="role"
                      name="role"
                      value={doctorInfo.role}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="experience">Required Experience (years)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="experience"
                      name="experience"
                      value={doctorInfo.experience}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="education">Education</label>
                    <input
                      type="text"
                      className="form-control"
                      id="education"
                      name="education"
                      value={doctorInfo.education}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact">Contact Number</label>
                    <input
                      type="phone"
                      className="form-control"
                      id="contact"
                      name="contact"
                      value={doctorInfo.contact}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={doctorInfo.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="workingTime">Working Time</label>
                    <input
                      type="text"
                      className="form-control"
                      id="workingTime"
                      name="workingTime"
                      value={doctorInfo.workingTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={doctorInfo.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <input
                      type="text"
                      className="form-control"
                      id="message"
                      name="message"
                      value={doctorInfo.message}
                      onChange={handleInputChange}
                      required
                    />
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
}

export default Showdoctors;
