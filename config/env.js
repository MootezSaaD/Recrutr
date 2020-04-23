const dotenv = require('dotenv');

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config();

module.exports =  {
  port: process.env.PORT,
  secret: process.env.SECRET,
  mail: {
    apiKey: process.env.MAIL_API_KEY,
    sender: process.env.MAIL_SENDER,
  }
};