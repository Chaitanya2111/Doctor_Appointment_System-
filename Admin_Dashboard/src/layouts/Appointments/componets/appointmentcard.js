import React, { useState } from 'react';
import axios from 'axios';
function AppointmentCard() {
    const [activeTab, setActiveTab] = useState('today');
    const [appointments, setAppointments] = useState([]);

    const fetchappointment = async () => {
        try {
            const response = await axios.get('http://localhost:3005/hospital/getappointment');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    fetchappointment();

    const todayAppointments = appointments.filter(appointment => {
        const today = new Date().toISOString().slice(0, 10);
        return appointment.date === today;
    });

    const upcomingAppointments = appointments.filter(appointment => new Date(appointment.date) > new Date());
    const pastAppointments = appointments.filter(appointment => new Date(appointment.date) < new Date());

    const renderAppointmentCards = (appointments) => {
        return appointments.map(appointment => (
            <div key={appointment.id} className="col-md-4 mb-3">
                <div className="card" style={{boxShadow:' rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',borderRadius:'10px'}}> 
                    <div className="card-body" >
                        <h5 className="card-title" style={{color:'blue',fontWeight:'600px'}}>Dr. {appointment.doctor}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">{appointment.department}</h6><br></br>
                        <p className="card-text">Patient : {appointment.patientName}</p>
                        <p className="card-text">Time : {new Date(appointment.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="card-text">Location : {appointment.location}</p>
                        <p className="card-text">Date : {new Date(appointment.date).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        ));
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="container">
            <div className="tabs mb-3">

                <button className={`btn ${activeTab === 'today' ? 'btn-success' : 'btn-light'}`} onClick={() => handleTabClick('today')}>Today</button>
                <button className={`btn ${activeTab === 'upcoming' ? 'btn-success' : 'btn-light'}`} onClick={() => handleTabClick('upcoming')}>Upcoming</button>
                <button className={`btn ${activeTab === 'past' ? 'btn-success' : 'btn-light'}`} onClick={() => handleTabClick('past')}>Past</button>

            </div>
            {activeTab === 'today' && (
                <div>
                    <h5 className="mb-3">Todays Appointments</h5>
                    <div className="row">
                        {renderAppointmentCards(todayAppointments)}
                    </div>
                </div>
            )}
            {activeTab === 'upcoming' && (
                <div>
                    <h5 className="mb-3">Upcoming Appointments</h5>
                    <div className="row">
                        {renderAppointmentCards(upcomingAppointments)}
                    </div>
                </div>
            )}
            {activeTab === 'past' && (
                <div>
                    <h5 className="mb-3">Past Appointments</h5>
                    <div className="row">
                        {renderAppointmentCards(pastAppointments)}
                    </div>
                </div>
            )}

        </div>
    );
}

export default AppointmentCard;
