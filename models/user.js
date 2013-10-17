var mongoose = require('mongoose')
, Schema = mongoose.Schema;

var Users = new Schema({
	email: String,
	username: String,
	password: String
});



Users.methods.validPassword = function(pass) {
	var user = this;
	if (user.password == pass){
		return true;
	}

	return false;
}

exports.User = mongoose.model ('User', Users);