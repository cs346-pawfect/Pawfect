
/* ------------- application setup ------------- */

// create app from express
const express = require('express');
const app = express();

app.use(express.static('views'));

app.use(express.urlencoded({extended: true}))
app.use(express.json({extended: true}))

app.set('view engine', 'ejs')


/* ------------- MongoDB setup ------------- */


// create mogoose middleware to access MongoDB
const mongoose = require('mongoose');
const monogoURI = 'mongodb+srv://nouf:FjGU9Fi5HDCsDttq@cluster0.kcjispo.mongodb.net/pawfect'

// connection process to MongoDB
mongoose.connect(monogoURI,
 {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("MongoDB is connected"); // connected successfully
})
.catch(()=>{
    console.log("failed connection to MongoDB"); // failed in connection
})


/* ------------- Users, Pets, and mySession databaes ------------- */

const users_database = require('./models/users');
const pets_database = require('./models/pets');
const { createSession, isAuth } = require('./models/sessions');
createSession(app, monogoURI);


/* ------------- GET and POST methods ------------- */


// get the home page when calling it
app.get('/', (req, res) =>{
  req.session.isAuth = false;
  res.render('main', {isAuth: req.session.isAuth});
})

// get the login page when calling it
app.get('/login', (req, res) =>{
  res.render('login', { login_error_message: '', signup_error_message:'' });
})

// login & signup process
app.post("/login", (req, res) => {

  /*
  a hidden input (formType) is used to decied which form (login or signup) is sent,
  it is useful to distinguish between the two forms,
  because they are are from the same page path "/login"
  */
  const formType = req.body.formType;

  /* ------------------- Login ------------------- */
  if (formType === 'login') {

    console.log("login")
    
    // check if user exists
    users_database.findOne({ email: req.body.email })
    .then(user => {
      
      // if user exists
      if (user) {
        
        // check the password match
        const password = req.body.password;
        const isMatch = user.password === password

        // if password matches
        if(isMatch){
          console.log("correct password")
          req.session.isAuth = true;
          res.redirect(`/main`);
        }

        // if password did not match
        else{
          console.log("incorrect password")
          const message = 'incorrect password';
          res.render('login', {login_error_message: message, signup_error_message:''});
        }
      
      }
      
      // if user does not exsist
      else {
        console.log('user not found');
        const message = 'user does not exsits';
        res.render('login', {login_error_message: message, signup_error_message:''});
      }
    })
    .catch(error => {
      
      // if there is an error occured while searching for the user
      console.error('Error finding user:', error);
    });
  
  }
  
  /* ------------------- Signup ------------------- */
  if (formType === 'signup') {
    
    console.log("signup");

    // create a new data from the form sent by user
    const data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }

    // check if user exists
    users_database.findOne({ email: req.body.email })
    .then(user => {
    
      // if user exists print error message
      if (user) {
        const message = 'user exsists';
        res.render('login', {login_error_message: '', signup_error_message:message});
      }

      // if user is new, create a new user and add it to the database
      else{
        const user = new users_database(data);
        user.save().then(()=> console.log('user is added successfully into Database!'))
        res.render('login', {login_error_message: '', signup_error_message:''});
      }
    })
    .catch(error => {

      // if there is an error occured while searching for the user
      console.error('Error finding user:', error);
    });

  }

})


// user logged in successfully
app.get('/main', isAuth, (req, res) => {
  res.render('main', { isAuth: req.session.isAuth});
});

// call each pet page
app.get('/pet/:name', (req, res) => {
  const petName = decodeURIComponent(req.params.name);

  // get the pet from database
  pets_database.findOne({ petname: petName})
  .populate('owner') // populate the 'owner' field with the user object
  .then(pet => {

    petname = pet.petname;
    age = pet.age;
    type = pet.type;
    location = pet.location;
    date = pet.date;
    passport = pet.passport;
    owner = pet.owner.name;
    imgNum = pet.imgNum;

    res.render('pet', {
      isAuth: req.session.isAuth,
      petname: petname,
      age: age,
      type: type,
      location: location,
      date: date,
      passport: passport,
      owner: owner,
      imgNum: imgNum
    });
  })
  .catch(error => {

    // if there is an error occured while searching for the pet
    console.error('Error finding pet:', error);
  });
  
});


/* ------------ establish connection on port 3000 ------------*/
app.listen(3000, ()=>{
  console.log('connection is established at port 3000!')
})