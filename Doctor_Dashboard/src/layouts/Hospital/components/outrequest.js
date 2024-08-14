import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';


function Outrequest() {
  const [requestedHospitals, setRequestedHospitals] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    fetchRequestedHospitals();
  }, []);

  const fetchRequestedHospitals = async () => {
    try {
      const doctorId = sessionStorage.getItem('Doctor_id');
      if (doctorId) {
        const { data } = await axios.get(`http://localhost:3005/doctor/requested-Hospitals/${doctorId}`);
        setRequestedHospitals(data);
      }
    } catch (error) {
      console.error('Error fetching requested Hospitals:', error);
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

  const sortedHospitals = [...requestedHospitals].sort((a, b) => {
    if (sortConfig.direction === 'ascending') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    if (sortConfig.direction === 'descending') {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedHospitals.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentHospitals = sortedHospitals.slice(indexOfFirstEntry, indexOfLastEntry);

  const handleViewClick = async (Hospitals) => {
    setSelectedDoctor(Hospitals);
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);

  return (
    <div className="container">
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
        </div>
      </div>

      <h5 className="mt-4 mb-4">Requested Hospitals</h5>
      <div className="table-responsive" style={{ background: 'transparent ', maxHeight: '500px', overflowY: 'auto' }}>
        <table className="table table-border datatable mb=0" style={{ width: '100%' }}>
          <thead className="sticky-top" style={{ zIndex: 1, backgroundColor: '#cce0ff' }}>
            <tr style={{ cursor: 'pointer' }}>
            <th onClick={() => handleSort('name')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                <span style={{ marginRight: '10px' }}>Hospital Name</span>
                <span>
                  <span style={{ color: sortConfig.key === 'name' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                  <span style={{ color: sortConfig.key === 'name' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                </span>
              </th>
              <th onClick={() => handleSort('DoctorName')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                <span style={{ marginRight: '10px' }}>Doctor Name</span>
                <span>
                  <span style={{ color: sortConfig.key === 'DoctorName' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                  <span style={{ color: sortConfig.key === 'DoctorName' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                </span>
              </th>
              <th onClick={() => handleSort('Speciality')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                <span style={{ marginRight: '10px' }}>Speciality</span>
                <span>
                  <span style={{ color: sortConfig.key === 'Speciality' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                  <span style={{ color: sortConfig.key === 'Speciality' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                </span>
              </th>
              <th onClick={() => handleSort('Experience')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                <span style={{ marginRight: '10px' }}>Experience</span>
                <span>
                  <span style={{ color: sortConfig.key === 'Experience' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                  <span style={{ color: sortConfig.key === 'Experience' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                </span>
              </th>
              {/* <th onClick={() => handleSort('Education')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                <span style={{ marginRight: '10px' }}>Education</span>
                <span>
                  <span style={{ color: sortConfig.key === 'Education' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                  <span style={{ color: sortConfig.key === 'Education' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                </span>
              </th> */}
              
              <th onClick={() => handleSort('Contact')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                <span style={{ marginRight: '10px' }}>Contact</span>
                <span>
                  <span style={{ color: sortConfig.key === 'Contact' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                  <span style={{ color: sortConfig.key === 'Contact' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                </span>
              </th>
              {/* <th onClick={() => handleSort('Email')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                <span style={{ marginRight: '10px' }}>Email</span>
                <span>
                  <span style={{ color: sortConfig.key === 'Email' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                  <span style={{ color: sortConfig.key === 'Email' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                </span>
              </th> */}
              <th onClick={() => handleSort('AvailableTime')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                <span style={{ marginRight: '10px' }}>Available Time</span>
                <span>
                  <span style={{ color: sortConfig.key === 'AvailableTime' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                  <span style={{ color: sortConfig.key === 'AvailableTime' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                </span>
              </th>
              {/* <th onClick={() => handleSort('Address')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                <span style={{ marginRight: '10px' }}>Address</span>
                <span>
                  <span style={{ color: sortConfig.key === 'Address' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                  <span style={{ color: sortConfig.key === 'Address' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                </span>
              </th>
              <th onClick={() => handleSort('Gender')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                <span style={{ marginRight: '10px' }}>Gender</span>
                <span>
                  <span style={{ color: sortConfig.key === 'Gender' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                  <span style={{ color: sortConfig.key === 'Gender' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                </span>
              </th> */}
              <th style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }} scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentHospitals.map((Hospitals) => (
              <tr key={Hospitals.DoctorID} className={Hospitals.Status === 'approved' ? 'text-success' : Hospitals.Status === 'rejected' ? 'text-danger' : ''}>
                                <td className={Hospitals.Status === 'approved' ? 'text-success' : Hospitals.Status === 'rejected' ? 'text-danger' : ''}>{Hospitals.name}</td>
                <td className={Hospitals.Status === 'approved' ? 'text-success' : Hospitals.Status === 'rejected' ? 'text-danger' : ''}> {Hospitals.DoctorName}</td>
                <td className={Hospitals.Status === 'approved' ? 'text-success' : Hospitals.Status === 'rejected' ? 'text-danger' : ''}>{Hospitals.Speciality}</td>
                <td className={Hospitals.Status === 'approved' ? 'text-success' : Hospitals.Status === 'rejected' ? 'text-danger' : ''}>{Hospitals.Experience}</td>
                {/* <td className={Hospitals.Status === 'approved' ? 'text-success' : Hospitals.Status === 'rejected' ? 'text-danger' : ''}>{Hospitals.Education}</td> */}
                <td className={Hospitals.Status === 'approved' ? 'text-success' : Hospitals.Status === 'rejected' ? 'text-danger' : ''}>{Hospitals.Contact}</td>
                {/* <td className={Hospitals.Status === 'approved' ? 'text-success' : Hospitals.Status === 'rejected' ? 'text-danger' : ''}>{Hospitals.Email}</td> */}
                <td className={Hospitals.Status === 'approved' ? 'text-success' : Hospitals.Status === 'rejected' ? 'text-danger' : ''}>{Hospitals.AvailableTime}</td>
                {/* <td className={Hospitals.Status === 'approved' ? 'text-success' : Hospitals.Status === 'rejected' ? 'text-danger' : ''}>{Hospitals.Address}</td>
                <td className={Hospitals.Status === 'approved' ? 'text-success' : Hospitals.Status === 'rejected' ? 'text-danger' : ''}>{Hospitals.Gender}</td> */}
                <td>
                <button className="btn btn-primary mr-2" onClick={() => handleViewClick(Hospitals)}>
                    View
                  </button>
                  <button className="btn btn-danger">
                    Cansle
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
          <p>Showing {indexOfFirstEntry + 1} to {indexOfLastEntry > sortedHospitals.length ? sortedHospitals.length : indexOfLastEntry} of {sortedHospitals.length} entries</p>
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

export default Outrequest;
