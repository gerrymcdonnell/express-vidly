const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const morgan = require('morgan');
const config=require('config');

const error=require('./middleware/error');

const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users=require('./routes/users');
const auth=require('./routes/auth');

const express = require('express');
const app = express();


// to set env variable in terminal type
// export vidly_jwtPrivateKey=mySecureKey
if(!config.get('jwtPrivateKey')){
  console.log('FATAL ERROR: jwt private key not define');
  process.exit(1);
}

const dbName="vidly";
const dbConnectionString=`mongodb://localhost/${dbName}`;

mongoose.connect(dbConnectionString)
  .then(() => console.log('Connected to MongoDB...',dbConnectionString))
  .catch(err => console.error('Could not connect to MongoDB...'));

//middleware
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth',auth);

//vid 145 error middleware
app.use(error);

//environments
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log('app.get(env):', app.get('env'));

//morgan middleware logs http requests. only use it development mode
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  console.log('Middleware: morgan enabled: Logging Http requests');
}


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));