var async = require("async");
var AccountService = require("../services/AccountService");
var ListService = require("../services/ListService");
var EmailService = require("../services/EmailService");
var EmailRendererService = require("../services/EmailRendererService");
var MailDataModel = require("../models/MailDataModel");




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

var Controller = {
    sendContactMessage : sendContactMessage
};


if(module.parent){
    module.exports = Controller;
}else{
    var processName = process.argv[1];
    var functionName = process.argv[2];
    var arg1 = process.argv[3];
    if(!functionName){
        console.error(`[Error] ${processName} Provide first argument : the name of the function in the service.`);
        console.error(`Hint: getList`);
        return process.exit(-1);
    }
    
    Controller[functionName](arg1);
}



function sendContactMessage(publicKey,emailFrom,message,callback){
    
    callback=callback||defaultCallback;
    
    var MailData = new MailDataModel();
    var MailData2 = new MailDataModel();
    
    var listId = "";
    var accountId = "";
    var AccountEmails = [];
    
    async.series([
        function(callback){
            ListService.getListIdFromPublicKey(publicKey,(err,rList)=>{
               if(err){
                   return callback(err);       
               }
                   
                listId = rList.listId;
                return callback();    
              
            });
        },
        function(callback){
            ListService.getOwnerAccountIdFromListId(listId,(err,rAccountId)=>{
               if(err){
                  return callback(err);       
               }
               console.log(rAccountId);
               accountId = rAccountId;
               return callback();                           
            });
        },
        function(callback){
             AccountService.getAccountEmails(accountId,(err,rAccountEmails)=>{
               if(err){
                  return callback(err);       
               }
                
               AccountEmails = rAccountEmails;
               return callback();                           
            });
        },
        function(callback){
             ListService.getEmailDataForList(listId,(err,rData)=>{
               if(err){
                  return callback(err);       
               }
                
               MailData = rData;
               return callback();                           
            });
        }
    ],(err)=>{
        
    if(err){
        return callback(err);
    }    
           
    if(!AccountEmails.length){
        console.log("[WARNING] [EmailController] No emails assigned not account.");
    }
   
    // feedback to message sender
    MailData.setSendTo(emailFrom);
    MailData.setMessageSubject("Contact Confirmation");
    MailData.setMessageHeader(`Thank you for contacting ${MailData.ProductName}`);    
    MailData.setMessageBody(`Thank you for contacting ${MailData.ProductName}. Your message:<br> <p><em>${message}</em></p>`);
    MailData.setReplyTo(AccountEmails);
        
    // feedback to account manager
    MailData2.setSendTo(AccountEmails);
    MailData2.setReplyTo(emailFrom);
    MailData2.setMessageSubject(`${emailFrom} has contacted your company (${MailData.ProductName}`);
    MailData2.setMessageHeader("Message:<br>");
    MailData2.setMessageBody(message);
    MailData2.setUrl("http://viciqloud.com")    
    MailData2.setCompanySlogan("Powered by ViciQloud. Web. Mobile. NodeJS.");
    MailData2.setCompanyName("ViciQloud UG (haftungsbeschränkt)");
    MailData2.setCompanyCEO("Adrian Barwicki");
    MailData2.setCompanyAddress("Robert-Bosch-Strasse 49, 69190 Walldorf");    
    MailData2.setProductName("SiemaZiom");
        
    var messageHTML = EmailRendererService.renderWithData("transactional_basic",MailData);
    var messageHTML2 = EmailRendererService.renderWithData("transactional_basic",MailData2);
    
    MailData.setMessageHTML(messageHTML);
    MailData.setMessageText(messageHTML);
    
    MailData2.setMessageHTML(messageHTML2);
    MailData2.setMessageText(messageHTML2);
    
    
    async.parallel([
        function(callback){
             EmailService.sendMessage(MailData,(err)=>{
                    return callback(err);
             });
        },
        function(callback){
             EmailService.sendMessage(MailData2,(err)=>{
                    return callback(err);
            });
        }
    ],(err)=>{
        return callback(err);   
    });

  });
  

}