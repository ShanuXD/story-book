const express=require('express')
const dotenv = require('dotenv')
const morgan=require('morgan')
const path = require('path')
const passport = require('passport')
const exphbs=require('express-handlebars')
const connectDB=require('./config/db')
const session = require('express-session')
const MongoStore=require('connect-mongo')(session)
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const { format } = require('path')
//load config
dotenv.config({path:'./config/config.env'})

//passport config
require('./config/passport')(passport)

connectDB()

const app=express()

//body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())
//mthod override
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )

//handelbars helpers
const {formatDate,stripTags,truncate,editIcon,select}=require('./helpers/hbs')

//handelbars
app.engine('.hbs', exphbs({
    helpers:{
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select,
    },defaultLayout:'main',extname:'.hbs'}))
app.set('view engine','.hbs')

//Session
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:false,
    store:new MongoStore({mongooseConnection:mongoose.connection})
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//set global var
app.use(function (req, res,next){
res.locals.user=req.user || null
next()
})

//static folder
app.use(express.static(path.join(__dirname, 'public')))

//routes
app.use('/', require('./route/index'))
app.use('/auth', require('./route/auth'))
app.use('/stories', require('./route/stories'))


const PORT=process.env.PORT||5000

app.listen(PORT, console.log(`Server running on port${PORT} `))