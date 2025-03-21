const express = require('express')                              // express
// const Workout = require('../models/workoutModel.js')            // model

const {
    createWorkout,
    getWorkout,
    getWorkouts,
    deleteWorkout,
    updateWorkout
} = require('../controllers/workoutController.js')
const requireAuth = require('../middleware/requireAuth.js')

const router = express.Router()

//this will protect routes coming below
router.use(requireAuth)

// GET all workouts
router.get('/',getWorkouts)


// GET a single workout
router.get('/:id', getWorkout)

// POST a new workout
router.post('/', createWorkout)

// DELETE a workout
router.delete('/:id',deleteWorkout)


// UPDATE a workout
router.patch('/:id',updateWorkout)


module.exports = router