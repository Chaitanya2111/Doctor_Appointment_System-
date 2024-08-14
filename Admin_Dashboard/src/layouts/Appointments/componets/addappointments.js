import React, { useState, useEffect } from 'react';
import axios from 'axios';
function AddAppointments() {

  const [formData, setFormData] = useState({
    patientName: '',
    department: '',
    doctor: '',
    date: '',
    time: '',
    patientEmail: '',
    patientPhoneNumber: '',
    message: '',
    status: 'Active',
    AppointmentID: 'ATP--001',
  });

  useEffect(() => {
    fetchLatestAppointmentId();
  }, []);

  const fetchLatestAppointmentId = async () => {
    try {
      const response = await axios.get('http://localhost:3005/hospital/latest-appointment-id');
      const latestId = response.data.latestId;
      let nextId;
      if (latestId && latestId.startsWith('ATP-')) {
        const numericPart = parseInt(latestId.split('--')[1]);
        const nextNumericPart = numericPart + 1;
        const paddedNumericPart = String(nextNumericPart).padStart(3, '0');
        nextId = `ATP--${paddedNumericPart}`;
      } else {
        nextId = 'ATP--001';
      }
      setFormData(prevState => ({ ...prevState, AppointmentID: nextId }));
    } catch (error) {
      console.error('Error fetching latest appointment ID:', error);
    }
  };

  // const incrementAppointmentId = (latestId) => {
  //   const numericPart = parseInt(latestId.split('-')[1]);
  //   const nextNumericPart = numericPart + 1;
  //   const paddedNumericPart = String(nextNumericPart).padStart(3, '0');
  //   const nextId = `ATP-${paddedNumericPart}`;
  //   return nextId;
  // };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3005/hospital/submit-appointments', formData);
      console.log('Appointment created:', response.data);
      fetchLatestAppointmentId();
      setFormData({
        patientName: '',
        department: '',
        doctor: '',
        date: '',
        time: '',
        patientEmail: '',
        patientPhoneNumber: '',
        message: '',
        status: 'Active'
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:3005/hospital/patients');
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);


  const [departmentsData, setDepartmentsData] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:3005/hospital/departments');
        setDepartmentsData(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  const [doctorsData, setDoctorsData] = useState([]);

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


  return (
    <div className="container" style={{ backgroundColor: 'white' }}>
      <div className="row">

        <div className="col-lg-8 offset-lg-2"> <br></br>
          <h4 className="page-title">Add Appointment</h4><br></br>
        </div>

      </div>
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Appointment ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="AppointmentID"
                    value={formData.AppointmentID}
                    onChange={handleChange}
                    placeholder="Enter prefix"
                  />
                </div>
              </div>
              <div className="col-sm-6 col-md-6">
                <div className="form-group">
                  <label>Patient Name</label>
                  <select className="form-control" name="patientName" onChange={handleChange}>
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>{patient.firstName} {patient.lastName}</option>
                    ))}
                  </select>

                </div>
              </div>
              <div className="col-sm-6 col-md-6">
                <div className="form-group">
                  <label>Department</label>
                  <select className="form-control" name="department" onChange={handleChange} value={formData.department}>
                    <option value="">Select Department</option>
                    {departmentsData.map(department => (
                      <option key={department.id} value={department.id}>{department.department_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-sm-6 col-md-6">
                <div className="form-group">
                  <label>Doctor</label>
                  <select className="form-control" name="doctor" onChange={handleChange} value={formData.doctor}>
                    <option value="">Select Doctor</option>
                    {doctorsData.map(doctor => (
                      <option key={doctor.id} >{`${doctor.first_name} ${doctor.last_name}`}</option>
                    ))}
                  </select>

                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Date</label>
                  <div className="cal-icon">
                    <input type="date" className="form-control datetimepicker" name="date" onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Time</label>
                  <div className="time-icon">
                    <input type="time" className="form-control" id="datetimepicker3" name="time" onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Patient Email</label>
                  <input className="form-control" type="email" name="patientEmail" onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Patient Phone Number</label>
                  <input className="form-control" type="text" name="patientPhoneNumber" onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label>Message</label>
                  <textarea cols="30" rows="4" className="form-control" name="message" onChange={handleChange}></textarea>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label className="display-block">Appointment Status:</label>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="status" id="product_active" value="Active" checked onChange={handleChange} />
                    <label className="form-check-label" htmlFor="product_active">Active</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="status" id="product_inactive" value="Inactive" onChange={handleChange} />
                    <label className="form-check-label" htmlFor="product_inactive">Inactive</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="m-t-20 text-center">
              <button type="submit" className="btn btn-success submit-btn">Create Appointment</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAppointments;

