import express from 'express'
import mongoose from 'mongoose'
import User from '../models/user'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export function middlewareTokenValidation(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, process.env.MONGO_SECRET, (err, decoded) => {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        req.decoded = decoded;    
        next();
      }
    });
  } else {
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
}

export function signUp(req, res) {
	if(req.body.name == null){
		res.json({ success: false, message: 'Sign up failed. Username must be provided.' })
		return
	} 
	
	if(req.body.password == null){
		res.json({ success: false, message: 'Sign up failed. Password must be provided.' })
		return
	}

  const saltRounds = 10;
  bcrypt.hash(req.body.password, saltRounds).then((hash) => {
		var user = new User({ 
	    name: req.body.name, 
	    password: hash,
	    admin: true 
	  });

	  user.save((err) => {
	    if (err) {
	    	if(err.code == 11000){
	    		res.json({ success: false, message: 'Sign up failed. Username already exists.' })
	    	} else {
					throw err	    		
	    	}
	    } else {
	    	res.json({ success: true, message: 'User created successfully' })
	    }
	    
	  });
	});
}

export function authenticate(req, res) {
  User.findOne({
    name: req.body.name
  }, (err, user) => {

    if (err) throw err;

    if (!user) {
      res.json({ 
      	success: false, 
      	message: 'Authentication failed. User not found.' 
      });
    } else if (user) {

      bcrypt.compare(req.body.password, user.password, (err, bCryptResponse) => {
      	if(bCryptResponse){
	      	var token = jwt.sign(user, process.env.MONGO_SECRET, {
	          expiresIn : 60*60*24 //24h 
	        });

	        res.json({
	          success: true,
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
}

export function validateToken(req, res) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if(token){
    jwt.verify(token, process.env.MONGO_SECRET, (err, decoded) => {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        return res.json({ 
	        success: true, 
	        message: 'Valid token provided.' 
    		});
      }
    });
	}else{
		return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
	}
}

export function getAllUsers(req, res) {
	User.find({}, function(err, users) {
    res.json(users);
  });
}