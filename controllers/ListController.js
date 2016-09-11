var async = require('async');
var randtoken = require('rand-token');
var ListService = require("../services/ListService");
var SubService = require("../services/SubService");
var AccountService = require("../services/AccountService");
var EmailService = require("../services/EmailService");
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
  analyzeList : analyzeList,  
  addToList : addToList,
};

if(module.parent){
    module.exports = Controller;
}else{
    var processName = process.argv[1];
    var functionName = process.argv[2];
    var arg1 = process.argv[3];
    var arg2 = process.argv[4];
    if(!functionName){
        console.error(`[Error] ${processName} Provide first argument : the name of the function in the service.`);
        console.error(`Hint: getList`);
        return process.exit(-1);
    }
    
    Controller[functionName](arg1,arg2);
}


/**
Aggregates subsription on its properties
*/
function analyzeList(listId,cb){
    SubService.groupSubsByProps(listId,(err,rData)=>{
        cb(err,rData);
    });
}


/**
@param publicKey: Public key to identify the list
@param email: Email address of the subcription
@param props: object or array with properties properyKey:propertyValue
*/
function addToList(publicKey,email,props,callback) {
    callback=callback||defaultCallback;

    var accountId,listName,AccountEmails=[],listId, subId;

    async.waterfall([
        (cb)=>{
        ListService.getListIdFromPublicKey(publicKey,(err,rList)=>{
            if(err){
                return callback(err);
            }
            listId = rList.listId;
            cb();
        });
        },
        (cb)=>{
             ListService.appendEmailToList(listId,email,(err,rSub)=>{
                if(err){
                    return cb(err);
                }

                subId = rSub.subId;        
                // add properties to the subscription
                cb();
            });
        },
        (cb)=>{
            
            // we check if props are indeed of type array
            if (typeof props !== "object"){
                console.log("[INFO] Converting props to Array");
                try{
                    props = JSON.parse(props);
                } catch(err){
                    console.error("[ERROR] Props could not be converted into JSON object.");
                    console.error(err);
                    return cb(err);
                }
            }
            
            async.eachLimit(props,5,(prop,callback)=>{
                //subId,propKey,propValue
                var propKey = prop[0];
                var propValue = prop[1];

                if(!propKey || !propValue){
                    console.log("[WARNING] Property key or propery value missing!",prop);
                    return callback();
                }
                
                SubService.addPropToSub(subId,propKey,propValue,(err)=>{
                    return callback(err); 
                });
            },(err)=>{
                return cb(err);
            });
        }
    ],(err)=>{
        callback(err);
        if(err){
            return;
        }
        
        // async after returning back
        // lets get list info with account owner and list name and fetch the emails for the owner... :)
        async.series([
            (cb) => {
                ListService.getListInfo(listId,(err,rList)=>{
                   if(err){
                      return cb(err);       
                   }
                   accountId = rList.owner_account_id;
                   listName = rList.list_name;
                   return cb();                           
                });
            },
            (cb)=> {
                 AccountService.getAccountEmails(accountId,(err,rAccountEmails)=>{
                   if(err){
                      return cb(err);       
                   }
                   AccountEmails = rAccountEmails;
                   return cb();                           
                });
            },
            (cb)=> {       
             
                sendMessageToAccountOwner(cb);
                
                function sendMessageToAccountOwner(cb){
                    
                    var MailData2 = new MailDataModel();
                    var message = `${email} subsribed to the your list "${listName}"`;
                    MailData2.setSendTo(AccountEmails);
                    MailData2.setReplyTo(email);
                    MailData2.setMessageSubject(`${email} has subscribed to list (${listName})`);
                    MailData2.setMessageHeader("New Subscription!");
                    MailData2.setMessageBody(message);
                    MailData2.setUrl("http://viciqloud.com");
                    MailData2.setCompanySlogan("Powered by ViciQloud. Web. Mobile. NodeJS.");
                    MailData2.setCompanyName("ViciQloud UG (haftungsbeschränkt)");
                    MailData2.setCompanyCEO("Adrian Barwicki");
                    MailData2.setCompanyAddress("Robert-Bosch-Strasse 49, 69190 Walldorf");    
                    MailData2.setProductName("SiemaZiom (Subs)");

                    MailData2.setMessageHTML(message);
                    MailData2.setMessageText(message);


                    EmailService.sendMessage(MailData2,(err)=>{
                            return cb(err);
                    });      
                }
                
             }
        ],(err)=>{
             if(err){
                console.error("[ERROR]");
                console.error(err);
             }        
        });
        
        
        
    });
    
     
}



