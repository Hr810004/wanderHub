const express = require('express')
const router = express.Router()
const User = require('../Models/user.js')
const passport = require('passport')
const wrapAsync = require('../utils/wrapAsync')
const { saveRedirectURL } = require('../middleware.js')

//singup route
router.get('/signup', (req, res) => {
    res.render('users/signup.ejs')
})

router.post('/signup', wrapAsync(async (req, res) => {
    try{
        let {username, email, password} = req.body
        const newUser = new User({email, username})
        const registeredUser = await User.register(newUser, password)
        req.login(registeredUser, (err) => {
            if(err){
                return next(err)
            }
            req.flash('success', `Welcome to Airbnb, ${username}`)
            res.redirect('/listings')
        })      
    } catch(e){
        req.flash('error', e.message)
        res.redirect('/signup')
    }
}))

//login route
router.get('/login', (req, res) => {
    res.render('users/login.ejs')
})

router.post('/login',saveRedirectURL, passport.authenticate('local', {failureRedirect : '/login', failureFlash : true}), async (req, res) => {
    let {username} = req.body
    req.flash('success', `Welcome back, ${username}`)
    let redirectURL = res.locals.redirectURL || '/listings'
    res.redirect(redirectURL)
})

//logout route
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if(err){
            return next(err)
        }
        req.flash('success', 'Logout Successfull')
        res.redirect('/listings')
    })
})

module.exports = router