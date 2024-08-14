import React, { useState, useEffect } from 'react';
import img1 from './Avatar.jpg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Patients() {
  const [entriesPerPage, setEntriesPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [patients, setPatients] = useState([]);
  const totalPages = Math.ceil(patients.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = patients.slice(indexOfFirstEntry, indexOfLastEntry);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const navigate = useNavigate();
  useEffect(() => {

    const fetchpatients = async () => {
      try {
        const response = await axios.get('http://localhost:3005/hospital/patients');
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchpatients();

  }, []);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedEntries = [...currentEntries].sort((a, b) => {
    if (sortConfig.direction === 'ascending') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    if (sortConfig.direction === 'descending') {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
    return 0;
  });


  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleEdit = (pat_id) => {
    navigate(`/addpatients/${pat_id}`);
  };

  const handleDeletePatients = async (pat_id) => {
    try {
      await axios.delete(`http://localhost:3005/hospital/patients/delete/${pat_id}`);

      console.log('patients deleted successfully');
    } catch (error) {
      console.error('Error deleting patients:', error);
    }
  };

  const calculateAge = (dob) => {
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    return age;
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
            <Link to={'/addpatients'} className="btn btn btn-success btn-rounded float-right">
              <i className="fa fa-plus"></i> Add Patient
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive" style={{ background: 'transparent ', maxHeight: '500px', overflowY: 'auto' }}>
              <table className="table table-border datatable mb-0" style={{ width: '100%' }}>
                <thead className="sticky-top" style={{ zIndex: 1, backgroundColor: '#ccfff5' }}>
                  <tr style={{ cursor: 'pointer' }}>
                    <th onClick={() => handleSort('firstName')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Name</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'firstName' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'firstName' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th onClick={() => handleSort('age')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Age</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'age' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'age' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th onClick={() => handleSort('address')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Address</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'address' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'address' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th onClick={() => handleSort('phone')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Phone</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'phone' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'phone' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th onClick={() => handleSort('email')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Email</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'email' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'email' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }} className="text-right">Action
                    </th>
                  </tr>

                </thead>
                <tbody>
                  {sortedEntries.map((patient, index) => (
                    <tr key={index}>
                      <td>
                        {patient.avatar ? (
                          <img
                            width="50"
                            height="50"
                            src={`http://localhost:3005${patient.avatar}`}
                            className="rounded-circle m-r-5"
                            alt=""
                            onError={(e) => {
                              console.error('Error loading image:', e);
                              console.log('Image path:', patient.avatar);
                              console.log('Full URL:', `http://localhost:3005${patient.avatar}`);
                            }}
                          />
                        ) : (
                          <img
                            width="50"
                            height="50"
                            src={img1}
                            className="rounded-circle m-r-5"
                            alt=""
                          />
                        )}
                        {patient.firstName} {patient.lastName}
                      </td>
                      <td>{calculateAge(patient.dob)}</td>
                      <td>{patient.address}</td>
                      <td>{patient.phone}</td>
                      <td>{patient.email}</td>
                      <td className="text-right">
                        <div className="dropdown dropdown-action">
                          <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                            <i className="fa fa-ellipsis-v"></i>
                          </a>
                          <div className="dropdown-menu dropdown-menu-right">
                            <button className="dropdown-item" onClick={() => handleEdit(patient.pat_id)}>
                              <i className="fa fa-pencil m-r-5"></i> Edit
                            </button>
                            <button className="dropdown-item" onClick={() => handleDeletePatients(patient.pat_id)}>
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
        <div className='row '>
          <div className='col-6 d-flex justify-content-start'>
            <p>Showing {indexOfFirstEntry + 1} to {indexOfLastEntry > patients.length ? patients.length : indexOfLastEntry} of {patients.length} entries</p>
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
      <div className="notification-box"></div>
      <div id="delete_patient" className="modal fade delete-modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <img src="assets/img/sent.png" alt="" width="50" height="46" />
              <h3>Are you sure want to delete this Patient?</h3>
              <div className="m-t-20">
                <a href="#" className="btn btn-white" data-dismiss="modal">
                  Close
                </a>
                <button type="submit" className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Patients;
