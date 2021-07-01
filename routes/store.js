const express = require('express')
const router = express.Router()
const { pool } = require('../config/mysql')
const {storeValidator} = require('../validators/store')
const { validationResult } = require('express-validator')
const domainName = process.env.DOMAIN_NAME

// POST create and update store
router.post('/', storeValidator, async (req, res) => {
    try {
        const {userName, storeName, phoneNumber} = req.body
        const validationErrors = validationResult(req).array();
        if (validationErrors.length > 0) {
            var error = validationErrors.map(function (item) {
                return item['msg'];
            });
            return res.status(400).json({ error })
        }

        //Check if user already exists
        const checkUserNameQuery = `select exists(select username from users where username = ${pool.escape(userName)}) as userNameCheck;`
        const isUserNameUnique = (await pool.query(checkUserNameQuery))

        //Update existing store
        if (isUserNameUnique[0].userNameCheck){
            const updateQuery = `update users set phone_number = ${pool.escape(phoneNumber)}, store_name = ${pool.escape(storeName)} where username = ${pool.escape(userName)};`
            const result = (await pool.query(updateQuery))
            if (result.affectedRows) {
                return res.status(200).json({
                    message: 'Successfully updated store info',
                    storeLink: `${domainName}/${userName}`,
                    userName, storeName, phoneNumber
                })
            }
            else
                throw new Error('Couldn\'t insert new user to MySQL')
        }
        //Create new store
        else{
            const insertQuery = `insert into users(username, store_name, phone_number) values(${pool.escape(userName)}, ${pool.escape(storeName)}, ${pool.escape(phoneNumber)});`
            const result = (await pool.query(insertQuery))
            if (result.affectedRows) {
                return res.status(200).json({
                    message: 'Successfully created new store',
                    userName, storeName, phoneNumber
                })
            }
            else
                throw new Error('Couldn\'t insert new user to MySQL')
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error: ['Something went wrong!']})
    }
})


router.get('/:userName', async (req, res) => {
    try {
        const userName = req.params.userName

        const storeInfoQuery
        res.status(200).json({ userName});
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: ['Something went wrong!'] })
    }
})

module.exports = router