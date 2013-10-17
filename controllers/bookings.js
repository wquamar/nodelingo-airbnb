var mongoose = require('mongoose')
, Rental = mongoose.model('Rental');

exports.create = function (req, res, next) {
	
	var id = req.params.id;

	Rental.findById(id, function (err, rental) {
		if (err){
			console.log(err);
		}

		//var newBooking = new Booking(req.body);
		//rental.bookings.push(req.body);

		/**
			Add Authentication
		**/

		rental.bookings.push({
			checkInDate: req.body.startDate,
			checkOutDate: req.body.endDate,
			numberOfGuests: req.body.numberOfGuests
		});

		rental.save(function(err) {
		
 			if (err) {
	 			console.log(err);
	 		}
	 		
	 		res.json(rental);
 		
 		});


	});

	
}