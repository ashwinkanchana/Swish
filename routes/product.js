const express = require('express')
const router = express.Router()
const { pool } = require('../config/mysql')


// GET test
router.post('/add', async (req, res) => {
    try {
        const {name, price, description} = req.body
        const insertProdcutQuery = s
        res.status(200).json({
            mesage: 'Successfully added product',
            name, price, description
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Something went wrong'})
    }
})

module.exports = router