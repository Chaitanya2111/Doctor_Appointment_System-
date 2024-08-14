import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Expenses() {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const [filters, setFilters] = useState({
        itemName: '',
        purchasedBy: '',
        paidBy: '',
        fromDate: '',
        toDate: '',
    });

    const expensesData = [
        { itemName: 'Stretcher', purchaseFrom: 'Hospital Equipment Inc', purchaseDate: '17 Aug 2018', purchasedBy: 'Loren Gatlin', amount: '$8048', paidBy: 'Cash', status: 'Pending' },
        { itemName: 'Anaesthetic machine', purchaseFrom: 'Biomedical Equipment Inc', purchaseDate: '22 Jun 2018', purchasedBy: 'Tarah Shropshire', amount: '$62480', paidBy: 'Cheque', status: 'Approved' },
        { itemName: 'Aspiration/Suction Pump', purchaseFrom: 'Medi Pro Service', purchaseDate: '24 Jul 2018', purchasedBy: 'Tarah Shropshire', amount: '$3250', paidBy: 'Cheque', status: 'Approved' },
        { itemName: 'Stretcher', purchaseFrom: 'Hospital Equipment Inc', purchaseDate: '17 Aug 2018', purchasedBy: 'Loren Gatlin', amount: '$8048', paidBy: 'Cash', status: 'Pending' },
        { itemName: 'Anaesthetic machine', purchaseFrom: 'Biomedical Equipment Inc', purchaseDate: '22 Jun 2018', purchasedBy: 'Tarah Shropshire', amount: '$62480', paidBy: 'Cheque', status: 'Approved' },
        { itemName: 'Aspiration/Suction Pump', purchaseFrom: 'Medi Pro Service', purchaseDate: '24 Jul 2018', purchasedBy: 'Tarah Shropshire', amount: '$3250', paidBy: 'Cheque', status: 'Approved' },
        { itemName: 'Stretcher', purchaseFrom: 'Hospital Equipment Inc', purchaseDate: '17 Aug 2018', purchasedBy: 'Loren Gatlin', amount: '$8048', paidBy: 'Cash', status: 'Pending' },
        { itemName: 'Anaesthetic machine', purchaseFrom: 'Biomedical Equipment Inc', purchaseDate: '22 Jun 2018', purchasedBy: 'Tarah Shropshire', amount: '$62480', paidBy: 'Cheque', status: 'Approved' },
        { itemName: 'Aspiration/Suction Pump', purchaseFrom: 'Medi Pro Service', purchaseDate: '24 Jul 2018', purchasedBy: 'Tarah Shropshire', amount: '$3250', paidBy: 'Cheque', status: 'Approved' },
        { itemName: 'Stretcher', purchaseFrom: 'Hospital Equipment Inc', purchaseDate: '17 Aug 2018', purchasedBy: 'Loren Gatlin', amount: '$8048', paidBy: 'Cash', status: 'Pending' },
        { itemName: 'Anaesthetic machine', purchaseFrom: 'Biomedical Equipment Inc', purchaseDate: '22 Jun 2018', purchasedBy: 'Tarah Shropshire', amount: '$62480', paidBy: 'Cheque', status: 'Approved' },
       
    ];

    // Sorting
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...expensesData].sort((a, b) => {
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
 
    const totalPages = Math.ceil(sortedData.length / entriesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Search and Filter
    const filteredData = sortedData.filter((expense) => {
        const isItemNameMatch = expense.itemName.toLowerCase().includes(filters.itemName.toLowerCase());
        const isPurchasedByMatch = expense.purchasedBy.toLowerCase().includes(filters.purchasedBy.toLowerCase());
        const isPaidByMatch = expense.paidBy.toLowerCase().includes(filters.paidBy.toLowerCase());

        return isItemNameMatch && isPurchasedByMatch && isPaidByMatch;
    });

    const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };


    return (
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
                    <Link to={'/addexpenses'} className="btn btn-success btn-rounded float-right">
                        <i className="fa fa-plus"></i> Add New Expenses
                    </Link>
                </div>
            </div>
            {/* Filter Row */}
            <div className="row filter-row">
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                    <div className="form-group form-focus">
                        <label className="focus-label">Item Name</label>
                        <input type="text" className="form-control floating" name="itemName" value={filters.itemName} onChange={handleFilterChange} />
                    </div>
                </div>
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                    <div className="form-group form-focus select-focus">
                        <label className="focus-label">Purchased By</label>
                        <select className="form-control select floating" name="purchasedBy" value={filters.purchasedBy} onChange={handleFilterChange}>
                            <option> -- Select -- </option>
                            <option>Loren Gatlin</option>
                            <option>Tarah Shropshire</option>
                        </select>
                    </div>
                </div>
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                    <div className="form-group form-focus select-focus">
                        <label className="focus-label">Paid By</label>
                        <select className="form-control select floating" name="paidBy" value={filters.paidBy} onChange={handleFilterChange}>
                            <option> -- Select -- </option>
                            <option> Cash </option>
                            <option> Cheque </option>
                        </select>
                    </div>
                </div>
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                    <div className="form-group form-focus">
                        <label className="focus-label">From</label>
                        <div className="cal-icon">
                            <input className="form-control floating datetimepicker" type="text" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} />
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                    <div className="form-group form-focus">
                        <label className="focus-label">To</label>
                        <div className="cal-icon">
                            <input className="form-control floating datetimepicker" type="text" name="toDate" value={filters.toDate} onChange={handleFilterChange} />
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                    <br></br>
                    <a href="#" className="btn btn-success btn-block"> Search </a>
                </div>
            </div>
            <br></br>
            <div className="row">
                <div className="col-md-12">
                <div className="table-responsive" style={{ background: 'transparent ', maxHeight: '500px', overflowY: 'auto' }}>
                        <table className="table table-border datatable mb-0" style={{ width: '100%' }}>

                            <thead className="sticky-top" style={{ zIndex: 1, backgroundColor: '#ccfff5' }}>
                                <tr style={{ cursor: 'pointer' }}>
                                    <th onClick={() => handleSort('itemName')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                                        <span style={{ marginRight: '10px' }}>Item</span>
                                        <span>
                                            <span style={{ color: sortConfig.key === 'itemName' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                                            <span style={{ color: sortConfig.key === 'itemName' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                                        </span>
                                    </th>
                                    <th onClick={() => handleSort('purchaseFrom')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                                        <span style={{ marginRight: '10px' }}>Purchase From</span>
                                        <span>
                                            <span style={{ color: sortConfig.key === 'purchaseFrom' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                                            <span style={{ color: sortConfig.key === 'purchaseFrom' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                                        </span>
                                    </th>
                                    <th onClick={() => handleSort('purchaseDate')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                                        <span style={{ marginRight: '10px' }}>Purchase Date </span>
                                        <span>
                                            <span style={{ color: sortConfig.key === 'purchaseDate' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                                            <span style={{ color: sortConfig.key === 'purchaseDate' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                                        </span>
                                    </th>
                                    <th onClick={() => handleSort('purchasedBy')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                                        <span style={{ marginRight: '10px' }}>Purchased By</span>
                                        <span>
                                            <span style={{ color: sortConfig.key === 'purchasedBy' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                                            <span style={{ color: sortConfig.key === 'purchasedBy' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                                        </span>
                                    </th>
                                    <th onClick={() => handleSort('amount')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                                        <span style={{ marginRight: '10px' }}>Amount </span>
                                        <span>
                                            <span style={{ color: sortConfig.key === 'amount' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                                            <span style={{ color: sortConfig.key === 'amount' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                                        </span>
                                    </th>
                                    <th onClick={() => handleSort('paidBy')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                                        <span style={{ marginRight: '10px' }}>Paid By </span>
                                        <span>
                                            <span style={{ color: sortConfig.key === 'paidBy' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                                            <span style={{ color: sortConfig.key === 'paidBy' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                                        </span>
                                    </th>
                                    <th onClick={() => handleSort('status')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
                                        <span style={{ marginRight: '10px' }}>Status  </span>
                                        <span>
                                            <span style={{ color: sortConfig.key === 'status' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
                                            <span style={{ color: sortConfig.key === 'status' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
                                        </span>
                                    </th>
                                    <th className="text-right" style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEntries.map((expense, index) => (
                                    <tr key={index}>
                                        <td>{expense.itemName}</td>
                                        <td>{expense.purchaseFrom}</td>
                                        <td>{expense.purchaseDate}</td>
                                        <td>{expense.purchasedBy}</td>
                                        <td>{expense.amount}</td>
                                        <td>{expense.paidBy}</td>
                                        <td className="text-center">
                                            <div className={`custom-badge status-${expense.status.toLowerCase()}`}>
                                                {expense.status}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="dropdown dropdown-action">
                                                <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i className="fa fa-ellipsis-v"></i></a>
                                                <div className="dropdown-menu dropdown-menu-right">
                                                    <a className="dropdown-item" href="edit-expense.html"><i className="fa fa-pencil m-r-5"></i> Edit</a>
                                                    <a className="dropdown-item" href="#" data-toggle="modal" data-target="#delete_expense"><i className="fa fa-trash-o m-r-5"></i> Delete</a>
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
            <div className="row">
                <div className="col-6 d-flex justify-content-start">
                    <p>Showing {indexOfFirstEntry + 1} to {indexOfLastEntry > filteredData.length ? filteredData.length : indexOfLastEntry} of {filteredData.length} entries</p>
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

export default Expenses;
