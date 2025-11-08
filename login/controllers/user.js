const { StatusCodes } = require('http-status-codes');
const pool = require('../db/connect');

// GET all users
const getUser = async (req, res) => {
  let conn; // 
  try {
    conn = await pool.getConnection();

    const query = `SELECT * FROM UserDetails`;
    const rows = await conn.query(query);
    console.log(rows.toString())

    res.status(StatusCodes.OK).json(rows);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  } finally {
    if (conn) conn.release(); // 
  }
};

// GET all users by id
const getUserById = async (req, res) => {
  let conn; 
  const userId=req.params.id
  console.log(userId)
 

  try {
    conn = await pool.getConnection();

    const query = `SELECT * FROM UserDetails WHERE userid = ?`;
const rows= await conn.query(query, [userId]);
    console.log(rows.toString())

    res.status(StatusCodes.OK).json(rows);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  } finally {
    if (conn) conn.release(); 
  }
};

// CREATE user
const createUser = async (req, res) => {
    console.log(req.body)
  let conn;
  try {
    const {
      userid,
      first_name,
      last_name,
      gender,
      phonenumber,
      emailid,
      department,
      created_by
    } = req.body;

    // Basic validation
    if (
      !userid ||
      !first_name ||
      !last_name ||
      !gender ||
      !phonenumber ||
      !emailid ||
      !department ||
      !created_by
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'All fields are required' });
    }

    
    if (phonenumber.length !== 13) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Phone number must be exactly 13 digits' });
    }

    conn = await pool.getConnection();

    const query = `
      INSERT INTO UserDetails 
      (userid, first_name, last_name, gender, phonenumber, emailid, department, created_by, created_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const result = await conn.query(query, [
      userid,
      first_name,
      last_name,
      gender,
      phonenumber,
      emailid,
      department,
      created_by
    ]);

    res.status(StatusCodes.CREATED).json({
      msg: 'User created successfully',
      userdetailId: result.insertId.toString()
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  } finally {
    if (conn) conn.release();
  }
};
const updateUser = async (req, res) => {
  let conn;
  console.log('from update' ,req.body)
  const userdetailId = parseInt(req.params.id);
  const userid = req.user.userId; 

  try {
    const {
      first_name,
      last_name,
      gender,
      phonenumber,
      emailid,
      department,
      created_by
    } = req.body;

    // build dynamic set clause
    const fields = [];
    const values = [];

    if (first_name) {
      fields.push('first_name = ?');
      values.push(first_name);
    }
    if (last_name) {
      fields.push('last_name = ?');
      values.push(last_name);
    }
    if (gender) {
      fields.push('gender = ?');
      values.push(gender);
    }
    if (phonenumber) {
      if (phonenumber.length !== 13) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Phone number must be exactly 13 digits' });
      }
      fields.push('phonenumber = ?');
      values.push(phonenumber);
    }
    if (emailid) {
      fields.push('emailid = ?');
      values.push(emailid);
    }
    if (department) {
      fields.push('department = ?');
      values.push(department);
    }
    if (created_by) {
      fields.push('created_by = ?');
      values.push(created_by);
    }

    // no fields to update
    if (fields.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'No fields provided to update' });
    }

    // add updated_date and where clause
    fields.push('created_date = NOW()');
    const query = `
      UPDATE UserDetails
      SET ${fields.join(', ')}
      WHERE userdetailId = ? AND userid = ?
    `;

    values.push(userdetailId, userid);

    conn = await pool.getConnection();
    const result = await conn.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'No record found or not authorized' });
    }

    res.status(StatusCodes.OK).json({ msg: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  } finally {
    if (conn) conn.release();
  }
};
const deleteUser = async (req, res) => {
  let conn; 
  const userdetailId=parseInt(req.params.id)
  const userid = req.user.userId
  console.log("hellloooooo",userdetailId,userid)
  
  try {
    conn = await pool.getConnection();

    const query = `
      DELETE FROM UserDetails
      WHERE userdetailId = ? AND userid = ?
    `;
    const result = await conn.query(query, [userdetailId, userid]);

    if (result.affectedRows === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'No record found or not authorized' });
    }

    res.status(StatusCodes.OK).json({ msg: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  getUser,
  createUser,getUserById,deleteUser,updateUser
};
