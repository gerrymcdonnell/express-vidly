const {User} = require('../models/user');

const config=require('config');
const jwt=require('jsonwebtoken');
const mongoose = require('mongoose');
const express = require('express');
const bcrypt=require('bcrypt');
const _lodash=require('lodash');
const Joi = require('joi');
const router = express.Router();

router.post('/', async (req, res) => {
    //validate the user object
    const { error } = validate(req.body); 
    //if validation fails 400 http error sent
    if (error) return res.status(400).send(error.details[0].message);
  
    //see if user already exists, by searching via there email    
    let user=await User.findOne({email:req.body.email});    
    //if we dont find a user then send back request
    if (!user) return res.status(400).send('Invalid email or password');

    // validate password using bcrypt 
    // compare plain text password (req.body.password) with hashedpassword (user.password)
    const validPassword=await bcrypt.compare(req.body.password,user.password);

    //just for testing
    if(router.get('env')==='development')
        console.log('plain text password is: ',req.body.password);
        console.log('hashed password is: ',user.password);

    if(!validPassword)return res.status(400).send('Invalid email or password');

    // jwt get hte value of enviroment variable and use to sign token
    // to set env variable in terminal type
    // export vidly_jwtPrivateKey=mySecureKey
    const token=jwt.sign({_id:user._id},config.get('jwtPrivateKey'));

    //valid login
    res.send(token);
});


//validate the user object
function validate(req) {
    const schema = {      
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    };
  
    return Joi.validate(req, schema);
  }

module.exports=router;