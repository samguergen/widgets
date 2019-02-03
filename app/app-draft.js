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

var allPages = ['/home','/what-we-do','/organization','/faces-of-our-members','/faq','/news','/contact','/become-member','/member-app','/volunteer-to-drive','/volunteer-app','/family-involvement','/member-programs','/pay-online','/donate','/corporate', '/non-rider-member','/dashboard','/login', '/view-form','/draft','/million-rides-campaign-photo-album','/annual-report-2017','/about','/ways-to-give','/find-your-itn','/portal','/login-portal','/itnamerica','/itn-operations','/other','/rides-in-sight','/nda2018xyz','/rides','/calendar','/human-resources','/agenda','/ttp','/research','/important-docs', '/important-docs-landing','/employee-profiles','/dept-report','/hr-tickets', '/calendar-ris','/affiliate','/comments','/web-traffic','/affiliate-info','/rides-data','/documents','/timesheet', '/timesheets','/affiliate-landing','/shift-scheduler','/annual-report-2018'];


MongoClient.connect('mongodb://samguergen:samanthics2504@ds119662.mlab.com:19662/widgets', function(err, client) {
  if (err) {
    console.log('db not connecting, but inside mongo block - 1', err);
  };
  db = client.db('widgets');

  console.log('inside first mongo block');


// 1) BLOG CONTENT ZONE

  app.get('/getBlogContent', formidable(), function(req, res) {
    console.log('params are ', req.query.blogURL)
    request.get(req.query.blogURL, function(err,result,body) {
      res.send(result.body)
    });
  });





  
// 2) CALENDAR ZONE  
  


  app.get('/viewMonthlyCalendarEvents', formidable(), function (req,res) {
    db.collection('monthly-calendar').find().toArray(function (err, result) {
      res.send(result);
    })
  }); // end of /viewCalendarEvents get request

  app.get('/viewWeeklyCalendarEvents', formidable(), function (req,res) {
    db.collection('weekly-calendar').find().toArray(function (err, result) {
      res.send(result);
    })
  }); // end of /viewRISCalendarEvents get request
  

  app.post('/addMonthlyCalendarEvent', formidable(), function (req,res) {
    db.collection('monthly-calendar').save(req.body.newEvent, function(err, result){
      if (err) { return console.log('connecting to db, but not saving obj', err);}
      console.log('contact form saved to database', result);
      res.send(result);
    })
  });


  app.post('/addWeeklyCalendarEvent', formidable(), function (req,res) {
    db.collection('weekly-calendar').save(req.body.newEvent, function(err, result){
      if (err) { return console.log('connecting to db, but not saving obj', err);}
      console.log('contact form saved to database', result);
      res.send(result);
    })
  });
  
  
  
    app.delete('/deleteAgendaEvent', formidable(), function (req,res) {
        var agendaEvent = JSON.parse(req.query.agendaEvent);
        var dbName = req.query.dbName;
        console.log('agenda event is ', agendaEvent, 'db name is ', dbName);
        console.log('title and description', agendaEvent.title, agendaEvent.description);

        db.collection(dbName).deleteOne({description: agendaEvent.description}, function(err, result){
          if (err) { throw new Error('No record found. ', err) };
          console.log('record has been removed, i think');
          res.send(result);
        });
    }); // end of deleteagendaevent request




    //the GET call below is meant to be the DELETE CALL above but smth is parsing wrong.
    app.delete('/deleteWeeklyEventObj', formidable(), function (req,res) {
      var parsedEventToDelete = JSON.parse(req.query.event);
      var affiliateName = req.query.affiliateName;
      db.collection('commentsphoto').find({name: affiliateName}).toArray(function (err, result) {
        if (err) { throw new Error('No record found. ', err) };
        var recordId = result[0]._id;
        var matchConditions = {author: parsedEventToDelete.author, description: parsedEventToDelete.description, title: parsedEventToDelete.title};
        console.log('match conditions are ', matchConditions);
        var eventObj = { $pull: {scheduler: matchConditions} };
        console.log('recordId:', recordId);
        console.log("event obj is ", eventObj);
        db.collection('commentsphoto').update(
           { _id: recordId },
           eventObj
        )
        res.send(result);
      });
    });
    
    
    
    
  // 3) DOCUMENT LIBRARY ZONE
    
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
    var fileObj = { $push: {"fileUploads": theFile} };
    var tableName = req.query.tableName;
          console.log('table name backend is ', tableName);
    db.collection('commentsphoto').update(
       { name: tableName },
       fileObj
    )
    res.send();
  });
    

  app.get('/removeFile', formidable(), function (req,res) {
        console.log('inside removeFile, queries are ', req.query);
    var fileName = req.query.fileName;
    var tableName = req.query.tableName;
    db.collection('commentsphoto').find({name: tableName}).toArray(function (err, result) {
      if (err) { throw new Error('No record found. ', err) };
      var recordId = result[0]._id;
      // var newFileArr = { $pull: { 'contact.phone': { number: '+1786543589455' } } } // if want to modify name only
      var newFileArr = { $pull: { 'fileUploads': { name: fileName } } };
      db.collection('commentsphoto').update(
         { _id: recordId },
         newFileArr
      )
      res.send(result);
    });
  }); // end of /removeFile get request

  app.get('/updateCategory', formidable(), function (req,res) {
      console.log('inside update cat, queries are ', req.query);
    var fileName = req.query.fileName;
    var tableName = req.query.tableName;
    var categoryName = req.query.categoryName;
    db.collection('commentsphoto').find({name: tableName}).toArray(function (err, result) {
      if (err) { throw new Error('No record found. ', err) };
      var recordId = result[0]._id;
            console.log('recordId is ', recordId);
      db.collection('commentsphoto').updateOne(
         { _id: recordId, 'fileUploads.name': fileName },
         {$set: {'fileUploads.$.category': categoryName}}
      )
      res.send(result);
    });
  }); // end of /updateCategory get request
  
  //view file?
  

  // app.get('/loginPrivilege', formidable(), function (req,res) {
  //     var userInput = JSON.parse(req.query.formData);
  //     var tableName = req.query.tableName;
  //     var privilegeType = req.query.privilegeType;
  //     console.log('inside backend loginprivilege, user input is ', userInput, 'tablename is ', tableName, 'privilegeType ', privilegeType);
  // 
  //     db.collection(tableName).find({username: userInput.username}).toArray(function (err, result) {
  //       console.log('result from db is ', result[0]);
  //       if ( ((result[0].username === userInput.username) && (result[0].password === userInput.password) && result[0].privilege === privilegeType) || ((result[0].username === userInput.username) && (result[0].password === userInput.password) && result[0].privilege === 'Master') ){
  //         console.log('a match, initializing session');
  //         req.session.user = userInput;
  //         console.log('new session is ', req.session.user, 'and', req.session);
  //         res.send(result);
  //       }
  //       else {
  //         res.status(500).send('error')
  //       }
  //     })
  // }); // end of /loginPrivilege get request


// 4) TIMESHEET ZONE

  app.get('/getTimesheets', function (req,res) {
    var affiliateName = req.query.affiliateName;
    db.collection('timesheets').find({name: affiliateName}).toArray(function (err, result) {
      if (err) { throw new Error('No record found. ', err) };
      var timesheets = result[0].timesheets;
      // console.log('timesheets are: ', timesheets);
      res.send(result);
    })
  });


  app.put('/saveTimesheet', function (req,res) {
    var timesheet = req.body.timesheet;
    var affiliateName = req.body.timesheet.affiliate;
    console.log('saving timesheets table for affiliate ', affiliateName);

    db.collection('timesheets').find({name: affiliateName}).toArray(function (err, result) {
      if (err) { throw new Error('No record found. ', err) };
      var recordId = result[0]._id;
      console.log('recordId:', recordId);
      var newTimesheet = { $addToSet: {timesheets: timesheet} };
      db.collection('timesheets').update(
         { _id: recordId },
         newTimesheet
      )
      console.log('timesheet is saved in db', timesheet, typeof(timesheet));
      res.send(result);
    })
  });
  
  app.delete('/deleteTimesheet', function (req,res) {
    var timesheet = JSON.parse(req.query.timesheet);
    var affiliateName = req.query.affiliateName;
    console.log('timesheet to delete in backend is ', timesheet, affiliateName);

    db.collection('timesheets').find({name: affiliateName}).toArray(function (err, result) {
      if (err) { throw new Error('No record found. ', err) };
      var recordId = result[0]._id;
      console.log('recordId:', recordId);
      var newTimesheet = { $pull: {timesheets: timesheet} };
      db.collection('timesheets').update(
         { _id: recordId },
         newTimesheet
      )
      console.log('timesheet is delete from db', timesheet, typeof(timesheet));
      res.send(result);
    })
  });



  // //the GET call below is meant to be the POST CALL above but smth is parsing wrong.
  // app.get('/fetchAffiliateSchedulerEvent', formidable(), function (req,res) {
  //   console.log('inside addcalendarevent, backend');
  //   console.log('inside fetch affiliate calendar', req.query.newEvent);
  //   var parsedNewEvent = JSON.parse(req.query.newEvent);
  //   var affiliateName = req.query.affiliateName
  //   db.collection('commentsphoto').find({name: affiliateName}).toArray(function (err, result) {
  //     if (err) { throw new Error('No record found. ', err) };
  //     var recordId = result[0]._id;
  //     var eventObj = { $addToSet: {scheduler: parsedNewEvent} };
  //     console.log('recordId:', recordId);
  //     console.log("event obj is ", eventObj);
  //     db.collection('commentsphoto').update(
  //        { _id: recordId },
  //        eventObj
  //     )
  //     res.send(result);
  //   });
  // });

// 5) COMMENT ZONE
  
  app.get('/getComments', formidable(), function (req,res) {
    db.collection('comments').find().toArray(function (err, result) {
      res.send(result);
    })
  }); // end of /getRidesData get request


//fetchComment should be a POST request, but not working for some reason
  app.get('/fetchComment', formidable(), function (req,res) {
    console.log('adding new comment');
    var parsedContent = JSON.parse(req.query.content);
    var parsedAffiliate = JSON.parse(req.query.affiliate);
    var updatedComment = {
      message: parsedContent.message,
      author: parsedContent.author,
      email: parsedContent.email
    };
    console.log('affiliate is ', parsedAffiliate.name, 'content is ', updatedComment);

    db.collection('commentsphoto').find({name: parsedAffiliate.name}).toArray(function (err, result) {
      if (err) { throw new Error('No record found. ', err) };
      var recordId = result[0]._id;
      var commentObj;
      console.log('recordId:', recordId);
      commentObj = { $addToSet: {comments: updatedComment} };

      db.collection('commentsphoto').update(
         { _id: recordId },
         commentObj
      )
      res.send(result);
    });
  }); // end of /fetchComment post request




  app.put('/updateComment', formidable(), function (req,res) {
    console.log('inside update comments photo');
    var newComment = {
      message: req.body.content.message,
      author: req.body.content.author,
      email: req.body.content.email
    }
    console.log('affiliate is ', req.body.affiliate, 'content is ', req.body.content);

    db.collection('comments').find({name: req.body.affiliate.name}).toArray(function (err, result) {
      if (err) { throw new Error('No record found. ', err) };
      var operation = req.body.operation;
      var recordId = result[0]._id;
      var commentObj;
      console.log('operation: ', operation, 'recordId:', recordId);

      if (operation === 'add') {
        commentObj = { $addToSet: {comments: newComment} };
      } else if (operation === 'delete') {
        commentObj = { $pull: {comments: newComment} };
      }

      console.log("comment obj is ", commentObj);
      db.collection('commentsphoto').update(
         { _id: recordId },
         commentObj
      )
      res.send(result);
    });
  });



  app.delete('/deleteComment', formidable(), function (req,res) {
    console.log('inside delete comments');
    var parsedContent = JSON.parse(req.query.content);
    var parsedAffiliate = JSON.parse(req.query.affiliate);
    var operation = req.query.operation;
    var updatedComment = {
      message: parsedContent.message,
      author: parsedContent.author,
      email: parsedContent.email
    };
    console.log('affiliate is ', parsedAffiliate.name, 'content is ', updatedComment, 'operation is ', operation);

    db.collection('commentsphoto').find({name: parsedAffiliate.name}).toArray(function (err, result) {
      if (err) { throw new Error('No record found. ', err) };
      var recordId = result[0]._id;
      var commentObj;

      console.log('operation: ', operation, 'recordId:', recordId);

      if (operation === 'add') {
        commentObj = { $addToSet: {comments: updatedComment} };
      } else if (operation === 'delete') {
        commentObj = { $pull: {comments: updatedComment} };
      }
      console.log("comment obj is ", commentObj);

      db.collection('commentsphoto').update(
         { _id: recordId },
         commentObj
      )
      res.send(result);
    });
  }); // end of /deleteComment delete request








// app.post('/sendmail', function(req, res){
//   console.log('post req', req.body);
// 
//     let transporter = nodemailer.createTransport(smtpTransport({
//        service: "Gmail",  // sets automatically host, port and connection security settings
//        auth: {
//            user: gmail_login,
//            pass: gmail_pass
//        }
//     })
//   )
// 
//   let mailOptions = {};
//   if (req.body && req.body.pdf && req.body.formType === 'ndaform'){ //NDA forms
//     console.log('sending email with pdf, NDA form is ', req.body.formType);
//     var htmlObj = "<p><strong>Name</strong>: " + req.body.text.name + "</p>\n" +
//         "<p><strong>Email</strong>: " + req.body.text.email + "</p>\n " +
//         "<p><strong>Signature</strong>: " + req.body.text.signature + "</p>\n " +
//         "<p><strong>Date</strong>: " + req.body.text.date + "</p>\n " +
//         "<p><strong>User Consented</strong>: " + req.body.text.agree + "</p>\n ";
//     var htmlObj = req.body.html + htmlObj;
//     mailOptions = {
//         from: req.body.from, // sender address
//         to: req.body.to, // list of receivers
//         subject: req.body.subject, // Subject line
//         text: JSON.stringify(req.body.text), // plain text body
//         html: htmlObj,
//         attachments: [{path: req.body.pdf}],
//         bcc: 'support@itnamerica.org;katherine.freund@itnamerica.org'
//     };
//   }
//   else if (req.body && req.body.pdf){ //membership, volunteer and non-rider apps
//     console.log('sending email with pdf, membership, volunteer or non-rider forms');
//     mailOptions = {
//         from: req.body.from, // sender address
//         to: req.body.to, // list of receivers
//         subject: req.body.subject, // Subject line
//         text: JSON.stringify(req.body.text), // plain text body
//         attachments: [{path: req.body.pdf}],
//         bcc: 'info@itnamerica.org;morgan.jameson@itnamerica.org'
//     };
//   }
//   else if (req.body && req.body.formType === 'hrcontactform'){ ///private contact form from ITN staff to HR
//     console.log('sending email without pdf, contact form');
//     mailOptions = {
//         from: req.body.from, // sender address
//         to: req.body.to, // list of receivers
//         subject: req.body.subject, // Subject line
//         html: req.body.html, // html body
//         bcc: 'jean.palanza@itnamerica.org'
//     };
//   }
//   else if (req.body && req.body.formType.email){ //private contact form from ITN staff to ITN staff
//     console.log('sending email without pdf, contact form');
//     mailOptions = {
//         from: req.body.from, // sender address
//         to: req.body.to, // list of receivers
//         subject: req.body.subject, // Subject line
//         html: req.body.html, // html body
//         bcc: req.body.formType.email
//     };
//   }
//   else if (req.body && req.body.html){ //regular/public contact forms
//     console.log('sending email without pdf, contact form');
//     mailOptions = {
//         from: req.body.from, // sender address
//         to: req.body.to, // list of receivers
//         subject: req.body.subject, // Subject line
//         html: req.body.html, // html body
//         bcc: 'info@itnamerica.org;morgan.jameson@itnamerica.org'
//     };
//   } else { //all else
//     console.log('sending email with neither');
//     mailOptions = {
//         from: req.body.from, // sender address
//         to: req.body.to, // list of receivers
//         subject: req.body.subject, // Subject line
//         text: JSON.stringify(req.body.text), // plain text body
//         bcc: 'info@itnamerica.org;morgan.jameson@itnamerica.org'
//     };
//   }
// 
//     // send mail with defined transport object
//     transporter.sendMail(mailOptions, function(error, info) {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('Message sent: %s', info.messageId);
//         transporter.close();
//     });
// 
//     MongoClient.connect('mongodb://itnadmin:itnUser0136!@ds119442.mlab.com:19442/itnamerica-new', function(err, client) {
//       if (err) {
//         console.log('db not connecting, but inside mongo block - 2', err);
//       };
//       db = client.db('itnamerica-new');
// 
// 
//       var objWithPDF; var pdfVal;
// 
//       if ((req.body && req.body.html) && (req.body.formType === 'contact')) {
//         var contactObj = {
//           subject: req.body.text.subject,
//           messageBody: req.body.text.messageBody,
//           name: req.body.text.name,
//           email: req.body.text.email,
//           phone: req.body.text.phone,
//           date: req.body.text.date,
//         };
//         db.collection('contactform').save(contactObj, function(err, result){
//           if (err) { return console.log('connecting to db, but not saving obj', err);}
//           console.log('contact form saved to database', result);
//           // res.redirect('/');
//         })
//       }
//       else if (req.body.text.email && (req.body.formType === 'newsletter')) {
//         db.collection('newsletterform').save(req.body.text, function(err, result){
//           if (err) { return console.log('connecting to db, but not saving obj', err);}
//           console.log('newsletter form saved to database', result);
//           // res.redirect('/');
//         })
//       }
//       else if (req.body && (req.body.formType === 'ndaform')) {
//         var ndaObj = {
//           name: req.body.text.name,
//           signature: req.body.text.signature,
//           date: req.body.text.date,
//           email: req.body.text.email,
//           affiliate: req.body.text.itnAffiliate,
//           agree: req.body.text.agree,
//           pdf: req.body.pdf
//         };
//         db.collection('ndaform').save(ndaObj, function(err, result){
//           if (err) { return console.log('connecting to db, but not saving obj', err);}
//           console.log('nda form saved to database', result);
//           // res.redirect('/');
//         })
//       } else if ((req.body && req.body.html) && (req.body.formType === 'hrcontactform')) {
//         console.log('inside HR backend block',req.body.html);
//         var contactObj = {
//           subject: req.body.text.subject,
//           messageBody: req.body.text.messageBody,
//           name: req.body.text.name,
//           email: req.body.text.email,
//           phone: req.body.text.phone,
//           date: req.body.text.date,
//         };
//         db.collection('hrcontactform').save(contactObj, function(err, result){
//           if (err) { return console.log('connecting to db, but not saving obj', err);}
//           console.log('newsletter form saved to database', result);
//           // res.redirect('/');
//         })
//       }
//     });//end of mongoclient
//     console.log('after mongo block');
//     res.end();
//   }); 


  app.use(allPages, function(req, res){
    res.sendFile(__dirname + '/app/index.html');
  });



app.listen(process.env.PORT || 13270);
