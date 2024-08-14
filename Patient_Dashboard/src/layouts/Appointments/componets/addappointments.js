import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AddPointment.css'
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Popup from '../../Popup/popup';

function AddAppointments() {
  const location = useLocation();
  const { appointmentId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const initialDoctor = queryParams.get('doctor');
  const initialDepartment = queryParams.get('department');
  const [contactId, setContactId] = useState('');

  useEffect(() => {
    fetchLatestAppointmentId();
    const contactIdFromSession = sessionStorage.getItem('Contact_id');
    setContactId(contactIdFromSession);
  }, []);


  const [formData, setFormData] = useState({
    patientName: '',
    doctor: initialDoctor || '',
    department: initialDepartment || '',
    date: '',
    patientEmail: '',
    patientPhoneNumber: '',
    message: '',
    address: '',
    status: 'Pending',
    type: '',
    AppointmentID: 'ATP--001',
    time_slot: ''
  });

  useEffect(() => {
    fetchAppointmentDetails();
  }, [appointmentId]);

  useEffect(() => {
    fetchLatestAppointmentId();
  }, []);

  const fetchAppointmentDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3005/patient/appointment-details/${appointmentId}`);
      const appointmentData = response.data;

      if (appointmentData.date) {
        const formattedDate = new Date(appointmentData.date);

        setFormData(prevState => ({
          ...prevState,
          ...appointmentData,
          date: formattedDate.toISOString().substr(0, 10),
          time_slot: appointmentData.time_slot,
          patientEmail: appointmentData.patientEmail,
          patientPhoneNumber: appointmentData.patientPhoneNumber,
          message: appointmentData.message,
          address: appointmentData.address,
        }));

        // Fetch booked slots for the pre-filled date and doctor
        fetchBookedSlots(formattedDate.toISOString().split('T')[0], appointmentData.doctor);
      } else {
        console.error('Date field is missing in appointmentData');
      }
    } catch (error) {
      console.error('Error fetching appointment details:', error);
    }
  };



  const fetchLatestAppointmentId = async () => {
    try {
      const response = await axios.get('http://localhost:3005/patient/latest-appointment-id');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date') {
      const formattedDate = new Date(value).toISOString().split('T')[0];
      setFormData({ ...formData, [name]: formattedDate });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const timeParts = formData.time.split(':');
      const formattedTime = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}:00`;

      if (appointmentId) {

        const response = await axios.put(`http://localhost:3005/patient/appointments/${appointmentId}`, {
          ...formData,
          date: formattedDate,
          time_slot: formattedTime,
          Contact_id: contactId
        });
        setShowPopup(true);
        console.log('Appointment updated:', response.data);
      } else {

        const response = await axios.post('http://localhost:3005/patient/submit-appointments', {
          ...formData,
          date: formattedDate,
          time_slot: formattedTime,
          Contact_id: contactId
        });
        setShowPopup(true);
        console.log('Appointment created:', response.data);
      }

      fetchLatestAppointmentId();
      setFormData({
        patientName: '',
        department: '',
        doctor: '',
        date: '',
        patientEmail: '',
        patientPhoneNumber: '',
        message: '',
        address: '',
        status: '',
        type: '',
        time_slot: '' // Clear the selected time slot if needed
      });
    } catch (error) {
      console.error('Error submitting appointment:', error);
    }
  };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {

  //     const formattedDate = selectedDate.toISOString().split('T')[0];
  //     const timeParts = formData.time.split(':');
  //     const formattedTime = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}:00`;

  //     const response = await axios.post('http://localhost:3005/submit-appointments', {
  //       ...formData,
  //       date: formattedDate,
  //       time_slot: formattedTime,
  //       Contact_id: contactId

  //     });
  //     setShowPopup(true);
  //     console.log('Appointment created:', response.data);
  //     fetchLatestAppointmentId();
  //     setFormData({

  //       patientName: '',
  //       department: '',
  //       doctor: '',
  //       date: '',
  //       patientEmail: '',
  //       patientPhoneNumber: '',
  //       message: '',
  //       address: '',
  //       status: '',
  //       type: '',
  //       time_slot: '' // Clear the selected time slot if needed
  //     });
  //   } catch (error) {
  //     console.error('Error creating appointment:', error);
  //   }
  // };

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
  }, []); const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    // Your existing code
  }, []);

  // Fetch doctors based on the selected department
  useEffect(() => {
    if (formData.department) {
      fetchDoctorsByDepartment(formData.department);
    }
  }, [formData.department]);

  const fetchDoctorsByDepartment = async (departmentName) => {
    try {
      const response = await axios.get(`http://localhost:3005/api/doctors?departmentName=${departmentName}`);
      setFilteredDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors by department:', error);
    }
  };

  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {

    fetchBookedSlots(selectedDate.toISOString().split('T')[0]);
  }, [selectedDate]);

  // const handleDateChange = (e) => {
  //   const selectedDate = new Date(e.target.value);
  //   setSelectedDate(selectedDate);
  // };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setFormData({ ...formData, date: e.target.value }); // Update formData.date
    setSelectedDate(selectedDate);
  };

  const fetchBookedSlots = async (selectedDate, doctorId = '') => {
    try {
      const response = await axios.get(`http://localhost:3005/patient/booked-slots`, {
        params: {
          date: selectedDate,
          doctorId: doctorId // Pass the doctorId if provided
        }
      });
      setBookedSlots(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
    }
  };

  useEffect(() => {
    fetchBookedSlots(selectedDate.toISOString().split('T')[0], formData.doctor); // Pass the doctor's ID
  }, [selectedDate, formData.doctor]); // Include formData.doctor in dependencies
  const [showAllSlots, setShowAllSlots] = useState(false);


  const renderTimeSlots = () => {
    const startTime = 9; // Start time in 24-hour format (9:00 AM)
    const endTime = 17; // End time in 24-hour format (5:00 PM)
    const maxSlotsToShow = 4; // Maximum slots to show initially

    const slots = [];
    for (let hour = startTime; hour < endTime; hour++) {
      for (let minute = 0; minute < 60; minute += 15) { // Increment by 15 minutes
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const isBooked = bookedSlots && bookedSlots.includes(time); // Check if slot is booked
        const isCurrentDate = selectedDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
        if (slots.length < maxSlotsToShow || showAllSlots) {
          slots.push(
            <button
              key={time}
              type="button"
              value={formData.time_slot}
              className={`btn ${isBooked ? 'booked-slot' : 'btn-success'}`}
              disabled={isBooked && isCurrentDate}
              onClick={(e) => handleTimeSlotSelect(time, e)}
              required
              style={{
                backgroundColor: isBooked ? "#f2110a" : "lightgreen",
                border: "2px solid green"
              }}
            >
              {time}
            </button>
          );
        }
      }
    }
    return slots;
  };


  const handleTimeSlotSelect = (time, e) => {
    e.preventDefault();
    setFormData({ ...formData, time: time });
    e.target.style.backgroundColor = 'darkgreen';
  };


  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="container" style={{ backgroundColor: 'white' }}>
      <div className="row">
        <Popup isOpen={showPopup} onRequestClose={() => setShowPopup(false)} message="Your appointment is submitted!" />

        <div className="col-lg-8 offset-lg-2"> <br></br>
          <h4 className="page-title-apoointment">Add Appointment</h4><br></br>
        </div>

      </div>
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className='form-label'>Appointment ID</label>
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
                  <label className='form-label'>Patient Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    placeholder="Enter Patient Name"
                    required
                  />
                </div>

              </div>
              <div className="col-sm-6 col-md-6">
                <div className="form-group">
                  <label className='form-label'>Department</label>
                  <select className="form-control" name="department" onChange={handleChange} required value={formData.department}>
                    <option value="">Select Department</option>
                    {departmentsData.map(department => (
                      <option key={department.dep_id} value={department.dep_id}>{department.department_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-sm-6 col-md-6">
                <div className="form-group">
                  <label className='form-label'>Doctor</label>
                  <select className="form-control" name="doctor" onChange={handleChange} value={formData.doctor} required>
                    <option value="">Select Doctor</option>
                    {filteredDoctors.map(doctor => (
                      <option key={doctor.id} value={`${doctor.id}`}>{`${doctor.first_name} ${doctor.last_name}`}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label className='form-label'>Date</label>
                  <div className="cal-icon">
                    <input
                      type="date"
                      className="form-control datetimepicker"
                      name="date"
                      onChange={handleDateChange}
                      value={formData.date || selectedDate.toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label className='form-label'>Patient Email</label>
                  <input className="form-control" type="email" value={formData.patientEmail} name="patientEmail" onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className='form-label'>Patient Phone Number</label>
                  <input className="form-control" type="text" value={formData.patientPhoneNumber} name="patientPhoneNumber" onChange={handleChange} />
                </div>
              </div>
              <div className="col-sm-6 col-md-6">
                <div className="form-group">
                  <label className='form-label'>Appointment Type</label>
                  <select className="form-control" name="type" onChange={handleChange} value={formData.type} required>
                    <option>Select Type</option>
                    <option>Urgent care</option>
                    <option>Annual physicals</option>

                  </select>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label className='form-label'>Address</label>
                  <textarea cols="30" rows="2" className="form-control" value={formData.address} name="address" onChange={handleChange} required></textarea>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label className='form-label'>Message</label>
                  <textarea cols="30" rows="3" className="form-control" value={formData.message} name="message" onChange={handleChange}></textarea>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label className='form-label'>Select Time</label>
                    <div className="time-slots">
                      {renderTimeSlots()}
                      {!showAllSlots && (
                        <button className="btn btn-primary" onClick={() => setShowAllSlots(true)}>
                          Load More
                        </button>
                      )}
                    </div>

                  </div>

                </div>
                <br></br>
                <h6 className="text-danger">Red-colored slots are booked</h6>
              </div>
            </div>
            <div className="m-t-20 text-center">
              <button type="submit" className="btn btn-primary submit-btn">Create Appointment</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAppointments;

