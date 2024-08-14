import React from 'react'

function Addexpenses() {
  return (
    <div className="container" style={{backgroundColor:'white'}}>
    <div className="row">
        <div className="col-lg-8 offset-lg-2 my-3">
            <h4 className="page-title">New Expense</h4>
        </div>
    </div>
    <div className="row">
        <div className="col-lg-8 offset-lg-2">
            <form>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group my-3">
                            <label>Item Name</label>
                            <input className="form-control" type="text"/>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group my-3">
                            <label>Purchase From</label>
                            <input className="form-control" type="text"/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group my-3">
                            <label>Purchase Date</label>
                            <div className="cal-icon">
                                <input className="form-control datetimepicker" type="date"/>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group my-3">
                            <label>Purchased By </label>
                            <select className="select form-control">
                                <option>Daniel Porter</option>
                                <option>Roger Dixon</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group my-3">
                            <label>Amount</label>
                            <input placeholder="$50" className="form-control" type="text"/>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group my-3">
                            <label>Paid By</label>
                            <select className="select form-control">
                                <option>Cash</option>
                                <option>Cheque</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group my-3">
                            <label>Status</label>
                            <select className="select form-control">
                                <option>Pending</option>
                                <option>Approved</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group my-3">
                            <label>Attachments</label>
                            <input className="form-control" type="file"/>
                        </div>
                    </div>
                </div>
                <div className="attach-files">
                   
                        
                            {/* <img src={bimage} alt="" height='60px' width='60px' className='m-3'/> */}
                            {/* <a href="#" className="fa fa-close file-remove"></a> */}
                        
                        
                            {/* <img src={bimage} alt="" height='60px' width='60px' className='m-3' /> */}
                            {/* <a href="#" className="fa fa-close file-remove"></a> */}
                        
                    
                </div>
                <div className="m-t-20 text-center my-3">
                    <button className="btn btn-success submit-btn">Create Expense</button>
                </div>
            </form>
        </div>
    </div>
</div>

  )
}

export default Addexpenses
