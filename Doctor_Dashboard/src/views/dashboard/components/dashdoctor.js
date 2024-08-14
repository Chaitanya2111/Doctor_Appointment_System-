// import React from 'react';
// import docimg from '../components/Alldr-removebg-preview.png';
// import Chart from '../components/chart';
// import '../css/dashdoctor.css';
// import Calendar from '../components/calendar';
// import { IoPersonSharp } from 'react-icons/io5';
// import { RiStethoscopeFill } from 'react-icons/ri';
// import { GiLoveInjection } from 'react-icons/gi';
// import { FaBriefcaseMedical } from 'react-icons/fa';
// import Pchart from '../components/pchart';
// import { Row, Col } from 'react-bootstrap';
// import { GoChevronRight } from "react-icons/go";
// import ladydoctor from './ladydoctor.jpg'



// const appointments = [
//   {
//     image: 'ladydoctor.jpg',
//     name: 'John Doe',
//     time: '10:00 AM - 11:00 AM'
//   },
//   {
//     image: 'ladydoctor.jpg',
//     name: 'Jane Smith',
//     time: '11:30 AM - 12:30 PM'
//   },
//   {
//     image: 'ladydoctor.jpg',
//     name: 'Michael Johnson',
//     time: '1:00 PM - 2:00 PM'
//   },
//   {
//     image: 'ladydoctor.jpg',
//     name: 'Michael Johnson',
//     time: '1:00 PM - 2:00 PM'
//   },
//   // Add more appointments as needed
// ];


// const colors = ["lightgrey", "lightblue", "lightyellow", "lavender", "lightcoral", "lightsalmon", "lightsteelblue", "lightseagreen", "lightblue"];


// function doctordash() {
//   return (

//     <><div className="container">
//       <div className="row ">
//         <div className="col-xl-12  doctor ">
//           <div className=" p-5 border rounded-2 bg-white text-white" id="box" >
//             <div className="">
//               <p className="fs-6 pb-2">Welcome back,</p>
//               <div>
//                 <p className="fs-2">
//                   <b>Dr.Jessica Linda</b>
//                 </p>
//                 <p className="fs-0">MD.DM(Cardiology),FACC,FESC</p>
//               </div>

//               <p className="fs-6">
//                 You have total <span className="text-warning">12 appointments</span> today!
//               </p>
//             </div>
//             <div className="float-end" id="docimg">
//               <img alt="dash" src={docimg} className="" id="dimg" />
//             </div>
//           </div>
//         </div>
//       </div>
//       <br></br>
//       <div className='row'>
//         <div className='col-xl-8 report '>
//           <div className="card " >
//             <div className="card-body">

//                 <div className="d-flex align-items-center justify-content-between m-2">
//                   <div className="d-flex align-items-center">
//                     <b className="m-0" style={{ fontSize: "18px" }}>Report</b>
//                   </div>
//                   <select name="cars" id="cars" className="float-end  custom-dropdown">
//                     <option value="volvo">This month</option>
//                     <option value="saab">yesterday</option>
//                     <option value="mercedes">today</option>
//                     {/* <option value="audi">Audi</option> */}
//                   </select>

//               </div>
//               <div className="row">
//                 <div className="col-xl-6 col-md-6 mb-3 mb-md-0">
//                   <div className="border rounded-2  text-center" id="box1" >
//                     <p style={{ margin: 0, fontSize: "16px",fontWeight:'400' }}>
//                       <IoPersonSharp style={{ color: "black", fontSize: "16px",fontWeight:'400' }} />  patients
//                     </p>
//                     <p className="fs-2" style={{ margin: 0, color: "black",fontWeight:'600'}}>473</p>
//                   </div>
//                 </div>
//                 <div className="col-xl-6 col-md-6 mb-3 mb-md-0">
//                   <div className="border rounded-2  text-center" id="box2" >
//                     <p style={{ margin: 0, fontSize: "16px",fontWeight:'400' }}>
//                       <RiStethoscopeFill style={{ color: "black", fontSize: "16px",fontWeight:'400' }} /> consultation
//                     </p>
//                     <p className="fs-2" style={{ margin: 0, color: "black",fontWeight:'600'}}>236</p>
//                   </div>
//                 </div>
//                 <div className="col-xl-6 col-md-6 mb-3 mb-md-0">
//                   <div className="border rounded-2  text-center" id="box3" >
//                     <p style={{ margin: 0, fontSize: "16px",fontWeight:'400' }}>
//                       <GiLoveInjection style={{ color: "black", fontSize: "16px",fontWeight:'400' }} /> inject
//                     </p>
//                     <p className="fs-2" style={{ margin: 0, color: "black",fontWeight:'600'}}>105</p>
//                   </div>
//                 </div>
//                 <div className="col-xl-6 col-md-6 mb-3 mb-md-0">
//                   <div className="border rounded-2  text-center" id="box4" >
//                     <p style={{ margin: 0, fontSize: "16px",fontWeight:'400' }}>
//                       <FaBriefcaseMedical style={{ color: "black", fontSize: "16px",fontWeight:'400' }} /> surgery
//                     </p>
//                     <p className="fs-2" style={{ margin: 0, color: "black",fontWeight:'600'}}>132</p>
//                   </div>
//                 </div>
//               </div>

//             </div>
//           </div>

//         </div>
//         <div className='col-xl-4'>
//           <div className="card calenderr">
//             <div className="card-header">
//               <h5>Appointments</h5>
//             </div>
//             <div className="card-body">
//               <div style={{ height: "100%" }}>
//                 <Calendar className="custom-calendar" />

//               </div>
//             </div>

//           </div>
//         </div>

//       </div>

//     </div>
//       <div className="row">
//         <div className="col-xl-8">
//           <Row style={{ display: 'flex' }}>
//             <Col md={6} lg={6} xl={6} className="mb-3 mb-lg-0">
//               <div className='card another-custom-cardd' style={{ marginRight: '10px', marginLeft: "12px", marginBottom: '50px', borderRadius: "10px", width: "100%" }}>
//                 <div className='card-body body-chart' style={{ borderRadius: "10px" }}>
//                   <Chart />
//                 </div>
//               </div>
//             </Col>
//             <Col md={6} lg={6} xl={6} className="mb-3 mb-lg-0">
//               <div className='card another-custom-card' style={{ marginLeft: '10px', marginRight: "15px", marginBottom: '50px', borderRadius: "10px", width: "100%" }}>
//                 <div className='card-body body-chart' style={{ borderRadius: "10px", marginRight: "18px" }}>
//                   <Pchart />
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </div>
//         <div className='col-xl-4'>
//           {appointments.map((appointment, index) => (
//             <div className="appointment" key={index} style={{ backgroundColor: colors[index % colors.length], border: "1px solid whitesmoke", borderRadius: "10px", marginBottom: "10px" }}>
//               <div className="left">
//                 {/* Left-hand side image */}
//                 <img src={ladydoctor} alt={appointment.name} style={{ height: "50px", width: "50px", borderRadius: "50px" }} />
//               </div>
//               <div className="middle">
//                 {/* Name of the appointment */}
//                 <h5> {appointment.name}</h5>
//                 {/* Time of the appointment */}
//                 <p>{appointment.time}</p>
//               </div>
//               <div className="right">
//                 {/* Icon for details */}
//                 <div style={{ height: "30px", width: "30px", backgroundColor: "white", borderRadius: "50%", marginRight: "50px", display: "flex", justifyContent: "center", alignItems: "center" }}>
//                   <GoChevronRight />
//                 </div>
//               </div>
//             </div>
//           ))}
//           <div style={{ textAlign: "center", marginTop: "20px" }}>
//             <div className="btn btn-outline-secondary view-all-appointments" style={{ width: "100%" }}>
//               View all Appointments <GoChevronRight />
//             </div>
//           </div>
//         </div>

//       </div>

//     </>

//   );
// }
// export default doctordash;









import React, { useEffect, useState } from 'react';
import docimg from '../components/portrait-3d-male-doctor-removebg-preview.png';
import Chart from '../components/chart';
import '../css/dashdoctor.css';
import Calendar from '../components/calendar';
import { IoPersonSharp } from 'react-icons/io5';
import { RiStethoscopeFill } from 'react-icons/ri';
import { GiLoveInjection } from 'react-icons/gi';
import { FaBriefcaseMedical } from 'react-icons/fa';
import Pchart from '../components/pchart';
import { Row, Col } from 'react-bootstrap';
import { GoChevronRight } from "react-icons/go";
import ladydoctor from './ladydoctor.jpg'

const appointments = [
  {
    image: 'ladydoctor.jpg',
    name: 'John Doe',
    time: '10:00 AM - 11:00 AM'
  },
  {
    image: 'ladydoctor.jpg',
    name: 'Jane Smith',
    time: '11:30 AM - 12:30 PM'
  },
  {
    image: 'ladydoctor.jpg',
    name: 'Michael Johnson',
    time: '1:00 PM - 2:00 PM'
  },
  {
    image: 'ladydoctor.jpg',
    name: 'Michael Johnson',
    time: '1:00 PM - 2:00 PM'
  },
  // Add more appointments as needed
];



const colors = ["lightgrey", "lightblue", "lightyellow", "lavender", "lightcoral", "lightsalmon", "lightsteelblue", "lightseagreen", "lightblue"];

function Doctordash() {
  const [contactInfo, setContactInfo] = useState(null);
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
  return (

    <>
      <div className="container">
        <div className="row ">
          <div className="col-xl-8">

            <div className=" col-xl-12 p-5 border rounded-2 bg-white text-white" id="box" >
              <div className="pname">
                <p className="fs-6 pb-2">Welcome back,</p>
                <div>
                  {contactInfo && (
                    <p className="fs-2">
                      <b> Dr. {contactInfo.FirstName} {contactInfo.LastName}</b>
                      <p className="fs-0">MD.DM(Cardiology),FACC,FESC</p>
                    </p>
                  )}
                </div>

                <p className="fs-6">
                  You have total <span className="text-warning">12 appointments</span> today!
                </p>
              </div>
              <div className="float-end" id="docimg">
                <img alt="dash" src={docimg} className="" id="dimg" />
              </div>
            </div>
            <br></br>
            <div className='col-xl-12 report '>
              <div className="card custom-card" style={{ borderRadius: '10px' }}>
                <div className="card-body">
                  <div className="row">
                    <div className="d-flex align-items-center justify-content-between m-2">
                      <div className="d-flex align-items-center">
                        <b className="m-0" style={{ fontSize: "18px" }}>Report</b>
                      </div>
                      <select name="cars" id="cars" className="float-end  custom-dropdown">
                        <option value="volvo">This month</option>
                        <option value="saab">yesterday</option>
                        <option value="mercedes">today</option>
                        {/* <option value="audi">Audi</option> */}
                      </select>
                    </div>
                    <br></br>
                  </div>
                  <div className="row">
                    <div className="col-xl-3 col-md-6 mb-3 mb-md-0" style={{ height: '100px' }}>
                      <div className="border rounded-2  text-center" id="box1" style={{ height: '100px' }}>
                        <p style={{ margin: 0, fontSize: "16px", fontWeight: '400' }}>
                          <IoPersonSharp style={{ color: "black", fontSize: "16px", fontWeight: '400' }} />  patients
                        </p>
                        <p className="fs-2" style={{ margin: 0, color: "black", fontWeight: '600' }}>473</p>
                      </div>
                    </div>
                    <div className="col-xl-3 col-md-6 mb-3 mb-md-0" style={{ height: '100px' }}>
                      <div className="border rounded-2  text-center" id="box2" style={{ height: '100px' }}>
                        <p style={{ margin: 0, fontSize: "16px", fontWeight: '400' }}>
                          <RiStethoscopeFill style={{ color: "black", fontSize: "16px", fontWeight: '400' }} /> consultation
                        </p>
                        <p className="fs-2" style={{ margin: 0, color: "black", fontWeight: '600' }}>236</p>
                      </div>
                    </div>
                    <div className="col-xl-3 col-md-6 mb-3 mb-md-0" style={{ height: '100px' }}>
                      <div className="border rounded-2  text-center" id="box3" style={{ height: '100px' }} >
                        <p style={{ margin: 0, fontSize: "16px", fontWeight: '400' }}>
                          <GiLoveInjection style={{ color: "black", fontSize: "16px", fontWeight: '400' }} /> inject
                        </p>
                        <p className="fs-2" style={{ margin: 0, color: "black", fontWeight: '600' }}>105</p>
                      </div>
                    </div>
                    <div className="col-xl-3 col-md-6 mb-3 mb-md-0" style={{ height: '100px' }}>
                      <div className="border rounded-2  text-center" id="box4" style={{ height: '100px' }}  >
                        <p style={{ margin: 0, fontSize: "16px", fontWeight: '400' }}>
                          <FaBriefcaseMedical style={{ color: "black", fontSize: "16px", fontWeight: '400' }} /> surgery
                        </p>
                        <p className="fs-2" style={{ margin: 0, color: "black", fontWeight: '600' }}>132</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
            <div className="col-xl-12">
              <Row style={{ display: 'flex' }}>
                <Col md={6} lg={6} xl={6} className="mb-3 mb-lg-0">
                  <div className='card another-custom-cardd' style={{ borderRadius: "10px", width: "100%" }}>
                    <div className='card-body body-chart' style={{ borderRadius: "10px" }}>
                      <Chart />
                    </div>
                  </div>
                </Col>
                <Col md={6} lg={6} xl={6} className="mb-3 mb-lg-0">
                  <div className='card another-custom-card' style={{ borderRadius: "10px", width: "100%" }}>
                    <div className='card-body body-chart' style={{ borderRadius: "10px" }}>
                      <Pchart />
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div className='col-xl-4'>
          
              <div className=" col-xl-12 card calenderr" style={{ borderRadius: '10px' }}>
                <div className="card-header">
                  <h5>Appointments</h5>
                </div>
                <div className="card-body" >
                  <div style={{ height: "100%" }}>
                    <Calendar className="custom-calendar" />
                  </div>
                </div>
              </div>
              <div className='col-xl-12 card another-custom-card' style={{ borderRadius: "10px", width: "100%" }}>
                <div className='card-body'>
                  {appointments.map((appointment, index) => (
                    <div className="appointment" key={index} style={{ backgroundColor: colors[index % colors.length], border: "1px solid whitesmoke", borderRadius: "10px", marginBottom: "10px" }}>
                      <div className="left">
                        {/* Left-hand side image */}
                        <img src={ladydoctor} alt={appointment.name} style={{ height: "50px", width: "50px", borderRadius: "50px" }} />
                      </div>
                      <div className="middle">
                        {/* Name of the appointment */}
                        <h5> {appointment.name}</h5>
                        {/* Time of the appointment */}
                        <p>{appointment.time}</p>
                      </div>
                      <div className="right">
                        {/* Icon for details */}
                        <div style={{ height: "30px", width: "30px", backgroundColor: "white", borderRadius: "50%", marginRight: "50px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <GoChevronRight />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <div className="btn btn-outline-secondary view-all-appointments" style={{ width: "100%" }}>
                      View all Appointments <GoChevronRight />
                    </div>
                  </div>
                </div>

              </div>
           
          </div>
        </div>
      </div>
    </>
  );
}
export default Doctordash;







