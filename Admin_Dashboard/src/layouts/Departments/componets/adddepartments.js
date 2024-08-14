import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function AddDepartments() {
  const { dep_id } = useParams();
  const [departmentName, setDepartmentName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');
  const [message, setMessage] = useState('');
  const [pageTitle, setPageTitle] = useState('Add Department');
  const [buttonText, setButtonText] = useState('Create Department');
  const navigate = useNavigate();

  useEffect(() => {
    if (dep_id) {
      const fetchDepartment = async () => {
        try {
          const response = await axios.get(`http://localhost:3005/hospital/departments/${dep_id}`);
          const { department_name, description, status } = response.data;
          setDepartmentName(department_name);
          setDescription(description);
          setStatus(status);
          setPageTitle('Update Department');
          setButtonText('Update Department');
        } catch (error) {
          console.error('Error fetching department:', error);
        }
      };

      fetchDepartment();
    }
  }, [dep_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const hospitalId = sessionStorage.getItem('Hospital_id');
  
    try {
      let response;
      const departmentData = {
        departmentName: departmentName,
        description: description,
        status: status,
        hospitalId: hospitalId,
      };
  
      if (dep_id) {
        response = await axios.put(`http://localhost:3005/hospital/update-department/${dep_id}`, departmentData);
      } else {
        response = await axios.post('http://localhost:3005/hospital/submit-department', departmentData);
      }
  
      if (response.status === 200 || response.status === 201) {
        setMessage('Department saved successfully');
        // Reset the form
        setDepartmentName('');
        setDescription('');
        setStatus('Active');
        navigate('/app/dashboard/departments');
      }
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving department');
      console.error(error);
    }
  };
  
  return (
    <div className="container" style={{ backgroundColor: 'white' }}>
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <br />
          <h4 className="page-title">{pageTitle}</h4>
          <br />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Department Name</label>
              <input
                className="form-control"
                type="text"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                required
              />
            </div>
            <br />
            <div className="form-group">
              <label>Description</label>
              <textarea
                cols="30"
                rows="4"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <br />
            <div className="form-group">
              <label className="display-block">Department Status : </label><br />
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="status"
                  id="product_active"
                  value="Active"
                  checked={status === 'Active'}
                  onChange={() => setStatus('Active')}
                />
                <label className="form-check-label" htmlFor="product_active">
                  Active
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="status"
                  id="product_inactive"
                  value="Inactive"
                  checked={status === 'Inactive'}
                  onChange={() => setStatus('Inactive')}
                />
                <label className="form-check-label" htmlFor="product_inactive">
                  Inactive
                </label>
              </div>
            </div>
            <br />
            <div className="m-t-20 text-center">
              <button className="btn btn-success submit-btn">{buttonText}</button>
            </div>
          </form>
          {message && <p className="mt-3 text-center">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default AddDepartments;
