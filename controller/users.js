const User = require('../Models/user.js')

//SignUp
module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs')
}

module.exports.signup = async (req, res) => {
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
}


//Login
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs')
}

module.exports.login =  async (req, res) => {
    let {username} = req.body
    req.flash('success', `Welcome back, ${username}`)
    let redirectURL = res.locals.redirectURL || '/listings'
    res.redirect(redirectURL)
}


//Logout
module.exports.logout = (req, res) => {
    req.logout((err) => {
        if(err){
            return next(err)
        }
        req.flash('success', 'Logout Successfull')
        res.redirect('/listings')
    })
}