var controllers = require('./controllers')
, RootController = controllers.RootController
, RentalsController = controllers.RentalsController
, BookingsController = controllers.BookingsController
, passport = require('passport');

module.exports = function(app) {
  app.get('/', RootController.index);

  app.get('/rentals', RentalsController.index);
  app.get('/rentals/:id', RentalsController.show);
  app.put('/rentals/:id', RentalsController.update);
  app.delete('/rentals/:id', RentalsController.delete);
  app.post('/rentals', RentalsController.create);

  app.get('/rentalimages/:id', RentalsController.image);

  app.post('/rentals/:id/bookings', BookingsController.create);

  app.post('/login', passport.authenticate('local'), function(req, res) {
  	res.redirect('/');
  });
}