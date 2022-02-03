const express = require('express');
const viewsController = require('./../controllers/viewController');
const router = express.Router();
const authController = require('./../controllers/authContoroller');



router.get('/',authController.isLoggedIn,viewsController.getOverview)
router.get('/tours/:slug',authController.isLoggedIn,viewsController.getTour)
router.get('/login',authController.isLoggedIn,viewsController.getLogin)
router.get('/me',authController.protect,viewsController.getAccount)

router.post('/submit-user-data',authController.protect,viewsController.updateUser)
module.exports = router














