// create mogoose middleware to access MongoDB
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema of the pets collection
const schema = new mongoose.Schema({
    petname:{
        type: String,
        required: true
    },
    age:{
        type: String,
        required: true,
    }
    ,
    type:{
        type: String,
        required: true
    },
    passport:{
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    imgNum:{
        type: String
    }

  })

// create the Users collection using this schem
const pets_database = new mongoose.model("pets", schema)

// to be accessed from other .js files
module.exports = pets_database;