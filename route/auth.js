const express = require('express')
const passport = require('passport')
const router = express.Router()

// @desc Auth with google
// @route GET/auth/ggole
router.get('/google',passport.authenticate('google', {scope:['profile']}))

// @desc Google auth call back
// @router GET /auth/google/callback
router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/'}),
(req, res)=>{
    res.redirect('/dashboard')
})

module.exports = router