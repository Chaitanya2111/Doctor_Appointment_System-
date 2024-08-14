import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Addemployee.css';
import { useParams } from 'react-router-dom';

function Addemployee() {

    
    const { employeeId } = useParams();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        joining_date: '',
        phone: '',
        role: '',
        employee_id: '',
        status: 'Active' // Default status
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    useEffect(() => {
        if (employeeId) {
            fetchEmployee(employeeId);
        } else {
            // Reset form data if no employeeId is present (for adding a new employee)
            setFormData({
                first_name: '',
                last_name: '',
                username: '',
                email: '',
                password: '',
                joining_date: '',
                phone: '',
                role: '',
                employee_id: '',
                status: 'Active'
            });
        }
    }, [employeeId]);

    const fetchEmployee = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3005/api/employees/${id}`);
            const {  first_name, last_name, username, email, password, joining_date, phone, role, status ,employee_id} = response.data;
            setFormData({
                first_name,
                last_name,
                username,
                email,
                password,
                joining_date,
                phone,
                employee_id,
                role,
                status
            });
        } catch (error) {
            console.error('Error fetching employee:', error);
            // Handle error: Display error message to the user
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (employeeId) {
                await axios.put(`http://localhost:3005/api/employees/${employeeId}`, formData);
                alert('Employee updated successfully');
            } else {
                await axios.post('http://localhost:3005/api/addEmployee', formData);
                alert('Employee added successfully');
            }
            // Reset form data after submission
            setFormData({
                first_name: '',
                last_name: '',
                username: '',
                email: '',
                password: '',
                joining_date: '',
                phone: '',
                role: '',
                employee_id: '',
                status: 'Active'
            });
        } catch (err) {
            console.error(err);
            alert('Failed to add/update employee');
        }
    };
   
   

    return (
        <div className="container">
            <br />
            <div className="row">
                <div className="col-lg-8 offset-lg-2">
                    <h3 className="page-title">{employeeId ? 'Edit Employee' : 'Add Employee'}</h3>
                </div>
            </div>
            <br />
            <div className="row">
                <div className="col-lg-8 offset-lg-2">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="form-group ">
                                    <label>First Name <span className="text-danger">*</span></label>
                                    <input
                                        className="form-control add"
                                        type="text"
                                        name="first_name"
                                        value={formData. first_name}
                                        onChange={handleChange}
                                    />
                                    <br />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input
                                        className="form-control add"
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                    />
                                    <br />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Username <span className="text-danger">*</span></label>
                                    <input
                                        className="form-control add"
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                    <br />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Email <span className="text-danger">*</span></label>
                                    <input
                                        className="form-control add"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    <br />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        className="form-control add"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <br />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Joining Date <span className="text-danger">*</span></label>
                                    <div className="cal-icon">
                                        <input
                                            type="date"
                                            className="form-control add datetimepicker"
                                            name="joining_date"
                                            value={formData.joining_date}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <br />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        className="form-control add"
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                    <br />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Admin</label>
                                    <select
                                        className="form-control add"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Role</option>
                                        <option value="Nurse">Nurse</option>
                                        <option value="Pharmacist">Pharmacist</option>
                                        <option value="Laboratorist">Laboratorist</option>
                                        <option value="Accountant">Accountant</option>
                                        <option value="Receptionist">Receptionist</option>
                                        <option value="Doctor">Doctor</option>
                                    </select>
                                    <br />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Employee ID</label>
                                    <input
                                        className="form-control add"
                                        type="text"
                                        name="employee_id"
                                        value={formData.employee_id}
                                        onChange={handleChange}
                                    />
                                    <br />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="display-block">Status:</label><br />
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="status"
                                    id="employee_active"
                                    value="Active"
                                    checked={formData.status === 'Active'}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor="employee_active">
                                    Active
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="status"
                                    id="employee_inactive"
                                    value="Inactive"
                                    checked={formData.status === 'Inactive'}
                                    onChange={handleChange}
                                />edit
                                <label className="form-check-label" htmlFor="employee_inactive">
                                    Inactive
                                </label>
                            </div>
                        </div>
                        <div className="m-t-20 text-center">
                            <button className="btn btn-success submit-btn">{employeeId ? 'Update Employee' : 'Create Employee'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Addemployee;
