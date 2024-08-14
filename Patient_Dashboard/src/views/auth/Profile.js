import React, { useState, useEffect } from 'react';
import './css/Profile.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Popup from './popup';

const ProfileCard = () => {
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State to manage the visibility of the popup
  const [popupMessage, setPopupMessage] = useState(''); // Message to be displayed in the popup


  
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const contactId = sessionStorage.getItem('Contact_id');
      const response = await axios.get(`http://localhost:3005/patient/profile/${contactId}`);
      const profileData = response.data;
      setProfileData(profileData);
      
      // Check if password data is an array and extract the first element
      const password = Array.isArray(profileData.Password) ? profileData.Password[0] : profileData.Password;
      
      setCurrentPassword(password); // Set current password from profile data
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirmed: false
  });

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleEditClick = async () => {
    try {
      const contactId = sessionStorage.getItem('Contact_id');
      const response = await axios.get(`http://localhost:3005/patient/profile/${contactId}`);
      setProfileData(response.data);
      navigate(`/Registerform/${contactId}`);
    } catch (error) {
      console.error('Error fetching patient data for editing:', error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const contactId = sessionStorage.getItem('Contact_id');
      await axios.delete(`http://localhost:3005/patient/delete-patient/${contactId}`);
      // Redirect or perform any other action after successful deletion
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };
  
  const handleChangePassword = async () => {
    // Check if new password meets validation criteria
    if (newPassword.length < 8) {
      setPopupMessage('New password must be at least 8 characters long');
      setShowPopup(true); // Show the popup with the validation message
      return;
    }
    // You can add more validation criteria here, such as requiring certain characters or patterns
  
    // Check if passwords match
    if (newPassword !== confirmedPassword) {
      setPopupMessage('New password and confirmed password do not match');
      setShowPopup(true); // Show the popup with the validation message
      return;
    }
  
    // Make API call to change password
    try {
      const contactId = sessionStorage.getItem('Contact_id');
      const response = await axios.post('http://localhost:3005/patient/change-password', {
        currentPassword,
        newPassword,
        contactId,
      });
      // Handle successful password change
      setPopupMessage(response.data.message);
      setShowPopup(true); // Show the popup with the success message
    } catch (error) {
      setPopupMessage(error.response.data.message);
      setShowPopup(true); // Show the popup with the error message
    }
  };
  

  
  const handleTogglePasswordVisibility = (inputField) => {
    if (inputField === 'current') {
      setShowPassword((prevState) => ({ ...prevState, current: !prevState.current }));
    } else if (inputField === 'new') {
      setShowPassword((prevState) => ({ ...prevState, new: !prevState.new }));
    } else if (inputField === 'confirmed') {
      setShowPassword((prevState) => ({ ...prevState, confirmed: !prevState.confirmed }));
    }
  };
  
  return (
    <>
      <div
        className="image"
        onClick={toggleModal}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            toggleModal();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="">
          <i className="fas fa-camera fa-2x"></i>
        </div>
      </div>

      <div className="containerr">
        <div className="cardd">
          <div className="header">
            <a href="#" className="mail">
              <div className="dropdown dropdown-action" style={{ color: "white" }}>
                <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false" style={{ color: "white" }}>
                  <i className="fa fa-ellipsis-v" style={{ color: "white" }}></i>
                </a>
                <div className="dropdown-menu dropdown-menu-right">
                  <a
                    className="dropdown-item"
                    onClick={handleEditClick}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEditClick();
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <i className="fa fa-pencil m-r-5"></i> Edit
                  </a>

                  <a
                    className="dropdown-item"
                    onClick={handleDeleteClick}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleDeleteClick();
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <i className="fa fa-trash-o m-r-5"></i> Delete
                  </a>
                </div>
              </div>
            </a>
            <div className="main">
              <div
                className="image"
                onClick={toggleModal}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    toggleModal();
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="hover">
                  <i className="fas fa-camera fa-2x"></i>
                </div>
                {profileData && (
                  <img src={profileData.profilePicUrl} alt="" />
                )}
              </div>
              <h3 className="name" style={{ fontSize: "25px", fontWeight: "600px" }}>{profileData ? `${profileData.FirstName} ${profileData.LastName}` : 'Loading...'}</h3>
            </div>
          </div>

          <div className="content">
            <div className="left">
              <div className="about-container">
                <div className=" row container-profile">

                  <div className="col-md-6 col-12 rounded-0 border-0 border-start-1">
                    <div className="row text-start mt-3">
                      <div className=" col-4">
                        <label className="d-flex justify-content-start" style={{ fontSize: "18px", color: "black" }}><b>Phone:</b></label>
                      </div>
                      <div className=" col-8">
                        <label className=" text-primary d-flex justify-content-start" style={{ fontSize: "18px", color: "black" }}>{profileData?.PhoneNumber}</label>
                      </div>
                      <div className=" col-4">
                        <label className="d-flex justify-content-start" style={{ fontSize: "18px", color: "black" }}><b>Email:</b></label>
                      </div>
                      <div className=" col-8">
                        <label className="d-flex justify-content-start text-primary" style={{ fontSize: "18px", color: "black" }}>{profileData?.Email}</label>
                      </div>
                      <div className=" col-4">
                        <label className="d-flex justify-content-start" style={{ fontSize: "18px", color: "black" }}><b>Birthday:</b></label>
                      </div>
                      <div className=" col-8">
                        <label className="d-flex justify-content-start" style={{ fontSize: "18px", color: "black" }}>{profileData?.DateOfBirth ? formatDate(profileData.DateOfBirth) : 'Loading...'}</label>
                      </div>
                      <div className="col-4 ">
                        <label className="d-flex justify-content-start" style={{ fontSize: "18px", color: "black" }}><b>Address:</b></label>
                      </div>
                      <div className="col-8 ">
                        <label className="d-flex justify-content-start" style={{ fontSize: "18px", color: "black" }}>{profileData?.Address}</label>
                      </div>
                      <div className="col-4 ">
                        <label className="d-flex justify-content-start" style={{ fontSize: "18px", color: "black" }}><b>Gender:</b></label>
                      </div>
                      <div className="col-8 ">
                        <label className="d-flex justify-content-start" style={{ fontSize: "18px", color: "black" }}>{profileData?.Gender}</label>
                      </div>
                    </div>
                  </div>

                  <div className=" col-md-6 password-change">
                    <h3>Change Password</h3>
                    <div className="input-group">
                      <label htmlFor="currentPassword">Current Password:</label>
                      <div className="password-input-container">
                        <input
                          id="currentPassword"
                          type={showPassword.current ? "text" : "password"}
                          placeholder="Enter your current password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="password-input"
                        />
                        <span
                          className="password-toggle-icon"
                          onClick={() => handleTogglePasswordVisibility('current')}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleTogglePasswordVisibility('current');
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          style={{ color: '#007bff' }}
                        >
                          <i className={`fas ${showPassword.current ? "fa-eye" : "fa-eye-slash"}`}></i>
                        </span>
                      </div>
                    </div>

                    <div className="input-group">
                      <label htmlFor="newPassword">New Password:</label>
                      <div className="password-input-container">
                        <input
                          id="newPassword"
                          type={showPassword.new ? "text" : "password"}
                          placeholder="Enter your new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="password-input"
                        />
                        <span
                          className="password-toggle-icon"
                          onClick={() => handleTogglePasswordVisibility('new')}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleTogglePasswordVisibility('new');
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          style={{ color: '#007bff' }}
                        >
                          <i className={`fas ${showPassword.new ? "fa-eye" : "fa-eye-slash"}`}></i>
                        </span>
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <label htmlFor="confirmedPassword">Confirm New Password:</label>
                      <div className="password-input-container">
                        <input
                          id="confirmedPassword"
                          type={showPassword.confirmed ? "text" : "password"}
                          placeholder="Confirm your new password"
                          value={confirmedPassword}
                          onChange={(e) => setConfirmedPassword(e.target.value)}
                          className="password-input"
                        />
                        <span
                          className="password-toggle-icon"
                          onClick={() => handleTogglePasswordVisibility('confirmed')}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleTogglePasswordVisibility('confirmed');
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          style={{ color: '#007bff' }}
                        >
                          <i className={`fas ${showPassword.confirmed ? "fa-eye" : "fa-eye-slash"}`}></i>
                        </span>
                      </div>
                    </div>
                    
                    <button className='btn btn-primary' onClick={handleChangePassword} style={{ marginLeft: "00px" }}>Change Password</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
       {/* Popup component */}
       <Popup
        isOpen={showPopup}
        onRequestClose={() => setShowPopup(false)}
        message={popupMessage}
      />

    </>
  );
};

export default ProfileCard;

