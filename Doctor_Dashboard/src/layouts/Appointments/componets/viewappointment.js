import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ViewAppointment() {
    const { appointmentId } = useParams();
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        fetchAppointmentDetails();
    }, [appointmentId]);

    const fetchAppointmentDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3005/doctor/appointment-details/${appointmentId}`);
            setAppointment(response.data);
        } catch (error) {
            console.error('Error fetching appointment details:', error);
        }
    };

    if (!appointment) {
        return <div>Loading...</div>;
    }
    const adjustTimeWithTimeZone = (timeString) => {
        const time = new Date(timeString);
        const offset = time.getTimezoneOffset() / 60;
        const adjustedTime = new Date(time.getTime() + offset * 60 * 60 * 1000);
        return adjustedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    return (
        <div className='container'style={{margin:'15px'}}>
            <div className='card' >
                <div className='card-body'>
                <div className='card-title'>
                    <h4>View Appointment</h4><br></br>
                    <span className={`custom-badge status-${appointment.status.toLowerCase()}`}>
                          {appointment.status}
                        </span>
                </div>
                <div className='card-text'>
                    <div className='row'>
                   
                        <div className='col-md-6'>
                            <p>Appointment ID : {appointment.AppointmentID}</p>
                            <p>Patient Name : {appointment.patientName}</p>
                            <p>Department : {appointment.department_name}</p>
                            <p>Doctor : {appointment.first_name} {appointment.last_name}</p>
                            <p>Date : {new Date(appointment.date).toLocaleDateString()}</p>
                        </div>
                        <div className='col-md-6'>
                            <p>Time :{adjustTimeWithTimeZone(appointment.time_slot)}</p>
                            <p>Patient Email : {appointment.patientEmail}</p>
                            <p>Patient Phone Number : {appointment.patientPhoneNumber}</p>
                            <p>Appointment Type : {appointment.type}</p>
                            <p>Address : {appointment.address}</p>
                            <p>Message : {appointment.message}</p>
                        </div>
</div>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default ViewAppointment;
