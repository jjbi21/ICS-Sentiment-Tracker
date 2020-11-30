var express = require('express');
var router = express.Router();

// firebase database setup with view only private key credentials
var serviceAccount = require("../gcloud_private.json");
const admin=require('firebase-admin');
var databaseURL = "https://sentiment-analyzer-295302.firebaseio.com/";
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: databaseURL
});
var db = admin.database();
var ref = db.ref("/");


// rate limiting: 1000 requests per day
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
	windowMs: 24 * 60 * 60 * 1000,
	max: 1000
});
router.use(limiter);

// courses endpoint that returns list of courses
router.get('/courses', (req, res, next) => {
	ref.child('courses').once('value').then((dataSnapshot) => {
		return dataSnapshot.val();
	}).then(json => {
		res.json(json);
	}).catch(err => {
		console.error(err);
	});
});

// messages endpoint that returns an object of sentiment data filtered by course and timestamp
router.get('/messages/:course/:timestamp', (req, res, next) => {
	var course = req.params.course;
	var timestamp = req.params.timestamp;
	ref.child(course).orderByKey().startAt(timestamp).once('value').then((dataSnapshot) => {
		return dataSnapshot.val();
	}).then(json => {
		res.json(json);
	}).catch(err => {
		console.error(err);
	});
});

module.exports = router;
