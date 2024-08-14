import React, { useState, useEffect } from 'react';
import img1 from './Avatar.jpg';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import DeletePopup from '../../Popup/deletepopup';

function Appointments() {
  const [entriesPerPage, setEntriesPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [appointments, setAppointments] = useState([]);
  const [contactId, setContactId] = useState('');
  const [deleteAppointmentID, setDeleteAppointmentID] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [deletedAppointmentID, setDeletedAppointmentID] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // State to control delete popup 
  useEffect(() => {
    fetchAppointments();
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

      const response = await fetch(`http://localhost:3005/patient/getappointment/${contactId}`);
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
  const handleEditAppointment = (AppointmentID) => {
    navigate(`/addappointments/${AppointmentID}`);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch("http://localhost:3005/patient/delete-appointment", {
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


  return (
    <div className="container" style={{ background: 'transparent ' }}>
      <div className="content">
        <h6>Contact ID: {contactId}</h6>
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
                    <th onClick={() => handleSort('doctor')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
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
                      <td style={{ color: appointment.status === 'Canceled' ? 'red' : 'inherit' }}>{appointment.first_name} {appointment.last_name}</td>
                      <td style={{ color: appointment.status === 'Canceled' ? 'red' : 'inherit' }}>{appointment.department_name}</td>
                      <td style={{ color: appointment.status === 'Canceled' ? 'red' : 'inherit' }}>{new Date(appointment.date).toLocaleDateString()}</td>
                      <td style={{ color: appointment.status === 'Canceled' ? 'red' : 'inherit' }}>{adjustTimeWithTimeZone(appointment.time_slot)}</td>
                      <td style={{ color: appointment.status === 'Canceled' ? 'red' : 'inherit' }}>{appointment.status}</td>

                      <td className="text-right">
                        <div className="dropdown dropdown-action">
                          <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                            <i className="fa fa-ellipsis-v"></i>
                          </a>
                          <div className="dropdown-menu dropdown-menu-right">
                            <a className="dropdown-item" href="#" onClick={() => handleViewAppointment(appointment.AppointmentID)}>
                              <i className="fa fa-pencil m-r-5"></i> View
                            </a>
                            <a className="dropdown-item" href="#" onClick={() => handleEditAppointment(appointment.AppointmentID)}>
                              <i className="fa fa-pencil m-r-5"></i> Edit
                            </a>
                            <a className="dropdown-item" href="#" onClick={() => handleDeleteAppointment(appointment.AppointmentID)}>
                              <i className="fa fa-trash-o m-r-5"></i> Delete
                            </a>

                          </div>
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

    </div>
  );
}

export default Appointments;








