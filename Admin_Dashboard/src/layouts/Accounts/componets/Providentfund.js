import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Providentfund() {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [entriesPerPage, setEntriesPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);

    const providentFundData = [
        { employeeName: 'Albina Simonis', providentFundType: 'Percentage of Basic Salary', employeeShare: '2%', organizationShare: '2%', status: 'Pending' },
        { employeeName: 'John Doe', providentFundType: 'Fixed Amount', employeeShare: '3%', organizationShare: '3%', status: 'Approved' },
        { employeeName: 'Jane Smith', providentFundType: 'Percentage of Basic Salary', employeeShare: '2%', organizationShare: '2%', status: 'Pending' },
        { employeeName: 'Robert Johnson', providentFundType: 'Fixed Amount', employeeShare: '3%', organizationShare: '3%', status: 'Approved' },
        { employeeName: 'Emily Davis', providentFundType: 'Percentage of Basic Salary', employeeShare: '2%', organizationShare: '2%', status: 'Pending' },
        { employeeName: 'Michael Wilson', providentFundType: 'Fixed Amount', employeeShare: '3%', organizationShare: '3%', status: 'Approved' },
        { employeeName: 'Emma Jones', providentFundType: 'Percentage of Basic Salary', employeeShare: '2%', organizationShare: '2%', status: 'Pending' },
        { employeeName: 'William Brown', providentFundType: 'Fixed Amount', employeeShare: '3%', organizationShare: '3%', status: 'Approved' },
        { employeeName: 'Olivia Taylor', providentFundType: 'Percentage of Basic Salary', employeeShare: '2%', organizationShare: '2%', status: 'Pending' },
        { employeeName: 'David Miller', providentFundType: 'Fixed Amount', employeeShare: '3%', organizationShare: '3%', status: 'Approved' }
    ];
    

    // Sorting
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...providentFundData].sort((a, b) => {
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
        <div>
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
                        <Link to={'/addprovidentfund'} className="btn btn btn-success btn-rounded float-right">
                            <i className="fa fa-plus"></i> Create New Invoices
                        </Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                    <div className="table-responsive" style={{ background: 'transparent ', maxHeight: '500px', overflowY: 'auto' }}>
                            <table className="table table-border datatable mb-0" style={{ width: '100%' }}>

                                <thead className="sticky-top" style={{ zIndex: 1, backgroundColor: '#ccfff5' }}>
                                    <tr style={{ cursor: 'pointer' }}>
                                        <th onClick={() => handleSort('employeeName')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                                            <span style={{ marginRight: '10px' }}>Employee Name</span>
                                            <span>
                                                <span style={{ color: sortConfig.key === 'employeeName' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                                                <span style={{ color: sortConfig.key === 'employeeName' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                                            </span>
                                        </th>
                                        <th onClick={() => handleSort('providentFundType')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                                            <span style={{ marginRight: '10px' }}>Provident Fund Type</span>
                                            <span>
                                                <span style={{ color: sortConfig.key === 'providentFundType' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                                                <span style={{ color: sortConfig.key === 'providentFundType' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                                            </span>
                                        </th>
                                        <th onClick={() => handleSort('employeeShare')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                                            <span style={{ marginRight: '10px' }}>Employee Share</span>
                                            <span>
                                                <span style={{ color: sortConfig.key === 'employeeShare' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                                                <span style={{ color: sortConfig.key === 'employeeShare' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                                            </span>
                                        </th>
                                        <th onClick={() => handleSort('organizationShare')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                                            <span style={{ marginRight: '10px' }}>Organization Share</span>
                                            <span>
                                                <span style={{ color: sortConfig.key === 'organizationShare' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                                                <span style={{ color: sortConfig.key === 'organizationShare' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                                            </span>
                                        </th>
                                        <th onClick={() => handleSort('status')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                                            <span style={{ marginRight: '10px' }}>Status</span>
                                            <span>
                                                <span style={{ color: sortConfig.key === 'status' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                                                <span style={{ color: sortConfig.key === 'status' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                                            </span>
                                        </th>
                                        <th className="text-right" style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>Actions</th>
                                    </tr>

                                </thead>
                                <tbody>
                                    {currentEntries.map((data, index) => (
                                        <tr key={index}>
                                            <td>{data.employeeName}</td>
                                            <td>{data.providentFundType}</td>
                                            <td>{data.employeeShare}</td>
                                            <td>{data.organizationShare}</td>
                                            <td>
                                                <div className="dropdown action-label">
                                                    <a className={`custom-badge status-${data.status.toLowerCase()} dropdown-toggle`} href="#" data-toggle="dropdown" aria-expanded="false">
                                                        {data.status}
                                                    </a>
                                                    <div className="dropdown-menu dropdown-menu-right">
                                                        <a className="dropdown-item" href="#">Pending</a>
                                                        <a className="dropdown-item" href="#">Approved</a>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                <div className="dropdown dropdown-action">
                                                    <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i className="fa fa-ellipsis-v"></i></a>
                                                    <div className="dropdown-menu dropdown-menu-right">
                                                        <a className="dropdown-item" href="edit-provident-fund.html"><i className="fa fa-pencil m-r-5"></i> Edit</a>
                                                        <a className="dropdown-item" href="#" data-toggle="modal" data-target="#delete_pf"><i className="fa fa-trash-o m-r-5"></i> Delete</a>
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
                <div className="row">
                    <div className="col-6 d-flex justify-content-start">
                        <p>Showing {indexOfFirstEntry + 1} to {indexOfLastEntry > sortedData.length ? sortedData.length : indexOfLastEntry} of {sortedData.length} entries</p>
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
        </div>
    );
}

export default Providentfund;
