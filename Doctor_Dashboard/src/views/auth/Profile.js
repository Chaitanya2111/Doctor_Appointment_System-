import React, { useState, useEffect } from 'react';
import './css/Profile.css';
import dr from './Avatar.jpg'; // Import your default doctor image here
import Tabsall from './tabsall';

function Profile() {
  const [contactInfo, setContactInfo] = useState(null);
  const [doctorImage, setDoctorImage] = useState(null);
  const [fetchingImage, setFetchingImage] = useState(true); // State to track image fetching

  useEffect(() => {
    const doctorId = sessionStorage.getItem('Doctor_id');
    if (doctorId) {
      fetchDoctorDetails(doctorId);
      fetchDoctorImage(doctorId);
    }
  }, []);

  // Function to fetch doctor's information from API
  const fetchDoctorDetails = async (doctorId) => {
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

  // Function to fetch doctor's image from API
  const fetchDoctorImage = async (doctorId) => {
    try {
      const response = await fetch(`http://localhost:3005/doctor/doctorimage/${doctorId}`);
      if (response.ok) {
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        setDoctorImage(imageUrl);
      } else {
        console.error('Failed to fetch doctor image');
      }
    } catch (error) {
      console.error('Error fetching doctor image:', error);
    } finally {
      setFetchingImage(false); // Set fetchingImage to false after image is fetched
    }
  };

  

  return (
    <div className="container" style={{ marginTop: "100px" }}>
      <div id="firstdiv"></div>
      <div className="bg-white">
        <div className='d-flex'>
          <div className="mx-4">
            {/* Display default image until doctor's image is fetched */}
            {fetchingImage ? (
              <img alt="dr" src={dr} className="rounded-circle shadow" id="dr" />
            ) : (
              <img alt="dr" src={doctorImage || dr} className="rounded-circle shadow" id="dr" />
            )}
          </div>
          <div>
            {contactInfo && (
              <>

                <h3> <br></br>Dr. {contactInfo.FirstName} {contactInfo.LastName}</h3>
                <p>{contactInfo.specialization}</p>
              </>
            )}
          </div>
        </div>
        <Tabsall></Tabsall>
      </div>
    </div>
  );
}

export default Profile;
