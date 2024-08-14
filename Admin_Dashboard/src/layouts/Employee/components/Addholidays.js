import React, { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/Addholidays.css';
import { useParams } from 'react-router-dom';

function AddHoliday() {
    const { holidayId } = useParams();

    useEffect(() => {
        if (holidayId) {
            fetchHoliday(holidayId);
        }
    }, [holidayId]);

    const fetchHoliday = async (id) => {
        try {
            const response = await fetch(`http://localhost:3005/api/holidays/${id}`);
            const data = await response.json();
            setHolidayName(data.title);
            setHolidayDate(new Date(data.date)); // Convert date string to Date object
        } catch (error) {
            console.error('Error fetching holiday:', error);
        }
    };
    
    const [holidayDate, setHolidayDate] = useState(null);
    const [holidayName, setHolidayName] = useState('');

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const url = holidayId ? `http://localhost:3005/api/holidays/${holidayId}` : 'http://localhost:3005/api/add-holiday';
            const method = holidayId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: holidayName,
                    date: holidayDate.toISOString().split('T')[0], // Convert date to ISO format (YYYY-MM-DD)
                    day: holidayDate.toLocaleDateString('en-US', { weekday: 'long' }) // Get the weekday name
                })
            });

            if (response.ok) {
                console.log('Holiday added/updated successfully!');
                // Redirect or show a success message
            } else {
                console.error('Failed to add/update holiday:', response.statusText);
                // Handle error, show error message, etc.
            }
        } catch (error) {
            console.error('Error adding/updating holiday:', error);
            // Handle error, show error message, etc.
        }
    }

    return (
        <div className="content">
            <div className="row">
                <div className="col-lg-8 offset-lg-2">
                    <h3 className="page-title">{holidayId ? 'Edit Holiday' : 'Add Holiday'}</h3>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-8 offset-lg-2">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Holiday Name <span className="text-danger">*</span></label>
                            <input 
                                className="form-control" 
                                type="text" 
                                value={holidayName}
                                onChange={(e) => setHolidayName(e.target.value)}
                            />
                        </div>
                        <div className="col-md-12">
                            <label style={{ fontSize: "20px" }}>Holiday Date <span className="text-danger">*</span></label>
                            <div className="form-group form-focus">
                                <div className="input-with-icon">
                                    <DatePicker
                                        className="form-control floating datetimepicker"
                                        selected={holidayDate}
                                        onChange={date => {
                                            setHolidayDate(date);
                                        }}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                    <FaCalendarAlt className="calendar-icon" />
                                </div>
                            </div>
                        </div>
                        <div className="m-t-20 text-center">
                            <button type="submit" className="btn btn-success submit-btn" style={{ fontSize: "20px", fontWeight: "600" }}>{holidayId ? 'Update Holiday' : 'Create Holiday'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddHoliday;
