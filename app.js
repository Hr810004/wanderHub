require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const methodoverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError.js')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const listingsRoute = require('./routes/listing.js')
const reviewsRoute = require('./routes/review.js')
const userRoute = require('./routes/user.js')

const User = require('./Models/user.js')

// const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb"
const dburl = process.env.ATLASDB_URL   

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.engine('ejs', ejsMate)

const store = MongoStore.create({
    mongoUrl : dburl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600,
})

store.on('error', () => console.log("Erro in mongo session", err))

const sessionOptions = { 
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 6*24*60*60*1000,
        maxAge : 6*24*60*60*1000,
    }
}

app.use(express.urlencoded({ extended: true }))
app.use(methodoverride("_method"))
app.use('/src', express.static('src'));
// app.use(express.static(path.join(__dirname, 'src')))


//connect to DB
main().then((res) => console.log("connected to database"))
    .catch((err) => {
        console.log("Error connecting to database:", err.message);
        process.exit(1);
    });

async function main() {
    try {
        await mongoose.connect(dburl, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 10s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw err;
    }
}




app.use(session(sessionOptions))
app.use(flash()) //use before using routes

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currUser = req.user
    next()
})

//Routes
app.use('/listings', listingsRoute)
app.use('/listings/:id/reviews', reviewsRoute)
app.use('/', userRoute)

app.get('/', (req, res) => {
    res.redirect('/listings')
})

//Page not found
app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"))
})

//Error handling
app.use((err, req, res, next) => {
    let { status = 500, message = "something went wrong" } = err
    res.render('error.ejs', { message })
})

app.listen(3000, () => console.log("listening on port 3000"))