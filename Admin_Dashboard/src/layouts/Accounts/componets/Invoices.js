
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Invoices() {
    const invoicesData = [
        {
            id: 1,
            invoiceNumber: 'INV-001',
            patient: 'John Doe',
            createdDate: '2024-04-01',
            dueDate: '2024-04-10',
            amount: '100.00',
            status: 'Pending',
        },
        {
            id: 2,
            invoiceNumber: 'INV-002',
            patient: 'Jane Doe',
            createdDate: '2024-04-02',
            dueDate: '2024-04-11',
            amount: '150.00',
            status: 'Paid',
        },
        {
            id: 3,
            invoiceNumber: 'INV-003',
            patient: 'Alice Smith',
            createdDate: '2024-04-03',
            dueDate: '2024-04-12',
            amount: '200.00',
            status: 'Partially Paid',
        },
        {
            id: 1,
            invoiceNumber: 'INV-001',
            patient: 'John Doe',
            createdDate: '2024-04-01',
            dueDate: '2024-04-10',
            amount: '100.00',
            status: 'Pending',
        },
        {
            id: 2,
            invoiceNumber: 'INV-002',
            patient: 'Jane Doe',
            createdDate: '2024-04-02',
            dueDate: '2024-04-11',
            amount: '150.00',
            status: 'Paid',
        },
        {
            id: 3,
            invoiceNumber: 'INV-003',
            patient: 'Alice Smith',
            createdDate: '2024-04-03',
            dueDate: '2024-04-12',
            amount: '200.00',
            status: 'Partially Paid',
        },
        {
            id: 1,
            invoiceNumber: 'INV-001',
            patient: 'John Doe',
            createdDate: '2024-04-01',
            dueDate: '2024-04-10',
            amount: '100.00',
            status: 'Pending',
        },
        {
            id: 2,
            invoiceNumber: 'INV-002',
            patient: 'Jane Doe',
            createdDate: '2024-04-02',
            dueDate: '2024-04-11',
            amount: '150.00',
            status: 'Paid',
        },
        {
            id: 3,
            invoiceNumber: 'INV-003',
            patient: 'Alice Smith',
            createdDate: '2024-04-03',
            dueDate: '2024-04-12',
            amount: '200.00',
            status: 'Partially Paid',
        },

    ];

    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);


    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('Select Status');

    const filterData = () => {
        let filteredInvoices = invoicesData;

        if (fromDate) {
            filteredInvoices = filteredInvoices.filter(
                (invoice) => new Date(invoice.createdDate) >= new Date(fromDate)
            );
        }

        if (toDate) {
            filteredInvoices = filteredInvoices.filter(
                (invoice) => new Date(invoice.createdDate) <= new Date(toDate)
            );
        }

        if (selectedStatus !== 'Select Status') {
            filteredInvoices = filteredInvoices.filter(
                (invoice) => invoice.status === selectedStatus
            );
        }

        return filteredInvoices;
    };

    const handleSearch = () => {
        setCurrentPage(1); 
    };

  
    const filteredData = filterData();
    const totalPages = Math.ceil(filteredData.length / entriesPerPage);
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedInvoices = [...currentEntries].sort((a, b) => {
        if (sortConfig.direction === 'ascending') {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        }
        if (sortConfig.direction === 'descending') {
            return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
        }
        return 0;
    });
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
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
                <div className="col-lg-10 col-6 text-right m-b-20 d-flex justify-content-end">
                    <Link to={'/createinvoices'} className="btn btn btn-success btn-rounded float-right">
                        <i className="fa fa-plus"></i> Create New Invoices
                    </Link>
                </div>
            </div>

            <div className="row filter-row">
                <div className="col-sm-6 col-md-3">
                    <div className="form-group form-focus">
                        <label className="focus-label">From</label>
                        <div className="cal-icon">
                            <input
                                className="form-control floating datetimepicker"
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-md-3">
                    <div className="form-group form-focus">
                        <label className="focus-label">To</label>
                        <div className="cal-icon">
                            <input
                                className="form-control floating datetimepicker"
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-md-3">
                    <div className="form-group form-focus select-focus">
                        <label className="focus-label">Status</label>
                        <select
                            className="form-control select floating"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option>Select Status</option>
                            <option>Pending</option>
                            <option>Paid</option>
                            <option>Partially Paid</option>
                        </select>
                    </div>
                </div>
                <div className="col-sm-6 col-md-3">
                    <br />
                    <a href="#" className="btn btn-success btn-block" onClick={handleSearch}>
                        Search
                    </a>
                </div>
            </div>

            <br />
            <div className="row">
                <div className="col-md-12">
                    <div className="table-responsive" style={{ background: 'transparent ', maxHeight: '500px', overflowY: 'auto' }}>
                        <table className="table table-border datatable mb-0" style={{ width: '100%' }}>

                            <thead className="sticky-top" style={{ zIndex: 1, backgroundColor: '#ccfff5' }}>
                                <tr style={{ cursor: 'pointer' }}>
                                    <th onClick={() => handleSort('id')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                                        <span style={{ marginRight: '10px' }}>#</span>

                                    </th>
                                    <th onClick={() => handleSort('invoiceNumber')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                                        <span style={{ marginRight: '10px' }}>Invoice Number</span>
                                        <span>
                                            <span style={{ color: sortConfig.key === 'invoiceNumber' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                                            <span style={{ color: sortConfig.key === 'invoiceNumber' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                                        </span>
                                    </th>
                                    <th onClick={() => handleSort('patient')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                                        <span style={{ marginRight: '10px' }}>Patient</span>
                                        <span>
                                            <span style={{ color: sortConfig.key === 'patient' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                                            <span style={{ color: sortConfig.key === 'patient' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                                        </span>
                                    </th>
                                    <th onClick={() => handleSort('createdDate')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                                        <span style={{ marginRight: '10px' }}>Created Date</span>
                                        <span>
                                            <span style={{ color: sortConfig.key === 'createdDate' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                                            <span style={{ color: sortConfig.key === 'createdDate' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                                        </span>
                                    </th>
                                    <th onClick={() => handleSort('dueDate')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                                        <span style={{ marginRight: '10px' }}>Due Date</span>
                                        <span>
                                            <span style={{ color: sortConfig.key === 'dueDate' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                                            <span style={{ color: sortConfig.key === 'dueDate' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                                        </span>
                                    </th>
                                    <th onClick={() => handleSort('amount')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                                        <span style={{ marginRight: '10px' }}>Amount</span>
                                        <span>
                                            <span style={{ color: sortConfig.key === 'amount' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                                            <span style={{ color: sortConfig.key === 'amount' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                                        </span>
                                    </th>
                                    <th onClick={() => handleSort('status')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                                        <span style={{ marginRight: '10px' }}>Status</span>
                                        <span>
                                            <span style={{ color: sortConfig.key === 'status' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                                            <span style={{ color: sortConfig.key === 'status' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                                        </span>
                                    </th>
                                    <th className="text-right" style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedInvoices.map((invoice, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td><Link to='/invoicepdf'>{invoice.invoiceNumber}</Link></td>
                                        <td>{invoice.patient}</td>
                                        <td>{invoice.createdDate}</td>
                                        <td>{invoice.dueDate}</td>
                                        <td>${invoice.amount}</td>
                                        <td><span className={`custom-badge status-${invoice.status.toLowerCase()}`}>{invoice.status}</span></td>
                                        <td className="text-right">
                                            <div className="dropdown dropdown-action">
                                                <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                    <i className="fa fa-ellipsis-v"></i>
                                                </a>
                                                <div className="dropdown-menu dropdown-menu-right">
                                                    <a className="dropdown-item" href={`edit-invoice.html#${invoice.id}`}><i className="fa fa-pencil m-r-5"></i> Edit</a>
                                                    <a className="dropdown-item" href={`invoice-view.html#${invoice.id}`}><i className="fa fa-eye m-r-5"></i> View</a>
                                                    <a className="dropdown-item" href="#"><i className="fa fa-file-pdf-o m-r-5"></i> Download</a>
                                                    <a className="dropdown-item" href="#"><i className="fa fa-trash-o m-r-5"></i> Delete</a>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div><br></br>
            <div className='row '>
                <div className='col-6 d-flex justify-content-start'>
                    <p>Showing {indexOfFirstEntry + 1} to {indexOfLastEntry > invoicesData.length ? invoicesData.length : indexOfLastEntry} of {invoicesData.length} entries</p>
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

export default Invoices;

