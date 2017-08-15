// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./models/user'); // get our mongoose model
var bcrypt = require('bcrypt'); // used to encrypt password

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// API ROUTES -------------------
//Create user
app.post('/signup', function(req, res) {

	if(req.body.name == null){
		res.json({ success: false, message: 'Sign up failed. Username must be provided.' });
		return;
	} 

	if(req.body.password == null){
		res.json({ success: false, message: 'Sign up failed. Password must be provided.' });
		return;
	}

  // BCRYPT + SALT
  const saltRounds = 10;
  bcrypt.hash(req.body.password, saltRounds).then(function(hash){
		var user = new User({ 
	    name: req.body.name, 
	    password: hash,
	    admin: true 
	  });

	  user.save(function(err) {
	    if (err) throw err;

	    console.log('User created successfully');
	    res.json({ success: true });
	  });
	});

});

// get an instance of the router for api routes
var apiRoutes = express.Router(); 

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      bcrypt.compare(req.body.password, user.password, function(err, bCryptResponse) {
      	if(bCryptResponse){
	      	var token = jwt.sign(user, app.get('superSecret'), {
	          expiresIn : 60*60*24 //24h 
	        });

	        res.json({
	          success: true,
	          message: 'Enjoy your token!',
	          token: token
        	});
      	} else {
      		res.json({
	          success: false,
	          message: 'Wrong password!'
        	});
      	}
        
      });
    }
  });
});

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });

  }
});

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});   

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);