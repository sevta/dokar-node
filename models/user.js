var mongoose = require('mongoose')
var Schema = mongoose.Schema

const userSchema = new Schema({
  username: String ,
  password: String ,
  status: Number
} , {timestamps: true} , {collections: 'users'})

var userModel = mongoose.model('User' , userSchema)

module.exports = userModel
