import React, { useState } from 'react';

function Payments() {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
 
  const paymentsData = [
    { invoiceId: '#INV-0001', patient: 'Charles Ortega', paymentType: 'Paypal', paidDate: '8 Aug 2017', paidAmount: '$500' },
    { invoiceId: '#INV-0002', patient: 'Denise Stevens', paymentType: 'Paypal', paidDate: '8 Aug 2017', paidAmount: '$500' },
    { invoiceId: '#INV-0003', patient: 'Dennis Salazar', paymentType: 'Paypal', paidDate: '8 Aug 2017', paidAmount: '$500' },
    { invoiceId: '#INV-0004', patient: 'John Doe', paymentType: 'Credit Card', paidDate: '9 Aug 2017', paidAmount: '$400' },
    { invoiceId: '#INV-0005', patient: 'Jane Doe', paymentType: 'Credit Card', paidDate: '10 Aug 2017', paidAmount: '$600' },
    { invoiceId: '#INV-0006', patient: 'Alice Smith', paymentType: 'Paypal', paidDate: '11 Aug 2017', paidAmount: '$350' },
    { invoiceId: '#INV-0007', patient: 'Bob Johnson', paymentType: 'Credit Card', paidDate: '12 Aug 2017', paidAmount: '$450' },
    { invoiceId: '#INV-0008', patient: 'Emma Wilson', paymentType: 'Paypal', paidDate: '13 Aug 2017', paidAmount: '$550' },
    { invoiceId: '#INV-0009', patient: 'Mike Brown', paymentType: 'Credit Card', paidDate: '14 Aug 2017', paidAmount: '$300' },
    { invoiceId: '#INV-0010', patient: 'Sarah Williams', paymentType: 'Paypal', paidDate: '15 Aug 2017', paidAmount: '$700' },
  ];

   // Pagination
   const indexOfLastEntry = currentPage * entriesPerPage;
   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = paymentsData.slice(indexOfFirstEntry, indexOfLastEntry);
   const totalPages = Math.ceil(paymentsData.length / entriesPerPage);
   // Change page
   const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...currentEntries].sort((a, b) => {
    if (sortConfig.direction === 'ascending') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    if (sortConfig.direction === 'descending') {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="container">
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
         
          </div>
        </div>
      <div className="row">
         
        <div className="col-lg-12">
        <div className="table-responsive" style={{ background: 'transparent ', maxHeight: '500px', overflowY: 'auto' }}>
          <table className="table table-border datatable mb-0" style={{ width: '100%'}}>

<thead className="sticky-top" style={{ zIndex: 1, backgroundColor: '#ccfff5' }}>
      <tr style={{ cursor: 'pointer' }}>
        <th onClick={() => handleSort('invoiceId')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
          <span style={{ marginRight: '10px' }}>Invoice Id</span>
          <span>
            <span style={{ color: sortConfig.key === 'invoiceId' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
            <span style={{ color: sortConfig.key === 'invoiceId' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
          </span>
        </th>
        <th onClick={() => handleSort('patient')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
          <span style={{ marginRight: '10px' }}>Patient</span>
          <span>
            <span style={{ color: sortConfig.key === 'patient' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
            <span style={{ color: sortConfig.key === 'patient' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
          </span>
        </th>
        <th onClick={() => handleSort('paymentType')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
          <span style={{ marginRight: '10px' }}>Payment Type</span>
          <span>
            <span style={{ color: sortConfig.key === 'paymentType' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
            <span style={{ color: sortConfig.key === 'paymentType' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
          </span>
        </th>
        <th onClick={() => handleSort('paidDate')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
          <span style={{ marginRight: '10px' }}>Paid Date </span>
          <span>
            <span style={{ color: sortConfig.key === 'paidDate' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
            <span style={{ color: sortConfig.key === 'paidDate' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
          </span>
        </th>
        <th onClick={() => handleSort('paidAmount')} style={{ backgroundColor: '#ccfff5', fontSize: '14px', fontWeight: '200px', color: 'black' }}>
          <span style={{ marginRight: '10px' }}> Paid Amount </span>
          <span>
            <span style={{ color: sortConfig.key === 'paidAmount' && sortConfig.direction === 'ascending' ? 'black' : 'grey' }}>&uarr;</span>
            <span style={{ color: sortConfig.key === 'paidAmount' && sortConfig.direction === 'descending' ? 'black' : 'grey' }}>&darr;</span>
          </span>
        </th>
               
                 
            
                </tr>
              </thead>
              <tbody>
                {sortedData.map((payment, index) => (
                  <tr key={index}>
                    <td><a href="#">{payment.invoiceId}</a></td>
                    <td><a href="#">{payment.patient}</a></td>
                    <td>{payment.paymentType}</td>
                    <td>{payment.paidDate}</td>
                    <td>{payment.paidAmount}</td>
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
            <p>Showing {indexOfFirstEntry + 1} to {indexOfLastEntry > paymentsData.length ? paymentsData.length : indexOfLastEntry} of {paymentsData.length} entries</p>
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

export default Payments;
