import { Row ,Col} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

function Setting() {

  const [formData, setFormData] = useState({
    logo: '',
    photo: '',
    name: '',
    locations: '',
    departments: '',
    timing: '',
    facilities: '',
    about:''
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
    requestData.append('about', formData.about);
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
    <>
      <Row>
        <h4 className="text-success ">Account Setting</h4>
        <form onSubmit={handleSubmit} style={{ backgroundColor: 'white' }}>
          <br></br>
          <div className='container'>
          <Row>
            {/* Hospital Logo */}
            <Col md={6}>
              <label htmlFor="logo" className="form-label">Hospital Logo</label>
              <input type="file" className="form-control" id="logo" name="logo" onChange={handleLogoChange} />
              {imagePreviewLogo ? (
                <img
                  width="100"
                  height="100"
                  src={imagePreviewLogo}
                  alt="HospitalLogoPreview"
                  style={{ marginTop: '10px' }}
                />
              ) : (
                formData.logo && (
                  <img
                    width="100"
                    height="100"
                    src={`http://localhost:3005${formData.logo}`}
                    alt="HospitalLogo"
                    style={{ marginTop: '10px' }}
                    onError={(e) => {
                      console.error('Error loading logo:', e);
                      console.log('Logo path:', formData.logo);
                      console.log('Full URL:', `http://localhost:3005${formData.logo}`);
                    }}
                  />
                )
              )}
            </Col>

            {/* Hospital Photo */}
            <Col md={6}>
              <label htmlFor="photo" className="form-label">Hospital Photo</label>
              <input type="file" className="form-control" id="photo" name="photo" onChange={handleFileChange} />
              {imagePreviewPhoto ? (
                <img
                  width="100"
                  height="100"
                  src={imagePreviewPhoto}
                  alt="HospitalPhotoPreview"
                  style={{ marginTop: '10px' }}
                />
              ) : (
                formData.photo && (
                  <img
                    width="100"
                    height="100"
                    src={`http://localhost:3005${formData.photo}`}
                    alt="HospitalPhoto"
                    style={{ marginTop: '10px' }}
                    onError={(e) => {
                      console.error('Error loading photo:', e);
                      console.log('Photo path:', formData.photo);
                      console.log('Full URL:', `http://localhost:3005${formData.photo}`);
                    }}
                  />
                )
              )}
            </Col>

            {/* Hospital Name */}
            <Col md={6}>
              <label htmlFor="name" className="form-label my-2">Hospital Name</label>
              <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} />
            </Col>

            {/* Locations */}
            <Col md={6}>
              <label htmlFor="locations" className="form-label my-2">Locations</label>
              <input type="text" className="form-control" id="locations" name="locations" value={formData.locations} onChange={handleChange} />
            </Col>

            {/* Departments */}
            <Col md={6}>
              <label htmlFor="departments" className="form-label my-2">Departments</label>
              <input type="text" className="form-control" id="departments" name="departments" value={formData.departments} onChange={handleChange} />
            </Col>

            {/* Timing */}
            <Col md={6}>
              <label htmlFor="timing" className="form-label my-2">Timing</label>
              <input type="text" className="form-control" id="timing" name="timing" value={formData.timing} onChange={handleChange} />
            </Col>

            {/* Facilities */}
            <Col md={6}>
              <label htmlFor="facilities" className="form-label my-2">Facilities</label>
              <input type="text" className="form-control" id="facilities" name="facilities" value={formData.facilities} onChange={handleChange} />
            </Col>

            <Col md={6}>
              <label htmlFor="about" className="form-label my-2">About hospital</label>
              <textarea type="text" className="form-control" id="about" name="about" value={formData.about} onChange={handleChange} />
            </Col>

            {/* Submit Button */}
            <Col md={6} className="d-flex align-items-end my-2">
            
              <button type="submit" className="btn btn-success">Update Profile</button>
            </Col>
          </Row>

          </div>
          <br></br>
        </form>
      </Row>
    </>
  );
}
export default Setting;
