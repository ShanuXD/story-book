const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Story=require('../models/Story')

// @desc login / landing page
// @route GET/
router.get('/', ensureGuest,(req, res) => {
    res.render('login', {
      layout: 'login',
    })
  })

// @desc DashBoard
// @router GET /dashboard
router.get('/dashboard',ensureAuth, async(req, res) => {

  try{
    //inorder to pass value in a handelbar template use .lean
    const stories=await Story.find({user:req.user.id}).lean()
    res.render('dashboard',{
      name:req.user.firstName,
      stories
    })

  }catch(err){
    //handel err cuz i dont have privalage like react who provide jason 
    console.log(err)
    res.render('error/500')
  }

      
    })

module.exports = router