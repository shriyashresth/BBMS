const express = require('express')                              // express

const {
    createCamp,
    getCamp,
    getCamps,
    deleteCamp,
    updateCamp
} = require('../controllers/campController.js')

const requireAuth = require('../middleware/requireAuth.js')

const router = express.Router()

//this will protect routes coming below
router.use(requireAuth)

// GET all workouts
router.get('/',getCamps)


// GET a single workout
router.get('/:id', getCamp)

// POST a new workout
router.post('/', createCamp)

// DELETE a workout
router.delete('/:id',deleteCamp)


// UPDATE a workout
router.patch('/:id',updateCamp)

module.exports = router