var mongoose = require('mongoose')
, Schema = mongoose.Schema;

var Bookings = new Schema({
	checkInDate: Date,
	checkOutDate: Date,
	numberOfGuests: Number
});

Bookings.virtual('price').get(function () {
	//
});

var Rentals = new Schema ({
	title: String,
	description: String, 
	location: String, 
	capacity: Number,
	price: Number,
	image: Buffer,
	bookings: [ Bookings ],
	type: {type: String, enum: ['Private room', 'Shared room', 'Entire room']}
});

//setting virtual field (not mapped to MongoDB field)
Rentals.virtual('image_url').get(function() {
	var id = this._id;
	return '/rentalimages/' + id;
});

Rentals.set('toJSON', {virtuals: true, transform: true });

//removing fields from JSON response
Rentals.options.toJSON.transform = function (doc, ret, options) {
	if (ret['image']) {
		delete ret['image'];
	}
}

exports.Rental = mongoose.model('Rental', Rentals);