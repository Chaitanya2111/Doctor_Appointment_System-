import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo2 from './logo4-removebg-preview.png';
import { ConfigContext } from '../../../../contexts/ConfigContext';
import * as actionType from '../../../../store/actions';

const NavLogo = () => {
  const configContext = useContext(ConfigContext);
  const { collapseMenu } = configContext.state;
  const { dispatch } = configContext;
  const [formData, setFormData] = useState({
    logo: '',
    name: '',
  });

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

  useEffect(() => {
    // Fetch existing hospital profile data based on Hospital_id
    fetchHospitalProfile();
  }, []); // Run once on component mount

  let toggleClass = ['mobile-menu'];
  if (collapseMenu) {
    toggleClass = [...toggleClass, 'on'];
  }

  return (
    <React.Fragment>
      <div className="navbar-brand header-logo" style={{ backgroundColor: '#00b38f' }}>
      <Link to="#" className="b-brand">
      <div className="b-bg">
     <img
          src={formData.logo ? `http://localhost:3005${formData.logo}` : logo2}
          alt="HospitalLogo"
          style={{ height: '40px', width: '40px' ,marginRight:'5px'}}
          onError={(e) => {
            e.target.src = logo2; // Fallback to default logo if there's an error loading the custom logo
            console.error('Error loading logo:', e);
            console.log('Logo path:', formData.logo);
            console.log('Full URL:', `http://localhost:3005${formData.logo}`);
          }}
        />
     </div>
        <span className="b-title" style={{ color: 'black', fontWeight: '800',fontSize:'15px'}}>  {formData.name  ||  'Hospital '}</span>
        </Link>
        <Link to="#" className={toggleClass.join(' ')} id="mobile-collapse" onClick={() => dispatch({ type: actionType.COLLAPSE_MENU })}>
          <span />
        </Link>
      </div>
    </React.Fragment>
  );
};

export default NavLogo;
