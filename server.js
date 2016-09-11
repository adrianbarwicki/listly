var express = require('express');
var app = express();
var cors = require('cors');
var port = 9000;
var http = require("http");

app.use('/', express.static(__dirname + '/dist/public'));



var httpServer = http.createServer(app);

app.get("/list/:listId",(req,res)=>{
    res.send("ListlyCDN is up and running! Powered by ViciQloud (viciqloud.com).");
});

httpServer.listen(port,function() {
	var host = httpServer.address().address;
	var port = httpServer.address().port;
	console.log('Listly CDN listening at port %s',port);
});
