import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HolidaysList() {
    const [holidays, setHolidays] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHolidays();
    }, []);

    const fetchHolidays = async () => {
        try {
            const response = await fetch('http://localhost:3005/api/holidays');
            const data = await response.json();
            setHolidays(data);
        } catch (error) {
            console.error('Error fetching holidays:', error);
        }
    };

    const handleAddHolidays = () => {
        navigate('/addholidays');
    };

    const handleEditHoliday = (holidayId) => {
        const holidayToEdit = holidays.find(holiday => holiday.id === holidayId);
        navigate(`/addholidays/${holidayId}`, { state: { holidayToEdit } });
    };
    
    const currentDate = new Date();

    return (
        <div className="content">
            <div className="row">
                <div className="col-12">
                    <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                        <h3 style={{ float: "left", fontWeight: "bolder" }}>Holidays 2024</h3>
                        <button className="btn btn-success" onClick={handleAddHolidays} style={{ fontWeight: "550", fontSize: "18px", borderRadius: "25px", float: "right", margin: "8px" }}>
                            <i className="fa fa-plus"></i> Add Holidays
                        </button>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="table-responsive">
                        <table className="table table-striped custom-table mb-0">
                            <thead>
                                <tr>
                                    <th style={{ fontSize: "20px" }}>#</th>
                                    <th style={{ fontSize: "20px" }}>Title</th>
                                    <th style={{ fontSize: "20px" }}>Holiday Date</th>
                                    <th style={{ fontSize: "20px" }}>Day</th>
                                    <th style={{ fontSize: "20px" }} className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {holidays.map(holiday => {
                                    const holidayDate = new Date(holiday.date);
                                    const isPast = holidayDate < currentDate;
                                    const rowClass = isPast ? "text-muted" : "";

                                    return (
                                        <tr key={holiday.id} className={rowClass}>
                                            <td>{holiday.id}</td>
                                            <td>{holiday.title}</td>
                                            <td>{holiday.date}</td>
                                            <td>{holiday.day}</td>
                                            <td className="text-right">
                                                <div className="dropdown dropdown-action">
                                                    <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i className="fa fa-ellipsis-v"></i></a>
                                                    <div className="dropdown-menu dropdown-menu-right">
                                                    <a 
    className="dropdown-item" 
    onClick={() => handleEditHoliday(holiday.id)} 
    onKeyDown={(e) => {
        if (e.key === 'Enter') {
            handleEditHoliday(holiday.id);
        }
    }}
    role="button" 
    tabIndex={0} // Make the element focusable
>
    <i className="fa fa-pencil m-r-5"></i> Edit
</a>

                                                        <a className="dropdown-item" href="#" title="Delete" data-toggle="modal" data-target="#delete_confirm"><i className="fa fa-trash-o m-r-5"></i> Delete</a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HolidaysList;
