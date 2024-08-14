import React from 'react'

function Addtaxes() {
  return (
    <div className="container " style={{backgroundColor:'white'}}>
  
       <div className="row">
           <div className="col-lg-8 offset-lg-2 my-3">
               <h4 className="page-title">Add Tax</h4>
           </div>
       </div>
       <div className="row">
           <div className="col-lg-8 offset-lg-2">
               <form>
                   <div className="form-group my-3">
                       <label>Tax Name <span className="text-danger">*</span></label>
                       <input className="form-control" type="text"/>
                   </div>
                   <div className="form-group my-3">
                       <label>Tax Percentage (%) <span className="text-danger">*</span></label>
                       <input className="form-control" type="text"/>
                   </div>
                   <div className="form-group my-3">
                       <label>Status <span className="text-danger">*</span></label>
                       <select className="select form-control">
                           <option>Pending</option>
                           <option>Approved</option>
                       </select>
                   </div>
                   <div className="m-t-20 text-center my-4">
                       <button className="btn btn-success submit-btn">Create Tax</button>
                   </div>
               </form>
           </div>
       </div>
  
</div>

  )
}

export default Addtaxes
