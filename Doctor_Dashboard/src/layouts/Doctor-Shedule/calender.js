import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui/themes/base/all.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './css/calender.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios'; // Import axios for API requests

function Calendar() {
  const [ename, setEname] = useState('');
  const [edate, setEdate] = useState(null);
  const [etime, setEtime] = useState(null);
  const [edesc, setEdesc] = useState('');
  const [ecolor, setEcolor] = useState('null');
  const [activeType, setActiveType] = useState('');
  const [etype, setEtype] = useState(''); // Added event type 
  const [events, setEvents] = useState([
    {
      title: 'Barber',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      start: '2023-05-05', // Make sure these are in ISO 8601 format
      end: '2023-05-05',
      className: 'fc-bg-default',
      icon: 'circle'
    },
    {
      title: 'Flight Paris',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      start: '2023-08-08T14:00:00', // Include time in ISO 8601 format
      end: '2023-08-08T20:00:00',
      className: 'fc-bg-deepskyblue',
      icon: 'cog',
      allDay: false
    }
  ]);
  

  useEffect(() => {
    $(document).ready(function () {
      $('.datetimepicker').datepicker({
        timepicker: true,
        language: 'en',
        range: true,
        multipleDates: true,
        multipleDatesSeparator: ' - '
      });

      $('#add-event').submit(function (event) {
        event.preventDefault();
        const formData = $(this).serializeArray();

        // Create a new event object
        const newEvent = {
          title: formData.find(item => item.name === 'ename')?.value || '',
          description: formData.find(item => item.name === 'edesc')?.value || '',
          start: formData.find(item => item.name === 'edate')?.value || '',
          className: formData.find(item => item.name === 'ecolor')?.value || 'fc-bg-default',
          icon: '' // formData.find(item => item.name === 'eicon')?.value || '' - If you're using 'eicon' in your form
        };

        // Update events state with the new event
        setEvents([...events, newEvent]);

        // Reset the form and close the modal
        $(this)[0].reset();
        $('#modal-view-event-add').modal('hide');
      });
    });
  }, [events]); // Run this effect whenever events change

 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const url = activeType
          ? `http://localhost:3005/doctor/events/filter?type=${activeType}`
          : 'http://localhost:3005/doctor/events';

        const response = await axios.get(url);
        const updatedEvents = response.data.map(event => ({
          ...event,
          type: event.className.split('-')[1] // Assuming className is like 'fc-bg-default'
        }));
        setEvents(updatedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [activeType]);

  useEffect(() => {
   
    window.jQuery = $;
    window.$ = $;
    require('bootstrap');
  }, []);

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   try {
  //     const formattedDate = edate.toISOString().slice(0, 10);
  //     const formattedTime = etime.toLocaleTimeString();
  //     await axios.post('http://localhost:3005/api/save-event', {
  //       ename,
  //       edate: formattedDate,
  //       etime: formattedTime,
  //       edesc,
  //       ecolor,
  //       etype
  //     });
  //     console.log('Event saved successfully!');
  //   } catch (error) {
  //     console.error('Error saving event:', error);
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formattedDate = edate.toLocaleDateString('en-CA'); // Format date as 'YYYY-MM-DD'
      const formattedTime = etime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      await axios.post('http://localhost:3005/doctor/save-event', {
        ename,
        edate: formattedDate,
        etime: formattedTime,
        edesc,
        ecolor,
        etype
      });
      console.log('Event saved successfully!');
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };
  
  const handleDateChange = (date) => {
    setEdate(date); 
  };


  const renderEventContent = (eventInfo) => (
    <>
      {eventInfo.event.extendedProps.icon && (
        <i className={`fa fa-${eventInfo.event.extendedProps.icon}`}></i>
      )}
      <div style={{ color: 'black', fontSize: '12px' }}>
        <div>{eventInfo.event.title}</div>
      </div>
    </>
  );

  const eventRender = (eventInfo) => {
    const tooltip = `
      <div className="fc-tooltip" style="color: black;">
        <span>${eventInfo.event.title}</span>
        <span>${eventInfo.event.extendedProps.time}</span> {/* Use extendedProps.time */}
        <span>${eventInfo.event.extendedProps.description}</span>
      </div>
    `;

    $(eventInfo.el).tooltip({
      title: tooltip,
      html: true,
    });

    // Set background color based on event type
    switch (eventInfo.event.extendedProps.type) {
      case 'operation':
        $(eventInfo.el).css('background-color', '#dc3545');
        break;
      case 'meeting':
        $(eventInfo.el).css('background-color', '#28a745');
        break;
      case 'workshop':
        $(eventInfo.el).css('background-color', '#ffc107');
        break;
      case 'training':
        $(eventInfo.el).css('background-color', '#17a2b8');
        break;
      default:
        $(eventInfo.el).css('background-color', '#007bff');
        break;
    }
  };

const filterEvents = (type) => {
    setActiveType(type);
  };
  

  return (
    <div className='container'>
      <div className='row'>
        
      <div className='col-md-3 ' >
        
          <div className="card" style={{backgroundColor:'white'}}>
          <h4 style={{textAlign:'center',marginTop:'10px'}}>Events</h4>
              <div className="card-body ">
          <div className="btn-group-vertical event-buttons d-flex justify-content-center">
            <button type="button" className={`btn  ${activeType === 'operation' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => filterEvents('operation')}>
              Operation
            </button>
            <button type="button" className={`btn  ${activeType === 'meeting' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => filterEvents('meeting')}>
              Meeting
            </button>
            <button type="button" className={`btn  ${activeType === 'workshop' ? 'btn-warning' : 'btn-outline-warning'}`} onClick={() => filterEvents('workshop')}>
              Workshop
            </button>
            <button type="button" className={`btn  ${activeType === 'training' ? 'btn-info' : 'btn-outline-info'}`} onClick={() => filterEvents('training')}>
              Training
            </button>
          </div>
          </div>
          </div>
        </div>

        <div className='col-md-9'>
            <div className="card" style={{backgroundColor:'white'}}>
              <div className="card-body ">
                <button
                  type="button"
                  className="btn btn-primary mb-3"
                  data-toggle="modal"
                  data-target="#modal-view-event-add"
                >
                  Add Event
                </button>
              <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  events={events}
                  eventContent={renderEventContent}
                  eventRender={eventRender} // Custom event rendering
                  editable={true}
                  headerToolbar={{
                    left: 'title',
                    center: 'dayGridMonth,timeGridWeek,timeGridDay',
                    right: 'today prev,next'
                  }}
                  eventClick={(info) => {
                    $('.event-icon').html(`<i class='fa fa-${info.event.extendedProps.icon}'></i>`);
                    $('.event-title').html(info.event.title);
                    $('.event-body').html(info.event.extendedProps.description);
                    $('.event-time').html(info.event.extendedProps.time); // Display event time
                    $('#modal-view-event').modal('show');
                  }}
                />
              </div>
            </div>

          <div id="modal-view-event" className="modal modal-top fade calendar-modal">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body">
                  <h4 className="modal-title">
                    <span className="event-icon"></span>
                    <span className="event-title"></span>
                  </h4>
                  <div className="event-body"></div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" data-dismiss="modal">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div id="modal-view-event-add" className="modal modal-top fade calendar-modal">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <form id="add-event" onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <h4>Add Event Detail</h4>
                    <div className="form-group">
                      <label>Event name</label>
                      <input type="text" className="form-control" value={ename} onChange={(e) => setEname(e.target.value)} />
                    </div>
                    <div className="form-group">
                <label>Event Date</label>
                <DatePicker
                  className="form-control "
                  selected={edate}
                  onChange={handleDateChange} // Use handleDateChange function
                  dateFormat="yyyy-MM-dd" // Ensure the date format matches the backend
                />
              </div>
              <div className="form-group">
                <label>Event Time</label>
                <DatePicker
                  className="form-control timepicker"
                  selected={etime}
                  onChange={(time) => setEtime(time)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  dateFormat="h:mm aa"
                  timeCaption="Time"
                />
              </div>
                    <div className="form-group">
                      <label>Event Description</label>
                      <textarea className="form-control" value={edesc} onChange={(e) => setEdesc(e.target.value)}></textarea>
                    </div>
                    <div className="form-group">
                      <label>Event Color</label>
                      <select className="form-control" value={ecolor} onChange={(e) => setEcolor(e.target.value)}>
                        <option value="fc-bg-default">fc-bg-default</option>
                        <option value="fc-bg-blue">fc-bg-blue</option>
                        <option value="fc-bg-lightgreen">fc-bg-lightgreen</option>
                        <option value="fc-bg-pinkred">fc-bg-pinkred</option>
                        <option value="fc-bg-deepskyblue">fc-bg-deepskyblue</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Event Type</label>
                      <select className="form-control" value={etype} onChange={(e) => setEtype(e.target.value)}>
                        <option value="operation">Operation</option>
                        <option value="meeting">Meeting</option>
                        <option value="workshop">Workshop</option>
                        <option value="training">Training</option>
                      </select>
                    </div>
               
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">Save</button>
                    <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Calendar;
