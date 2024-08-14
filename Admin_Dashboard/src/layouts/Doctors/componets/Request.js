import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import '../css/request.css'

function Request() {
  const [requestedDoctors, setRequestedDoctors] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    fetchRequestedDoctors();
  }, []);

  const fetchRequestedDoctors = async () => {
    try {
      const hospitalId = sessionStorage.getItem('Hospital_id');
      if (hospitalId) {
        const { data } = await axios.get(`http://localhost:3005/hospital/requested-doctors/${hospitalId}`);
        setRequestedDoctors(data);
      }
    } catch (error) {
      console.error('Error fetching requested doctors:', error);
    }
  };
  const approveDoctor = async (doctor) => {
    const hospitalId = sessionStorage.getItem('Hospital_id');
    try {
      await axios.post('http://localhost:3005/hospital/approve-doctor', { doctorID: doctor.DoctorID, hospitalID: hospitalId });
      setRequestedDoctors(requestedDoctors.map(d => d.DoctorID === doctor.DoctorID ? { ...d, Status: 'approved' } : d));
    } catch (error) {
      console.error('Error approving doctor:', error);
    }
  };
  
  const rejectDoctor = async (doctor) => {
    try {
      await axios.post('http://localhost:3005/hospital/reject-doctor', { doctorID: doctor.DoctorID, hospitalID: hospitalId });
      setRequestedDoctors(requestedDoctors.map(d => d.DoctorID === doctor.DoctorID ? { ...d, Status: 'rejected' } : d));
    } catch (error) {
      console.error('Error rejecting doctor:', error);
    }
  };
  

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const sortedDoctors = [...requestedDoctors].sort((a, b) => {
    if (sortConfig.direction === 'ascending') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    if (sortConfig.direction === 'descending') {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedDoctors.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentDoctors = sortedDoctors.slice(indexOfFirstEntry, indexOfLastEntry);

  const handleViewClick = async (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };
  
  const handleClose = () => setShowModal(false);

  return (
    <div className="container">
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
        {/* Add Appointments button */}
        <div className="col-lg-10 col-6 text-right m-b-20 d-flex justify-content-end">
        </div>
      </div>

      <h5 className="mt-4 mb-4">Requested Doctors</h5>
      <div className="table-responsive" style={{ background: 'transparent ', maxHeight: '500px', overflowY: 'auto' }}>
        <table className="table table-border datatable mb=0" style={{ width: '100%' }}>
          <thead className="sticky-top" style={{ zIndex: 1, backgroundColor: '#ccfff5' }}>
            <tr style={{ cursor: 'pointer' }}>
              <th onClick={() => handleSort('DoctorName')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                <span style={{ marginRight: '10px' }}>Doctor Name</span>
                <span>
                  <span style={{ color: sortConfig.key === 'DoctorName' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                  <span style={{ color: sortConfig.key === 'DoctorName' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                </span>
              </th>
              <th onClick={() => handleSort('Speciality')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                <span style={{ marginRight: '10px' }}>Speciality</span>
                <span>
                  <span style={{ color: sortConfig.key === 'Speciality' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                  <span style={{ color: sortConfig.key === 'Speciality' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                </span>
              </th>
              <th onClick={() => handleSort('Experience')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                <span style={{ marginRight: '10px' }}>Experience</span>
                <span>
                  <span style={{ color: sortConfig.key === 'Experience' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                  <span style={{ color: sortConfig.key === 'Experience' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                </span>
              </th>
              <th onClick={() => handleSort('Education')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                <span style={{ marginRight: '10px' }}>Education</span>
                <span>
                  <span style={{ color: sortConfig.key === 'Education' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                  <span style={{ color: sortConfig.key === 'Education' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                </span>
              </th>
              <th onClick={() => handleSort('Contact')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                <span style={{ marginRight: '10px' }}>Contact</span>
                <span>
                  <span style={{ color: sortConfig.key === 'Contact' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                  <span style={{ color: sortConfig.key === 'Contact' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                </span>
              </th>
              <th onClick={() => handleSort('Email')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                <span style={{ marginRight: '10px' }}>Email</span>
                <span>
                  <span style={{ color: sortConfig.key === 'Email' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                  <span style={{ color: sortConfig.key === 'Email' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                </span>
              </th>
              <th onClick={() => handleSort('AvailableTime')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                <span style={{ marginRight: '10px' }}>Available Time</span>
                <span>
                  <span style={{ color: sortConfig.key === 'AvailableTime' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                  <span style={{ color: sortConfig.key === 'AvailableTime' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                </span>
              </th>
              <th onClick={() => handleSort('Address')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                <span style={{ marginRight: '10px' }}>Address</span>
                <span>
                  <span style={{ color: sortConfig.key === 'Address' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                  <span style={{ color: sortConfig.key === 'Address' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                </span>
              </th>
              <th onClick={() => handleSort('Gender')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                <span style={{ marginRight: '10px' }}>Gender</span>
                <span>
                  <span style={{ color: sortConfig.key === 'Gender' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                  <span style={{ color: sortConfig.key === 'Gender' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                </span>
              </th>
              <th style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }} scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDoctors.map((doctor) => (
              <tr key={doctor.DoctorID} className={doctor.Status === 'approved' ? 'text-success' : doctor.Status === 'rejected' ? 'text-danger' : ''}>
                <td className={doctor.Status === 'approved' ? 'text-success' : doctor.Status === 'rejected' ? 'text-danger' : ''}> {doctor.DoctorName}</td>
                <td className={doctor.Status === 'approved' ? 'text-success' : doctor.Status === 'rejected' ? 'text-danger' : ''}>{doctor.Speciality}</td>
                <td className={doctor.Status === 'approved' ? 'text-success' : doctor.Status === 'rejected' ? 'text-danger' : ''}>{doctor.Experience}</td>
                <td className={doctor.Status === 'approved' ? 'text-success' : doctor.Status === 'rejected' ? 'text-danger' : ''}>{doctor.Education}</td>
                <td className={doctor.Status === 'approved' ? 'text-success' : doctor.Status === 'rejected' ? 'text-danger' : ''}>{doctor.Contact}</td>
                <td className={doctor.Status === 'approved' ? 'text-success' : doctor.Status === 'rejected' ? 'text-danger' : ''}>{doctor.Email}</td>
                <td className={doctor.Status === 'approved' ? 'text-success' : doctor.Status === 'rejected' ? 'text-danger' : ''}>{doctor.AvailableTime}</td>
                <td className={doctor.Status === 'approved' ? 'text-success' : doctor.Status === 'rejected' ? 'text-danger' : ''}>{doctor.Address}</td>
                <td className={doctor.Status === 'approved' ? 'text-success' : doctor.Status === 'rejected' ? 'text-danger' : ''}>{doctor.Gender}</td>
                <td>
                  <button className="btn btn-primary mr-2" onClick={() => handleViewClick(doctor)}>
                    View
                  </button>
                  <button className="btn btn-success mr-2" onClick={() => approveDoctor(doctor)}>
                    Approve
                  </button>
                  <button className="btn btn-danger" onClick={() => rejectDoctor(doctor)}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Doctor Details</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          {selectedDoctor && (
            <div>
              <p><strong>Doctor Name:</strong> {selectedDoctor.DoctorName}</p>
              <p><strong>Speciality:</strong> {selectedDoctor.Speciality}</p>
              <p><strong>Experience:</strong> {selectedDoctor.Experience}</p>
              <p><strong>Education:</strong> {selectedDoctor.Education}</p>
              <p><strong>Contact:</strong> {selectedDoctor.Contact}</p>
              <p><strong>Email:</strong> {selectedDoctor.Email}</p>
              <p><strong>Available Time:</strong> {selectedDoctor.AvailableTime}</p>
              <p><strong>Address:</strong> {selectedDoctor.Address}</p>
              <p><strong>Gender:</strong> {selectedDoctor.Gender}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <br></br>
      {/* Pagination */}
      <div className='row'>
        <div className="col-6 d-flex justify-content-start">
          <p>Showing {indexOfFirstEntry + 1} to {indexOfLastEntry > sortedDoctors.length ? sortedDoctors.length : indexOfLastEntry} of {sortedDoctors.length} entries</p>
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
  );
}

export default Request;
