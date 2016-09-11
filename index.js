//var async = require('async');
//var fs = require('fs');
//var path = require('path');
//var email = require('./listly/email.js');
var ListService = require('./services/ListService.js');


module.exports = {
  //sendToEmail : sendToEmail,
  //getTemplate : getTemplate,
  //sendToList : sendToList,
  appendToList : ListService.appendToList,
  getList : ListService.getList
};


/*
var getTemplate = function(templateKey,callback){


var tmpltPath = path.join(__dirname+"/../public/emails/"+templateKey+".html");
  console.log(tmpltPath);
fs.readFile(tmpltPath,'utf8', function(err, data) {
  if(err){
    return callback(err);
  }
  
  callback(null,data);
});

};




var sendToList = function(listId,templateKey,callback){
  
  getTemplate("invitation-requested-prelaunch",function(err,rHTML){
    
  var msgPrototype = email.getMessagePrototype();
      msgPrototype.html = rHTML;
      msgPrototype.subject = "Glückwunsch! Du bist kurz davor...";
      msgPrototype.to = [{
            "email": "adrian.barwicki@viciqloud.com",
            "type": "to"
      }];
    
  var lList;
  async.waterfall([
     function(callback){
      var sql = "SELECT email FROM list_subs WHERE list_id = ?"
       pool.query(sql,[listId],function(err,result){
         if(err){
           return callback(err);
         }
         if(result.length){
            lList = result;
         } else {
            return callback({status:400, code : "LIST_DOES_NOT_EXISTS"});
         }
         
          return callback();
       });
    },
    function(callback){
      
          msgPrototype.to = lList.map(function(item){
                return {
                  email : item.email,
                  type : "to"
                }
          });

          email.sendMessage(msgPrototype,function(err){
            return callback(err);
          });
          
      
    }],function(err){
    if(err){
      return callback(err);
    }
    
    callback(err,lList);
    });
  });
    };


var sendToEmail = function(receiver,templateKey){
  getTemplate(templateKey,function(err,rHTML){
      if(err){
        return console.error(err);
      }


      var msgPrototype = email.getMessagePrototype();
      msgPrototype.subject = "Glückwunsch! Du bist kurz davor...";
      msgPrototype.html = rHTML;
      msgPrototype.to = [{
            "email": receiver.email,
            "type": "to"
      }];

      email.sendMessage(msgPrototype,function(err){
            return console.log(err);
      });
  }); 
}

*/