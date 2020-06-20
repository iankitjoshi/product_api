const express = require('express')
const router = express.Router()
const  authenticateUser  = require('../app/middleware/authentication')

const productMobileController = require('../app/controller/ProductMobile')

router.get('/mobiles', productMobileController.list)
router.post('/mobiles',authenticateUser , productMobileController.create)
router.get('/mobiles/:id',authenticateUser , productMobileController.show)
router.put('/mobiles/:id',authenticateUser , productMobileController.update)
router.delete('/mobiles/:id',authenticateUser , productMobileController.destroy)

module.exports = router