const express = require('express')
const router = express.Router()
const User = require('../Models/user.js')
const passport = require('passport')
const wrapAsync = require('../utils/wrapAsync')
const { saveRedirectURL } = require('../middleware.js')
const userController =require('../controller/users.js')

//Singup route
router
    .route('/signup')
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup))


//Login route
router
    .route('/login')
    .get( userController.renderLoginForm) 
    .post(saveRedirectURL, 
        passport.authenticate('local', {failureRedirect : '/login', failureFlash : true}), 
        userController.login)


//Logout route
router.get('/logout', userController.logout)


module.exports = router