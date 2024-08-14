import React from 'react';
import { FaFacebook, FaWhatsapp, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './footer.css'
function Footer() {
    return (
        <footer className='footermain'>
            <div className="container fcontainer">
                <div className="row">
                    <div className="col-lg-6">
                        <p>&copy; 2023  @LissomTechnologies</p>
                    </div>
                    <div className="col-lg-6" >
                        <div className="row media" style={{float:"right"}}>
                          <div className='col-3'>
                          <a href="#" target="_blank" rel="noopener noreferrer">
                                <FaFacebook size={24} color='#ffffff' />
                            </a>
                          </div>
                          <div className='col-3'>
                          <a href="#" target="_blank" rel="noopener noreferrer">
                                <FaWhatsapp size={24} color='#ffffff' />
                            </a>
                          </div>
                           <div className='col-3'>
                           <a href="#" target="_blank" rel="noopener noreferrer">
                                <FaInstagram size={24} color='#ffffff' />
                            </a>
                           </div>
                            <div className='col-3'>
                            <a href="#" target="_blank" rel="noopener noreferrer" >
                                <FaLinkedin size={24} color='#ffffff' />
                            </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;