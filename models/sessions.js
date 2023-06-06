// session.js

const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);

// Function to create a session for authentication
const createSession = (app, monogoURI) => {
  const store = new MongoDBSession({
    uri: monogoURI,
    collection: 'mySessions'
  });

  app.use(
    session({
      secret: 'key key',
      resave: false,
      saveUninitialized: false,
      store: store
    })
  );

  return app;
};

// Middleware to check if the user is authenticated
const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect('/login');
  }
};

// to be accessed from other .js files
module.exports = { createSession, isAuth };