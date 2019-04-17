const {Genre, validate} = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//auth middleware
const auth=require('../middleware/auth');
const admin=require('../middleware/admin');

//vid 144 code previously had no error handling
router.get('/', async (req, res) => {
  try{
    const genres = await Genre.find().sort('name');
    res.send(genres);
  }
  catch(ex){
    res.status(500).send('Err: 500 Something failed')
  }
});

//vid 137 note auth paramter which is a middleware object which prevents unauthorised
//post requests without a valid token
router.post('/', auth,async (req, res) => {

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  
  res.send(genre);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
  res.send(genre);
});

// note the 2 middleware fucntions which will be executed in sequence
// ie auth and admin 
router.delete('/:id', [auth,admin],async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

module.exports = router;