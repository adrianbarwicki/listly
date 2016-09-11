var async = require('async');
var pool = require("../config/db.js")()

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

var Service = {
  createAccount : createAccount,
  getAccountEmails : getAccountEmails,
};

if(module.parent){
    module.exports = Service;
}else{
    var processName = process.argv[1];
    var functionName = process.argv[2];
    var arg1 = process.argv[3];
    if(!functionName){
        console.error(`[Error] ${processName} Provide first argument : the name of the function in the service.`);
        console.error(`Hint: getList`);
        return process.exit(-1);
    }
    
    Service[functionName](arg1);
}


function createAccount(uname,callback){
      callback=callback||defaultCallback;
      if(!uname){
          callback("Inital username")
      }
    
      var sql = "INSERT INTO account SET uname = ?";
      pool.query(sql,[uname],function(err,result){
        if(err){
          return callback(err);
        }
        var accountId = result.insertId;
        console.log(`[OK] Account has been created with uname ${uname}`);
        return callback();
      });
}

function getAccountEmails(accountId,callback){
      callback=callback||defaultCallback;
    
      if(!accountId){
          return callback("Inital accountId")
      }
    
      var sql = "SELECT email FROM account_emails WHERE account_id = ?";
      pool.query(sql,[accountId],function(err,result){
        if(err){
          return callback(err);
        }
        var Emails = result.map(function(item){
            return item.email;
        })
        console.log(`[OK] Emails assigned to account ${accountId}:`);
        console.log(Emails.join(","));
        return callback(null,Emails);
      });
}

