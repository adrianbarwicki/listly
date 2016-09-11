var serverCDN = require('../server-cdn.js');
var serverAPI = require('../server-api.js');


var assert = require('assert');
var http = require('http');



describe('SERVER CDN', function () {
    

  var port = 11111;    
    
  before(function () {
    serverCDN.listen(port);
  });     
      
    
  it('it should return 200', function (done) {
    http.get('http://localhost:'+port, function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });
    
     
  after(function () {
    server.close();
  });
    
    
});



describe('SERVER API', function () {
    

  var port = 11112;    
    
  before(function () {
    serverAPI.listen(port);
  });     
      
    
  it('it should return 200', function (done) {
    http.get('http://localhost:'+port, function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });
    
     
  after(function () {
    server.close();
  });
    
    
});    
    
    
