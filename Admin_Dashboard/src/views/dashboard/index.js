import React from 'react';
import PropTypes from 'prop-types'; 
import { Row, Col, Card, Container } from 'react-bootstrap';
import '../dashboard/css/dashboard.css'
import { FaStethoscope } from "react-icons/fa";
import NVD3Chart from 'react-nvd3';
import { FaRegUser } from "react-icons/fa";
import { FiUserCheck } from "react-icons/fi";
import { TbHeartbeat } from "react-icons/tb";
import avatar1 from '../../assets/images/user/avatar-1.jpg';
const dashSalesData = [
  { title: 'Doctors', icon: <FaStethoscope size={70} color="white" />, class: 'progress-c-theme' },
  { title: 'Patients', icon: <FaRegUser size={70} color="white" />, class: 'progress-c-theme' },
  { title: 'Attend', icon: <FiUserCheck size={70} color="white" />, class: 'progress-c-theme' },
  { title: 'Pending', icon: <TbHeartbeat size={70} color="white" />, class: 'progress-c-theme' }
];


function getDatum() {
  var sin = [],
    sin2 = [],
    cos = [];
  for (var i = 0; i < 100; i++) {
    sin.push({
      x: i,
      y: Math.sin(i / 10)
    });
    sin2.push({
      x: i,
      y: Math.sin(i / 10) * 0.25 + 0.5
    });
    cos.push({
      x: i,
      y: 0.5 * Math.cos(i / 10)
    });
  }
  return [
    {
      values: sin,
      key: 'Sine Wave',
      color: '#A389D4'
    },
    {
      values: cos,
      key: 'Cosine Wave',
      color: '#04a9f5'
    },
    {
      values: sin2,
      key: 'Another sine wave',
      color: '#1de9b6',
      area: true
    }
  ];
}

const LineChart = ({ title, data }) => {
  return (
    <React.Fragment>
      <h3 className="mb-4">{title}</h3>
      {React.createElement(NVD3Chart, {
        xAxis: {
          tickFormat: function (d) {
            return d;
          },
          axisLabel: 'Time (ms)'
        },
        yAxis: {
          axisLabel: 'Value',
          tickFormat: function (d) {
            return parseFloat(d).toFixed(2);
          }
        },
        type: 'lineChart',
        datum: data,
        x: 'x',
        y: 'y',
        height: 300,
        renderEnd: function () {
          console.log('renderEnd');
        }
      })}
    </React.Fragment>
  );
};

LineChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};

const DashDefault = () => {
  const data = getDatum();


  const patientsData = [
    {
      values: data[0].values.map(({ x, y }) => ({ x, y: y * 1.15 })), // Increase by 15%
      key: 'Patients',
      color: '#04a9f5'
    }
  ];

  const icuPatientsData = [
    {
      values: data[0].values.map(({ x }) => ({ x, y: Math.random() * 50 + 30 })), // Random ICU data
      key: 'ICU Patients',
      color: '#ff5722'
    }
  ];

  return (
    <React.Fragment>
      <Container>
      <Row>
        
        {/* Card 1 */}
      <Col xl={6} xxl={3}>
        <Card style={{ borderRadius: "10px", backgroundColor: "  #00b38f" }}>
          <Card.Body>
            <h4 className={`mb-4 ${dashSalesData[0].title === 'Doctors' ? 'bg-c-blue text-white' : ''}`} style={{ width: "120px", float: "right", borderRadius: "5px", backgroundColor: "  #00b38f", color: "#ffffff" }}>
              {dashSalesData[0].title === 'Doctors' ? <span className="checkmark" style={{ color: "#ffffff" }}>&#10003;</span> : ''}
              {dashSalesData[0].title}
            </h4>
            <div className="row d-flex align-items-center">
              <div className="col-9">
                <h4 className="f-w-300 d-flex align-items-center m-b-0">
                  <div className="bg-c-blue p-1 rounded-circle d-inline-block" style={{ backgroundColor: "  #00b38f" }}>
                    {dashSalesData[0].icon}
                  </div>
                  {dashSalesData[0].value}
                  <div>
                    <span style={{ fontSize: "18px", float: "right", marginTop: "50px", marginLeft: "90px", fontWeight: "900", color: "#ffffff" }}>98</span>
                  </div>
                </h4>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* Card 2 */}
      <Col xl={6} xxl={3}>
        <Card style={{ borderRadius: "10px", backgroundColor: "  #00b38f" }}>
          <Card.Body>
            <h4 className={`mb-4 ${dashSalesData[1].title === 'Patients' ? 'bg-c-green text-white' : ''}`} style={{ width: "120px", float: "right", borderRadius: "5px", backgroundColor: "  #00b38f", color: "#ffffff" }}>
              {dashSalesData[1].title === 'Patients' ? <span className="checkmark" style={{ marginLeft: "2px", color: "#ffffff" }}>&#10003;</span> : ''}
              {dashSalesData[1].title}
            </h4>
            <div className="row d-flex align-items-center">
              <div className="col-9">
                <h4 className="f-w-300 d-flex align-items-center m-b-0">
                  <div className="bg-c-green p-1 rounded-circle d-inline-block" style={{ backgroundColor: "#00b38f" }}>
                    {dashSalesData[1].icon}
                  </div>
                  {dashSalesData[1].value}
                  <div>
                    <span style={{ fontSize: "18px", float: "right", marginTop: "50px", marginLeft: "90px", fontWeight: "900", color: "#ffffff" }}>1072</span>
                  </div>
                </h4>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* Card 3 */}
      <Col xl={6} xxl={3}>
        <Card style={{ borderRadius: "10px", backgroundColor: "  #00b38f" }}>
          <Card.Body>
            <h4 className={`mb-4 ${dashSalesData[2].title === 'Attend' ? 'bg-c-yellow text-white' : ''}`} style={{ width: "120px", float: "right", borderRadius: "5px", backgroundColor: "  #00b38f", color: "#ffffff" }}>
              {dashSalesData[2].title === 'Attend' ? <span className="checkmark" style={{ marginLeft: "2px", color: "#ffffff" }}>&#10003;</span> : ''}
              {dashSalesData[2].title}
            </h4>
            <div className="row d-flex align-items-center">
              <div className="col-9">
                <h4 className="f-w-300 d-flex align-items-center m-b-0">
                  <div className="bg-c-yellow p-1 rounded-circle d-inline-block" style={{ backgroundColor: "  #00b38f" }}>
                    {dashSalesData[2].icon}
                  </div>
                  {dashSalesData[2].value}
                  <div>
                    <span style={{ fontSize: "18px", float: "right", marginTop: "50px", marginLeft: "90px", fontWeight: "900", color: "#ffffff" }}>72</span>
                  </div>
                </h4>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* Card 4 */}
      <Col xl={6} xxl={3}>
        <Card style={{ borderRadius: "10px", backgroundColor: "  #00b38f" }}>
          <Card.Body>
            <h4 className={`mb-4 ${dashSalesData[3].title === 'Pending' ? 'bg-c-red  text-white' : ''}`} style={{ width: "120px", float: "right", borderRadius: "5px", backgroundColor: "  #00b38f", color: "#ffffff" }}>
              {dashSalesData[3].title === 'Pending' ? <span className="checkmark" style={{ marginLeft: "2px", color: "#ffffff" }}>&#10003;</span> : ''}
              {dashSalesData[3].title}
            </h4>
            <div className="row d-flex align-items-center">
              <div className="col-9">
                <h4 className="f-w-300 d-flex align-items-center m-b-0">
                  <div className="bg-c-red p-1 rounded-circle d-inline-block" style={{ backgroundColor: "  #00b38f" }}>
                    {dashSalesData[3].icon}
                  </div>
                  {dashSalesData[3].value}
                  <div>
                    <span style={{ fontSize: "18px", float: "right", marginTop: "50px", marginLeft: "90px", fontWeight: "900", color: "#ffffff" }}>618</span>
                  </div>
                </h4>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

        {/* Card 5 - Patients Chart */}
        <Col xl={6}>
          <Card style={{ borderRadius: "10px", marginBottom: "20px" }}>
            <Card.Body>
              <LineChart title="Patients Total (15% Higher)" data={patientsData} />
            </Card.Body>
          </Card>
        </Col>

        {/* Card 6 - ICU Patients Chart */}
        <Col xl={6}>
          <Card style={{ borderRadius: "10px", marginBottom: "20px" }}>
            <Card.Body>
              <LineChart title="Patients in ICU" data={icuPatientsData} />
            </Card.Body>
          </Card>
        </Col>
      
          {/* Card 7 - Upcoming Appointments */}
          <Col xl={8} xxl={8}>
            <Card style={{ borderRadius: "10px", marginBottom: "20px" }}>
              <Card.Header>
                <h3 className="card-title d-inline-block">Upcoming Appointments</h3>
                <a href="appointments.html" className="btn btn-success float-right" style={{ float: "right", fontSize: "18px", fontWeight: "600" }}>View all</a>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <table className="table mb-0">
                    <thead className="d-none">
                      <tr>
                        <th>Patient Name</th>
                        <th>Doctor Name</th>
                        <th>Timing</th>
                        <th className="text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ minWidth: "200px" }}>

                          <h5><a href="profile.html" style={{ color: "#999" }}>Bernardo Galaviz
                            <br></br><span style={{ color: "#999", fontSize: "16px" }}>New York, USA</span></a></h5>
                        </td>
                        <td>
                          <h5 className="time-title p-0" style={{ fontWeight: "510" }}>Appointment With</h5>
                          <p>Dr. Cristina Groves</p>
                        </td>
                        <td>
                          <h5 className="time-title p-0" style={{ fontWeight: "510" }}>Timing</h5>
                          <p>7.00 PM</p>
                        </td>
                        <td className="text-right">
                          <a href="appointments.html" className="btn btn-outline-success take-btn">Take up</a>
                        </td>
                      </tr>
                      {/* Repeat the above structure for each appointment */}
                    </tbody>
                    <tbody>
                      <tr>
                        <td style={{ minWidth: "200px" }}>

                          <h5 ><a href="profile.html" style={{ color: "#999" }}>Bernardo Galaviz
                            <br></br><span style={{ color: "#999", fontSize: "16px" }}>New York, USA</span></a></h5>
                        </td>
                        <td>
                          <h5 className="time-title p-0" style={{ fontWeight: "510" }}>Appointment With</h5>
                          <p>Dr. Cristina Groves</p>
                        </td>
                        <td>
                          <h5 className="time-title p-0" style={{ fontWeight: "510" }}>Timing</h5>
                          <p>7.00 PM</p>
                        </td>
                        <td className="text-right">
                          <a href="appointments.html" className="btn btn-outline-success take-btn">Take up</a>
                        </td>
                      </tr>
                      {/* Repeat the above structure for each appointment */}
                    </tbody>
                    <tbody>
                      <tr>
                        <td style={{ minWidth: "200px" }}>

                          <h5><a href="profile.html" style={{ color: "#999" }}>Bernardo Galaviz
                            <br></br><span style={{ color: "#999", fontSize: "16px" }}>New York, USA</span></a></h5>
                        </td>
                        <td>
                          <h5 className="time-title p-0" style={{ fontWeight: "510" }}>Appointment With</h5>
                          <p>Dr. Cristina Groves</p>
                        </td>
                        <td>
                          <h5 className="time-title p-0" style={{ fontWeight: "510" }}>Timing</h5>
                          <p>7.00 PM</p>
                        </td>
                        <td className="text-right">
                          <a href="appointments.html" className="btn btn-outline-success take-btn">Take up</a>
                        </td>
                      </tr>
                      {/* Repeat the above structure for each appointment */}
                    </tbody>
                    <tbody>
                      <tr>
                        <td style={{ minWidth: "200px" }}>

                          <h5><a href="profile.html" style={{ color: "#999" }}>Bernardo Galaviz
                            <br></br><span style={{ color: "#999", fontSize: "16px" }}>New York, USA</span></a></h5>
                        </td>
                        <td>
                          <h5 className="time-title p-0" style={{ fontWeight: "510" }}>Appointment With</h5>
                          <p>Dr. Cristina Groves</p>
                        </td>
                        <td>
                          <h5 className="time-title p-0" style={{ fontWeight: "510" }}>Timing</h5>
                          <p>7.00 PM</p>
                        </td>
                        <td className="text-right">
                          <a href="appointments.html" className="btn btn-outline-success take-btn">Take up</a>
                        </td>
                      </tr>
                      {/* Repeat the above structure for each appointment */}
                    </tbody>
                    <tbody>
                      <tr>
                        <td style={{ minWidth: "200px" }}>

                          <h5><a href="profile.html" style={{ color: "#999" }}>Bernardo Galaviz
                            <br></br><span style={{ color: "#999", fontSize: "16px" }}>New York, USA</span></a></h5>
                        </td>
                        <td>
                          <h5 className="time-title p-0" style={{ fontWeight: "510" }}>Appointment With</h5>
                          <p>Dr. Cristina Groves</p>
                        </td>
                        <td>
                          <h5 className="time-title p-0" style={{ fontWeight: "510" }}>Timing</h5>
                          <p>7.00 PM</p>
                        </td>
                        <td className="text-right">
                          <a href="appointments.html" className="btn btn-outline-success take-btn">Take up</a>
                        </td>
                      </tr>
                      {/* Repeat the above structure for each appointment */}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={4} xxl={4}>
            <div className="card member-panel">
              <div className="card-header bg-white">
                <h3 className="card-title mb-0">Doctors</h3>
              </div>

              <div className="card-body" style={{ height: "460px", overflowY: "auto" }}>
                <ul className="contact-list" style={{ listStyle: 'none', listStylePosition: 'initial', listStyleImage: 'initial', listStyleType: 'none', paddingLeft: '0', margin: '0', }}>
                  <li style={{ display: 'list-item', textAlign: '-webkit-match-parent', unicodeBidi: 'isolate', borderBottom: '1px solid #eaeaea', borderRadius: 'inherit', padding: '10px', backgroundColor: '#fff', color: "black" }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="float-left" style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '10px' }}>
                        <img src={avatar1} alt="Dr. Cristina Groves" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ position: 'relative' }}>
                        <span className="status online" style={{ backgroundColor: '#55ce63', borderRadius: '50%', display: 'inline-block', height: '15px', width: '15px', position: 'absolute', top: '10px', right: '12px', zIndex: '1', border: '2px solid #fff' }}></span>
                      </div>
                      <div style={{ marginLeft: '10px' }}>
                        <a href="profile.html" title="Dr. Cristina Groves" style={{ fontWeight: '900', color: "#999", fontSize: "18px" }}>Dr. Cristina Groves</a>
                        <span style={{ color: '#999' }}>
                          <br></br>MBBS, MD</span>
                      </div>
                    </div>
                  </li>



                  <li style={{ display: 'list-item', textAlign: '-webkit-match-parent', unicodeBidi: 'isolate', borderBottom: '1px solid #eaeaea', borderRadius: 'inherit', padding: '10px', backgroundColor: '#fff', color: "black" }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="float-left" style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '10px' }}>
                        <img src={avatar1} alt="Dr. Cristina Groves" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ position: 'relative' }}>
                        <span className="status online" style={{ backgroundColor: '#55ce63', borderRadius: '50%', display: 'inline-block', height: '15px', width: '15px', position: 'absolute', top: '10px', right: '12px', zIndex: '1', border: '2px solid #fff' }}></span>
                      </div>
                      <div style={{ marginLeft: '10px' }}>
                        <a href="profile.html" title="Dr. Cristina Groves" style={{ fontWeight: '900', color: "#999", fontSize: "18px" }}>Dr. Cristina Groves</a>
                        <span style={{ color: '#999' }}>
                          <br></br>MBBS, MD</span>
                      </div>
                    </div>
                  </li>
                  <li style={{ display: 'list-item', textAlign: '-webkit-match-parent', unicodeBidi: 'isolate', borderBottom: '1px solid #eaeaea', borderRadius: 'inherit', padding: '10px', backgroundColor: '#fff', color: "black" }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="float-left" style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '10px' }}>
                        <img src={avatar1} alt="Dr. Cristina Groves" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ position: 'relative' }}>
                        <span className="status online" style={{ backgroundColor: '#55ce63', borderRadius: '50%', display: 'inline-block', height: '15px', width: '15px', position: 'absolute', top: '10px', right: '12px', zIndex: '1', border: '2px solid #fff' }}></span>
                      </div>
                      <div style={{ marginLeft: '10px' }}>
                        <a href="profile.html" title="Dr. Cristina Groves" style={{ fontWeight: '900', color: "#999", fontSize: "18px" }}>Dr. Cristina Groves</a>
                        <span style={{ color: '#999' }}>
                          <br></br>MBBS, MD</span>
                      </div>
                    </div>
                  </li>
                  <li style={{ display: 'list-item', textAlign: '-webkit-match-parent', unicodeBidi: 'isolate', borderBottom: '1px solid #eaeaea', borderRadius: 'inherit', padding: '10px', backgroundColor: '#fff', color: "black" }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="float-left" style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '10px' }}>
                        <img src={avatar1} alt="Dr. Cristina Groves" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ position: 'relative' }}>
                        <span className="status online" style={{ backgroundColor: '#55ce63', borderRadius: '50%', display: 'inline-block', height: '15px', width: '15px', position: 'absolute', top: '10px', right: '12px', zIndex: '1', border: '2px solid #fff' }}></span>
                      </div>
                      <div style={{ marginLeft: '10px' }}>
                        <a href="profile.html" title="Dr. Cristina Groves" style={{ fontWeight: '900', color: "#999", fontSize: "18px" }}>Dr. Cristina Groves</a>
                        <span style={{ color: '#999' }}>
                          <br></br>MBBS, MD</span>
                      </div>
                    </div>
                  </li>
                  <li style={{ display: 'list-item', textAlign: '-webkit-match-parent', unicodeBidi: 'isolate', borderBottom: '1px solid #eaeaea', borderRadius: 'inherit', padding: '10px', backgroundColor: '#fff', color: "black" }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="float-left" style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '10px' }}>
                        <img src={avatar1} alt="Dr. Cristina Groves" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ position: 'relative' }}>
                        <span className="status online" style={{ backgroundColor: '#55ce63', borderRadius: '50%', display: 'inline-block', height: '15px', width: '15px', position: 'absolute', top: '10px', right: '12px', zIndex: '1', border: '2px solid #fff' }}></span>
                      </div>
                      <div style={{ marginLeft: '10px' }}>
                        <a href="profile.html" title="Dr. Cristina Groves" style={{ fontWeight: '900', color: "#999", fontSize: "18px" }}>Dr. Cristina Groves</a>
                        <span style={{ color: '#999' }}>
                          <br></br>MBBS, MD</span>
                      </div>
                    </div>
                  </li>
                  <li style={{ display: 'list-item', textAlign: '-webkit-match-parent', unicodeBidi: 'isolate', borderBottom: '1px solid #eaeaea', borderRadius: 'inherit', padding: '10px', backgroundColor: '#fff', color: "black" }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="float-left" style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '10px' }}>
                        <img src={avatar1} alt="Dr. Cristina Groves" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ position: 'relative' }}>
                        <span className="status online" style={{ backgroundColor: '#55ce63', borderRadius: '50%', display: 'inline-block', height: '15px', width: '15px', position: 'absolute', top: '10px', right: '12px', zIndex: '1', border: '2px solid #fff' }}></span>
                      </div>
                      <div style={{ marginLeft: '10px' }}>
                        <a href="profile.html" title="Dr. Cristina Groves" style={{ fontWeight: '900', color: "#999", fontSize: "18px" }}>Dr. Cristina Groves</a>
                        <span style={{ color: '#999' }}>
                          <br></br>MBBS, MD</span>
                      </div>
                    </div>
                  </li>
                  <li style={{ display: 'list-item', textAlign: '-webkit-match-parent', unicodeBidi: 'isolate', borderBottom: '1px solid #eaeaea', borderRadius: 'inherit', padding: '10px', backgroundColor: '#fff', color: "black" }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="float-left" style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '10px' }}>
                        <img src={avatar1} alt="Dr. Cristina Groves" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ position: 'relative' }}>
                        <span className="status online" style={{ backgroundColor: '#55ce63', borderRadius: '50%', display: 'inline-block', height: '15px', width: '15px', position: 'absolute', top: '10px', right: '12px', zIndex: '1', border: '2px solid #fff' }}></span>
                      </div>
                      <div style={{ marginLeft: '10px' }}>
                        <a href="profile.html" title="Dr. Cristina Groves" style={{ fontWeight: '900', color: "#999", fontSize: "18px" }}>Dr. Cristina Groves</a>
                        <span style={{ color: '#999' }}>
                          <br></br>MBBS, MD</span>
                      </div>
                    </div>
                  </li>
                  <li style={{ display: 'list-item', textAlign: '-webkit-match-parent', unicodeBidi: 'isolate', borderBottom: '1px solid #eaeaea', borderRadius: 'inherit', padding: '10px', backgroundColor: '#fff', color: "black" }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="float-left" style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '10px' }}>
                        <img src={avatar1} alt="Dr. Cristina Groves" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ position: 'relative' }}>
                        <span className="status online" style={{ backgroundColor: '#55ce63', borderRadius: '50%', display: 'inline-block', height: '15px', width: '15px', position: 'absolute', top: '10px', right: '12px', zIndex: '1', border: '2px solid #fff' }}></span>
                      </div>
                      <div style={{ marginLeft: '10px' }}>
                        <a href="profile.html" title="Dr. Cristina Groves" style={{ fontWeight: '900', color: "#999", fontSize: "18px" }}>Dr. Cristina Groves</a>
                        <span style={{ color: '#999' }}>
                          <br></br>MBBS, MD</span>
                      </div>
                    </div>
                  </li>
                  <li style={{ display: 'list-item', textAlign: '-webkit-match-parent', unicodeBidi: 'isolate', borderBottom: '1px solid #eaeaea', borderRadius: 'inherit', padding: '10px', backgroundColor: '#fff', color: "black" }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="float-left" style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '10px' }}>
                        <img src={avatar1} alt="Dr. Cristina Groves" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ position: 'relative' }}>
                        <span className="status online" style={{ backgroundColor: '#55ce63', borderRadius: '50%', display: 'inline-block', height: '15px', width: '15px', position: 'absolute', top: '10px', right: '12px', zIndex: '1', border: '2px solid #fff' }}></span>
                      </div>
                      <div style={{ marginLeft: '10px' }}>
                        <a href="profile.html" title="Dr. Cristina Groves" style={{ fontWeight: '900', color: "#999", fontSize: "18px" }}>Dr. Cristina Groves</a>
                        <span style={{ color: '#999' }}>
                          <br></br>MBBS, MD</span>
                      </div>
                    </div>
                  </li>
                  <li style={{ display: 'list-item', textAlign: '-webkit-match-parent', unicodeBidi: 'isolate', borderBottom: '1px solid #eaeaea', borderRadius: 'inherit', padding: '10px', backgroundColor: '#fff', color: "black" }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="float-left" style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '10px' }}>
                        <img src={avatar1} alt="Dr. Cristina Groves" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ position: 'relative' }}>
                        <span className="status online" style={{ backgroundColor: '#55ce63', borderRadius: '50%', display: 'inline-block', height: '15px', width: '15px', position: 'absolute', top: '10px',  zIndex: '1', border: '2px solid #fff' }}></span>
                      </div>
                      <div style={{ marginLeft: '10px' }}>
                        <a href="profile.html" title="Dr. Cristina Groves" style={{ fontWeight: '900', color: "#999", fontSize: "18px" }}>Dr. Cristina Groves</a>
                        <span style={{ color: '#999' }}>
                          <br></br>MBBS, MD</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="card-footer text-center bg-white">
                <a href="doctors.html" className="text-muted">View all Doctors</a>
              </div>
            </div>
          </Col>
          
          <Col xl={8} xxl={8}>
            <div className="card">
              <div className="card-header" style={{ borderBottom: "none" }}>
                <h3 className="card-title d-inline-block">New Patients </h3>
                <a href="appointments.html" className="btn btn-success float-right" style={{ float: "right", fontSize: "18px", fontWeight: "600" }}>View all</a>
              </div>
              <div className="card-block" style={{ marginTop: "-26px" }}>
                <div className="table-responsive">
                  <table className="table mb-0 new-patient-table" style={{ borderCollapse: 'collapse', color: '#000', border: '1px solid #f0f0f0' }}>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 300, padding: '.75rem', verticalAlign: 'middle', borderTop: '1px solid #dee2e6', position: 'relative' }}>
                          <img width="40" height="40" className="rounded-circle" src={avatar1} alt="" style={{ position: 'absolute', left: '0', top: '20px' }} />
                          <h5 style={{ marginLeft: '50px' }}>John Doe</h5>
                        </td>
                        <td style={{ padding: '.75rem', verticalAlign: 'middle', borderTop: '1px solid #dee2e6' }}>Johndoe21@gmail.com</td>
                        <td style={{ padding: '.75rem', verticalAlign: 'middle', borderTop: '1px solid #dee2e6' }}>+1-202-555-0125</td>
                        <td>
                          <button
                            className="btn btn-success btn-success-one float-right"
                            style={{
                              border: "1px solid #ffbc35",
                              borderRadius: "25px",
                              width: "100px",
                              background: "transparent",
                              color: "#000",
                              fontSize: "0.875rem"
                            }}
                            onMouseOver={e => {
                              e.target.style.backgroundColor = "#009efb";
                              e.target.style.borderColor = "#009efb";
                            }}
                            onMouseOut={e => {
                              e.target.style.backgroundColor = "transparent";
                              e.target.style.borderColor = "#ffbc35";
                            }}
                            onFocus={e => {
                              e.target.style.backgroundColor = "#009efb";
                              e.target.style.borderColor = "#009efb";
                            }}
                            onBlur={e => {
                              e.target.style.backgroundColor = "transparent";
                              e.target.style.borderColor = "#ffbc35";
                            }}
                          >
                            Fever
                          </button>


                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 300, padding: '.75rem', verticalAlign: 'middle', borderTop: '1px solid #dee2e6', position: 'relative' }}>
                          <img width="40" height="40" className="rounded-circle" src={avatar1} alt="" style={{ position: 'absolute', left: '0', top: '20px' }} />
                          <h5 style={{ marginLeft: '50px' }}>Richard</h5>
                        </td>
                        <td style={{ padding: '.75rem', verticalAlign: 'middle', borderTop: '1px solid #dee2e6' }}>Richard123@yahoo.com</td>
                        <td style={{ padding: '.75rem', verticalAlign: 'middle', borderTop: '1px solid #dee2e6' }}>202-555-0127</td>
                        <td>
                          <button
                            className="btn btn-success btn-success-two float-right"
                            style={{
                              border: "1px solid #009efb",
                              borderRadius: '25px',
                              width: '100px',
                              background: 'transparent',
                              color: '#000',
                              fontSize: '0.875rem'
                            }}
                            onMouseOver={e => {
                              e.target.style.backgroundColor = "#009efb";
                              e.target.style.borderColor = "#009efb";
                            }}
                            onMouseOut={e => {
                              e.target.style.backgroundColor = "transparent";
                              e.target.style.borderColor = "#009efb";
                            }}
                            onFocus={e => {
                              e.target.style.backgroundColor = "#009efb";
                              e.target.style.borderColor = "#009efb";
                            }}
                            onBlur={e => {
                              e.target.style.backgroundColor = "transparent";
                              e.target.style.borderColor = "#009efb";
                            }}
                          >
                            Cancer
                          </button>
                        </td>

                      </tr>
                      <tr>
                        <td style={{ fontWeight: 300, padding: '.75rem', verticalAlign: 'middle', borderTop: '1px solid #dee2e6', position: 'relative' }}>
                          <img width="40" height="40" className="rounded-circle" src={avatar1} alt="" style={{ position: 'absolute', left: '0', top: '20px' }} />
                          <h5 style={{ marginLeft: '50px' }}>Villiam</h5>
                        </td>
                        <td style={{ padding: '.75rem', verticalAlign: 'middle', borderTop: '1px solid #dee2e6' }}>Richard123@yahoo.com</td>
                        <td style={{ padding: '.75rem', verticalAlign: 'middle', borderTop: '1px solid #dee2e6' }}>+1-202-555-0106</td>
                        <td>
                          <button
                            className="btn btn-success btn-success-three float-right"
                            style={{
                              border: "1px solid #55ce63",
                              borderRadius: '25px',
                              width: '100px',
                              background: 'transparent',
                              color: '#000',
                              fontSize: '0.875rem'
                            }}
                            onMouseOver={e => {
                              e.target.style.backgroundColor = "#009efb";
                              e.target.style.borderColor = "#009efb";
                            }}
                            onMouseOut={e => {
                              e.target.style.backgroundColor = "transparent";
                              e.target.style.borderColor = "#009efb";
                            }}
                            onFocus={e => {
                              e.target.style.backgroundColor = "#009efb";
                              e.target.style.borderColor = "#009efb";
                            }}
                            onBlur={e => {
                              e.target.style.backgroundColor = "transparent";
                              e.target.style.borderColor = "#55ce63";
                            }}
                          >
                            Eye
                          </button>
                        </td>

                      </tr>
                      <tr>
                        <td style={{ fontWeight: 300, padding: '.75rem', verticalAlign: 'middle', borderTop: '1px solid #dee2e6', position: 'relative' }}>
                          <img width="40" height="40" className="rounded-circle" src={avatar1} alt="" style={{ position: 'absolute', left: '0', top: '20px' }} />
                          <h5 style={{ marginLeft: '50px' }}>Martin</h5>
                        </td>
                        <td style={{ padding: '.75rem', verticalAlign: 'middle', borderTop: '1px solid #dee2e6' }}>Richard123@yahoo.com</td>
                        <td style={{ padding: '.75rem', verticalAlign: 'middle', borderTop: '1px solid #dee2e6' }}>776-2323 89562015</td>
                        <td>
                          <button
                            className="btn btn-success btn-success-four float-right"
                            style={{
                              border: '1px solid #ffbc35',
                              borderRadius: '25px',
                              width: '100px',
                              background: 'transparent',
                              color: '#000',
                              fontSize: '0.875rem'
                            }}
                            onMouseOver={e => {
                              e.target.style.backgroundColor = "#009efb";
                              e.target.style.borderColor = "#009efb";
                            }}
                            onMouseOut={e => {
                              e.target.style.backgroundColor = "transparent";
                              e.target.style.borderColor = "#009efb";
                            }}
                            onFocus={e => {
                              e.target.style.backgroundColor = "#009efb";
                              e.target.style.borderColor = "#009efb";
                            }}
                            onBlur={e => {
                              e.target.style.backgroundColor = "transparent";
                              e.target.style.borderColor = "#009efb";
                            }}
                          >
                            Fever
                          </button>
                        </td>

                      </tr>
                      {/* Add more rows if needed */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Col>



          <Col xl={4} xxl={4}>
            
            <div className="hospital-wrapper">
           
              <div className="hospital-barchart  bg-white ">
                <h3 className="card-title d-inline-block ">Hospital</h3>
              </div>

              <div className="bar-chart">
              <br></br>
                <div className="legend">
                  <div className="item">
                    <h4>Level1</h4>
                  </div>
                  <div className="item">
                    <h4>Level2</h4>
                  </div>
                  <div className="item text-right">
                    <h4>Level3</h4>
                  </div>
                  <div className="item text-right">
                    <h4>Level4</h4>
                  </div>
                </div>
                <div className="chart clearfix">
                  <div className="item">
                    <div className="bar">
                      <span className="percent" >16%</span>
                      <div className="item-progress" data-percent="16" style={{ width: '52.8px' }} >
                        <span className="title" >OPD </span>
                      </div>
                    </div>
                  </div>
                
                  <div className="item">
                    <div className="bar">
                      <span className="percent">71%</span>
                      <div className="item-progress" data-percent="71" style={{ width: '234.3px' }}>
                        <span className="title">New Patient</span>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="bar">
                      <span className="percent">82%</span>
                      <div className="item-progress" data-percent="82" style={{ width: '270.6px' }}>
                        <span className="title">Laboratory Test</span>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="bar">
                      <span className="percent">67%</span>
                      <div className="item-progress" data-percent="67" style={{ width: '221.1px' }}>
                        <span className="title">Treatment</span>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="bar">
                      <span className="percent">30%</span>
                      <div className="item-progress" data-percent="30" style={{ width: '99px' }}>
                        <span className="title">Discharge</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>

      </Row>
      </Container>
    
    </React.Fragment>
  );
};

export default DashDefault;
