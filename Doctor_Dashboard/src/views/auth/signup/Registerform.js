import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import axios from 'axios';

const Registerform = () => {
    const { doctorID } = useParams();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [education, setEducation] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegistration = async (e) => {
        e.preventDefault();

        // Validate form fields
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !specialization.trim() || !education.trim() || !phoneNumber.trim() || !dateOfBirth.trim() || !gender.trim() || !address.trim()) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            let url;
            let method;
            let requestBody;

            if (doctorID) {
                // Update existing doctor
                url = `http://localhost:3005/api/update-doctor/${doctorID}`;
                method = "PUT";
                requestBody = {
                    FirstName: firstName,
                    LastName: lastName,
                    Email: email,
                    Password: password,
                    Specialization: specialization,
                    Education: education,
                    PhoneNumber: phoneNumber,
                    DateOfBirth: dateOfBirth,
                    Gender: gender,
                    Address: address
                };
            } else {
                // Register new doctor
                url = "http://localhost:3005/doctor/doctor/register";
                method = "POST";
                requestBody = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                    specialization: specialization,
                    education: education,
                    phoneNumber: phoneNumber,
                    dateOfBirth: dateOfBirth,
                    gender: gender,
                    address: address
                };
            }

            // Send request to backend
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.status === 201) {
                // Registration successful
                await sendOTP(email);
                sessionStorage.setItem("registrationEmail", email);
                sessionStorage.setItem("registrationPassword", password);
                navigate("/OTPVerification");
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to register/update. Please try again.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setError("An unexpected error occurred.");
        }
    };

    useEffect(() => {
        const fetchDoctorData = async (doctorID) => {
            try {
                const response = await axios.get(`http://localhost:3005/api/get-doctor/${doctorID}`);
                const doctorData = response.data;
                setFirstName(doctorData.FirstName);
                setLastName(doctorData.LastName);
                setEmail(doctorData.Email);
                setPassword(doctorData.Password);
                setSpecialization(doctorData.Specialization);
                setEducation(doctorData.Education);
                setPhoneNumber(doctorData.PhoneNumber);
                setDateOfBirth(doctorData.DateOfBirth);
                setGender(doctorData.Gender);
                setAddress(doctorData.Address);
            } catch (error) {
                console.error('Error fetching doctor data:', error);
            }
        };

        if (doctorID) {
            fetchDoctorData(doctorID);
        }
    }, [doctorID]);

    const sendOTP = async (email) => {
        try {
            await axios.post('http://localhost:3005/doctor/send_otp', { email });
        } catch (error) {
            console.error("Error sending OTP:", error);
            throw new Error("Failed to send OTP. Please try again.");
        }
    };

    return (
        <React.Fragment>
            <Breadcrumb />
            <div className="auth-wrapper">
                <div className="auth-content">
                    <div className="auth-bg">
                        <span className="r" />
                        <span className="r s" />
                        <span className="r s" />
                        <span className="r" />
                    </div>
                    <Card className="borderless" style={{ width: "400px" }}>
                        <Row className="align-items-center">
                            <Col>
                                <Card.Body className="text-center">
                                    <div className="mb-4">
                                        <i className="feather icon-user-plus auth-icon" />
                                    </div>
                                    <h3 className="page-title">{doctorID ? 'Edit Doctor' : 'Register Doctor'}</h3>

                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="First Name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Last Name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group mb-3">
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group mb-3">
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Specialization"
                                            value={specialization}
                                            onChange={(e) => setSpecialization(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Education"
                                            value={education}
                                            onChange={(e) => setEducation(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Phone Number"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group mb-3">
                                        <input
                                            type="date"
                                            className="form-control"
                                            placeholder="Date of Birth"
                                            value={dateOfBirth}
                                            onChange={(e) => setDateOfBirth(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group mb-3">
                                        <select
                                            className="form-control"
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </div>
                                    <button className="btn btn-primary mb-4" onClick={handleRegistration}>
                                        {doctorID ? 'Update' : 'Register'}
                                    </button>

                                    {error && <p className="text-danger">{error}</p>}
                                    <p className="mb-2">
                                        Already have an account?{' '}
                                        <NavLink to="/OTPVerification" className="f-w-400">
                                            Login
                                        </NavLink>
                                    </p>
                                </Card.Body>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Registerform;
