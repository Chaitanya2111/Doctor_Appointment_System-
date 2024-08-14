import React from 'react'

function Addprovidentfund() {
  return (
    <div className="container bg-white shadow">
        <div className="row">
            <div className="col-lg-8 offset-lg-2 my-3">
                <h4 className="page-title">Add Provident Fund</h4>
            </div>
        </div>
        <div className="row">
            <div className="col-lg-8 offset-lg-2">
                <form>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group my-3">
                                <label>Employee Name</label>
                                <select className="form-control select">
                                    <option value="3">John Doe (FT-0001)</option>
                                    <option value="23">Richard Miles (FT-0002)</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group my-3">
                                <label>Provident Fund Type</label>
                                <select className="form-control select">
                                    <option value="Fixed Amount" selected="">Fixed Amount</option>
                                    <option value="Percentage of Basic Salary">Percentage of Basic Salary</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="show-fixed-amount">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group my-3">
                                            <label>Employee Share (Amount)</label>
                                            <input className="form-control" type="text"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group my-3">
                                            <label>Organization Share (Amount)</label>
                                            <input className="form-control" type="text"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="show-basic-salary">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group my-3">
                                            <label>Employee Share (%)</label>
                                            <input className="form-control" type="text"/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group my-3">
                                            <label>Organization Share (%)</label>
                                            <input className="form-control" type="text"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group my-3">
                                <label>Description</label>
                                <textarea className="form-control" rows="4" cols="50"></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="m-t-20 text-center my-3">
                        <button className="btn btn-success submit-btn">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

  )
}

export default Addprovidentfund
