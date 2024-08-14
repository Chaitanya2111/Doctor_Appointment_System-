import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa'; // Import calendar icon
import '../css/Addleave.css';
import axios from 'axios';

const AddLeaveForm = () => {
  const { id } = useParams(); // Get the ID from URL parameters

  const [leaveType, setLeaveType] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const totalLeaves = 24; // Assuming 24 total leaves for now
  const [remainingLeaves, setRemainingLeaves] = useState(totalLeaves);

  useEffect(() => {
    if (id) {
      // Fetch leave entry data based on ID from your backend API
      const fetchLeaveEntry = async () => {
        try {
          const response = await axios.get(`http://localhost:3005/api/leave-requests/${id}`);
          const leaveData = response.data; // Assuming your API returns leave data
          // Populate form fields with the retrieved data
          setLeaveType(leaveData.leaveType);
          setLeaveReason(leaveData.leaveReason);
          setFromDate(new Date(leaveData.fromDate));
          setToDate(new Date(leaveData.toDate));
          setNumberOfDays(leaveData.numberOfDays);
          // Calculate remaining leaves based on fetched leave data
          const remaining = totalLeaves - leaveData.numberOfDays;
          setRemainingLeaves(remaining);
        } catch (error) {
          console.error('Error fetching leave entry:', error);
        }
      };

      fetchLeaveEntry();
    }
  }, [id, totalLeaves]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validation to check if required fields are not empty
    if (!leaveType || !fromDate || !toDate || !numberOfDays || !leaveReason) {
      alert('Please fill in all required fields.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3005/api/add-leave', {
        leaveType,
        leaveReason,
        fromDate,
        toDate,
        numberOfDays
      });
  
      if (response.status === 201) { // Changed status check to 201 for successful insertion
        alert('Leave added successfully');
        // Optionally, reset form fields after successful submission
        setLeaveType('');
        setLeaveReason('');
        setFromDate(null);
        setToDate(null);
        setNumberOfDays(0);
        setRemainingLeaves(totalLeaves);
        setIsEditMode(false);
      }
    } catch (error) {
      console.error('Error adding leave:', error);
      alert('Error adding leave. Please try again.');
    }
  };

  useEffect(() => {
    calculateNumberOfDays();
  }, [fromDate, toDate]);

  const calculateNumberOfDays = () => {
    if (fromDate && toDate) {
      const diffTime = Math.abs(toDate - fromDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNumberOfDays(diffDays);
      const remaining = totalLeaves - diffDays;
      setRemainingLeaves(remaining);
    } else {
      setNumberOfDays(0);
    }
  };

  return (
    <div className="content">
      <div className="row-leave">
        <div className="col-lg-8 offset-lg-2">
        <h3 className="page-title">{id ? 'Edit Leave' : 'Add Leave'}</h3>
        </div>
      </div>
      <div className="row-leave">
        <div className="col-lg-8 offset-lg-2">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label style={{ fontSize: "20px" }}>Leave Type <span className="text-danger">*</span></label>
              <select
                className="select select2-hidden-accessible"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                style={{ fontSize: "20px" }}
              >
                <option className='option' >Select Leave Type</option>
                <option className='option'>Casual Leave 12 Days</option>
                <option className='option'>Medical Leave</option>
                <option className='option'>Loss of Pay</option>
              </select>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label style={{ fontSize: "20px" }}>From<span className="text-danger">*</span></label>
                <div className="form-group form-focus">
                  <div className="input-with-icon">
                    <DatePicker
                      className="form-control floating datetimepicker"
                      selected={fromDate}
                      onChange={date => {
                        setFromDate(date);
                      }}
                      placeholderText="From"
                      dateFormat="dd/MM/yyyy"
                    />
                    <FaCalendarAlt className="calendar-icon" />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <label style={{ fontSize: "20px" }}>To<span className="text-danger">*</span></label>
                <div className="form-group form-focus" >
                  <div className="input-with-icon" >
                    <DatePicker
                      className="form-control floating datetimepicker"
                      selected={toDate}
                      onChange={date => {
                        setToDate(date);
                      }}
                      placeholderText="To"
                      dateFormat="dd/MM/yyyy"
                    />
                    <FaCalendarAlt className="calendar-icon" />
                  </div>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className="col-md-6">
                <div className="form-group form-focus">
                  <label style={{ fontSize: "20px" }}>Number of days <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    value={numberOfDays}
                    readOnly
                    style={{ backgroundColor: "#fff" }}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group form-focus">
                  <label style={{ fontSize: "20px" }}>Remaining Leaves <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    value={remainingLeaves}
                    readOnly
                    style={{ backgroundColor: "#fff" }}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label style={{ fontSize: "20px" }}>Leave Reason <span className="text-danger">*</span></label>
              <textarea
                rows="4"
                cols="5"
                className="form-control"
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                style={{ backgroundColor: "#fff" }}
              ></textarea>
            </div>
            <div className="m-t-20 text-center">
              <button type="submit" className="btn btn-success submit-btn" style={{ fontSize: "20px", fontWeight: "600" }}>
                {id ? 'UPDATE LEAVE' : 'SEND LEAVE REQUEST'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLeaveForm;
