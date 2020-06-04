const dotenv = require('dotenv');

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config();

module.exports =  {
  port: process.env.PORT,
  secret: process.env.SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  tokenExpiration: process.env.TOKEN_EXPIRATION,
  refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION,
  mail: {
    apiKey: process.env.MAIL_API_KEY,
    sender: process.env.MAIL_SENDER,
  }
};