var async = require("async");
var mandrill_client = require('../config/mandrillClient.js');

var defaultCallback = function(err,data){
    if(module.parent){
        err&&console.error(err);
        data&&console.log(data);
    }else{
        err&&console.error(err)&&process.exit(-1);
        data&&console.log(data);
        console.log("[COMPLETED]")
        process.exit();
    }
};



module.exports = {
    sendMessage : sendMessage
};


function getMessagePrototype(){
	return {
    //"html": "<p>Example HTML content</p>",
   // "text": "Example text content",
   //"subject": "example subject",
    "from_email": "noreply@viciqloud.com",
    "from_name": "",
    "to": [/*{
            "email": "adrian.barwicki@viciqloud.com",
            "name": "Adrian Barwicki",
            "type": "to"
        }*/], 
   "headers": {
        "Reply-To": "" // email
    }, 
    "important": false,
    "global_merge_vars": [
	/*	{
            "name": "name",
            "content": "Adrian Barwicki"
        } */
	],

    "metadata": {
        "website": "http://viciqloud.com/"
    },
    "recipient_metadata": [{
    /*        "rcpt": "recipient.email@example.com",
            "values": {
                "user_id": 123456
            } */
        }],
	};
}

function sendMessage(MailData,callback){

    callback=callback||defaultCallback;
    
    if(!MailData.SendTo)
        return callback({status:400,code:"INITIAL_EMAIL"});
    if(!MailData.SendTo.length)
        return callback({status:400,code:"INITIAL_EMAIL"});
    if(!MailData.MessageHTML)
        return callback({status:400,code:"INITIAL_MESSAGE"});


    /* setting the email */
    var message = getMessagePrototype();
    message.text = MailData.MessageText;
    message.html = MailData.MessageHTML;
    message.subject = MailData.MessageSubject;
    message.from_name = MailData.ProductName;
    message.headers["Reply-To"]=MailData.ReplyTo;

    // we iterate over the SentTo Emails Array
    MailData.SendTo.forEach((email)=>{
        message.to.push({
            "email": email,
            "type": "to"
        });
        
        message.recipient_metadata.push({
        "rcpt": email,
        });
    });
    
    
    // sending
    send(message, function(err,result){
        console.log(result);
        callback(err);
    });
 
}

function send(message, callback){
    var async = false;
    var ip_pool = "Main Pool";
    
    var logReceiverEmails = message.to.map((item)=>{
      return item.email;
    }).join(",");
    
    console.log("[INFO] [EmailService] Sending message to",logReceiverEmails);
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool }, function(result) {
        callback(null,result);
    }, function(e) {
        console.log('[ERROR] [EmailService] A mandrill error occurred: ' + e.name + ' - ' + e.message);
        callback(e);
    });	
}