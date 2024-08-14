
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/dashdoctor.css'

function MyCalendar() {
  const [date, setDate] = useState(new Date());

  return (
    <div className='app' style={{ height: "300px" }}>
      <div className='calendar-container' >
        <Calendar onChange={setDate} value={date}  style={{ height: "200px" }}/>
      </div>
      <br></br>
      <p className='text-center'>
        <span className='bold'>Selected Date:</span>{' '}
        {date.toDateString()}
      </p>

    </div>
  );
}

export default MyCalendar;