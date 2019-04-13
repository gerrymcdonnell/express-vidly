const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    //see if user already exists, by searching via there email    
    let user=await User.findOne({email:req.body.email});    
    //if we find a result from query then the user already exists
    if (user) return res.status(400).send('User Already Exists');

    //new user
    user = new User({ 
        name: req.body.name,
        email:req.body.email,
        password:req.body.password
    });
    //save it
    await user.save();
    //return to client
    res.send(user);
});

module.exports=router;