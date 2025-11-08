const express = require('express')
const router = express.Router()
const {getUser,createUser,getUserById,deleteUser,updateUser}=require('../controllers/user')

router.route('/').get(getUser).post(createUser)
router.route('/:id').get(getUserById).delete(deleteUser).patch(updateUser)


module.exports=router