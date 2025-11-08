const pool = require('../db/connect');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');
const createJWT = require('./token');

const register = async (req, res, next) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'All fields are required' });
  }

  let conn;
  try {
    conn = await pool.getConnection();  // explicitly get connection

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO employeeList (employeename, password, created_by, created_date)
      VALUES (?, ?, ?, NOW())
    `;
    const result = await conn.query(query, [name, hashedPassword, name]);

    res.status(StatusCodes.CREATED).json({
      msg: 'User created successfully. Please login.',
      id: result.insertId.toString()
    });

  } catch (err) {
    next(err);
  } finally {
    if (conn) conn.release();
  }
};

const login = async (req, res, next) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide username and password' });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const query = `SELECT * FROM employeeList WHERE employeename = ?`;
    const rows = await conn.query(query, [name]);

    if (!rows || rows.length === 0) {
      return res.status(401).json({ msg: 'User not found' });
    }

    const user = rows[0]; // pick first row
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid password' });
    }

    const token = createJWT({ id: user.employeeid, name: user.employeename });

    res.status(StatusCodes.OK).json({
      msg: 'Login successful',
      user: { id: user.employeeid.toString(), name: user.employeename.toString() },
      token
    });

  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = { register, login };
