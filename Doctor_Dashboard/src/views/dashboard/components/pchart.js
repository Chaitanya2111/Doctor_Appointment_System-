import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
Chart.register(ArcElement);

const pchart = () => {
  const data = {
    labels: ['Morning', 'Afternoon', 'Evening', 'Night'], // Appointment times
    datasets: [
      {
        data: [15, 20, 10, 5], // Number of appointments for each time slot
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2'], // Colors for each time slot
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2']
      }
    ]
  };

  return (
    <>
      <h3 style={{ textAlign: 'center' }}>Patients Appointments</h3>
      <br></br>
      <div style={{ height: '230px', width: '230px', margin: '0 auto' }}>
        <Pie data={data} />
      </div>
    </>
  );
};

export default pchart;
