import React, { useState, useEffect } from 'react';
import { CitySelect, CountrySelect, StateSelect } from "react-country-state-city";
import { useParams,useNavigate} from 'react-router-dom';
import "react-country-state-city/dist/react-country-state-city.css";
import img1 from './Avatar.jpg';
import axios from 'axios';
function AddPatients() {
  const [countryid, setCountryid] = useState(0);
  const [stateid, setStateid] = useState(0);
  const { pat_id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: '',
    address: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    phone: '',
    status: 'Active',
    avatar: null,
  });



  const handleInputChange = (e) => {
    if (e && e.target && e.target.name) {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };



  const [imagePreview, setImagePreview] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFormData({
      ...formData,
      avatar: selectedFile,
    });

    // Display the selected image preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (!formData.firstName) {
      alert('First Name is required');
      return;
    }
  
    try {
      let response;
      const formDataToSend = new FormData();
  
     
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
  
      if (pat_id) {
        response = await axios.put(`http://localhost:3005/hospital/updatepatients/${pat_id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
      } else {
        response = await axios.post('http://localhost:3005/hospital/submit-formpatients', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
      }
  
      if (response.status === 200 || response.status === 201) {
        alert(pat_id ? 'Patient updated successfully!' : 'Patient created successfully!');
       
        setFormData({
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          dob: '',
          gender: '',
          address: '',
          country: '',
          state: '',
          city: '',
          postalCode: '',
          phone: '',
          status: 'Active',
          avatar: null,
          // Reset other fields as needed
        });
        navigate('/app/dashboard/patients');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form.');
    }
  };
  
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/hospital/patients/${pat_id}`);
        const patientData = response.data;

        const formattedDate = new Date(patientData.dob);

        setFormData({
          ...formData,
          firstName: patientData.firstName || '',
          lastName: patientData.lastName || '',
          username: patientData.username || '',
          email: patientData.email || '',
          password: patientData.password || '',
          confirmPassword: patientData.confirmPassword || '',
          dob: formattedDate.toISOString().substr(0, 10),
          gender: patientData.gender || '',
          address: patientData.address || '',
          country: patientData.country || '',
          state: patientData.state || '',
          city: patientData.city || '',
          postalCode: patientData.postalCode || '',
          phone: patientData.phone || '',
          status: patientData.status || 'Active',
          avatar: patientData.avatar || null,
        });


        if (patientData.country) {
          const countryDetails = CountrySelect.getCountryByShort(patientData.country);
          if (countryDetails) {
            setCountryid(countryDetails.id);
          }
        }
        if (patientData.state) {
          const stateDetails = StateSelect.getStateByName(patientData.state);
          if (stateDetails) {
            setStateid(stateDetails.id);
          }
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    if (pat_id) {
      fetchPatientData();
    }
  }, [pat_id]);



  return (
    <div className="container" style={{ backgroundColor: 'white' }}>
      <br></br>
      <div className="row" >
        <div className="col-lg-8 offset-lg-2">
          <h4 className="page-title">{pat_id ? 'Edit Patient' : 'Create Patient'}</h4>
        </div>
      </div>
      <br></br>
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>First Name <span className="text-danger">*</span></label>
                  <input
                    className="form-control"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Username <span className="text-danger">*</span></label>
                  <input
                    className="form-control"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Email <span className="text-danger">*</span></label>
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    className="form-control"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group gender-select">
                  <label className="gen-label">Gender : </label><br></br>
                  <div className="form-check-inline">
                    <label className="form-check-label">
                      <input
                        type="radio"
                        name="gender"
                        className="form-check-input"
                        value="Male"
                        checked={formData.gender === 'Male'}
                        onChange={handleInputChange}
                      />
                      Male
                    </label>
                  </div>
                  <div className="form-check-inline">
                    <label className="form-check-label">
                      <input
                        type="radio"
                        name="gender"
                        className="form-check-input"
                        value="Female"
                        checked={formData.gender === 'Female'}
                        onChange={handleInputChange}
                      />
                      Female
                    </label>
                  </div>
                </div>

              </div>
              <div className="col-sm-12">
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-sm-6 col-md-6 col-lg-3">
                <div className="form-group">
                  <label>Country</label>
                  <option>{formData.country}</option>
                  <CountrySelect
                    onChange={(e) => {
                      setCountryid(e.id);
                      setStateid(0);
                      handleInputChange({ target: { name: 'country', value: e.name } }); // Update form data with name
                    }}
                    placeHolder="Select Country"
                    className="form-control select"
                    name="country"
                  />

                </div>
              </div>
              <div className="col-sm-6 col-md-6 col-lg-3">
                <div className="form-group">
                  <label>State/Province</label>
                  <option>{formData.state}</option>
                  <StateSelect
                    countryid={countryid}
                    onChange={(e) => {
                      setStateid(e.id);
                      handleInputChange({ target: { name: 'state', value: e.name } }); // Update form data with name
                    }}
                    placeHolder="Select State"
                    className="form-control select"
                    name="state"
                  />


                </div>
              </div>
              <div className="col-sm-6 col-md-6 col-lg-3">
                <div className="form-group">
                  <label>City</label>
                  <option>{formData.city}</option>
                  <CitySelect
                    countryid={countryid}
                    stateid={stateid}
                    onChange={(e) => {
                      handleInputChange({ target: { name: 'city', value: e.name } });

                    }}
                    placeHolder="Select City"
                    className="form-control select"
                    name="city"
                  />

                </div>
              </div>
              <div className="col-sm-6 col-md-6 col-lg-3">
                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Phone </label>
                  <input
                    className="form-control"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Avatar</label>
                  <div className="profile-upload">
                    <div className="upload-input">
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                        name="avatar"
                      />
                    </div><br></br>
                    {imagePreview ? (
                      <img
                        width="100"
                        height="100"
                        src={imagePreview}
                        alt=""
                      />
                    ) : (
                      formData.avatar ? (
                        <img
                          width="100"
                          height="100"
                          src={`http://localhost:3005${formData.avatar}`}
                          alt="Doctor Avatar"
                          onError={(e) => {
                            console.error('Error loading image:', e);
                            console.log('Image path:', formData.avatar);
                            console.log('Full URL:', `http://localhost:3005${formData.avatar}`);
                          }}
                        />
                      ) : (
                        <img
                          width="100"
                          height="100"
                          src={img1}
                          alt=""
                        />
                      ))
                    }
                  </div>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="form-group">
                  <label>Status : </label><br></br>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      id="patient_active"
                      value="Active"
                      checked={formData.status === 'Active'}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="patient_active">
                      Active
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      id="patient_inactive"
                      value="Inactive"
                      checked={formData.status === 'Inactive'}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="patient_inactive">
                      Inactive
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="m-t-20 text-center">
              <button className="btn btn-success submit-btn">
                {pat_id ? 'Update Patient' : 'Create Patient'}
              </button>

            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

export default AddPatients;
