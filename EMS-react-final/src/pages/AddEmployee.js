import React, { useState } from 'react';
import { authRequest } from '../api/authService'; // your axios instance

export default function AddEmployee({ switchView }) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    phone_number: '',
    emailid: '',
    department: '',
    created_by: localStorage.getItem('username') || '', // default to logged-in user
    created_date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const res = await authRequest({
        url: '/users',       // your backend endpoint for creating a user
        method: 'POST',
        data: form,
      });

      alert(`Employee Added: ${form.first_name} ${form.last_name}`);
      
      // Reset form
      setForm({
        first_name: '',
        last_name: '',
        gender: '',
        phone_number: '',
        emailid: '',
        department: '',
        created_by: localStorage.getItem('username') || '',
        created_date: new Date().toISOString().split('T')[0],
      });

      switchView(); // go back to list after adding
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Failed to add employee');
    }
  };

  return (
    <div>
      <h2>Add Employee</h2>
      {error && <p className="error">{error}</p>}
      <form className="employee-form" onSubmit={handleSubmit}>
        <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} required />
        <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} required />
        <select name="gender" value={form.gender} onChange={handleChange} required>
          <option value="">Selssect Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input name="phone_number" placeholder="Phone Number" value={form.phone_number} onChange={handleChange} required />
        <input name="emailid" placeholder="Email ID" value={form.emailid} onChange={handleChange} required />
        <input name="department" placeholder="Department" value={form.department} onChange={handleChange} required />
        <input name="created_by" placeholder="Created By" value={form.created_by} readOnly />
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
}
