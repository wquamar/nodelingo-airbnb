var mongoose = require('mongoose')
	, Rental = mongoose.model('Rental')
	, fs = require('fs')
	, imageinfo = require('imageinfo');


exports.index = function(req, res, next) {
	var query = {};
	if (req.query.capacity) {
		//query.capacity = Number (req.query.capacity);
		query.capacity = { $gte: Number(req.query.capacity)};
	}


	if (req.query.price){
		query.price = { $lte: Number(req.query.price) };
	}


	if (req.query.type){
		query.type = req.query.type;
	}

	if (req.query.title){
		query.title = new RegExp(req.query.title , 'i');
	}



	Rental.find(query, function(err, rentals) {
		if (err) {
			console.log(err);
		}

		res.json(rentals);

	});
}


exports.create = function(req, res, next) {
	
	console.log(req.files);
	


	//res.send('ok');
	/*

		req.body = {
			location: 'New York',

		}

	*/


	var newRental = new Rental(req.body);

	if (req.files['rental-image']) {
		var size = req.files['rental-image'].size;
		var path = req.files['rental-image'].path;

		fs.readFile(path, function(err, data) {
			//console.log(data);
			newRental.image = data;

			newRental.save(function(err) {
 		
	 			if (err) {
		 			console.log(err);
		 		}
		 		
		 		res.json(newRental);
 		
 			});
		});

		

	} else {

		newRental.save(function(err) {
 		
 			if (err) {
	 			console.log(err);
	 		}
	 		
	 		res.json(newRental);
	 		
	 	});
	}

 	
 
}

exports.show = function(req, res, next) {

	Rental.find({_id: req.params.id}, function(err, rental){
		if (err){
			console.log (err);
		}

		//next();
		res.json(rental);
	});
}

exports.update = function(req, res, next) {
	//console.log(req.params.id);
	//console.log(req.body);
	
	Rental.update({_id: req.params.id}, req.body, function (err){
		if (err){
			console.log(err);
		}

		Rental.findById(req.params.id, function (err, rental) {
			if (err){
				console.log(err);
			}

			if (!req.files || !req.files['rental-image']) {
				return res.json(rental);
			}

			var path = req.files['rental-image'].path;

			fs.readFile(path, function(err, data) {	

				if (err){
					console.log(err);
				}

				rental.save(function(err) {
					if (err){
						console.log(err);
					}
				});
				res.json(rental);

			});
		});

	});
}


exports.delete = function (req, res, next) {
	Rental.findById(req.params.id, function (err, rental) {
		if (err){
				console.log(err);
		}

		rental.remove(function (err) {
			if (err){
				console.log(err);
			}

			res.json({success: true});			
		});
			
	});
}


exports.image = function (req, res, next) {
	var id = req.params.id;
	Rental.findById (id, function(err, rental) {
		if (err) {
			console.log(err);
		}

		var image = rental.image;
		
		if (image){
			var metadata = imageinfo(image);
			console.log ('MimeTYpe' + metadata.mimeType);
			if (metadata.mimeType)
			{
				res.type(metadata.mimeType);		
			}
			
		}
		
		res.send (image);
	});
}