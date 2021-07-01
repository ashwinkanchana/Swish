const { check } = require('express-validator')
const pool = require('../config/mysql')

exports.productValidator = [
    check('productName', 'Please provide a valid prodcut name').trim().not().isEmpty(),
    check('price', 'Please provide a valid price').trim().isNumeric(),
    check('userID', 'Please provide a valid userID').trim().isNumeric(),
    check('description', 'Please provide a description').trim().not().isEmpty(),
    check('userName', 'Please provide a valid username').trim().not().isEmpty().bail().custom(async(username) => {
        //Check if user exists
        const checkUserNameQuery = `select exists(select username from users where username = ${pool.escape(username)}) as userNameCheck;`
        const isUserNameValid = await pool.query(checkUserNameQuery)
        if (!(isUserNameValid[0].userNameCheck)) 
            return Promise.reject('Invalid username');
    })
]