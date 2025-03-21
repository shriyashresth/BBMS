const express = require('express')                              // express

const {
    createFeedback,
    getFeedback,
    getFeedbacks,
    deleteFeedback,
    updateFeedback
} = require('../controllers/feedbackController.js')
const requireAuth = require('../middleware/requireAuth.js')

const router = express.Router()

//this will protect routes coming below
router.use(requireAuth)

// GET all Feedbacks
router.get('/',getFeedbacks)


// GET a single Feedback
router.get('/:id', getFeedback)

// POST a new Feedback
router.post('/', createFeedback)

// DELETE a Feedback
router.delete('/:id',deleteFeedback)


// UPDATE a Feedback
router.patch('/:id',updateFeedback)


module.exports = router