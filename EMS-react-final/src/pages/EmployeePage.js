import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authRequest, logoutClient } from '../api/authService';
import './EmployeePage.css';

export default function EmployeePage() {
  const loggedInUserId = parseInt(localStorage.getItem('userId'));
  console.log(loggedInUserId)
  const [view, setView] = useState('list'); // 'list', 'add', 'update'
  const [employees, setEmployees] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    phonenumber: '',
    emailid: '',
    department: '',
    created_by: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Dummy data
  // const dummyEmployees = [
  //   {
  //     userid: 1,``
  //     first_name: 'John',
  //     last_name: 'Doe',
  //     gender: 'Male',
  //     phonenumber: '1234567890',
  //     emailid: 'john@example.com',
  //     department: 'IT',
  //     created_by: 'Admin',
  //     created_date: '2025-11-06',
  //   },
  //   {
  //     userid: 2,
  //     first_name: 'Jane',
  //     last_name: 'Smith',
  //     gender: 'Female',
  //     phonenumber: '9876543210',
  //     emailid: 'jane@example.com',
  //     department: 'HR',
  //     created_by: 'Admin',
  //     created_date: '2025-11-05',
  //   },
  // ];

  // Fetch employees from backend or use dummy data
  const fetchEmployees = async () => {
    try {
      const res = await authRequest({ url: '/employees', method: 'GET' });
      setEmployees(res.data.length ? res.data : dummyEmployees);
    } catch (err) {
      console.error(err);
      setEmployees(dummyEmployees); // fallback to dummy
      if (err.response?.status === 401) {
        logoutClient();
        navigate('/');
      }
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Form handling
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

 const handleAdd = async e => {
  e.preventDefault();

  try {

     const createdById = parseInt(localStorage.getItem('userId')); 
     
    if (!createdById) throw new Error('User not logged in');

    
    const payload = {
      userid: parseInt(createdById),
      ...form,
      created_by: localStorage.getItem('username') || 'Admin', 
    };
    console.log(payload)

    // Call backend API to save employee
    const res = await authRequest({
      url: '/employees',      // your POST endpoint
      method: 'POST',
      data: payload,
    });

    // Update local state with newly created employee returned from backend
    const newEmployee = {
      ...payload,
      userid: res.data.userdetailId,      // backend ID
      created_date: new Date().toISOString().split('T')[0],
    };

    setEmployees([...employees, newEmployee]);
    setView('list');
    setForm({
      first_name: '',
      last_name: '',
      gender: '',
      phonenumber: '',
      emailid: '',
      department: '',
      created_by: '',
    });

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.msg || 'Failed to add employee');
  }
};


  const handleUpdateClick = emp => {
    setCurrentEmployee(emp);
    console.log(emp)
    setForm({ ...emp });
    setView('update');
  };

  const handleUpdate = async e => {
    
    e.preventDefault();
    console.log('helllo',form.userdetailId )
  
     try {
      const res = await authRequest({
       url: `/employees/${form.userdetailId}`,      
      method: 'PATCH',
      data: form,
      })
      setEmployees((prev) =>
      prev.map((emp) =>
        emp.userdetailId === form.userdetailId ? { ...emp, ...form } : emp
      )
    );

    alert('Employee updated successfully!');
      setView('list');
    setCurrentEmployee(null);
      
     } catch (error) {
      console.error(error);
    alert(error.response?.data?.msg || 'Failed to add employee');
      
     }
    setView('list');
    setCurrentEmployee(null);
  };

  const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this employee?')) {
    try {
      await authRequest({ url: `/employees/${id}`, method: 'DELETE' });
      alert('Employee deleted successfully!');
      setEmployees(prev => prev.filter(emp => emp.userid !== id));
      setView('list');     
      fetchEmployees();    
    } catch (error) {
      console.error(error);
      alert('Failed to delete employee.');
    }
  }
};

  const handleLogout = () => {
    logoutClient();
    navigate('/');
  };

  return (
    <div className="employee-page">
      <nav className="employee-nav">
        <h2>EMS Portal</h2>
        <div>
          <button onClick={() => setView('list')}>Employee List</button>
          <button onClick={() => setView('add')}>Add Employee</button>
          <button onClick={() => setView('Update')}>Update Employee</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {view === 'list' && (
        <div className="employee-container">
          {error && <p className="error">{error}</p>}
          <table className="employee-table">
            <thead>
              <tr>
                <th>UserID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Department</th>
                <th>Created By</th>
                <th>Created Date</th>
                
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.userid}>
                  <td>{emp.userid}</td>
                  <td>{emp.first_name}</td>
                  <td>{emp.last_name}</td>
                  <td>{emp.gender}</td>
                  <td>{emp.phonenumber}</td>
                  <td>{emp.emailid}</td>
                  <td>{emp.department}</td>
                  <td>{emp.created_by}</td>
                  <td>{emp.created_date}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {view === 'Update' && (
        <div className="employee-container">
          {error && <p className="error">{error}</p>}
          <table className="employee-table">
            <thead>
              <tr>
                <th>UserID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Department</th>
                <th>Created By</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.filter(emp => emp.userid === loggedInUserId)
              .map(emp => (
                <tr key={emp.userid}>
                  <td>{emp.userid}</td>
                  <td>{emp.first_name}</td>
                  <td>{emp.last_name}</td>
                  <td>{emp.gender}</td>
                  <td>{emp.phonenumber}</td>
                  <td>{emp.emailid}</td>
                  <td>{emp.department}</td>
                  <td>{emp.created_by}</td>
                  <td>{emp.created_date}</td>
                  <td>
                    <button className="update-btn" onClick={() => handleUpdateClick(emp)}>Update</button>
                    <button className="delete-btn" onClick={() => handleDelete(emp.userdetailId)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {(view === 'add' || view === 'update') && (
        <div className="employee-form">
          <h3>{view === 'add' ? 'Add Employee' : 'Update Employee'}</h3>
          {error && <p className="error">{error}</p>}
          <form onSubmit={view === 'add' ? handleAdd : handleUpdate}>
            <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} required />
            <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} required />
            <select name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input name="phonenumber" placeholder="Phone Number" value={form.phonenumber} onChange={handleChange} required />
            <input name="emailid" placeholder="Email" value={form.emailid} onChange={handleChange} required />
            <input name="department" placeholder="Department" value={form.department} onChange={handleChange} required />
            <input name="created_by" placeholder="Created By" value={form.created_by} onChange={handleChange} required />
            <button type="submit">{view === 'add' ? 'Add Employee' : 'Update Employee'}</button>
          </form>
        </div>
      )}
    </div>
  );
}
