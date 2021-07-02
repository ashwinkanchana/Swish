const router = require('express').Router()
const pool = require('../config/mysql')
const { storeValidator } = require('../validators/store')
const { validationResult } = require('express-validator')
const { insertStoreCache, updateStoreCache, getAllStores, getStore } = require('../config/dynamoDB')
const domainName = process.env.DOMAIN_NAME


// POST create and update store
router.post('/', storeValidator, async (req, res) => {
    try {
        const { userName, storeName, phoneNumber } = req.body
        const validationErrors = validationResult(req).array();
        if (validationErrors.length > 0) {
            var error = validationErrors.map(function (item) {
                return item['msg'];
            });
            return res.json({ error })
        }

        //Check if user already exists

        const checkUserNameQuery = `select exists(select username from users where username = ${pool.escape(userName)}) as userNameCheck;`
        const isUserNameUnique = (await pool.query(checkUserNameQuery))

        //Update existing store 
        if (isUserNameUnique[0].userNameCheck) {
            const updateQuery = `update users set phone_number = ${pool.escape(phoneNumber)}, store_name = ${pool.escape(storeName)} where username = ${pool.escape(userName)};select user_id from users where username = ${pool.escape(userName)};`
            const result = (await pool.query(updateQuery))
            console.log(result)
            if (result[0].affectedRows) {
                updateStoreCache(userName, phoneNumber, storeName, result[1][0].user_id)
                return res.json({
                    message: 'Successfully updated store info',
                    storeLink: `${domainName}/${userName}`,
                    userName, storeName, phoneNumber, userID: result[1][0].user_id
                })
            }
            else
                throw new Error('Couldn\'t insert new user to MySQL')
        }

        //Create new store
        else {
            const insertQuery = `insert into users(username, store_name, phone_number) values(${pool.escape(userName)}, ${pool.escape(storeName)}, ${pool.escape(phoneNumber)});`
            const result = (await pool.query(insertQuery))
            console.log(result)
            if (result.affectedRows) {
                insertStoreCache(userName, phoneNumber, storeName, result.insertId)
                return res.json({
                    message: 'Successfully created new store',
                    storeLink: `${domainName}/${userName}`,
                    userName, storeName, phoneNumber, userID: result.insertId
                })
            }
            else
                throw new Error('Couldn\'t insert new user to MySQL')
        }
    } catch (error) {
        console.log(error)
        res.json({ error: ['Something went wrong!'] })
    }
})

router.get('/all', async (req, res) => {
    try {
        const allStores = await getAllStores()
        return res.json(allStores);
    } catch (error) {
        console.log(error)
        res.json({ error: ['Something went wrong!'] })
    }
})


router.get('/:userName', async (req, res) => {
    try {
        res.json((await getStore(req.params.userName)).storeData[0]);
    } catch (error) {
        console.log(error)
        res.json({ error: ['Something went wrong!'] })
    }
})

module.exports = router