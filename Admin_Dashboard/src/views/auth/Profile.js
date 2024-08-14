import React, { useState, useEffect } from 'react';
import '../auth/css/Profile.css'
function Profile() {
  const [formData, setFormData] = useState({
    logo: '',
    photo: '',
    name: '',
    locations: '',
    departments: '',
    timing: '',
    facilities: ''
  });

  useEffect(() => {
    // Fetch existing hospital profile data based on Hospital_id
    fetchHospitalProfile();
  }, []); // Run once on component mount

  const fetchHospitalProfile = async () => {
    try {
      const hospitalId = sessionStorage.getItem('Hospital_id');
      const response = await fetch(`http://localhost:3005/hospital/profile/${hospitalId}`); // Replace with your endpoint to fetch hospital profile
      if (!response.ok) {
        throw new Error('Failed to fetch hospital profile');
      }
      const data = await response.json();
      setFormData(data); // Update form data with fetched data
    } catch (error) {
      console.error('Error fetching hospital profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // const handleLogoChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     logo: e.target.files[0]
  //   });
  // };

  // const handleFileChange = (e) => {
  //   const { name, files } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: files[0]
  //   });
  // };

  const [imagePreviewLogo, setImagePreviewLogo] = useState('');
  const [imagePreviewPhoto, setImagePreviewPhoto] = useState('');

  const handleLogoChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFormData({
        ...formData,
        logo: selectedFile
      });
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreviewLogo(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreviewLogo('');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFormData({
        ...formData,
        photo: selectedFile
      });
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreviewPhoto(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreviewPhoto('');
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const hospitalId = sessionStorage.getItem('Hospital_id');

    const requestData = new FormData();
    requestData.append('name', formData.name);
    requestData.append('locations', formData.locations);
    requestData.append('departments', formData.departments);
    requestData.append('timing', formData.timing);
    requestData.append('facilities', formData.facilities);
    requestData.append('logo', formData.logo); // Append logo file
    requestData.append('photo', formData.photo); // Append photo file

    try {
      const response = await fetch(`http://localhost:3005/hospital/update-hospital-profile/${hospitalId}`, {
        method: 'PUT',
        body: requestData  // Send FormData object containing both form data and files
      });
      if (!response.ok) {
        throw new Error('Failed to update hospital profile');
      }
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error('Error updating hospital profile:', error);
    }
  };



  return (
    <div className="container mt-7">
      <div className='row '>
        <div className='col-md-6 ' >
          <h4>Update Hospital Profile</h4>
          <br></br>
          <form onSubmit={handleSubmit} style={{ backgroundColor: 'white' }}>
            <br></br>
            <div className="row mb-3 d-flex justify-content-center">
              {/* Hospital Logo */}
              <div className="col-md-10">
                <label htmlFor="logo" className="form-label">Hospital Logo</label>
                <input type="file" className="form-control" id="logo" name="logo" onChange={handleLogoChange} />
                {/* Display image preview or existing logo */}
                {imagePreviewLogo ? (
                  <img
                    width="100"
                    height="100"
                    src={imagePreviewLogo}
                    alt="HospitalLogoPreview"
                  />
                ) : (
                  formData.logo ? (
                    <img
                      width="100"
                      height="100"
                      src={`http://localhost:3005${formData.logo}`}
                      alt="HospitalLogo"
                      onError={(e) => {
                        console.error('Error loading logo:', e);
                        console.log('Logo path:', formData.logo);
                        console.log('Full URL:', `http://localhost:3005${formData.logo}`);
                      }}
                    />
                  ) : null
                )}
              </div>
            </div>
            {/* Hospital Photo */}
            <div className="row mb-3 d-flex justify-content-center">
              <div className="col-md-10">
                <label htmlFor="photo" className="form-label">Hospital Photo</label>
                <input type="file" className="form-control" id="photo" name="photo" onChange={handleFileChange} />
                {/* Display image preview or existing photo */}
                {imagePreviewPhoto ? (
                  <img
                    width="100"
                    height="100"
                    src={imagePreviewPhoto}
                    alt="HospitalPhotoPreview"
                  />
                ) : (
                  formData.photo ? (
                    <img
                      width="100"
                      height="100"
                      src={`http://localhost:3005${formData.photo}`}
                      alt="HospitalPhoto"
                      onError={(e) => {
                        console.error('Error loading photo:', e);
                        console.log('Photo path:', formData.photo);
                        console.log('Full URL:', `http://localhost:3005${formData.photo}`);
                      }}
                    />
                  ) : null
                )}
              </div>
            </div>

            {/* Hospital Name */}
            <div className="row mb-3 d-flex justify-content-center">
              <div className='col-md-10' >
                <label htmlFor="name" className="form-label">Hospital Name</label>
                <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} />
              </div>
            </div>
            {/* Locations */}
            <div className="row mb-3 d-flex justify-content-center">
              <div className='col-md-10' >
                <label htmlFor="locations" className="form-label">Locations</label>
                <input type="text" className="form-control" id="locations" name="locations" value={formData.locations} onChange={handleChange} />
              </div>
            </div>
            {/* Departments */}
            <div className="row mb-3 d-flex justify-content-center">
              <div className='col-md-10' >
                <label htmlFor="departments" className="form-label">Departments</label>
                <input type="text" className="form-control" id="departments" name="departments" value={formData.departments} onChange={handleChange} />
              </div>
            </div>
            {/* Timing */}
            <div className="row mb-3 d-flex justify-content-center">
              <div className='col-md-10' >
                <label htmlFor="timing" className="form-label">Timing</label>
                <input type="text" className="form-control" id="timing" name="timing" value={formData.timing} onChange={handleChange} />
              </div>
            </div>
            {/* Facilities */}
            <div className="row mb-3 d-flex justify-content-center">
              <div className='col-md-10' >
                <label htmlFor="facilities" className="form-label">Facilities</label>
                <input type="text" className="form-control" id="facilities" name="facilities" value={formData.facilities} onChange={handleChange} />
              </div>
            </div>
            {/* Submit Button */}
            <div className="row mb-3 d-flex justify-content-center">
              <div className='col-md-10' >
                <button type="submit" className="btn btn-success">Update Profile</button>
              </div>
            </div>
            <br></br>
          </form>
        </div>
        <div className="col-md-6" >
          <h4> Hospital Profile</h4>
          <br></br>
          <div className="card">
            <div className="card-body row">
              <h5 className="card-title">Hospital Details</h5>
              <div className="col-6 mb-3">
                <label className="form-label">Hospital Logo</label>
                {formData.logo && (
                  <img src={`http://localhost:3005${formData.logo}`} alt="HospitalLogo" className="img-fluid" />
                )}
              </div>
              <div className=" col-6 mb-3">
                <label className="form-label">Hospital Photo</label>
                {formData.photo && (
                  <img src={`http://localhost:3005${formData.photo}`} alt="HospitalPhoto" className="img-fluid" />
                )}
              </div>
              <p className="card-text">Hospital Name: {formData.name}</p>
              <p className="card-text">Locations: {formData.locations}</p>
              <p className="card-text">Departments: {formData.departments}</p>
              <p className="card-text">Timing: {formData.timing}</p>
              <p className="card-text">Facilities: {formData.facilities}</p>
            </div>
          </div>
        </div>
      </div>



    </div>
  );
}

export default Profile;
