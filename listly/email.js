var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill("K59J9lVqpLY7_ix-GfEc7g");


var sendMessage = function(message, callback){
  
var async = false;
var ip_pool = "Main Pool";
mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool }, function(result) {
    console.log(result);
	callback(null,result);
}, function(e) {
	console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
	callback(e);
});
  
};

var getMessagePrototype =  function(){
	return {
        "from_email": "no-reply@studentask.de",
        "from_name": "StudenTask",
        "to": [{}], 
       "headers": {
            "Reply-To": "adrian.barwicki@viciqloud.com"
        }, 
        "important": false,
        "global_merge_vars": [],
        "metadata": {
            "website": "www.studentask.de"
        },
        "recipient_metadata": [{}],
	};
};


module.exports = {
    getMessagePrototype : getMessagePrototype,
    sendMessage : sendMessage
};

