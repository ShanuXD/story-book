const express=require('express')
const dotenv = require('dotenv')
const morgan=require('morgan')
const path = require('path')
const passport = require('passport')
const exphbs=require('express-handlebars')
const connectDB=require('./config/db')
const session=require('express-session')

//load config
dotenv.config({path:'./config/config.env'})

//passport config
require('./config/passport')(passport)

connectDB()

const app=express()

//Logging
if (process.env.NODE_ENV === 'development'){
app.use(morgan('dev'))
}

//handelbars
app.engine('.hbs', exphbs({defaultLayout:'main',extname:'.hbs'}))
app.set('view engine','.hbs')

//sessions
app.use(session({
    secret:'keyboard cat',
    resave: false,
    saveUninitialized:false,
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//static folder
app.use(express.static(path.join(__dirname, 'public')))

//routes
const route=require('./route/index')
app.use('/',route)
const groute=require('./route/auth')
app.use('/auth',groute)


const PORT=process.env.PORT||5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port${PORT} `))