const express = require('express')                              // express

const {
    createRequest,
    getRequestsUnit,
    getRequest,
    getRequests,
    deleteRequest,
    updateRequest,
    getRequestPerBlood
} = require('../controllers/bloodrequestController.js')
const requireAuth = require('../middleware/requireAuth.js')

const router = express.Router()

//this will protect routes coming below
router.use(requireAuth)

// GET all workouts
router.get('/',getRequests)
router.get('/unit',getRequestsUnit)
router.get('/split',getRequestPerBlood)



// GET a single workout
router.get('/:id', getRequest)

// POST a new workout
router.post('/', createRequest)

// DELETE a workout
router.delete('/:id',deleteRequest)


// UPDATE a workout
router.patch('/:id',updateRequest)

module.exports = router