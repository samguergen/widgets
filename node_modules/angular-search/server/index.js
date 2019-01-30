var _ = require('lodash')
  , express = require('express')
  , cors = require('cors')
  , fs = require('fs')
  , countries = require('./countries')
  , states = require('./states')
  , path = require('path')
  , port = process.argv[2] || 8001
  ;

express()
.use(cors())
.get('/countries', function (req, res) {

  setTimeout(function(){
    res.send(countries.filter(function (country) {
      return country.match(new RegExp(req.query.search, 'i'));
    }));
  },500);

})
.get('/states', function (req, res) {

  setTimeout(function(){
    res.send(_.filter(states, function (state) {
      return state.match(new RegExp(req.query.search, 'i'));
    }));
  },500);

})
.listen(port);

console.log('http server started on port', port, '...');

