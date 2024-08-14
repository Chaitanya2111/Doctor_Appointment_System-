import React, { useState, useEffect } from 'react';
import '../css/Leave.css'; // Import your custom CSS file
import DatePicker from 'react-datepicker'; // Import DatePicker component
import 'react-datepicker/dist/react-datepicker.css';
import { IoMdCalendar } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
const LeaveRequest = () => {
    // Define state variables for filters
    const [employeeName, setEmployeeName] = useState('');
    const [leaveType, setLeaveType] = useState('');
    const [leaveStatus, setLeaveStatus] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const navigate = useNavigate();
    // Function to handle search

    const handleSearch = () => {
        console.log("Searching with criteria:");
        console.log("Employee Name:", employeeName);
        console.log("Leave Type:", leaveType);
        console.log("Leave Status:", leaveStatus);
        console.log("From Date:", fromDate);
        console.log("To Date:", toDate);

        // Filter logic based on entered criteria
        const filtered = departmentsData.filter(entry => {
            const nameMatch = entry.employee.name.toLowerCase().includes(employeeName.toLowerCase());
            const typeMatch = leaveType ? entry.leaveType === leaveType : true;
            const statusMatch = leaveStatus ? entry.status === leaveStatus : true;
            const fromDateMatch = fromDate ? new Date(entry.fromDate) >= new Date(fromDate) : true;
            const toDateMatch = toDate ? new Date(entry.toDate) <= new Date(toDate) : true;
            return nameMatch && typeMatch && statusMatch && fromDateMatch && toDateMatch;
        });
        console.log("Filtered Data:", filtered);


    };

    useEffect(() => {
        console.log("Departments Data:", departmentsData);
        // Filter logic
        const filtered = departmentsData.filter(entry => {
            const nameMatch = entry.employee.name.toLowerCase().includes(employeeName.toLowerCase());
            const typeMatch = leaveType ? entry.leaveType === leaveType : true;
            const statusMatch = leaveStatus ? entry.status === leaveStatus : true;
            const fromDateMatch = fromDate ? new Date(entry.fromDate) >= new Date(fromDate) : true;
            const toDateMatch = toDate ? new Date(entry.toDate) <= new Date(toDate) : true;
            return nameMatch && typeMatch && statusMatch && fromDateMatch && toDateMatch;
        });
        console.log("Filtered Data:", filtered);


    }, [employeeName, leaveType, leaveStatus, fromDate, toDate]);

    const departmentsData = [
        {
            employee: {
                name: 'Zoe Butler',
                designation: 'Pharmacist',
                avatar: 'R'
            },
            leaveType: 'Casual Leave',
            fromDate: '31 Mar 2018',
            toDate: '31 Mar 2018',
            numberOfDays: '2 days',
            reason: 'Birthday Function',
            status: 'Declined'
        },
        {
            employee: {
                name: 'Cristina Groves',
                designation: 'Doctor',
                avatar: 'J'
            },
            leaveType: 'Medical Leave',
            fromDate: '13 Jul 2018',
            toDate: '15 Jul 2018',
            numberOfDays: '3 days',
            reason: 'Going to Vacation',
            status: 'Approved'
        },
        {
            employee: {
                name: 'Mary Mericle',
                designation: 'Accountant',
                avatar: 'J'
            },
            leaveType: 'Casual Leave',
            fromDate: '27 Jun 2018',
            toDate: '28 Jun 2018',
            numberOfDays: '2 days',
            reason: 'Going to Native Place',
            status: 'Approved'
        },
        {
            employee: {
                name: 'Albina Simonis',
                designation: 'Nurse',
                avatar: 'R'
            },
            leaveType: 'Casual Leave',
            fromDate: '8 Aug 2018',
            toDate: '8 Aug 2018',
            numberOfDays: '2 days',
            reason: 'Family Function',
            status: 'New'
        },


    ];

    const handleAddleave = () => {
        // Navigate to the "add employee" page
        navigate('/addleave'); // Use the navigate function to redirect
    };


    const handleeditleave = (id) => {
        // Navigate to the "add employee" page for editing with the ID
        navigate(`/employee/Addleave/${id}`); // Use the navigate function to redirect with ID
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'New':
                return 'sky';
            case 'Pending':
                return 'yellow';
            case 'Approved':
                return 'green';
            case 'Declined':
                return 'red';
            default:
                return '';
                
        }
    };
    


    return (
        <div className="content">
            <div className="row">
                <div className=" col-12">
                    <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                        <h3 style={{ float: "left", fontWeight: "bolder" }}>Leave Request</h3>
                        <button className="btn btn-success" onClick={handleAddleave} style={{ fontWeight: "550", fontSize: "18px", borderRadius: "25px", float: "right", margin: "0px" }}>
                            <i className="fa fa-plus"></i> Add Leave
                        </button>
                    </div>
                </div>
            </div>
            <div className="row filter-row">
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                    <div className="form-group form-focus">
                        <input type="text" className="form-control floating custom-input" placeholder="Employee Name" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)}
                            style={{ padding: "8px" }} />
                    </div>
                </div>
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                    <div className="form-group form-focus select-focus focused">
                        <select className="select custom-input" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                            <option value="">Select Leave Type</option>
                            <option value="Casual Leave">Casual Leave</option>
                            <option value="Medical Leave">Medical Leave</option>
                            <option value="Loss of Pay">Loss of Pay</option>
                        </select>
                    </div>
                </div>
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                    <div className="form-group form-focus select-focus focused">
                        <select className="select custom-input" value={leaveStatus} onChange={(e) => setLeaveStatus(e.target.value)}>
                            <option value="">Select Leave Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                    <div className="form-group form-focus">
                        <div className="input-with-icon">
                            <DatePicker
                                className="form-control floating datetimepicker"
                                selected={fromDate}
                                onChange={date => setFromDate(date)}
                                placeholderText="From"
                                dateFormat="dd/MM/yyyy"
                            />
                            <IoMdCalendar className="calendar-icon" />
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                    <div className="form-group form-focus">
                        <div className="input-with-icon">
                            <DatePicker
                                className="form-control floating datetimepicker"
                                selected={toDate}
                                onChange={date => setToDate(date)}
                                placeholderText="To"
                                dateFormat="dd/MM/yyyy"
                            />
                            <IoMdCalendar className="calendar-icon" />
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12 d-flex align-items-end">
                    <button className="btn btn-success btn-block " onClick={handleSearch}>Search</button>
                </div>
            </div>
            <br></br>

            <div className="row">
                <div className="col-md-12">
                    <div className="table-responsive">
                        <table className="table table-striped custom-table mb-0">
                            <thead>
                                <tr>
                                    <th style={{ fontSize: "20px" }}>Employee</th>
                                    <th style={{ fontSize: "20px" }}>Leave Type</th>
                                    <th style={{ fontSize: "20px" }}>From</th>
                                    <th style={{ fontSize: "20px" }}>To</th>
                                    <th style={{ fontSize: "20px" }}>No of Days</th>
                                    <th style={{ fontSize: "20px" }}>Reason</th>
                                    <th className="text-center" style={{ fontSize: "20px" }}>Status</th>
                                    <th className="text-right" style={{ fontSize: "20px" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                {departmentsData.map(entry => (
                    <tr key={entry.id}>
                        <td>
                            <div className="avatar-container">
                                <div className="avatar">{entry.employee.avatar}</div>
                                <div className="user-info">
                                    <h5>{entry.employee.name}</h5>
                                    <span className="designation">{entry.employee.designation}</span>
                                </div>
                            </div>
                        </td>
                        <td>{entry.leaveType}</td>
                        <td>{entry.fromDate}</td>
                        <td>{entry.toDate}</td>
                        <td>{entry.numberOfDays}</td>
                        <td>{entry.reason}</td>
                        <td className="text-center">
                            <div className="dropdown action-label">
                            <a className={`custom-badge status-${getStatusColor(entry.status)}`} href="#" data-toggle="dropdown" aria-expanded="false">
    {entry.status}
</a>

                                <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item" href="#">New</a>
                                    <a className="dropdown-item" href="#">Pending</a>
                                    <a className="dropdown-item" href="#">Approved</a>
                                    <a className="dropdown-item" href="#">Declined</a>
                                </div>
                            </div>
                        </td>
                        <td className="text-right">
                            <div className="dropdown dropdown-action">
                                <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                    <i className="fa fa-ellipsis-v"></i>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item" href="#" onClick={() => handleeditleave(entry.id)}>
                                        <i className="fa fa-pencil m-r-5"></i> Edit
                                    </a>
                                    <a className="dropdown-item" href="#" >
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

        </div>

    );
};

export default LeaveRequest;
