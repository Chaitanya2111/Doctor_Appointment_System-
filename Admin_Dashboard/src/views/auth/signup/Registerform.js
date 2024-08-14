import React, { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import axios from 'axios';

const Registerform = () => {
    const [nameOfHospital, setNameOfHospital] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegistration = async (e) => {
        e.preventDefault();

        // Validate form fields
        if (!nameOfHospital.trim() || !email.trim() || !password.trim() || !phoneNumber.trim() || !address.trim()) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            // Send request to backend to register hospital
            const response = await axios.post('http://localhost:3005/hospital/register', {
                nameOfHospital: nameOfHospital,
                email: email,
                password: password,
                phoneNumber: phoneNumber,
                address: address
            });

            if (response.status === 201) {
                // Registration successful
                // Send request to backend to generate and send OTP
                await sendOTP(email);
                // Store email and password in sessionStorage
                sessionStorage.setItem("registrationEmail", email);
                sessionStorage.setItem("registrationPassword", password);
                // Redirect to OTP verification page
                navigate("/OTPVerification");
            } else {
                // Registration failed, display error message
                const errorData = response.data;
                setError(errorData.message || "Failed to register. Please try again.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setError("An unexpected error occurred.");
        }
    };

    const sendOTP = async (email) => {
        try {
            // Send request to backend to generate and send OTP
            await axios.post('http://localhost:3005/hospital/send_otp', { email });
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
                                    <h3 className="page-title">Register Hospital</h3>

                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Hospital Name"
                                            value={nameOfHospital}
                                            onChange={(e) => setNameOfHospital(e.target.value)}
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
                                            placeholder="Phone Number"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        />
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
                                        Register
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

