import React, { useState } from 'react';
import img1 from './Avatar.jpg';
import { Link } from 'react-router-dom';
import AppointmentCard from './appointmentcard';
import axios from 'axios';

function Appointments() {
  const [entriesPerPage, setEntriesPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointments, setAppointments] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });



  const fetchappointment = async () => {
    try {
      const response = await axios.get('http://localhost:3005/hospital/getappointment');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  fetchappointment();

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
  const handleDeleteAppointments = async (id) => {
    try {
      await axios.delete(`http://localhost:3005/hospital/appointment/delete/${id}`);

      console.log('appointment deleted successfully');
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const adjustTimeWithTimeZone = (timeString) => {
    const time = new Date(timeString);
    const offset = time.getTimezoneOffset() / 60;
    const adjustedTime = new Date(time.getTime() + offset * 60 * 60 * 1000);
    return adjustedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container" style={{ background: 'transparent ' }}>
      <div className="content">
        {/* Header */}
        <div className="row">
          {/* Entries per page dropdown */}
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
          {/* Add Appointments button */}
          <div className="col-lg-10 col-6 text-right m-b-20 d-flex justify-content-end">
            <Link to={'/addappointments'} className="btn btn btn-success btn-rounded float-right">
              <i className="fa fa-plus"></i> Add Appointments
            </Link>
          </div>
        </div>

        {/* Appointments table */}
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive" style={{ background: 'transparent ', maxHeight: '500px', overflowY: 'auto' }}>
              <table className="table table-border datatable mb-0" style={{ width: '100%' }}>

                <thead className="sticky-top" style={{ zIndex: 1, backgroundColor: '#ccfff5' }}>
                  <tr style={{ cursor: 'pointer' }}>
                    <th onClick={() => handleSort('id')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>ID</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'id' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'id' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th onClick={() => handleSort('patientName')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Patient Name</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'patientName' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'patientName' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th onClick={() => handleSort('age')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Age</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'age' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'age' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th onClick={() => handleSort('doctorName')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Doctor Name</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'doctorName' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'doctorName' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th onClick={() => handleSort('department')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Department</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'department' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'department' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th onClick={() => handleSort('date')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Appointment Date</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'date' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'date' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>

                    <th onClick={() => handleSort('time')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Appointment Time</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'time' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'time' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th onClick={() => handleSort('status')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Status</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'status' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'status' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>

                    <th style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }} className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAppointments.map((appointment, index) => (
                    <tr key={index}>
                      <td>{appointment.AppointmentID}</td>
                      <td>
                        <img width="28" height="28" src={img1} className="rounded-circle m-r-5" alt="" />
                        {appointment.patientName}
                      </td>
                      <td>{appointment.age}</td>
                      <td>{appointment.first_name} {appointment.last_name}</td>
                      <td>{appointment.department_name}</td>
                      <td>{new Date(appointment.date).toLocaleDateString()}</td>
                      <td>{adjustTimeWithTimeZone(appointment.time_slot)}</td>
                      <td>{appointment.status}</td>
                      <td className="text-right">
                        <div className="dropdown dropdown-action">
                          <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                            <i className="fa fa-ellipsis-v"></i>
                          </a>
                          <div className="dropdown-menu dropdown-menu-right">
                            <a className="dropdown-item" href="edit-appointment.html">
                              <i className="fa fa-pencil m-r-5"></i> Edit
                            </a>
                            <button className="dropdown-item" onClick={() => handleDeleteAppointments(appointment.id)}>
                              <i className="fa fa-trash-o m-r-5"></i> Delete
                            </button>
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
      <AppointmentCard></AppointmentCard>
    </div>
  );
}

export default Appointments;








