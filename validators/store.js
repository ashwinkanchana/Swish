const { check } = require('express-validator')

exports.storeValidator = [
    check('userName', 'Please provide a valid username without spaces').trim().not().isEmpty()
    .custom(value => !/\s/.test(value)).withMessage('No spaces are allowed in the user id'),
    check('storeName', 'Invalid store name').trim().not().isEmpty(),
    check('phoneNumber', 'Please provide a valid 10 digit phone number').trim().isNumeric().bail().isLength({ min: 10, max: 10 })
]