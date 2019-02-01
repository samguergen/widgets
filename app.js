var express = require('express');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var app = express();

const MongoClient = require('mongodb').MongoClient;
var mongo = require('mongodb');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var env = require(__dirname + '/env-vars.js');
var gmail_login = env.gmail_login;
var gmail_pass = env.gmail_pass;
var db;
var http = require('http');
var request=require('request');
var _ =require('lodash');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
var multipart = require('connect-multiparty');
var formidable = require('express-formidable');
var fs = require('fs');


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json()); //convert req to json
app.use(express.static(__dirname + '/app'));
app.use(session({secret: "Sam is awesome"}));
// app.use(formidable());

app.use(bodyParser.json()); // Configures bodyParser to accept JSON
app.use(bodyParser.urlencoded({
    extended: false
}));

var allPages = ['/home','/portfolio', '/timesheets', '/timesheet', '/documents'];


MongoClient.connect('mongodb://samguergen:samanthics2504@ds119662.mlab.com:19662/widgets', function(err, client) {
  if (err) {
    console.log('db not connecting, but inside mongo block - 1', err);
  };
  db = client.db('widgets');

  console.log('inside first mongo block');
  
  
  app.get('/getTimesheets', function (req,res) {
    db.collection('timesheets').find().toArray(function (err, result) {
      res.send(result);
    })
  });
  

  app.post('/addTimesheet', function (req,res) {
    console.log('inside timesheet add')
    var timesheet = req.body.timesheet;
    console.log('ts to be saved, received from backend is ', timesheet)
    db.collection('timesheets').save(timesheet, function(err, result){
      if (err) { return console.log('connecting to db, but not saving obj', err);}
      console.log('ts saved to database');
      res.send(result);
    })
  });
  
  
  app.delete('/deleteTimesheet', function (req,res) {
      var timesheetId = req.query.timesheetId;
      console.log('ts to be deleted, received from backend is ', timesheetId)
      db.collection('timesheets').deleteOne({_id: new mongo.ObjectId(timesheetId)}, function(err, result){
        if (err) { throw new Error('No record found. ', err) };
        console.log('timesheet has been removed, i think');
        res.send(result);
      });
  }); // end of deleteagendaevent request
  
  
  // 
  // app.put('/saveTimesheet', function (req,res) {
  //   var timesheet = req.body.timesheet;
  //   var name = req.body.timesheet.name;
  //   console.log('saving timesheets table for affiliate ', affiliateName);
  // 
  //   db.collection('timesheets').find({name: affiliateName}).toArray(function (err, result) {
  //     if (err) { throw new Error('No record found. ', err) };
  //     var recordId = result[0]._id;
  //     console.log('recordId:', recordId);
  //     var newTimesheet = { $addToSet: {timesheets: timesheet} };
  //     db.collection('timesheets').update(
  //        { _id: recordId },
  //        newTimesheet
  //     )
  //     console.log('timesheet is saved in db', timesheet, typeof(timesheet));
  //     res.send(result);
  //   })
  // });
  

  




}); //end of main mongodb block

  app.use(allPages, function(req, res){
    res.sendFile(__dirname + '/app/index.html');
  });



app.listen(process.env.PORT || 13270);
