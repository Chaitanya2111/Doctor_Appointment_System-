import React, { useState, useEffect } from 'react';
import img1 from './Avatar.jpg';
import { Link } from 'react-router-dom';
import { FaRegEye, FaRegClock, FaRegCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeletePopup from '../popup/DeletePopup';
import '../css/Appointments.css';
import AcceptAppointmentPopup from '../popup/AcceptAppointmentPopup'
function Appointments() {
  const [entriesPerPage, setEntriesPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [appointments, setAppointments] = useState([]);
  const [contactId, setContactId] = useState('');
  const [deleteAppointmentID, setDeleteAppointmentID] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [deletedAppointmentID, setDeletedAppointmentID] = useState(null);
  const [showAcceptPopup, setShowAcceptPopup] = useState(false);
  const [acceptAppointmentID, setAcceptAppointmentID] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showTable, setShowTable] = useState(false);
  const [status, setStatus] = useState(''); // initial status
  useEffect(() => {
    fetchAppointments();
    console.log(setAcceptAppointmentID)
    const contactIdFromSession = sessionStorage.getItem('Contact_id');
    setContactId(contactIdFromSession);
  }, []);

  useEffect(() => {
    if (contactId) {
      fetchAppointments();
    }
  }, [contactId]);

  const fetchAppointments = async () => {
    try {

      const response = await fetch(`http://localhost:3005/doctor/appointments`);
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);

    }
  };




  const navigate = useNavigate();
  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    if (sortConfig.direction === 'ascending') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    if (sortConfig.direction === 'descending') {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedAppointments.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentAppointments = sortedAppointments.slice(indexOfFirstEntry, indexOfLastEntry);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const adjustTimeWithTimeZone = (timeString) => {
    const time = new Date(timeString);
    const offset = time.getTimezoneOffset() / 60;
    const adjustedTime = new Date(time.getTime() + offset * 60 * 60 * 1000);
    return adjustedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleViewAppointment = (AppointmentID) => {
    navigate(`/viewappointment/${AppointmentID}`);
  };
  // const handleEditAppointment = (AppointmentID) => {
  //   navigate(`/addappointments/${AppointmentID}`);
  // };

  const confirmDelete = async () => {
    try {
      const response = await fetch("http://localhost:3005/doctor/delete-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ AppointmentID: deleteAppointmentID }),
      });

      if (response.ok) {
        const updatedAppointments = appointments.map(appointment => {
          if (appointment.AppointmentID === deleteAppointmentID) {
            return { ...appointment, status: 'Canceled' };
          }
          return appointment;
        });
        console.log(setDeletedAppointmentID)
        setAppointments(updatedAppointments);
        setIsDeleted(true);
        setShowPopup(false); // Close the delete popup after successful delete
      } else {
        console.error("Failed to cancel appointment");
        // Handle error here
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      // Handle error here
    }
  };

  // Other functions...
  const handleDeleteAppointment = async (AppointmentID) => {
    // Set the appointment ID to delete and show the delete popup
    setDeleteAppointmentID(AppointmentID);
    setShowPopup(true);
  };

  const handleRightClick = (e, appointmentId) => {
    e.preventDefault();
    setAcceptAppointmentID(appointmentId);
    setShowAcceptPopup(true);
    console.log(status)
  };

  const handleAcceptAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:3005/doctor/accept-appointment/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Accepted' }),
      });

      if (response.ok) {
        const updatedAppointments = appointments.map((appointment) => {
          if (appointment.AppointmentID === appointmentId) {
            return { ...appointment, status: 'Accepted' };
          }
          return appointment;
        });

        setAppointments(updatedAppointments);
        setShowAcceptPopup(false); // Close the accept popup after successful acceptance
      } else {
        console.error('Failed to accept appointment');
        // Handle error here
      }
    } catch (error) {
      console.error('Error accepting appointment:', error);
      // Handle error here
    }
  };


  const handleFilterChange = (event) => {
    const selectedStatus = event.target.value;
    setFilterStatus(selectedStatus);
    setShowTable(selectedStatus === 'accepted' || selectedStatus === 'pending' || selectedStatus === 'Canceled');
  };

  const filteredAppointments = currentAppointments.filter(appointment => {
    if (filterStatus === 'all') {
      return true;
    } else {
      return appointment.status.toLowerCase() === filterStatus.toLowerCase();
    }
  });

  const handleStatusChange = async (appointmentID, newStatus) => {
    try {
      await axios.put(`http://localhost:3005/doctor/update-appointment-status/${appointmentID}`, { status: newStatus });
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.AppointmentID === appointmentID
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
      console.log(setStatus)
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };
  
  const handleCompletedClick = (appointmentID) => {
    handleStatusChange(appointmentID, 'completed');
  };
  
  const handleIncompletedClick = (appointmentID) => {
    handleStatusChange(appointmentID, 'incompleted');
  };

  return (
    <div className="container" style={{ background: 'transparent ' }}>
      <div className="content">
        <div className="row">
          <div className="col-lg-2 col-6">
            <p className="page-title">
              <select className="form-control select" onChange={(e) => setEntriesPerPage(Number(e.target.value))}>
                <option>-- Show Entries --</option>
                <option>10</option>
                <option>20</option>
                <option>30</option>
              </select>
            </p>
          </div>
          <div className="col-lg-10 col-6 text-right m-b-20 d-flex justify-content-end">
            <Link to={'/addappointments'} className="btn btn btn-primary btn-rounded float-right">
              <i className="fa fa-plus"></i> Add Appointments
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive" style={{ background: 'transparent ', maxHeight: '500px', overflowY: 'auto' }}>
              <table className="table table-border datatable mb-0" style={{ width: '100%' }}>

                <thead className="sticky-top" style={{ zIndex: 1, backgroundColor: '#cce0ff' }}>
                  <tr style={{ cursor: 'pointer' }}>
                    {/* <th onClick={() => handleSort('id')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Appointment ID</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'id' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'id' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th> */}
                    <th onClick={() => handleSort('patientName')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Patient Name</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'patientName' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'patientName' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    {/* <th onClick={() => handleSort('age')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Age</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'age' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'age' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th> */}
                    {/* <th onClick={() => handleSort('doctor')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Doctor Name</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'doctor' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'doctor' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th onClick={() => handleSort('department')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Department</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'department' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'department' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th> */}
                     <th onClick={() => handleSort('name')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                  <span style={{ marginRight: '10px' }}>Hospital</span>
                  <span>
                    <span style={{ color: sortConfig.key === 'name' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                    <span style={{ color: sortConfig.key === 'name' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                  </span>
                </th> 
                    <th onClick={() => handleSort('date')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Appointment Date</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'date' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'date' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>

                    <th onClick={() => handleSort('time_slot')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Appointment Time</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'time_slot' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'time_slot' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th onClick={() => handleSort('status')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Status</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'status' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'status' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>

                    <th style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }} className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAppointments.map((appointment, index) => (
                    <tr key={index} className={isDeleted && appointment.AppointmentID === deletedAppointmentID ? 'deleted-appointment' : ''}>
                      <td style={{ color: appointment.status === 'Canceled' ? 'red' : 'inherit' }}>
                        <img width="28" height="28" src={img1} className="rounded-circle m-r-5" alt="" />
                        {appointment.patientName}
                      </td>
                      {/* <td style={{ color: appointment.status === 'Canceled' ? 'red' : 'inherit' }}>{appointment.FirstName} {appointment.LastName}</td>
                      <td style={{ color: appointment.status === 'Canceled' ? 'red' : 'inherit' }}>{appointment.department_name}</td> */}
                      <td style={{ color: appointment.status === 'Canceled' ? 'red' : 'inherit' }}>{appointment.name}</td> 
                      <td style={{ color: appointment.status === 'Canceled' ? 'red' : 'inherit' }}>{new Date(appointment.date).toLocaleDateString()}</td>
                      <td style={{ color: appointment.status === 'Canceled' ? 'red' : 'inherit' }}>{adjustTimeWithTimeZone(appointment.time_slot)}</td>
                      <td style={{ color: appointment.status === 'Canceled' ? 'red' : 'inherit' }}>{appointment.status}</td>

                      <td>
                        <div className="action-icons">
                          <button className="btn btn-sm mr-2" onClick={() => handleViewAppointment(appointment.AppointmentID)}>
                            <div className="icon-container" style={{ backgroundColor: '#e0ffff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <i className="fas fa-eye" style={{ color: '#00FFFF', fontSize: "18px" }}></i>
                            </div>
                          </button>
                          {/* <button className="btn btn-sm mr-2" onClick={() => handleEditAppointment(appointment.AppointmentID)}>
                            <div className="icon-container" style={{ backgroundColor: '#e0ffff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <i className="fas fa-edit" style={{ color: '#00FFFF', fontSize: "18px" }}></i>
                            </div>
                          </button> */}
                          <button className="btn btn-sm" onClick={() => handleDeleteAppointment(appointment.AppointmentID)}>
                            <div className="icon-container" style={{ backgroundColor: '#fdd', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <i className="fas fa-trash" style={{ color: 'red', fontSize: "18px" }}></i>
                            </div>
                          </button>
                          <button className="btn btn-sm" onClick={(e) => handleRightClick(e, appointment.AppointmentID)}>
                            <div className="icon-container" style={{ backgroundColor: '#d9f9d9', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <i className="fas fa-check" style={{ color: 'green', fontSize: "18px" }}></i>
                            </div>
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <br></br>
        <div className="appointments-container">
      <div className="filters-container">
        <label htmlFor="status-filter">Filter by Status:</label>
        <select
          id="status-filter"
          value={filterStatus}
          onChange={handleFilterChange}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="Canceled">Canceled</option>
          <option value="accepted">Accepted</option>
        </select>
      </div>
      {showTable && (
        <div className="table-container">
          <table className="table table-border datatable mb-0" style={{ width: '100%' }}>
            <thead className="sticky-top" style={{ zIndex: 1, backgroundColor: '#cce0ff' }}>
              <tr style={{ cursor: 'pointer' }}>
                <th onClick={() => handleSort('patientName')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                  <span style={{ marginRight: '10px' }}>Patient Name</span>
                  <span>
                    <span style={{ color: sortConfig.key === 'patientName' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                    <span style={{ color: sortConfig.key === 'patientName' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                  </span>
                </th>
                {/* <th onClick={() => handleSort('doctor')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                  <span style={{ marginRight: '10px' }}>Doctor Name</span>
                  <span>
                    <span style={{ color: sortConfig.key === 'doctor' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                    <span style={{ color: sortConfig.key === 'doctor' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                  </span>
                </th>
                <th onClick={() => handleSort('department')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                  <span style={{ marginRight: '10px' }}>Department</span>
                  <span>
                    <span style={{ color: sortConfig.key === 'department' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                    <span style={{ color: sortConfig.key === 'department' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                  </span>
                </th> */}
                  <th onClick={() => handleSort('name')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                  <span style={{ marginRight: '10px' }}>Hospital</span>
                  <span>
                    <span style={{ color: sortConfig.key === 'name' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                    <span style={{ color: sortConfig.key === 'name' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                  </span>
                </th> 
                <th onClick={() => handleSort('date')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                  <span style={{ marginRight: '10px' }}>Appointment Date</span>
                  <span>
                    <span style={{ color: sortConfig.key === 'date' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                    <span style={{ color: sortConfig.key === 'date' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                  </span>
                </th>
                <th onClick={() => handleSort('time_slot')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                  <span style={{ marginRight: '10px' }}>Time Slot</span>
                  <span>
                    <span style={{ color: sortConfig.key === 'time_slot' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                    <span style={{ color: sortConfig.key === 'time_slot' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                  </span>
                </th>
                <th onClick={() => handleSort('status')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                  <span style={{ marginRight: '10px' }}>Status</span>
                  <span>
                    <span style={{ color: sortConfig.key === 'status' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                    <span style={{ color: sortConfig.key === 'status' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                  </span>
                </th>
                <th onClick={() => handleSort('Actions')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.AppointmentID}>
                  <td>{appointment.patientName}</td>
                  {/* <td>{appointment.FirstName} {appointment.LastName}</td>
                  <td>{appointment.department_name}</td> */}
                   <td>{appointment.name}</td> 
                  <td>{new Date(appointment.date).toLocaleDateString()}</td>
                  <td>{adjustTimeWithTimeZone(appointment.time_slot)}</td>
                  <td>{appointment.status}</td>
                  <td>
                    <div className="action-icons">
                      <button className="btn btn-sm mr-2" onClick={() => handleViewAppointment(appointment.AppointmentID)}>
                        <div className="icon-container" style={{ backgroundColor: '#e0ffff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FaRegEye style={{ color: '#00FFFF', fontSize: '18px' }} />
                        </div>
                      </button>
                      <button className="btn btn-sm" onClick= {() => handleCompletedClick (appointment.AppointmentID)}>
        <div className="icon-container" style={{ backgroundColor: '#d9f9d9', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FaRegCheckCircle style={{ color: 'green', fontSize: '18px' }} />
        </div>
      </button>
      <button className="btn btn-sm" onClick={ () =>handleIncompletedClick (appointment.AppointmentID)}>
        <div className="icon-container" style={{ backgroundColor: '#fdd', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FaRegClock style={{ color: 'red', fontSize: '18px' }} />
        </div>
      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    <br></br>
        {/* Pagination */}
        <div className='row'>
          <div className='col-6 d-flex justify-content-start'>
            <p>Showing {indexOfFirstEntry + 1} to {indexOfLastEntry > sortedAppointments.length ? sortedAppointments.length : indexOfLastEntry} of {sortedAppointments.length} entries</p>
          </div>
          <div className='col-6 d-flex justify-content-end'>
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <a className="page-link" href="#" aria-label="Previous" onClick={() => paginate(currentPage - 1)}>
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                    <a className="page-link" href="#" onClick={() => paginate(pageNumber)}>
                      {pageNumber}
                    </a>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <a className="page-link" href="#" aria-label="Next" onClick={() => paginate(currentPage + 1)}>
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Notification and Delete Modal */}
      <div className="notification-box"></div>
      <div id="delete_appointment" className="modal fade delete-modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <img src="assets/img/sent.png" alt="" width="50" height="46" />
              <h3>Are you sure want to delete this Appointment?</h3>
              <div className="m-t-20">
                <a href="#" className="btn btn-white" data-dismiss="modal">Close</a>
                <button type="submit" className="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeletePopup
        isOpen={showPopup}
        onRequestClose={() => setShowPopup(false)}
        message="Confirming deletion of this appointment. Do you wish to proceed?"
        onConfirm={confirmDelete}
      />
      <AcceptAppointmentPopup
        isOpen={showAcceptPopup}
        onRequestClose={() => setShowAcceptPopup(false)}
        appointmentId={acceptAppointmentID}
        onAccept={handleAcceptAppointment}
      />


    </div>
  );
}

export default Appointments;
