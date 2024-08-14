import React, { useState } from 'react';
import img1 from './Avatar.jpg';
import { Link } from 'react-router-dom';

function DoctorSchedule() {
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  // Sample schedule data
  const scheduleData = [
    {
      doctorName: 'aennifer zobinson',
      age: 35,
      associatedDoctor: 'genry daniels',
      department: 'lardiology',
      availableDays: '20 Dec 2018',
      availableTime: '10:00am - 11:00am',
      status: 'Inactive',
    },

    {
      doctorName: 'Jennifer Robinson',
      age: 40,
      associatedDoctor: 'Henry Daniels',
      department: 'Cardiology',
      availableDays: '30 Dec 2018',
      availableTime: '10:00am - 11:00am',
      status: 'Active',
    },

    {
      doctorName: 'bennifer mobinson',
      age: 49,
      associatedDoctor: 'jenry kaniels',
      department: 'wardiology',
      availableDays: '10 Dec 2019',
      availableTime: '10:30am - 12:00am',
      status: 'Active',
    },

    {
      doctorName: 'John Doe',
      age: 16,
      associatedDoctor: 'Venry paniels',
      department: 'sardiology',
      availableDays: '12 Dec 2022',
      availableTime: '10:30am - 11:50am',
      status: 'Active',
    },

    {
      doctorName: 'Hennary Robert',
      age: 68,
      associatedDoctor: 'Reachord Stark',
      department: 'Zodiology',
      availableDays: '30 Jan 2018',
      availableTime: '09:08am - 10:15am',
      status: 'Inactive',
    },

    {
      doctorName: 'Tony Stark',
      age: 55,
      associatedDoctor: 'Michell Mcllghan',
      department: 'sardiology',
      availableDays: '14 March 2019',
      availableTime: '11:00am - 11:30am',
      status: 'Active',
    },

    {
      doctorName: 'Jony Bairstow',
      age: 45,
      associatedDoctor: 'Michell Stark',
      department: 'Bardiology',
      availableDays: '31 Dec 2013',
      availableTime: '10:11am - 11:10am',
      status: 'Inactive',
    },

    {
      doctorName: 'Jos Butlar',
      age: 38,
      associatedDoctor: 'Sam Butlar',
      department: 'asrdiology',
      availableDays: '03 Jan 2007',
      availableTime: '11:00am - 09:40am',
      status: 'Inactive',
    },
    {
      doctorName: 'Sam Curran',
      age: 29,
      associatedDoctor: 'Chris Gyale',
      department: 'rardiology',
      availableDays: '06 April 2002',
      availableTime: '10:00am - 11:00am',
      status: 'Active',
    },

    {
      doctorName: 'Andrea Russell',
      age: 15,
      associatedDoctor: 'Chris Simmons',
      department: 'xardiology',
      availableDays: '12 Dec 2008',
      availableTime: '01:35am - 01:50am',
      status: 'Active',
    },

  ];

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = scheduleData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(scheduleData.length / entriesPerPage);
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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


  return (
    <div className="container" style={{ background: 'transparent ' }}>
      <div className="content">
        <div className="row">
          <div className="col-lg-2 col-6">
            <p className="page-title">
              <select className="form-control select" onChange={(e) => setEntriesPerPage(Number(e.target.value))}>
                <option>-- Show Entries --</option>
                <option>5</option>
                <option>10</option>
                <option>20</option>
              </select>
            </p>
          </div>
          <div className="col-lg-10 col-6 text-right m-b-20 d-flex justify-content-end">
            <Link to={'/addshedule'} className="btn btn btn-success btn-rounded float-right">
              <i className="fa fa-plus"></i> Add Schedule
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive" style={{ background: 'transparent ', maxHeight: '500px', overflowY: 'auto' }}>
              <table className="table table-border datatable mb-0" style={{ width: '100%' }}>

                <thead className="sticky-top" style={{ zIndex: 1, backgroundColor: '#ccfff5' }}>
                  <tr style={{ cursor: 'pointer' }}>
                    <th onClick={() => handleSort('doctorName')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Doctor Name</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'doctorName' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'doctorName' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th onClick={() => handleSort('age')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Age</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'age' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'age' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th onClick={() => handleSort('associatedDoctor')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Associated Doctor</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'associatedDoctor' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'associatedDoctor' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th onClick={() => handleSort('department')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Department</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'department' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'department' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th onClick={() => handleSort('availableDays')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Available Days</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'availableDays' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'availableDays' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th onClick={() => handleSort('availableTime')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Available Time</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'availableTime' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'availableTime' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th onClick={() => handleSort('status')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Status</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'status' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'status' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th className="text-right" onClick={() => handleSort('action')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Action</span>

                    </th>
                  </tr>

                </thead>
                <tbody>
                  {sortedEntries.map((schedule, index) => (
                    <tr key={index}>
                      <td>
                        <img width="28" height="28" src={img1} className="rounded-circle m-r-5" alt="" />
                        {schedule.doctorName}
                      </td>
                      <td>{schedule.age}</td>
                      <td>{schedule.associatedDoctor}</td>
                      <td>{schedule.department}</td>
                      <td>{schedule.availableDays}</td>
                      <td>{schedule.availableTime}</td>
                      <td>{schedule.status}</td>
                      <td className="text-right">
                        <div className="dropdown dropdown-action">
                          <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                            <i className="fa fa-ellipsis-v"></i>
                          </a>
                          <div className="dropdown-menu dropdown-menu-right">
                            <a className="dropdown-item" href="edit-patient.html">
                              <i className="fa fa-pencil m-r-5"></i> Edit
                            </a>
                            <a className="dropdown-item" href="#" data-toggle="modal" data-target="#delete_schedule">
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
        <div className='row '>
          <div className='col-6 d-flex justify-content-start'>
            <p>Showing {indexOfFirstEntry + 1} to {indexOfLastEntry > scheduleData.length ? scheduleData.length : indexOfLastEntry} of {scheduleData.length} entries</p>
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
      {/* Delete Modal */}
      <div id="delete_schedule" className="modal fade delete-modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <img src="assets/img/sent.png" alt="" width="50" height="46" />
              <h3>Are you sure want to delete this Schedule?</h3>
              <div className="m-t-20">
                <a href="#" className="btn btn-white" data-dismiss="modal">Close</a>
                <button type="submit" className="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorSchedule;
