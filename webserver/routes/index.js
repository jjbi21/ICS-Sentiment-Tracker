var express = require('express');
var router = express.Router();
//Fetch doesn't exist on server-side JavaScript, so we impoort a package which implements the functionality.
var fetch = require('node-fetch');
var fs = require('fs');
var client_uri = 'http://localhost:4200';
var serviceAccount = require("../gcloud_private.json");
const admin=require('firebase-admin');
var databaseURL = "https://sentiment-analyzer-295302.firebaseio.com/";
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: databaseURL
});
var db = admin.database();
var ref = db.ref("/");

const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
	windowMs: 24 * 60 * 60 * 1000, // 24 hrs
	max: 1000 // limit each IP to 1000 requests per windowMs
});
router.use(limiter);

router.get('/course/:name', function(req, res, next) {
	var name = req.params.name;
	console.log(name);
	ref.child(name).once('value').then((dataSnapshot) => {
		// handle read data.
		// console.log(dataSnapshot);
		// console.log(dataSnapshot.val());
		return dataSnapshot.val();
	}).then(json => {
		res.json(json);
	}).catch(err => {
		console.error(err);
	});
});

module.exports = router;
