var async = require('async');
var randtoken = require('rand-token');
var pool = require("../config/db.js")();

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

var Service = {
  getListInfo : getListInfo,    
  getEmailDataForList : getEmailDataForList,
  getOwnerAccountIdFromListId : getOwnerAccountIdFromListId,
  getListIdFromPublicKey : getListIdFromPublicKey,
  generateKeyForList : generateKeyForList,
  describeList : describeList,
  appendEmailToList : appendEmailToList,
  appendToList : appendToList, 
  getList : getList,
  displayEmailsFromList : displayEmailsFromList
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

/*
    @name displayEmailsFromList
    @desc displays emails in list, use in bash with '> textfilename.csv' to save the output into a file
    intended only for command use.
    @param listId<int>
    @param callback<fn>
    @returns EmailList<Array>
*/
function displayEmailsFromList(listId,callback){
    callback=callback||defaultCallback;
    getList(listId,(err,rList)=>{
       if(err) {
           return callback(err);
       }
        
       var EmailList=rList.elements.map((item)=>{
          console.log(item.email); 
       }); 
      if(module.parent){
          return callback(null,EmailList);
      }else{
          process.exit(0);
      }
    });
}

/*
    @name appendEmailToList
    @desc appends email to list
    @param listId<mysql:int10>
    @param email<String>
    @returns nothing
*/
function appendEmailToList(listId,email,callback){
    
    callback=callback||defaultCallback;
    
    if(!email||!listId){
        return callback("[Error] email or listId is initial!")
    }
    
    appendToList(listId,email,{},(err,rSub)=>{
       if(err){
           return callback(err);
       }
           
       return callback(null,rSub);  
    });
}

/*
 @name generateKeyForList
 @desc generates a random token and updates the public key for a list
 @param listId
 @callback {err}
*/
function generateKeyForList(listId,callback){
       callback=callback||defaultCallback;
       var token = randtoken.generate(20);
       var sql = "UPDATE list SET public_key = ? WHERE list_id = ?"
       pool.query(sql,[token,listId],function(err,result){
         if(err){
           return callback(err);
         }
         console.log(`[OK] Public key updated for listId ${listId} to ${token}`);   
         return callback();
       });
}
  
/*
 @name generateKeyForList
 @desc generates a random token and updates the public key for a list
 @param listId
 @callback {err}
*/
function getListIdFromPublicKey(publicKey,callback){
       callback=callback||defaultCallback;
       var sql = "SELECT list_id FROM list WHERE public_key = ?"
       pool.query(sql,[publicKey],function(err,result){
         if(err){
           return callback(err);
         }
         if(!result.length){
           return callback("[Error] Unknow public key");
         }   
         var List = result[0];
         console.log(`[OK] Public key ${publicKey} corresponds to listId ${List.list_id}`);   
         return callback(null,{ listId : List.list_id });
       });
}


function appendToList(listId,email,Props,callback){

  var subId;  
  async.waterfall([
    
    function(callback){
       var sql = "SELECT * FROM list_subs WHERE list_id = ? AND email = ?"
       pool.query(sql,[listId,email],function(err,result){
         if(err){
           return callback(err);
         }
         if(result.length){
           return callback({status:400,code:"EMAIL_EXISTS"});
         }
         
         console.log(`[OK] ${email} added to list ${listId}`);   
           
         return callback();
       });
    },
    
    function(callback){
      var sql = "INSERT INTO list_subs SET email = ?, list_id = ?";
      pool.query(sql,[email,listId],function(err,result){
        if(err){
          return callback();
        }
        subId = result.insertId;
        return callback();
      });
    },
    function(callback){
      var tProps = Object.keys(Props).map(function (key) {
        var rPropElement = {
          key : key,
          value : Props[key],
        };
        return rPropElement;
      });
      
      async.eachSeries(tProps,function(Prop,callback){
        
        var newProp = {
          sub_id : subId,
          key : Prop.key,
          value : Prop.value
        }
        console.log(newProp);
        var sql = "INSERT INTO list_subs_props SET ?"
        pool.query(sql,newProp,function(err){
        if(err){
          console.error(err);
          return callback(err);
        }
        return callback();
      });
      },function(err){
        callback(err);
      }); 
    }
  ],function(err){
    callback(err,{subId:subId});
  });
  
}


/*
@name getOwnerAccountIdFromListId
@desc gets account id of the the owner of the list
@param listId<Number>
@param callback<Function>, {err, accountId}
*/
function getOwnerAccountIdFromListId(listId,callback){
      if(!listId){
          return callback(`[ERROR] ListService : Initial listId`);
      }else{
          console.log(`[INFO] Getting Account Owner Id for List Id ${listId}`);
      }
    
      callback = callback || defaultCallback;
      var sql = "SELECT owner_account_id FROM list WHERE list_id = ?";
      pool.query(sql,[listId],function(err,result){
        if(err){
          return callback();
        }
        
        if(!result.length){
           return callback("List Id not found") 
        }  
        
          
          
        return callback(null,result[0].owner_account_id);
      });
}

/*
@name getEmailDataForList
@desc gets email data for list
@param listId<Number>
@param callback<Function>, {err, EmailData}
*/
function getEmailDataForList(listId,callback){
      if(!listId){
          return callback(`[ERROR] ListService : Initial listId`);
      }else{
          console.log(`[INFO] Getting Email Data for List Id ${listId}`);
      }
    
      callback = callback || defaultCallback;
      var sql = "SELECT * FROM list_email_data WHERE list_id = ?";
      pool.query(sql,[listId],function(err,result){
        if(err){
          return callback();
        }
        
        if(!result.length){
           return callback("Email Data for List Id not found") 
        }  
        
        var dataRow = result[0];

          
        var MailData = new MailDataModel();  
        MailData.setCompanyName(dataRow.company_name);
        MailData.setCompanySlogan(dataRow.company_slogan);
        MailData.setProductName(dataRow.product_name);
        MailData.setCompanyCEO(dataRow.company_ceo);
        MailData.setCompanyAddress(dataRow.company_address);
        MailData.setUrl(dataRow.company_url);
        MailData.setMessageImageUrl(dataRow.image_url);
          
        return callback(null,MailData);
      });
}


function describeList(listId){
    getList(listId,(err,rList)=>{
        if(err){
            console.error(err);
            process.exit(-1);
        }
        console.log(`----------------------${rList.list_name}------------------------------`);
        console.log(`ListId: ${rList.list_id}`);
        console.log(`List name: ${rList.list_name}`);
        console.log(`Belongs to userId: ${rList.owner_account_id}`);
        console.log(`Number of elements ${rList.elements.length}`);
        console.log("-----------------------------------------------------------------------");
        process.exit(0); 
    });
}


function getListInfo(listId,callback){
    
       callback=callback||defaultCallback; 
        
       if(!listId){
           return callback({status:500, code : "INITIAL_PARAMS", msg: "ListId is initial."});
       }
        
       var List = {};
    
       var sql = "SELECT * FROM list WHERE list_id = ?"
       pool.query(sql,[listId],function(err,result){
         if(err){
           return callback(err);
         }
         if(result.length){
            List = result[0];
         } else {
            return callback({status:400, code : "LIST_DOES_NOT_EXISTS"});
         }
         
          return callback(null,List);
       });
}

/*
@name getList with subscription emails
@param listId<Number>
@param callback<Function>
*/
function getList(listId,callback){
  
  callback=callback||defaultCallback;    
    
  if(!listId){
      return callback("Missing List Id")
  }    
    
    
  var lList,lElements;
  async.waterfall([
    (cb)=>{
      getListInfo(listId,(err,rList)=>{
          lList = rList;
          return cb(err);
      });
    },
    (callback)=>{
       var sql = "SELECT * FROM list_subs WHERE list_id = ? ORDER BY timestamp DESC"
       pool.query(sql,[listId],function(err,result){
         if(err){
           return callback(err);
         }
          lElements = result;
         
         
          async.eachLimit(lElements,3,function(Element,callback){
            var sql = "SELECT * FROM list_subs_props WHERE sub_id = ?"
            pool.query(sql,[Element.sub_id],function(err,rProps){
              if(err){
                return callback(err);
              }
              lElements[lElements.indexOf(Element)].props = rProps;
              callback();
            });
          },function(err){
            return callback(err);
          });
       });
    }],function(err){
        if(err){
          return callback(err);
        }
        var rList = lList;
        rList.elements = lElements;
        callback(err,rList);
    });
  
}
