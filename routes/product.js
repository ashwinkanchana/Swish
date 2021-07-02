const router = require('express').Router()
const pool = require('../config/mysql')
const { productValidator } = require('../validators/product')
const { validationResult } = require('express-validator')
const { insertProductCache, getStore } = require('../config/dynamoDB')
const domainName = process.env.DOMAIN_NAME


// POST create and update store
router.post('/', productValidator, async (req, res) => {
    try {
        console.log(req.body)
        const { productName, price, description, userName, userID } = req.body
        const validationErrors = validationResult(req).array();
        if (validationErrors.length > 0) {
            var error = validationErrors.map(function (item) {
                return item['msg'];
            });
            return res.json({ error })
        }

        //Create new product
        const insertQuery = `insert into products (product_name, product_price, product_description, user_id) values(${pool.escape(productName)}, ${pool.escape(price)}, ${pool.escape(description)}, ${pool.escape(userID)}); select product_name, product_price, product_description from products where user_id = ${pool.escape(userID)};`
        const result = (await pool.query(insertQuery))
        console.log(result)
        const productsArray = result[1]
        if (result[0].affectedRows) {
            insertProductCache(userName, productsArray)
            return res.json({
                message: 'Successfully added a product',
            })
        }
        else
            throw new Error('Couldn\'t insert new user to MySQL')

    } catch (error) {
        console.log(error)
        res.json({ error: ['Something went wrong!'] })
    }
})



module.exports = router