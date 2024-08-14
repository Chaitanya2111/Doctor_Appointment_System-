
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Outrequest = () => {
  // const [hospitals, setHospitals] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [requestedhospitals, setRequestedhospitals] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchRequestedhospitals();
    fetchhospitals();
  }, []);

  const fetchRequestedhospitals = async () => {
    try {
      const { data } = await axios.get('http://localhost:3005/hospital/requested-hospitals');
      setRequestedhospitals(data);
      console.log(hospitals)
    } catch (error) {
      console.error('Error fetching requested hospitals:', error);
    }
  };

  const fetchhospitals = async () => {
    try {
      const { data } = await axios.get('http://localhost:3005/api/hospitals');
      setHospitals(data);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    }
  };
 
  // const updatehospitalsList = async () => {
  //   try {
  //     const { data } = await axios.get('http://localhost:3005/api/hospitals');
  //     setHospitals(data);
  //   } catch (error) {
  //     console.error('Error updating hospitals list:', error);
  //   }
  // };

 

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedrequestedhospitals = [...requestedhospitals].sort((a, b) => {
    if (sortConfig.direction === 'ascending') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    if (sortConfig.direction === 'descending') {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
    return 0;
  });

  const totalPages = Math.ceil(requestedhospitals.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  
  const currentrequestedhospitals = sortedrequestedhospitals.slice(indexOfFirstEntry, indexOfLastEntry);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  return (
    <div className="container">
      <h5 className="mt-4 mb-4">Requested hospitals</h5>
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
           
          </div>
        </div>
      <div className='table-responsive'>
      <table className="table table-striped ">
        {/* <thead>
          <tr>
          
            <th scope="col">Speciality</th>
            <th scope="col">Experience</th>
            <th scope="col">Education</th>
            <th scope="col">Contact</th>
            <th scope="col">Email</th>
            <th scope="col">Working Time</th>
            <th scope="col">Address</th>
            <th scope="col">Message</th>
            <th scope="col">Actions</th>
          </tr>
        </thead> */}
        <thead className="sticky-top" style={{ zIndex: 1, backgroundColor: '#ccfff5' }}>
                  <tr style={{ cursor: 'pointer' }}>
                    
                    <th onClick={() => handleSort('Role')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Speciality</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'Role' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'Role' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
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
                    <th onClick={() => handleSort('ContactNo')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Contact</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'ContactNo' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'ContactNo' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>

                    <th onClick={() => handleSort('Email')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Email</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'Email' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'Email' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th onClick={() => handleSort('WTime')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Working Time</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'WTime' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'WTime' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th onClick={() => handleSort('Address')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Address</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'Address' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'Address' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th onClick={() => handleSort('Message')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Message</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'Message' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'Message' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    

                    <th style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }} className="text-right">Action</th>
                  </tr>
                </thead>
        <tbody>
          {currentrequestedhospitals.map((hospital) => (
            <tr key={hospital.hospitalID}>
              <td>{hospital.Role}</td>
              <td>{hospital.Experience}</td>
              <td>{hospital.Education}</td>
              <td>{hospital.ContactNo}</td>
              <td>{hospital.Email}</td>
              <td>{hospital.WTime}</td>
              <td>{hospital.Address}</td>
              <td>{hospital.Message}</td>
              <td>
                
                <button className="btn btn-danger">
                  Cancle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
<br></br>
      <div className='row'>
          <div className='col-6 d-flex justify-content-start'>
            <p>Showing {indexOfFirstEntry + 1} to {indexOfLastEntry > requestedhospitals.length ? requestedhospitals.length : indexOfLastEntry} of {requestedhospitals.length} entries</p>
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
};

export default Outrequest;
