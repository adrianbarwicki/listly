var port = 8000;
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var http = require("http");
var ListController = require("./controllers/ListController");
var EmailController = require("./controllers/EmailController");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/list/:listId', function (req, res) {
    ListController.analyzeList(req.params.listId, function (err, rGroupedList) {
        if (err) {
            return res.status(err.code || 500).send(err);
        }
        res.status(200).send(rGroupedList);
    });
});
app.post('/add-to-list', function (req, res) {
    console.log(req.body);
    var email = req.body.email;
    var publicKey = req.query.public_key;
    var props = [];
    Object.keys(req.body).forEach(function (propertyKey) {
        if (propertyKey.indexOf("prop-") > -1) {
            var keyName = propertyKey.split("prop-")[1];
            var keyValue = req.body[propertyKey];
            props.push([keyName, keyValue]);
        }
    });
    console.log(props);
    if (email.indexOf("@") == -1) {
        console.error("Wrong email");
        return res.status(400).send("Wrong email");
    }
    ListController.addToList(publicKey, email, props, function (err) {
        if (err) {
            return res.status(400).send(err);
        }
        res.status(200).send("OK. Added to list.");
    });
});
app.post("/send-message", function (req, res) {
    var email = req.body.email;
    var message = req.body.message;
    var publicKey = req.query.public_key;
    if (!publicKey) {
        var errMsg = "Missing public key";
        console.error(errMsg);
        return res.status(400).send(errMsg);
    }
    if (!email || !message) {
        console.error("Missing fields");
        return res.status(400).send("Missing fields");
    }
    if (email.indexOf("@") == -1) {
        console.error("Wrong email");
        return res.status(400).send("Wrong email");
    }
    return EmailController.sendContactMessage(publicKey, email, message, function (err) {
        res.status(err ? 500 : 200).send(err ? err : "OK");
    });
});
app.use(function (req, res) {
    res.send("Listly API is up and running! Powered by ViciQloud (viciqloud.com).");
});
var httpServer = http.createServer(app);
if (module.parent) {
    module.exports = httpServer;
}
else {
    httpServer.listen(port, function () {
        var host = httpServer.address().address;
        var port = httpServer.address().port;
        console.log('Listly API listening at port %s', port);
    });
}
