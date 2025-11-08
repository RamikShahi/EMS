// src/pages/EmployeeList.js
import React, { useState } from 'react';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([
    {
      userid: 1,
      first_name: 'John',
      last_name: 'Doe',
      gender: 'Male',
      phone_number: '9876543210',
      emailid: 'john@example.com',
      department: 'IT',
      created_by: 'Admin',
      created_date: '2025-11-06',
    },
    {
      userid: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      gender: 'Female',
      phone_number: '9876543211',
      emailid: 'jane@example.com',
      department: 'HR',
      created_by: 'Admin',
      created_date: '2025-11-05',
    },
  ]);

  const handleDelete = userid => {
    if (!window.confirm('Are you sure?')) return;
    setEmployees(employees.filter(emp => emp.userid !== userid));
  };

  const handleUpdate = userid => {
    const first_name = prompt('Enter new first name:');
    const last_name = prompt('Enter new last name:');
    if (first_name && last_name) {
      setEmployees(
        employees.map(emp =>
          emp.userid === userid ? { ...emp, first_name, last_name } : emp
        )
      );
    }
  };

  return (
    <div>
      <h2>Employee List</h2>
      <table className="employee-table">
        <thead>
          <tr>
            <th>UserID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Gender</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Department</th>
            <th>Created By</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.userid}>
              <td>{emp.userid}</td>
              <td>{emp.first_name}</td>
              <td>{emp.last_name}</td>
              <td>{emp.gender}</td>
              <td>{emp.phone_number}</td>
              <td>{emp.emailid}</td>
              <td>{emp.department}</td>
              <td>{emp.created_by}</td>
              <td>{emp.created_date}</td>
              <td>
                <button className="update-btn" onClick={() => handleUpdate(emp.userid)}>Update</button>
                <button className="delete-btn" onClick={() => handleDelete(emp.userid)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
