var bcrypt = require('bcrypt')
var mongoose = require('mongoose')

console.log('seeder')

var user = {
  username: 'sevta' ,
  password: 'dasartai'
}

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${user.username}:${user.password}@ds227570.mlab.com:27570/dokar`)


var User = require('./models/user')
var newuser = new User()
    newuser.username = 'superadmin'
    newuser.password = bcrypt.hashSync('superadmin890' , bcrypt.genSaltSync(10))
    newuser.status = 1

    newuser.save(function(err , result) {
      if (err) {
        console.log(err)
      } else {
        console.log(result , 'success')
      }
    })
User.find({username: 'superadmin' , function(err , user) {
  if (err) {
    console.log(err)
  }
  if (user.length == 0) {
    
  }
}})