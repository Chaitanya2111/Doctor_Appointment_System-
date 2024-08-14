import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../css/Sample.css';
import avatar1 from './Avatar.jpg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployeeList = () => {
  const [employeeID, setEmployeeID] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [role, setRole] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleSearch = () => {
    const filtered = filteredEmployees.filter(employee => {
      const isMatchingID = employeeID === '' || employee.employee_id.toLowerCase().includes(employeeID.toLowerCase());
      const isMatchingName = employeeName === '' || (employee.first_name.toLowerCase() + ' ' + employee.last_name.toLowerCase()).includes(employeeName.toLowerCase());
      const isMatchingRole = role === '' || employee.role.toLowerCase() === role.toLowerCase();
      return isMatchingID && isMatchingName && isMatchingRole;
    });
    setFilteredEmployees(filtered);
  };

  const handleAddEmployee = () => {
    navigate('/addemployee');
  };

  const handleEditEmployee = (employeeId) => {
    navigate(`/addemployee/${employeeId}`);
  };

  
  const handleDelete = async (employeeId) => {
    try {
      console.log('Deleting employee with ID:', employeeId); // Log the employee ID being deleted
      await axios.delete(`http://localhost:3005/api/employees/delete/${employeeId}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      // Optionally, display an error message to the user
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDeleteEmployeeId(null);
  };

 
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3005/api/employees');
      setFilteredEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  return (
    <div className="content">
      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <h3 style={{ float: "left", fontWeight: "bolder" }}>Employee</h3>
        <button className="btn btn-success" onClick={handleAddEmployee} style={{ fontWeight: "550", fontSize: "18px", borderRadius: "25px" }}>
          <i className="fa fa-plus"></i> Add Employee
        </button>
      </div>
      <div className="row filter-row">
        <div className="col-sm-6 col-md-3">
          <div className="form-group form-focus">
            <input
              type="text"
              className="form-control floating"
              style={{ height: "50px", padding: "7px" }}
              placeholder="Employee ID"
              value={employeeID}
              onChange={(e) => setEmployeeID(e.target.value)}
            />
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="form-group form-focus">
            <input
              type="text"
              className="form-control floating"
              style={{ height: "50px", padding: "7px" }}
              placeholder="Employee Name"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="form-group form-focus">
            <select
              className="form-control floating role-dropdown"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ height: "50px", padding: "7px" }}
            >
              <option value="">Select Role</option>
              <option value="Nurse">Nurse</option>
              <option value="Pharmacist">Pharmacist</option>
              <option value="Laboratorist">Laboratorist</option>
              <option value="Accountant">Accountant</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Doctor">Doctor</option>
            </select>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <button className="btn btn-success btn-block" onClick={handleSearch}> Search </button>
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-md-12">
          <div className="table-responsive">
            <table className="table table-striped custom-table">
              <thead>
                <tr>
                  <th style={{ minWidth: '200px', fontSize: "20px" }}>Name</th>
                  <th style={{ fontSize: "20px" }}>Employee ID</th>
                  <th style={{ fontSize: "20px" }}>Email</th>
                  <th style={{ fontSize: "20px" }}>Mobile</th>
                  <th style={{ minWidth: '110px', fontSize: "20px" }}>Join Date</th>
                  <th style={{ fontSize: "20px" }}> Role</th>
                  <th className="text-right" style={{ fontSize: "20px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {(filteredEmployees.length === 0) ? (
                  <tr>
                    <td colSpan="7" className="text-center">No matching employees found</td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee, index) => (
                    <EmployeeTableRow key={index} employee={employee} handleDelete={() => handleDelete(employee.employee_id)} handleEdit={() => handleEditEmployee(employee.employee_id)} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showModal && (
        <div id="delete_employee" className="modal fade delete-modal" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center">
                <img src="assets/img/sent.png" alt="" width="50" height="46" />
                <h3>Are you sure want to delete this Employee?</h3>
                <div className="m-t-20">
                  <button className="btn btn-white" onClick={handleCloseModal}>Close</button>
                  <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EmployeeTableRow = ({ employee, handleDelete, handleEdit }) => {
  return (
    <tr>
      <td>
        <div className="employee-wrapper">
          <div className="employee-info">
            <img width="28" height="28" src={avatar1} className="rounded-circle" alt="" />
          </div>
          <h5>{employee.first_name} {employee.last_name}</h5>
        </div>
      </td>
      <td>{employee.employee_id}</td>
      <td>{employee.email}</td>
      <td>{employee.phone}</td>
      <td>{employee.joining_date}</td>
      <td>
        <span className={`custom-badge status-${employee.role.toLowerCase()}`}>
          {employee.role}
        </span>
      </td>
      <td className="text-right">
        <DropdownMenu handleDelete={() => handleDelete(employee.employee_id)} handleEdit={handleEdit} />
      </td>
    </tr>
  );
};

const DropdownMenu = ({ handleDelete, handleEdit }) => {
  return (
    <div className="dropdown dropdown-action">
      <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
        <i className="fa fa-ellipsis-v"></i>
      </a>
      <div className="dropdown-menu dropdown-menu-right">
        <a className="dropdown-item" href="#" onClick={handleEdit}>
          <i className="fa fa-pencil m-r-5"></i> Edit
        </a>
        <a className="dropdown-item" href="#" onClick={handleDelete}>
          <i className="fa fa-trash-o m-r-5"></i> Delete
        </a>
      </div>
    </div>
  );
};

EmployeeList.propTypes = {
  employee: PropTypes.shape({
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    employee_id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    joining_date: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired
  }).isRequired
};

EmployeeTableRow.propTypes = {
  employee: PropTypes.shape({
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    employee_id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    joining_date: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired
  }).isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired
};

DropdownMenu.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired
};

export default EmployeeList;




// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import '../css/Sample.css';
// import avatar1 from './Avatar.jpg';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const EmployeeList = () => {
//   const [employeeID, setEmployeeID] = useState('');
//   const [employeeName, setEmployeeName] = useState('');
//   const [role, setRole] = useState('');
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
 
 
//   const navigate = useNavigate();

//   const handleSearch = () => {
//     const filtered = filteredEmployees.filter(employee => {
//       const isMatchingID = employeeID === '' || employee.employee_id.toLowerCase().includes(employeeID.toLowerCase());
//       const isMatchingName = employeeName === '' || (employee.first_name.toLowerCase() + ' ' + employee.last_name.toLowerCase()).includes(employeeName.toLowerCase());
//       const isMatchingRole = role === '' || employee.role.toLowerCase() === role.toLowerCase();
//       return isMatchingID && isMatchingName && isMatchingRole;
//     });
//     setFilteredEmployees(filtered);
//   };

//   const handleAddEmployee = () => {
//     navigate('/addemployee');
//   };

//   const handleEdit = (employeeId) => {
//     navigate(`/addemployee/${employeeId}`);
//   };




//   const handleDelete = async (employeeId) => {
//     try {
//       console.log('Deleting employee with ID:', employeeId); // Log the employee ID being deleted
//       await axios.delete(`http://localhost:3005/api/employees/delete/${employeeId}`);
//       fetchEmployees();
//     } catch (error) {
//       console.error('Error deleting employee:', error);
//       // Optionally, display an error message to the user
//     }
//   };
  
//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       const response = await axios.get('http://localhost:3005/api/employees');
//       setFilteredEmployees(response.data);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//     }
//   };

//   return (
//     <div className="content">
//       <div style={{ textAlign: 'right', marginBottom: '10px' }}>
//         <h3 style={{ float: "left", fontWeight: "bolder" }}>Employee</h3>
//         <button className="btn btn-success" onClick={handleAddEmployee} style={{ fontWeight: "550", fontSize: "18px", borderRadius: "25px" }}>
//           <i className="fa fa-plus"></i> Add Employee
//         </button>
//       </div>
//       <div className="row filter-row">
//         <div className="col-sm-6 col-md-3">
//           <div className="form-group form-focus">
//             <input
//               type="text"
//               className="form-control floating"
//               style={{ height: "50px", padding: "7px" }}
//               placeholder="Employee ID"
//               value={employeeID}
//               onChange={(e) => setEmployeeID(e.target.value)}
//             />
//           </div>
//         </div>
//         <div className="col-sm-6 col-md-3">
//           <div className="form-group form-focus">
//             <input
//               type="text"
//               className="form-control floating"
//               style={{ height: "50px", padding: "7px" }}
//               placeholder="Employee Name"
//               value={employeeName}
//               onChange={(e) => setEmployeeName(e.target.value)}
//             />
//           </div>
//         </div>
//         <div className="col-sm-6 col-md-3">
//           <div className="form-group form-focus">
//             <select
//               className="form-control floating role-dropdown"
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               style={{ height: "50px", padding: "7px" }}
//             >
//               <option value="">Select Role</option>
//               <option value="Nurse">Nurse</option>
//               <option value="Pharmacist">Pharmacist</option>
//               <option value="Laboratorist">Laboratorist</option>
//               <option value="Accountant">Accountant</option>
//               <option value="Receptionist">Receptionist</option>
//               <option value="Doctor">Doctor</option>
//             </select>
//           </div>
//         </div>
//         <div className="col-sm-6 col-md-3">
//           <button className="btn btn-success btn-block" onClick={handleSearch}> Search </button>
//         </div>
//       </div>
//       <br />
//       <div className="row">
//         <div className="col-md-12">
//           <div className="table-responsive">
//             <table className="table table-striped custom-table">
//               <thead>
//                 <tr>
//                   <th style={{ minWidth: '200px', fontSize: "20px" }}>Name</th>
//                   <th style={{ fontSize: "20px" }}>Employee ID</th>
//                   <th style={{ fontSize: "20px" }}>Email</th>
//                   <th style={{ fontSize: "20px" }}>Mobile</th>
//                   <th style={{ minWidth: '110px', fontSize: "20px" }}>Join Date</th>
//                   <th style={{ fontSize: "20px" }}> Role</th>
//                   <th className="text-right" style={{ fontSize: "20px" }}>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {(filteredEmployees.length === 0) ? (
//                   <tr>
//                     <td colSpan="7" className="text-center">No matching employees found</td>
//                   </tr>
//                 ) : (
//                   filteredEmployees.map((employee) => (
//                     <EmployeeTableRow
//   key={employee.employee_id}
//   employee={employee}
//   handleDelete={() => handleDelete(employee.employee_id)} // Pass employee_id
//   handleEdit={handleEdit}
// />

                  
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
      
//     </div>
//   );
// };

// const EmployeeTableRow = ({ employee, handleDelete, handleEdit }) => {
//   return (
//     <tr>
//       <td>
//         <div className="employee-wrapper">
//           <div className="employee-info">
//             <img width="28" height="28" src={avatar1} className="rounded-circle" alt="" />
//           </div>
//           <h5>{employee.first_name} {employee.last_name}</h5>
//         </div>
//       </td>
//       <td>{employee.employee_id}</td>
//       <td>{employee.email}</td>
//       <td>{employee.phone}</td>
//       <td>{employee.joining_date}</td>
//       <td>
//         <span className={`custom-badge status-${employee.role.toLowerCase()}`}>
//           {employee.role}
//         </span>
//       </td>
//       <td className="text-right">
//         <DropdownMenu handleDelete={() => handleDelete(employee.employee_id)} handleEdit={handleEdit} />
//       </td>
//     </tr>
//   );
// };

// const DropdownMenu = ({ handleDelete, handleEdit }) => {
//   return (
//     <div className="dropdown dropdown-action">
//       <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
//         <i className="fa fa-ellipsis-v"></i>
//       </a>
//       <div className="dropdown-menu dropdown-menu-right">
//         <a className="dropdown-item" href="#" onClick={handleEdit}>
//           <i className="fa fa-pencil m-r-5"></i> Edit
//         </a>
//         <a className="dropdown-item" href="#" onClick={handleDelete}>
//           <i className="fa fa-trash-o m-r-5"></i> Delete
//         </a>
//       </div>
//     </div>
//   );
// };

// EmployeeList.propTypes = {
//   employee: PropTypes.shape({
//     first_name: PropTypes.string.isRequired,
//     last_name: PropTypes.string.isRequired,
//     employee_id: PropTypes.string.isRequired,
//     email: PropTypes.string.isRequired,
//     phone: PropTypes.string.isRequired,
//     joining_date: PropTypes.string.isRequired,
//     role: PropTypes.string.isRequired
//   }).isRequired
// };

// EmployeeTableRow.propTypes = {
//   employee: PropTypes.shape({
//     first_name: PropTypes.string.isRequired,
//     last_name: PropTypes.string.isRequired,
//     employee_id: PropTypes.string.isRequired,
//     email: PropTypes.string.isRequired,
//     phone: PropTypes.string.isRequired,
//     joining_date: PropTypes.string.isRequired,
//     role: PropTypes.string.isRequired
//   }).isRequired,
//   handleDelete: PropTypes.func.isRequired,
//   handleEdit: PropTypes.func.isRequired
// };

// DropdownMenu.propTypes = {
//   handleDelete: PropTypes.func.isRequired,
//   handleEdit: PropTypes.func.isRequired
// };

// export default EmployeeList;
