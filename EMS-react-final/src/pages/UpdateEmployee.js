// src/pages/UpdateEmployee.js
import React, { useState, useEffect } from 'react';
import { authRequest } from '../api/authService';

export default function UpdateEmployee({ employee, switchView, refreshList }) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    phone_number: '',
    email_id: '',
    department: '',
    created_by: '',
  });

  useEffect(() => {
    if (employee) {
      setForm({
        first_name: employee.first_name,
        last_name: employee.last_name,
        gender: employee.gender,
        phone_number: employee.phone_number,
        email_id: employee.email_id,
        department: employee.department,
        created_by: employee.created_by,
      });
    }
  }, [employee]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authRequest({
        url: `/employees/${employee.userid}`,
        method: 'PUT',
        data: form,
      });
      refreshList(); // refresh employee list
      switchView();  // switch back to list
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || err.message);
    }
  };

  return (
    <div className="employee-form">
      <h3>Update Employee</h3>
      <form onSubmit={handleSubmit}>
        <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} required />
        <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} required />
        <select name="gender" value={form.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input name="phone_number" placeholder="Phone Number" value={form.phone_number} onChange={handleChange} required />
        <input name="email_id" placeholder="Email" value={form.email_id} onChange={handleChange} required />
        <input name="department" placeholder="Department" value={form.department} onChange={handleChange} required />
        <input name="created_by" placeholder="Created By" value={form.created_by} onChange={handleChange} required />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
