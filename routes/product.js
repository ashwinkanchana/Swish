const express = require('express')
const router = express.Router()
const { pool } = require('../config/mysql')


// GET test
router.post('/', async (req, res) => {
    try {
        res.status(200)
        .json({
            mesage: 'Hello world',
            id: uuidv4()
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Something went wrong'})
    }
})

module.exports = router