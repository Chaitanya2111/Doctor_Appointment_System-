import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { FaLongArrowAltRight, FaPhoneSquareAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import './css/Tabsall.css';

import axios from 'axios';
function Tabsall() {
  const [newExperience, setNewExperience] = useState({
    experience: '',
    period: '',
    title: '',
    hospital: ''
  });
  const [doctorExperiences, setDoctorExperiences] = useState([]);
  const [specialities, setSpecialities] = useState('');
  const [bio, setBio] = useState('');

  const [doctorId, setDoctorId] = useState(null);
  
  const [imageFile, setImageFile] = useState(null);

  const [newPassword, setNewPassword] = useState('');
  const [retypeNewPassword, setRetypeNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');
  const [showExperienceForm, setShowExperienceForm] = useState(false); // New state variable for showing the form
  const [selectedExperience, setSelectedExperience] = useState(null); // New state variable for the selected experience

  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    // Fetch the image from the server
    const fetchImage = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/doctor/doctorimage/${doctorId}`, {
          responseType: 'arraybuffer'
        });
        const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(imageBlob);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error('Error fetching doctor image:', error);
      }
    };

    fetchImage();
  }, [doctorId]);
  const [contactInfo, setContactInfo] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    PhoneNumber: '',
  });
  const handleEditProfile = async () => {
    try {
      const response = await fetch(`http://localhost:3005/doctor/updatedoctor/${doctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FirstName: contactInfo.FirstName,
          LastName: contactInfo.LastName,
          Email: contactInfo.Email,
          PhoneNumber: contactInfo.PhoneNumber,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update doctor information');
      }

      // Handle success
      alert('Doctor profile updated successfully');
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const handleDoubleClick = () => {
    setEditMode(true);
    console.log(editMode)
  };
  useEffect(() => {
    const id = sessionStorage.getItem('Doctor_id');
    if (id) {
      setDoctorId(id);
      fetchContactDetails(id);
      fetchProfileData(id);
      
    } else {
      console.error('Doctor ID not found in sessionStorage');
    }
  }, []);
  const fetchProfileData = async (id) => {
    try {
      const response = await fetch(`http://localhost:3005/doctor/profile/${id}`);
      if (response.ok) {
        const profileData = await response.json();
        console.log('Profile Data:', profileData); // Add this line to log the profile data
        const specialtiesArray = Array.isArray(profileData.specialities)
          ? profileData.specialities
          : profileData.specialities ? profileData.specialities.split(',') : [];
        setSpecialities(specialtiesArray);
        setBio(profileData.bio || '');
      } else {
        console.error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  // Function to fetch contact details from API
  const fetchContactDetails = async (doctorId) => {
    try {
      const response = await fetch(`http://localhost:3005/doctor/doctorinfo/${doctorId}`);
      if (response.ok) {
        const contactData = await response.json();
        setContactInfo(contactData);

      } else {
        console.error('Failed to fetch contact details');
      }
    } catch (error) {
      console.error('Error fetching contact details:', error);
    }
  };

  useEffect(() => {
    const fetchDoctorExperience = async () => {
      try {
        const response = await fetch(`http://localhost:3005/doctor/profile/${doctorId}/experience`);
        if (!response.ok) {
          throw new Error('Failed to fetch doctor experience');
        }
        const data = await response.json();
        setDoctorExperiences(data);
        console.log(setNewExperience)
      } catch (error) {
        console.error('Error fetching doctor experience:', error);
      }
    };

    fetchDoctorExperience();
  }, [doctorId]);


  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const [schedule, setSchedule] = useState({
    Monday: '8.00-20.00',
    Tuesday: '8.00-20.00',
    Wednesday: '8.00-20.00',
    Thursday: '8.00-20.00',
    Friday: '8.00-20.00',
    Saturday: '8.00-14.00',
    Sunday: '8.00-18.00'
  });


  const handleScheduleChange = (day, value) => {
    setSchedule({ ...schedule, [day]: value });
  };



  const saveSchedule = async () => {
    try {
      const doctorId = sessionStorage.getItem('Doctor_id');
      const response = await fetch('http://localhost:3005/doctor/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ doctorId, schedule })
      });
      if (response.ok) {
        console.log('Schedule saved successfully');
      } else {
        console.error('Failed to save schedule');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };


  const [timetable, setTimetable] = useState({
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
    Saturday: '',
    Sunday: ''
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchTimetable = async (doctorId) => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3005/doctor/timetable/${doctorId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch timetable');
        }
        const data = await response.json();
        setTimetable(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching timetable:', error);
        setError('Error fetching timetable. Please try again later.');
        setTimetable({
          Monday: '8.00-20.00',
          Tuesday: '8.00-20.00',
          Wednesday: '8.00-20.00',
          Thursday: '8.00-20.00',
          Friday: '8.00-20.00',
          Saturday: '8.00-14.00',
          Sunday: '8.00-18.00'
        });
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchTimetable(doctorId);
    }
  }, [doctorId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!timetable) {
    return <div>No timetable data available</div>;
  }







  const saveSpecialtiesBio = async () => {
    try {
      const response = await fetch('http://localhost:3005/doctor/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          specialities: specialities,
          bio: bio,
          Doctor_id: doctorId, // Ensure doctorId is passed in the request body
        }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error saving specialties and bio:', error);
      setMessage('Error saving specialties and bio');
    }
  };

  const addNewExperience = async () => {
    try {
      const response = await fetch('http://localhost:3005/doctor/profile/experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ doctorId, ...newExperience })
      });

      if (response.ok) {
        console.log('Experience added successfully');
        setEditMode(false); // Exit edit mode after successful addition
        setNewExperience({
          experience: '',
          period: '',
          title: '',
          hospital: ''
        }); // Clear the new experience form
      } else {
        console.error('Failed to add experience');
      }
    } catch (error) {
      console.error('Error adding experience:', error);
    }
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setNewExperience({
      ...newExperience,
      [name]: value,
    });
    setContactInfo({ ...contactInfo, [name]: value });
  };

  const handleExperienceClick = (experience) => {
    setSelectedExperience(experience);
    setNewExperience({
      experience: experience.Experience,
      period: experience.Period,
      title: experience.Title,
      hospital: experience.Hospital
    });
    setShowExperienceForm(true);
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('doctorId', doctorId); // Assuming you have doctorId in sessionStorage
  
      const response = await axios.post('http://localhost:3005/doctor/uploadImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data.success) {
        console.log('Image uploaded successfully');
        // Optionally, handle success message or UI updates
        alert('Image uploaded successfully');
      } else {
        console.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'oldPassword') {
      setOldPassword(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'retypeNewPassword') {
      setRetypeNewPassword(value);
    }
    setNewExperience({
      ...newExperience,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== retypeNewPassword) {
      setMessage('New passwords do not match');
      return;
    }

    try {
      const email = contactInfo?.Email; // Ensure email is defined and not null
      if (!email) {
        setMessage('Email is not available');
        return;
      }

      const response = await fetch('http://localhost:3005/doctor/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,

          newPassword,
          repeatPassword: retypeNewPassword,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setMessage('Old password is incorrect');
        } else {
          throw new Error('Network response was not ok');
        }
      } else {
        const data = await response.json();
        setMessage(data.message);
        setNewPassword('');
        setRetypeNewPassword('');

      }
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage('Error updating password');
    }
  };

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setNewExperience({ ...newExperience, [name]: value });
  };
  
  
  const handleUpdateExperience = async () => {
    const ExperienceID = selectedExperience.ExperienceID;
    try {
      const response = await axios.put(`http://localhost:3005/doctor/profile/updateexperience/${ExperienceID}`, {
        doctorId,
        experience: newExperience.experience,
        period: newExperience.period,
        title: newExperience.title,
        hospital: newExperience.hospital
      });

      if (response.status === 200) {
        alert('Experience updated successfully');
        setShowExperienceForm(false);
      }
    } catch (error) {
      console.error('Error updating experience:', error);
      alert('Error updating experience');
    }
  };


  return (
    <div className="container">
      <div className="tabs my-5">
        <button
          className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-light btn-lg'}`}
          onClick={() => handleTabClick('overview')}
        >
          Overview
        </button>
        <button
          className={`btn ${activeTab === 'experience' ? 'btn-primary' : 'btn-light btn-lg'}`}
          onClick={() => handleTabClick('experience')}
        >
          Experience
        </button>
        <button className={`btn ${activeTab === 'reviews' ? 'btn-primary' : 'btn-light btn-lg'}`} onClick={() => handleTabClick('reviews')}>
          Reviews
        </button>
        <button
          className={`btn ${activeTab === 'timetable' ? 'btn-primary' : 'btn-light btn-lg'}`}
          onClick={() => handleTabClick('timetable')}
        >
          Time Table
        </button>
        <button
          className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-light btn-lg'}`}
          onClick={() => handleTabClick('settings')}
        >
          Settings
        </button>
      </div>
      {activeTab === 'overview' && (
        <div className="py-3">
          <h6>Bio:</h6>
          <p>{bio}</p>
          <h6>Specialties:</h6>
          {specialities.length > 0 ? (
            <ul className="list-unstyled">
              {specialities.map((speciality, index) => (
                <li key={index}>
                  <FaLongArrowAltRight /> {speciality.trim()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No specialities available</p>
          )}

        </div>
      )}

      {activeTab === 'experience' && (
        <div className="py-3">
          {doctorExperiences.length > 0 && (
            <>
              <h6 className="mb-3">Experience</h6>
              <p>{doctorExperiences[0].Experience}</p>
              <br />
            </>
          )}
          <h6>Professional Experience:</h6>
          <Row className="my-4">
            {doctorExperiences.length > 0 ? (
              doctorExperiences.map((experience, index) => (
                <Col md={3} key={index}>
                  <Card onClick={() => handleExperienceClick(experience)} className="border">
                    <Card.Body >
                      <p>{experience.Period}</p>
                      <h6>{experience.Title}</h6>
                      <p>{experience.Hospital}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col md={12}>
                <p>No experience found.</p>
              </Col>
            )}
          </Row>
          {showExperienceForm && (
            <Col md={12}>
              <Card className="border">
                <Card.Body>
                  <Row>
                    <Col md={12} >
                        {/* <h6>Doctor ID: {doctorId || 'Loading...'}</h6> */}
                      <h6>Edit Experience</h6>
                    </Col>
                    <Col md={12}>
                      <Card onDoubleClick={() => setEditMode(true)}>
                        <Card.Body>
                          <Col md={12} className="my-3">
                            <h6>Experience</h6>
                            <textarea
                              className="form-control"
                              placeholder="Detail Experience"
                              name="experience"
                              value={newExperience.experience}
                              onChange={handleInputChange1}
                              rows={5}
                            />
                          </Col>
                          <Col md={12} className="my-3">
                            <h6>Period</h6>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g. 2014-2016"
                              name="period"
                              value={newExperience.period}
                              onChange={handleInputChange1}
                            />
                          </Col>
                          <Col md={12} className="my-3">
                            <label>Title</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g. Gynecology Test"
                              name="title"
                              value={newExperience.title}
                              onChange={handleInputChange1}
                            />
                          </Col>
                          <Col md={12} className="my-3">
                            <label>Hospital</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g. X.Y.Z Hospital (NZ)"
                              name="hospital"
                              value={newExperience.hospital}
                              onChange={handleInputChange1}
                            />
                          </Col>
                          <Col md={12} className="my-3">
                          <button className="btn btn-primary mt-3" onClick={handleUpdateExperience}>
                          Update Experience
                        </button>
                          </Col>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          )}
        </div>
      )}
      {activeTab === 'reviews' && (
        <div>
          <h6 className="mb-3">Review</h6>
          <div className="row"></div>
        </div>
      )}
      {activeTab === 'timetable' && (
        <div>
          <Row>
            <Col md={4}>
              <Card className=" border">
                <div className="mb-3">
                  <Row className="d-flex justify-content-around m-2 ">
                    <Col >Monday</Col>
                    <Col className="text-info">Time: {timetable.Monday}</Col>
                  </Row>
                  <br />
                  <Row className="d-flex justify-content-around m-2">
                    <Col>Tuesday</Col>
                    <Col className="text-info">Time: {timetable.Tuesday}</Col>
                  </Row>
                  <br />
                  <Row className="d-flex justify-content-around m-2">
                    <Col>Wednesday</Col>
                    <Col className="text-info">Time: {timetable.Wednesday}</Col>
                  </Row>
                  <br />
                  <Row className="d-flex justify-content-around m-2">
                    <Col>Thursday</Col>
                    <Col className="text-info">Time: {timetable.Thursday}</Col>
                  </Row>
                  <br />
                  <Row className="d-flex justify-content-around m-2">
                    <Col>Friday</Col>
                    <Col className="text-info">Time: {timetable.Friday}</Col>
                  </Row>
                  <br />
                  <Row className="d-flex justify-content-around m-2">
                    <Col>Saturday</Col>
                    <Col className="text-info">Time: {timetable.Saturday}</Col>
                  </Row>
                  <br />
                  <Row className="d-flex justify-content-around m-2">
                    <Col>Sunday</Col>
                    <Col className="text-info">Time: {timetable.Sunday}</Col>
                  </Row>
                  <br />
                </div>
              </Card>
            </Col>
            <Col md={4} className="text-center">
              <p id="icon">
                <FaPhoneSquareAlt />
              </p>
              <h4>Phone</h4>
              <p>Great doctor if you need your family member to get effective immediate assistance</p>
              <h6 className="text-info"> {contactInfo.PhoneNumber || ''}</h6>
            </Col>
            <Col md={4} className="text-center">
              <p id="icon">
                <MdEmail />
              </p>
              <h4>Email</h4>
              <p>Great doctor if you need your family member to get effective immediate assistance</p>
              <h6 className="text-info"  > {contactInfo.Email || ''}</h6>
            </Col>
          </Row>
        </div>
      )}
      {activeTab === 'settings' && (
        <div>
          <h6 className="mb-3">Settings</h6>
          <Row>
            <Col md={7}>
            <Card className="border">
      <Card.Body>
        <Row >
        <Col md={3} className="text-center">
            <img alt="dr" src={imageSrc || 'default-image-path.jpg'} className="rounded-circle shadow my-3" id="img" />
          </Col>
          <Col md={4}>
            <div className="m-2">
              <h5 >Upload your picture</h5>
              <p style={{ color: 'grey' }}>
                For best results, use an image at least 256px by 256px in either .jpg or .png format
              </p>
            </div>
          </Col>
          <Col md={5}>
            <div className="">
              <br />
              <input type="file" className="form-control" onChange={handleFileChange} /><br />
              <Button variant="primary" onClick={uploadImage}>
                Upload
              </Button>
              <button type="button" className="btn btn-danger">
                Remove
              </button>
            </div>
          </Col>

          <Col md={6}>
            <h6>First Name</h6>
            <input
              type="text"
              className="form-control"
              placeholder="First Name :"
              name="FirstName"
              value={contactInfo.FirstName}
              onChange={handleInputChange}
            />
          </Col>
          <Col md={6}>
            <h6>Last Name</h6>
            <input
              type="text"
              className="form-control"
              placeholder="Last Name :"
              name="LastName"
              value={contactInfo.LastName}
              onChange={handleInputChange}
            />
          </Col>
          <Col md={6} className="my-2">
            <h6>Your Email</h6>
            <input
              type="text"
              className="form-control"
              placeholder="Your Email :"
              name="Email"
              value={contactInfo.Email}
              onChange={handleInputChange}
            />
          </Col>
          <Col md={6} className="my-2">
            <h6>Phone no.</h6>
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control"
                placeholder="Phone no. :"
                name="PhoneNumber"
                value={contactInfo.PhoneNumber}
                onChange={handleInputChange}
              />
            </div>
            <Button
              variant="info"
              onClick={handleEditProfile}
              className='mt-4'
              style={{float:"right"}}
            >
             Update Profile
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
              <Col md={12}>
                <Card className="border">
                  <Card.Body>
                    <Row>
                      <Col md={12} className="my-2">
                          {/* <h6>Doctor ID: {doctorId || 'Loading...'}</h6> */}
                        <h5 className='cardheading'>Specialities</h5>
                        <textarea
                          className="form-control"
                          placeholder="List your specialities, separated by commas"
                          rows="3"
                          value={specialities}
                          onChange={(e) => setSpecialities(e.target.value)}
                        ></textarea>
                      </Col>
                      <Col className="my-2">
                        <h6>Your Bio Here</h6>
                        <textarea
                          className="form-control"
                          placeholder="Bio"
                          rows="5"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                        ></textarea>
                        <br />
                        <button type="button" className="btn btn-primary" onClick={saveSpecialtiesBio}>
                          Submit
                        </button>
                        {message && <p className="mt-2">{message}</p>}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Card className="border">
                <Card.Body>
                  <Row >
                    <Col md={12} >
                      <h5 className='cardheading'>Account Notifications :</h5>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                      {/* <h6>Doctor ID: {doctorId || 'Loading...'}</h6> */}
                    <Col md={12} className="my-3">
                      <h6>Old password :</h6>
                      <input type="text" className="form-control" placeholder="Old password"
                        value={contactInfo.Password || ''} />
                    </Col>
                    <Col md={12} className="my-3">
                      <h6>New password :</h6>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="New password"
                        name="newPassword"
                        value={newPassword}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={12} className="my-3">
                      <h6>Re-type New password :</h6>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Re-type New password"
                        name="retypeNewPassword"
                        value={retypeNewPassword}
                        onChange={handleChange}
                      />
                      <br />
                      <button className="btn btn-primary" type="submit" onClick={handleSubmit}>
                        Save password
                      </button>
                    </Col>
                    {message && (
                      <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`} role="alert">
                        {message}
                      </div>
                    )}

                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col md={5}>
              <Card className="border">
                <Card.Body>
                  <Row>
                    <Col md={12} >
                        {/* <h6>Doctor ID: {doctorId || 'Loading...'}</h6> */}
                      <h5 className='cardheading'>Update Schedule</h5>
                    </Col>
                    <Col md={12} className="p-3 ">
                      <Card>
                        <Card.Body>

                          {Object.keys(schedule).map((day) => (
                            <div key={day} className="mb-2">
                              <label>{day}</label>
                              <input
                                type="text"
                                className="form-control"
                                value={schedule[day]}
                                onChange={(e) => handleScheduleChange(day, e.target.value)}
                              />
                            </div>
                          ))}
                          <button className="btn btn-primary mt-3" onClick={saveSchedule}>
                            Save Schedule
                          </button>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>



              <Col md={12}>
                <Card className="border">
                  <Card.Body>
                    <Row>
                      <Col md={12} >
                          {/* <h6>Doctor ID: {doctorId || 'Loading...'}</h6> */}
                        <h5 className='cardheading'>Add New Experience</h5>
                      </Col>
                      <Col md={12} >
                        <Card onDoubleClick={handleDoubleClick}>
                          <Card.Body>
                            <Col md={12} className="my-3">
                              <h6>Experience</h6>
                              <textarea
                                className="form-control"
                                placeholder="Detail Experience"
                                name="experience"
                                value={newExperience.experience}
                                onChange={handleChange} // Add onChange handler
                                rows={5} // Set the number of visible rows
                              />
                            </Col>

                            <Col md={12} className="my-3">
                              <h6>Period</h6>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. 2014-2016"
                                name="period"
                                value={newExperience.period}
                                onChange={handleChange} // Add onChange handler
                              />
                            </Col>
                            <Col md={12} className="my-3">
                              <h6>Title</h6>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. Gynecology Test"
                                name="title"
                                value={newExperience.title}
                                onChange={handleChange} // Add onChange handler
                              />
                            </Col>
                            <Col md={12} className="my-3">
                              <h6>Hospital</h6>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. X.Y.Z Hospital (NZ)"
                                name="hospital"
                                value={newExperience.hospital}
                                onChange={handleChange} // Add onChange handler
                              />
                            </Col>
                            <Col md={12} className="my-3">
                              <button className="btn btn-primary mt-3" onClick={addNewExperience}>
                                Add Experience
                              </button>
                            </Col>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>






              <Card className="border">
                <Card.Body>
                  <Row>
                    <Col md={12} >
                      <h6>General Notifications :</h6>
                    </Col>
                    <Col>
                      <h3 className="text-danger">Delete Account :</h3>
                      <hr />
                      <p>Do you want to delete the account? Please press below Delete button</p>
                      <br />
                      <button type="button" className="btn btn-danger">
                        Delete Account
                      </button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
export default Tabsall;
