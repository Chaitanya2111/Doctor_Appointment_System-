import React, { useState } from 'react';
import Setting from '../components/Setting'
import About from '../components/About'

import '../css/Nav.css'


function Navbar(){

    const [activeTab, setActiveTab] = useState('about');

    const handleTabClick = (tab) => {
      setActiveTab(tab);
    };

    return(
        <>


         <div className="tabs my-5" > 
            {/* heading titles  */}  
      
       <div id='d1'>
        <button
         className={`${activeTab === 'about' ? 'border-bottom border-dark' : ''}`}
          onClick={() => handleTabClick('about')}
          id='post'
          style={{color:'black',fontWeight:'600'}}
        >
          About Me
        </button>
        </div>
        <div id='d1'>
        <button
        className={`${activeTab === 'setting' ? 'border-bottom border-dark' : ''}`}
        onClick={() => handleTabClick('setting')}
        id='post'
        style={{color:'black',fontWeight:'600'}}
        >
            
          Setting
        </button>
        </div><hr/>
        
      </div>

        {/* title body  */}

      {activeTab === 'about' && (
        <div className="py-3">
         <About />
        </div>
      )}
      {activeTab === 'setting' && (
        <div className="py-3">
         <Setting></Setting>
        </div>
      )}


        </>
    );
}
export default Navbar;