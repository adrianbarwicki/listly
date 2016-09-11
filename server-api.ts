declare var require: any;

var port = 8000;
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser  = require('body-parser');
var http = require("http");
var ListController = require("./controllers/ListController");
var EmailController = require("./controllers/EmailController")
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.get('/list/:listId',(req,res)=>{
    ListController.analyzeList(req.params.listId,(err,rGroupedList)=>{
         if(err){
                 return res.status(err.code||500).send(err);
        }
        
        res.status(200).send(rGroupedList);
    });
}); 

app.post('/add-to-list',(req,res)=>{
    console.log(req.body);

    let email:string = req.body.email;
    let publicKey:string = req.query.public_key;
    let props=[];
    
    // props : [[propValue,propKey],[propValue,propKey]]
    
    // get props into array props[]
    Object.keys(req.body).forEach((propertyKey)=>{
        if( propertyKey.indexOf("prop-") > -1 ){
            let keyName = propertyKey.split("prop-")[1]; // 
            let keyValue = req.body[propertyKey];
            props.push([keyName,keyValue]);
        }
    });
    
    console.log(props);

    if(email.indexOf("@")==-1){
            console.error("Wrong email");
            return res.status(400).send("Wrong email");
    }
    
    ListController.addToList(publicKey,email,props,(err)=>{
        if(err){
            return res.status(400).send(err);
        }
        
        res.status(200).send("OK. Added to list.")
    });
});

app.post("/send-message", function(req,res){
    
        let email:string = req.body.email;
        let message:string = req.body.message;
        let publicKey:string = req.query.public_key;
        
        if(!publicKey){
            let errMsg = "Missing public key";
            console.error(errMsg);
            return res.status(400).send(errMsg);
        }
    
        if(!email||!message){
            console.error("Missing fields");
            return res.status(400).send("Missing fields");
        }
    
        if(email.indexOf("@")==-1){
            console.error("Wrong email");
            return res.status(400).send("Wrong email");
        }
    
		return EmailController.sendContactMessage(publicKey,email,message,(err)=>{
            res.status(err?500:200).send(err?err:"OK");
        });
    
});


app.use((req,res)=>{
    res.send("Listly API is up and running! Powered by ViciQloud (viciqloud.com).");
});

var httpServer = http.createServer(app);





if(module.parent){
    module.exports = httpServer;
}else{
    httpServer.listen(port,function() {
        var host = httpServer.address().address;
        var port = httpServer.address().port;
        console.log('Listly API listening at port %s',port);
    });
}
