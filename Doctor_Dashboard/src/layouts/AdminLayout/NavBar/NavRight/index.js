import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';

import ChatList from './ChatList';

import avatar1 from '../../../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../../../assets/images/user/avatar-3.jpg';
import avatar4 from '../../../../assets/images/user/avatar-4.jpg';

const NavRight = () => {
  const [listOpen, setListOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {  
    const doctorId = sessionStorage.getItem('Doctor_id');
    if (doctorId) {
      fetchContactDetails(doctorId);
    }
  }, []);

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

  const notiData = [
    {
      name: 'Joseph William',
      image: avatar2,
      details: 'Purchase New Theme and make payment',
      activity: '30 min'
    },
    {
      name: 'Sara Soudein',
      image: avatar3,
      details: 'currently login',
      activity: '30 min'
    },
    {
      name: 'Suzen',
      image: avatar4,
      details: 'Purchase New Theme and make payment',
      activity: 'yesterday'
    }
  ];

  const handleLogout = () => {
    // Clear any user data or tokens
    sessionStorage.clear();

    // Navigate to the login page
    navigate("/login");
  };
  const goToProfile = () => {
    // Navigate to the Profile page
    navigate("/Profile");
  };


  return (
    <React.Fragment  >
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto" id="navbar-right" >
        {/* Notifications Dropdown */}
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="start" >
            {/* Toggle */}
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic" style={{color:'#ffffff'}}>
              <i className="feather icon-bell icon" style={{color:'#ffffff',fontSize:'15px'}}/>
            </Dropdown.Toggle>
            {/* Dropdown Menu */}
            <Dropdown.Menu align="end" className="notification notification-scroll">
              {/* Dropdown Header */}
              <div className="noti-head">
                <h6 className="d-inline-block m-b-0">Notifications</h6>
                <div className="float-end">
                  <Link to="#" className="me-2">
                    mark as read
                  </Link>
                  <Link to="#">clear all</Link>
                </div>
              </div>
              {/* Notification Body */}
              <PerfectScrollbar>
                <ListGroup as="ul" bsPrefix=" " variant="flush" className="noti-body">
                  {/* New Notifications */}
                  <ListGroup.Item as="li" bsPrefix=" " className="n-title">
                    <p className="m-b-0">NEW</p>
                  </ListGroup.Item>
                  <ListGroup.Item as="li" bsPrefix=" " className="notification">
                    <Card
                      className="d-flex align-items-center shadow-none mb-0 p-0"
                      style={{ flexDirection: 'row', backgroundColor: 'unset' }}
                    >
                      <img className="img-radius" src={avatar1} alt="Generic placeholder" />
                      <Card.Body className="p-0">
                        <p>
                          <strong>John Doe</strong>
                          <span className="n-time text-muted">
                            <i className="icon feather icon-clock me-2" />
                            30 min
                          </span>
                        </p>
                        <p>New ticket Added</p>
                      </Card.Body>
                    </Card>
                  </ListGroup.Item>
                  {/* Earlier Notifications */}
                  <ListGroup.Item as="li" bsPrefix=" " className="n-title">
                    <p className="m-b-0">EARLIER</p>
                  </ListGroup.Item>
                  {notiData.map((data, index) => {
                    return (
                      <ListGroup.Item key={index} as="li" bsPrefix=" " className="notification">
                        <Card
                          className="d-flex align-items-center shadow-none mb-0 p-0"
                          style={{ flexDirection: 'row', backgroundColor: 'unset' }}
                        >
                          <img className="img-radius" src={data.image} alt="Generic placeholder" />
                          <Card.Body className="p-0">
                            <p>
                              <strong>{data.name}</strong>
                              <span className="n-time text-muted">
                                <i className="icon feather icon-clock me-2" />
                                {data.activity}
                              </span>
                            </p>
                            <p>{data.details}</p>
                          </Card.Body>
                        </Card>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </PerfectScrollbar>
              {/* Dropdown Footer */}
              <div className="noti-footer">
                <Link to="#">show all</Link>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
        {/* Chat Dropdown */}
        {/* <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown>
            <Dropdown.Toggle as={Link} variant="link" to="#" className="displayChatbox" onClick={() => setListOpen(true)}>
              <i className="icon feather icon-mail" />
            </Dropdown.Toggle>
          </Dropdown>
        </ListGroup.Item> */}
        {/* User Dropdown */}
        <ListGroup.Item as="li" bsPrefix=" " >
          <Dropdown align="start" className="drp-user">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic" style={{color:'#ffffff'}}>
              <i className="icon feather icon-settings" style={{color:'#ffffff',fontSize:'15px'}}/>
            </Dropdown.Toggle>
            {/* User Dropdown Menu */}
            <Dropdown.Menu align="end" className="profile-notification">
              {/* User Profile Header */}
              <div className="pro-head">
                {contactInfo && (
                  <>
                    <img src={avatar1} className="img-radius" alt="User Profile" />
                    <span>{contactInfo.FirstName} {contactInfo.LastName}</span>
                  </>
                )}
                {/* Logout Button */}
                <button className="dud-logout" title="Logout" onClick={handleLogout} style={{border:'none'}}>
                  <i className="feather icon-log-out" style={{color:'black'}} />
                </button>
              </div>
              {/* User Profile Body */}
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
                {/* <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-settings" /> Settings
                  </Link>
                </ListGroup.Item> */}
                <ListGroup.Item as="li" bsPrefix=" ">
                  {/* Profile Link */}
                  <Link to="/Profile" className="dropdown-item" onClick={goToProfile}>
                    <i className="feather icon-user" /> Profile
                  </Link>
                </ListGroup.Item>
                {/* <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-mail" /> My Messages
                  </Link>
                </ListGroup.Item> */}
                {/* <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-lock" /> Lock Screen
                  </Link>
                </ListGroup.Item> */}
                {/* Logout Link */}
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="/login" className="dropdown-item" onClick={handleLogout}>
                    <i className="feather icon-log-out" /> Logout
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
      {/* Chat List */}
      <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
    </React.Fragment>
  );
};

export default NavRight;
