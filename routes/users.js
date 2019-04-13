const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const bcrypt=require('bcrypt');
const _lodash=require('lodash');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    //see if user already exists, by searching via there email    
    let user=await User.findOne({email:req.body.email});    
    //if we find a result from query then the user already exists
    if (user) return res.status(400).send('User Already Exists');

    //new user
    // user = new User({ 
    //     name: req.body.name,
    //     email:req.body.email,
    //     password:req.body.password
    // });

    user=new User(_lodash.pick(req.body,['name','email','password']));
    //generate salt
    const salt=await bcrypt.genSalt(10);
    //generate hased password using the salt
    user.password=await bcrypt.hash(user.password,salt);

    //save it
    await user.save();

    //lodash pick out these properties from obect i.e avoid the password field
    const lodashUserPick=_lodash.pick(user,['_id','name','email']);
    
    //return to client, sends all of object to the client
    res.send(lodashUserPick);
});

module.exports=router;