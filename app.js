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

var allPages = ['/home','/portfolio', '/timesheets', '/timesheet', '/documents','/shift-scheduler','/comments','/blog-thumbnail', '/resume'];


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
    console.log('ts to be saved, received from backend is ', timesheet);
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
  
  

  app.get('/getDocuments', formidable(), function (req,res) {
    db.collection('documents').find().toArray(function (err, result) {
      res.send(result);
    })
  }); // end of /getRidesData get request
  

  app.post('/uploadFiles', formidable(), function(req, res) {
          console.log('uploadFiles from backend is ', req.files);
    var binaryLocation = req.files.file.path;
    var fileName = req.files.file.name;
          console.log('file name is ', fileName);
    var binaryData = fs.readFileSync(binaryLocation);
    var theFile = {};
    theFile.data = binaryData
    theFile.name = fileName;
    theFile.category = 'all';
    theFile.categoryGeneral = 'all';
    var tableName = req.query.tableName;
          console.log('theFile is ', theFile);
          
    db.collection('documents').save(theFile, function(err, result){
      if (err) { return console.log('connecting to db, but not saving obj', err);}
      console.log('doc saved to database');
      res.send(result);
    })
  });
  
  
  app.delete('/removeFile', formidable(), function (req,res) {
        console.log('inside removeFile, queries are ', req.query.fileId);
    var fileId = req.query.fileId;
    db.collection('documents').deleteOne({_id: new mongo.ObjectId(fileId)}, function(err, result){
      if (err) { throw new Error('No record found. ', err) };
      console.log('file has been removed, i think');
      res.send(result);
    });
  }); // end of /removeFile delete request

  
  app.put('/updateCategory', function (req,res) {
    var fileName = req.body.fileName;
    var categoryDbName = req.body.categoryDbName;
    var fileId = req.body.fileId;
    console.log('file name is ', fileName, 'categoryDbName ', categoryDbName, 'fileId ', fileId);
    var myQuery = {_id: new mongo.ObjectId(fileId)};
    var newValues = {
      $set: {
        category: categoryDbName
      } 
    };
    db.collection('documents').findAndModify(myQuery, [['_id','asc']], newValues, {}, function(err, result){
        if (err) { throw new Error('No record found. ', err) };
        console.log('record has been updated, i think');
        res.send(result);
      });
  }); // end of /updateCategory put request
  
  
  
  
    app.get('/viewWeeklyCalendarEvents', function (req,res) {
      db.collection('weekly-calendar').find().toArray(function (err, result) {
        res.send(result);
      })
    }); // end of /viewRISCalendarEvents get request
    
    
    app.post('/addWeeklyCalendarEvent', function (req,res) {
      var newEvent = req.body.newEvent;
      console.log('event to be saved, received from backend is ', newEvent);
      db.collection('weekly-calendar').save(newEvent, function(err, result){
        if (err) { return console.log('connecting to db, but not saving obj', err);}
        console.log('event saved to database', result);
        res.send(result);
      })
    });
    
    
    app.delete('/deleteWeeklyCalendarEvent', function (req,res) {
        var eventId = req.query.eventId;
        console.log('event to be deleted, received from backend is ', eventId)
        db.collection('weekly-calendar').deleteOne({_id: new mongo.ObjectId(eventId)}, function(err, result){
          if (err) { throw new Error('No record found. ', err) };
          console.log('event has been removed');
          res.send(result);
        });
    }); // end of deleteagendaevent request
    
    
    app.get('/getComments', function (req,res) {
      db.collection('comments').find().toArray(function (err, result) {
        res.send(result);
      })
    }); // end of /getComments get request


    
    app.post('/addComment', function (req,res) {
      var comment = req.body.comment;
      console.log('comment to be saved, received from backend is ', comment);
      db.collection('comments').save(comment, function(err, result){
        if (err) { return console.log('connecting to db, but not saving obj', err);}
        console.log('comment saved to database');
        res.send(result);
      })
    });
    
    
    app.delete('/deleteComment', function (req,res) {
        var commentId = req.query.commentId;
        console.log('comment to be deleted, received from backend is ', commentId)
        db.collection('comments').deleteOne({_id: new mongo.ObjectId(commentId)}, function(err, result){
          if (err) { throw new Error('No record found. ', err) };
          console.log('comment has been removed');
          res.send(result);
        });
    }); // end of deleteagendaevent request
    
    
    
    
    
    app.post('/sendmail', function(req, res){
      console.log('inside sendmail, post req', req.body);
      let mailOptions = {};

      if (req.body){ //private contact form from ITN staff to ITN staff
        console.log('sending email without pdf');
        mailOptions = {
            from: req.body.from, // sender address
            to: req.body.to, // list of receivers
            subject: req.body.subject, // Subject line
            html: req.body.html // html body
        };
      }
    
      let transporter = nodemailer.createTransport(smtpTransport({
           service: "Gmail",  // sets automatically host, port and connection security settings
           auth: {
               user: gmail_login,
               pass: gmail_pass
           }
        })
      )
    
      // send mail with defined transport object
      transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
              return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);
          transporter.close();
      });


        console.log('after mongo block');
        res.end();
      }); 
    
    
    
      app.get('/getBlogContent', function(req, res) {
        console.log('params are ', req.query)
        request.get(req.query.blogURL, function(err,result,body) {
          console.log('result is ', result)
          res.send(result.body)
        });
      });
    


}); //end of main mongodb block

  app.use(allPages, function(req, res){
    res.sendFile(__dirname + '/app/index.html');
  });



app.listen(process.env.PORT || 13270);
