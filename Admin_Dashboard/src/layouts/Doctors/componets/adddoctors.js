import { useState, useEffect } from "react";
import React from 'react'
import axios from 'axios';
import { CitySelect, CountrySelect, StateSelect } from "react-country-state-city";
import { useParams,useNavigate} from 'react-router-dom';
import "react-country-state-city/dist/react-country-state-city.css";
import img1 from './Avatar.jpg';

function AddDoctors() {
  const { id } = useParams();
  const [countryid, setCountryid] = useState(0);
  const [stateid, setStateid] = useState(0);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    dob: '',
    gender: '',
    address: '',
    country: '',
    city: '',
    state: '',
    postal_code: '',
    phone: '',
    avatar: '',
    biography: '',
    status: 'active',
    department: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.first_name) {
      alert('First Name is required');
      return;
    }

    try {
      let response;
      const formDataToSend = new FormData();

      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      if (id) {
        response = await axios.put(`http://localhost:3005/hospital/updatedoctors/${id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
      } else {
        response = await axios.post('http://localhost:3005/hospital/add-doctor', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
      }

      if (response.status === 200 || response.status === 201) {
        console.log('Doctor saved successfully', response.data);

        setFormData({
          first_name: '',
          last_name: '',
          username: '',
          email: '',
          password: '',
          confirm_password: '',
          dob: '',
          gender: '',
          address: '',
          country: '',
          city: '',
          state: '',
          postal_code: '',
          phone: '',
          avatar: '',
          biography: '',
          status: 'active',
          department: '',
          // Reset other fields as needed
        });
        navigate('/app/dashboard/doctors');
      }
    } catch (error) {
      console.error('Error submitting form:', error.message);
    }
  };





  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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


  useEffect(() => {
    console.log("id:", id);
    if (id) {

      fetchDoctorData(id);
    }
  }, [id]);

  const fetchDoctorData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3005/hospital/doctors/${id}`);
      const doctorData = response.data;
      const formattedDate = new Date(doctorData.dob);

      setFormData({
        ...doctorData,
        dob: formattedDate.toISOString().substr(0, 10),
        country: doctorData.country,
        state: doctorData.state,
        city: doctorData.city,
      });

    } catch (error) {

      console.error('Error fetching doctor data:', error);
    }
  };


  const handleDepartmentChange = (e) => {
    setFormData({
      ...formData,
      department: e.target.value,
    });
  };
  const [departmentsData, setDepartmentsData] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:3005/api/departments');
        setDepartmentsData(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className="container" style={{ backgroundColor: 'white' }}>
      <br></br>
      <div className="row" >
        <div className="col-lg-8 offset-lg-2">
          <h3 className="page-title">{id ? 'Edit Doctor' : 'Add Doctor'}</h3>
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
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
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
                    onChange={handleChange}
                    placeholder="Username"
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
                    onChange={handleChange}
                    placeholder="Email"
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
                    onChange={handleChange}
                    placeholder="Password"
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    className="form-control"
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <div className="cal-icon">
                    <input
                      type="date"
                      className="form-control datetimepicker"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </div>
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
                        onChange={handleChange}
                      />{'  '}Male{' '}
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
                        onChange={handleChange}
                      />{' '}Female{' '}
                    </label>
                  </div>
                </div><br></br>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label>Department</label>
                  <select
                    className="form-control"
                    name="department"
                    value={formData.department}
                    onChange={handleDepartmentChange}
                  >
                    <option value="">Select Department</option>
                    {departmentsData.map(department => (
                      <option key={department.dep_id} value={department.dep_id}>{department.department_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-sm-12">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address"
                      />
                    </div><br></br>
                  </div>

                  <div className="col-sm-6 col-md-6 col-lg-3">
                    <div className="form-group">
                      <label>Country</label>
                      <CountrySelect
                        onChange={(e) => {
                          setCountryid(e.id);
                          setStateid(0);
                          handleInputChange({ target: { name: 'country', value: e.name } }); // Update form data with name
                        }}
                        placeHolder="Select Country"
                        className="form-control select"
                        name="country"
                        value={formData.country}
                      />

                    </div>
                  </div>

                  <div className="col-sm-6 col-md-6 col-lg-3">
                    <div className="form-group">
                      <label>State/Province</label>
                      <StateSelect
                        countryid={countryid}
                        onChange={(e) => {
                          setStateid(e.id);
                          handleInputChange({ target: { name: 'state', value: e.name } });
                          console.log(formData.state)
                        }}
                        placeHolder="Select State"
                        className="form-control select"
                        name="state"
                        value={formData.state}
                      />

                    </div>
                  </div>

                  <div className="col-sm-6 col-md-6 col-lg-3">
                    <div className="form-group">
                      <label>City</label>
                      <CitySelect
                        countryid={countryid}
                        stateid={stateid}
                        onChange={(e) => {
                          handleInputChange({ target: { name: 'city', value: e.name } });
                        }}
                        placeHolder="Select City"
                        className="form-control select"
                        name="city"
                        value={formData.city}
                      />

                    </div>
                  </div>


                  <div className="col-sm-6 col-md-6 col-lg-3">
                    <div className="form-group">
                      <label>Postal Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        placeholder="Postal Code"
                      />
                    </div>
                  </div>
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
                    onChange={handleChange}
                    placeholder="Phone"
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
            </div>
            <div className="row">
              <div className="col-sm-12">
                <div className="form-group">
                  <label> Short Biography</label>
                  <input
                    type="text"
                    className="form-control"
                    name="biography"
                    value={formData.biography}
                    onChange={handleChange}
                    placeholder="Short Biography"
                  />
                </div><br></br>
              </div>
            </div>
            <div className="form-group">
              <label className="display-block">Status : </label><br></br>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="status"
                  id="patient_active"
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={handleChange}
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
                  value="inactive"
                  checked={formData.status === 'inactive'}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="patient_inactive">
                  Inactive
                </label>
              </div>
            </div>
            <div className="m-t-20 text-center">

              <button className="btn btn-success submit-btn">{id ? 'Update Doctors' : 'Create Doctors'}</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default AddDoctors
