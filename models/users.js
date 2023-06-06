// create mogoose middleware to access MongoDB
const mongoose = require('mongoose');

// schema of the Users collection
const schema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    }
    ,
    password:{
        type: String,
        required: true
    }
  })

// create the Users collection using this schem
const users_database = new mongoose.model("users", schema)

// to be accessed from other .js files
module.exports = users_database;