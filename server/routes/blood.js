const express = require('express')                              // express

const {
    createDonation,
    getDonation,
    getDonations,
    deleteDonation,
    updateDonation,
    getDonationsUnit,
    getDonationPerBlood
} = require('../controllers/bloodController.js')
const requireAuth = require('../middleware/requireAuth.js')

const router = express.Router()

//this will protect routes coming below
router.use(requireAuth)

// GET all workouts
router.get('/',getDonations)
router.get('/unit',getDonationsUnit)
router.get('/split',getDonationPerBlood)


// GET a single workout
router.get('/:id', getDonation)

// POST a new workout
router.post('/', createDonation)

// DELETE a workout
router.delete('/:id',deleteDonation)


// UPDATE a workout
router.patch('/:id',updateDonation)

module.exports = router