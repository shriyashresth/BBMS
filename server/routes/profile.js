const express = require('express')                              // express
// const Workout = require('../models/workoutModel.js')            // model

const {
    createProfile,
    getProfilesCount,
    getProfile,
    getProfiles,
    updateProfile,
} = require('../controllers/profileController.js')
const requireAuth = require('../middleware/requireAuth.js')

const router = express.Router()

//this will protect routes coming below
router.use(requireAuth)

// GET all workouts
router.get('/',getProfiles)
router.get('/count',getProfilesCount)

// GET a single workout
router.get('/:id', getProfile)

// POST a new workout
router.post('/', createProfile)

// UPDATE a workout
router.patch('/:id',updateProfile)


module.exports = router