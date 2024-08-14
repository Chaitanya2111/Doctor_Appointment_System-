import React, { useState,useEffect } from 'react';
import img1 from './Avatar.jpg';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
function AppointmentCard() {
    const [activeTab, setActiveTab] = useState('today');
    const [appointments, setAppointments] = useState([]);

    const [contactId, setContactId] = useState('');
    const navigate = useNavigate();
    const handleViewAppointment = (AppointmentID) => {
        navigate(`/viewappointment/${AppointmentID}`);
      };

    useEffect(() => {
        const contactIdFromSession = sessionStorage.getItem('Contact_id');
        setContactId(contactIdFromSession);
    }, []);
    
    useEffect(() => {
        if (contactId) {
            fetchAppointments();
        }
    }, [contactId]);
    
  
    const fetchAppointments = async () => {
      try {
     
        const response = await fetch(`http://localhost:3005/patient/getappointment/${contactId}`);
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
   
      }
    };
    
  
    const todayAppointments = appointments.filter(appointment => {
        const today = new Date();
        const appointmentDate = new Date(appointment.date);
        return appointmentDate.getDate() === today.getDate() &&
               appointmentDate.getMonth() === today.getMonth() &&
               appointmentDate.getFullYear() === today.getFullYear();
    });
    

    const upcomingAppointments = appointments.filter(appointment => new Date(appointment.date) > new Date());
    // Function to check if two dates are on the same day
    const isSameDate = (date1, date2) => {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    };
    const pastAppointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        const today = new Date();
        return appointmentDate < today && !isSameDate(appointmentDate, today);
    });
    
    const adjustTimeWithTimeZone = (timeString) => {
        const time = new Date(timeString);
        const offset = time.getTimezoneOffset() / 60;
        const adjustedTime = new Date(time.getTime() + offset * 60 * 60 * 1000);
        return adjustedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      };
    

    const renderAppointmentCards = (appointments) => {
        return appointments.map(appointment => (
            <div key={appointment.id} className="col-md-3 mb-3" >
                <a href="#" onClick={() => handleViewAppointment(appointment.AppointmentID)}>
              <div className="card" style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px', borderRadius: '10px' }} >
    <div className="doctor-img rounded-circle">
        {appointment.avatar ? (
            <img alt="" src={`http://localhost:3005${appointment.avatar}`} />
        ) : (
            <img alt="" src={img1} />
        )}
    </div>
    <div className="card-body">
        <h5 className="card-title" style={{ color: 'blue', fontWeight: '600px' }}>Dr. {appointment.first_name}{" "}{appointment.last_name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{appointment.department_name}</h6><br></br>
        <div className="row">
            <div className="col-5 " >Patient :</div>
            <div className="col-7">{appointment.patientName}</div>
        </div>
        <div className="row">
            <div className="col-5 ">Time :</div>
            <div className="col-7">{adjustTimeWithTimeZone(appointment.time_slot)}</div>
        </div>
        <div className="row">
            <div className="col-5">Location :</div>
            <div className="col-7">{appointment.address}</div>
        </div>
        <div className="row">
            <div className="col-5">Date :</div>
            <div className="col-7">{new Date(appointment.date).toLocaleDateString()}</div>
        </div>
    </div>
</div>
</a>
            </div>
        ));
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <Container>
            <Row  >
                <Col  style={{backgroundColor:'white'}}>
                <div className="tabs d-flex justify-content-center " style={{margin:'10px'}}>

<button className= {`btn ${activeTab === 'today' ? 'btn-primary ' : 'btn-outline-primary btn-lg'}`}  onClick={() => handleTabClick('today')}>Today</button>
<button className={`btn ${activeTab === 'upcoming' ? 'btn-primary' : 'btn-outline-primary btn-lg'}`} onClick={() => handleTabClick('upcoming')}>Upcoming</button>
<button className={`btn ${activeTab === 'past' ? 'btn-primary' : 'btn-outline-primary btn-lg'}`} onClick={() => handleTabClick('past')}>Past</button>

</div>
                </Col>
          
            </Row>
           
            {activeTab === 'today' && (
                <div>
                    <br></br>
                    <h5 className="mb-3">Todays Appointments</h5>
                    <div className="row">
                        {renderAppointmentCards(todayAppointments)}
                    </div>
                </div>
            )}
            {activeTab === 'upcoming' && (
                <div>  <br></br>
                    <h5 className="mb-3">Upcoming Appointments</h5>
                    <div className="row">
                        {renderAppointmentCards(upcomingAppointments)}
                    </div>
                </div>
            )}
            {activeTab === 'past' && (
                <div>  <br></br>
                    <h5 className="mb-3">Past Appointments</h5>
                    <div className="row">
                        {renderAppointmentCards(pastAppointments)}
                    </div>
                </div>
            )}

        </Container>
    );
}

export default AppointmentCard;
