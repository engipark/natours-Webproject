const express = require('express');
const viewsController = require('./../controllers/viewController');
const router = express.Router();


router.get('/',viewsController.getOverview)
router.get('/tours/:slug',viewsController.getTour)
router.get('/login',viewsController.getLogin)
module.exports = router