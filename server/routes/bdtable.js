const express = require('express')                              // express

const {
    getTable,
    createTable
} = require('../controllers/bdtableController.js')
const requireAuth = require('../middleware/requireAuth.js')

const router = express.Router()

//this will protect routes coming below
router.use(requireAuth)

// GET all workouts
router.get('/',getTable)
router.post('/', createTable)

module.exports = router