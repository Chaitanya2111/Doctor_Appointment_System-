import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Taxes() {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [entriesPerPage, setEntriesPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  const taxesData = [
    { id: 1, taxName: 'VAT', taxPercentage: '14%', status: 'Inactive' },
    { id: 2, taxName: 'GST', taxPercentage: '30%', status: 'Active' },
    { id: 3, taxName: 'Sales Tax', taxPercentage: '10%', status: 'Inactive' },
    { id: 4, taxName: 'Income Tax', taxPercentage: '20%', status: 'Active' },
    { id: 5, taxName: 'Property Tax', taxPercentage: '5%', status: 'Inactive' },
    { id: 6, taxName: 'Service Tax', taxPercentage: '15%', status: 'Active' },
    { id: 7, taxName: 'Custom Duty', taxPercentage: '8%', status: 'Inactive' },
    { id: 8, taxName: 'Excise Duty', taxPercentage: '12%', status: 'Active' },
    { id: 9, taxName: 'Toll Tax', taxPercentage: '2%', status: 'Inactive' },
    { id: 10, taxName: 'Value Added Tax', taxPercentage: '18%', status: 'Active' },
  ];

  // Sorting
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...taxesData].sort((a, b) => {
    if (sortConfig.direction === 'ascending') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    if (sortConfig.direction === 'descending') {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = sortedData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(sortedData.length / entriesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
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
          <Link to={'/addtaxes'} className="btn btn btn-success btn-rounded float-right">
            <i className="fa fa-plus"></i> Create New Taxes
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
        <div className="table-responsive" style={{ background: 'transparent ', maxHeight: '500px', overflowY: 'auto' }}>
          <table className="table table-border datatable mb-0" style={{ width: '100%' }}>

<thead className="sticky-top" style={{ zIndex: 1, backgroundColor: '#ccfff5' }}>
    <tr style={{ cursor: 'pointer' }}>
    <th onClick={() => handleSort('id')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
  <span style={{ marginRight: '10px' }}>#</span>
  <span>
    <span style={{ color: sortConfig.key === 'id' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
    <span style={{ color: sortConfig.key === 'id' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
  </span>
</th>

<th onClick={() => handleSort('taxName')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
  <span style={{ marginRight: '10px' }}>Tax Name</span>
  <span>
    <span style={{ color: sortConfig.key === 'taxName' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
    <span style={{ color: sortConfig.key === 'taxName' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
  </span>
</th>

<th onClick={() => handleSort('taxPercentage')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
  <span style={{ marginRight: '10px' }}>Tax Percentage (%)</span>
  <span>
    <span style={{ color: sortConfig.key === 'taxPercentage' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
    <span style={{ color: sortConfig.key === 'taxPercentage' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
  </span>
</th>

<th onClick={() => handleSort('status')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
  <span style={{ marginRight: '10px' }}>Status</span>
  <span>
    <span style={{ color: sortConfig.key === 'status' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
    <span style={{ color: sortConfig.key === 'status' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
  </span>
</th>

<th className="text-right" style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>Action</th>

                </tr>
              </thead>
              <tbody>
                {currentEntries.map((tax) => (
                  <tr key={tax.id}>
                    <td>{tax.id}</td>
                    <td>{tax.taxName}</td>
                    <td>{tax.taxPercentage}</td>
                    <td>
                      <div className={`dropdown action-label ${tax.status === 'Active' ? 'status-green' : 'status-red'}`}>
                        <a className="dropdown-toggle" href="#" data-toggle="dropdown" aria-expanded="false">
                          {tax.status}
                        </a>
                        <div className="dropdown-menu">
                          <a className="dropdown-item" href="#">Active</a>
                          <a className="dropdown-item" href="#">Inactive</a>
                        </div>
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="dropdown dropdown-action">
                        <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i className="fa fa-ellipsis-v"></i></a>
                        <div className="dropdown-menu dropdown-menu-right">
                          <a className="dropdown-item" href="edit-tax.html"><i className="fa fa-pencil m-r-5"></i> Edit</a>
                          <a className="dropdown-item" href="#" data-toggle="modal" data-target="#delete_tax"><i className="fa fa-trash-o m-r-5"></i> Delete</a>
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
     <br>
     </br>
     <div className="row">
                    <div className="col-6 d-flex justify-content-start">
                        <p>Showing {indexOfFirstEntry + 1} to {indexOfLastEntry > taxesData.length ? taxesData.length : indexOfLastEntry} of {taxesData.length} entries</p>
                    </div>
                    <div className="col-6 d-flex justify-content-end">
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

export default Taxes;
