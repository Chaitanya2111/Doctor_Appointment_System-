

import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import axios from 'axios';
const Registerform = () => {
    const { patientID } = useParams();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateOfBirth, setdateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegistration = async (e) => {
        e.preventDefault();

        // Validate form fields
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !bloodGroup.trim() || !height.trim() || !weight.trim() || !phoneNumber.trim() || !dateOfBirth.trim() || !gender.trim() || !address.trim()) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            let url;
            let method;
            let requestBody;

            if (patientID) {
                // Update existing patient
                url = `http://localhost:3005/patient/update-patient/${patientID}`;
                method = "PUT";
                requestBody = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                    bloodGroup: bloodGroup,
                    height: height,
                    weight: weight,
                    phoneNumber: phoneNumber,
                    dateOfBirth: dateOfBirth,
                    gender: gender,
                    address: address
                };
            } else {
                // Register new patient
                url = "http://localhost:3005/patient/register";
                method = "POST";
                requestBody = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                    bloodGroup: bloodGroup,
                    height: height,
                    weight: weight,
                    phoneNumber: phoneNumber,
                    dateOfBirth: dateOfBirth,
                    gender: gender,
                    address: address
                };
            }

            // Send request to backend
            const response = await axios({
                method: method,
                url: url,
                data: requestBody,
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (response.status === 201) {
                // Registration successful
                // Generate and send OTP
                await sendOTP(email);
                // Store email and password in sessionStorage
                sessionStorage.setItem("registrationEmail", email);
                sessionStorage.setItem("registrationPassword", password);

                // Redirect to OTP verification page only for registration
                if (!patientID) {
                    navigate("/OTPVerification");
                }
            } else {
                // Registration/update failed, display error message
                setError(response.data.message || "Failed to register/update. Please try again.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setError("An unexpected error occurred.");
        }
    };


    useEffect(() => {
        const fetchPatientData = async (patientID) => {
            try {
                const response = await axios.get(`http://localhost:3005/patient/get-patients/${patientID}`);
                const patientData = response.data;

                // Ensure DateOfBirth is available and not null/undefined
                if (patientData.DateOfBirth) {
                    // Parse date string into a Date object
                    const dateOfBirth = new Date(patientData.DateOfBirth);

                    // Format the date as "yyyy-MM-dd"
                    const formattedDateOfBirth = formatDate(dateOfBirth);

                    // Set the date of birth in the format "yyyy-MM-dd"
                    setdateOfBirth(formattedDateOfBirth);
                } else {
                    // Handle case where DateOfBirth is null/undefined
                    setdateOfBirth('');
                }

                // Set other patient data
                setFirstName(patientData.FirstName);
                setLastName(patientData.LastName);
                setEmail(patientData.Email);
                setPassword(patientData.Password);
                setBloodGroup(patientData.BloodGroup);
                setHeight(patientData.Height);
                setWeight(patientData.Weight);
                setPhoneNumber(patientData.PhoneNumber);
                setGender(patientData.Gender);
                setAddress(patientData.Address);
            } catch (error) {
                console.error('Error fetching patient data:', error);
            }
        };

        // Function to format date as "yyyy-MM-dd"
        const formatDate = (date) => {
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        };


        fetchPatientData(patientID);
    }, [patientID]);

    const sendOTP = async (email) => {
        try {
            // Send request to backend to generate and send OTP
            await axios.post('http://localhost:3005/patient/send_otp', { email });
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
                                    <h3 className="page-title">{patientID ? 'Edit Profile' : 'Register'}</h3>


                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="First Name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)} // Corrected variable name
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
                                            placeholder="Blood Group"
                                            value={bloodGroup}
                                            onChange={(e) => setBloodGroup(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Height"
                                            value={height}
                                            onChange={(e) => setHeight(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Weight"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
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
                                    <div className="input-group mb-3">
                                        <input
                                            type="date"
                                            className="form-control"
                                            placeholder="Date of Birth"
                                            value={dateOfBirth}
                                            onChange={(e) => setdateOfBirth(e.target.value)}
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
                                    <button className="btn btn-primary mb-4" onClick={handleRegistration}>
                                        {patientID ? 'Update' : 'Register'}
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
