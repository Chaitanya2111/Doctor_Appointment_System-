import React, { useState, useEffect } from 'react';

import axios from 'axios';

function Departments() {
  const [departmentsData, setDepartmentsData] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
 
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
  }, []);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = departmentsData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(departmentsData.length / entriesPerPage);

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
  
  // const handleDelete = async (dep_id) => {
  //   try {
  //     const response = await axios.delete(`http://localhost:3005/delete-department/${dep_id}`);
  //     if (response.status === 200) {

  //       const updatedDepartments = departmentsData.filter(department => department.dep_id !== dep_id);
  //       setDepartmentsData(updatedDepartments);

  //     }
  //   } catch (error) {

  //     console.error(error);
  //   }
  // };



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
           
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive" style={{ background: 'transparent ', maxHeight: '500px', overflowY: 'auto' }}>
              <table className="table table-border datatable mb-0" style={{ width: '100%' }}>

                <thead className="sticky-top" style={{ zIndex: 1, backgroundColor: '#cce0ff' }}>
                  <tr style={{ cursor: 'pointer' }}>
                    <th onClick={() => handleSort('department_name')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Departments</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'department_name' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'department_name' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>
                    <th onClick={() => handleSort('status')} style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                      <span style={{ marginRight: '10px' }}>Status</span>
                      <span>
                        <span style={{ color: sortConfig.key === 'status' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                        <span style={{ color: sortConfig.key === 'status' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                      </span>
                    </th>

                    {/* <th className="text-right" style={{ backgroundColor: '#cce0ff', fontSize: '14px', fontWeight: '200px', color: 'black' }}>Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {sortedEntries.map((department, index) => (
                    <tr key={index}>
                      <td>{department.department_name}</td>
                      <td>{department.status}</td>
                      {/* <td className="text-right">
                        <div className="dropdown dropdown-action">
                          <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                            <i className="fa fa-ellipsis-v"></i>
                          </a>
                          <div className="dropdown-menu dropdown-menu-right">
                            <button className="dropdown-item" onClick={() => handleEdit(department.dep_id)}>
                              <i className="fa fa-pencil m-r-5"></i> Edit
                            </button>
                            <button className="dropdown-item" onClick={() => handleDelete(department.dep_id)}>
                              <i className="fa fa-trash-o m-r-5"></i> Delete
                            </button>

                          </div>
                        </div>
                      </td> */}
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
            <p>Showing {indexOfFirstEntry + 1} to {indexOfLastEntry > departmentsData.length ? departmentsData.length : indexOfLastEntry} of {departmentsData.length} entries</p>
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
      <div id="delete_department" className="modal fade delete-modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <img src="assets/img/sent.png" alt="" width="50" height="46" />
              <h3>Are you sure want to delete this Department?</h3>
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

export default Departments;
