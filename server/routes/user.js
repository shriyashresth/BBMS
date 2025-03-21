const express = require('express')

// controller function
const {signupUser,loginUser, getUserById} = require('../controllers/userController.js')

// router
const router = express.Router()

router.get('/:id',getUserById)

// login route
router.post('/login',loginUser)

// sinUp route
router.post('/signup',signupUser)

module.exports = router

 