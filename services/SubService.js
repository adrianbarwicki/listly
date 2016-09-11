var async = require('async');
var pool = require("../config/db.js")();

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
  addPropToSub : addPropToSub,
  groupSubsByProps : groupSubsByProps
};

if(module.parent){
    module.exports = Service;
}else{
    var processName = process.argv[1];
    var functionName = process.argv[2];
    var arg1 = process.argv[3];
    if(!functionName){
        console.error(`[Error] ${processName} Provide first argument : the name of the function in the service.`);
        return process.exit(-1);
    }
    
    Service[functionName](arg1);
}

function groupSubsByProps(listId,callback){
    callback=callback||defaultCallback;
    
    var sql = "SELECT `key`, `value`, COUNT(`value`) AS count FROM list_subs_props";
    sql += " WHERE sub_id IN ( SELECT sub_id FROM list_subs WHERE list_id = ? )";
    sql += " GROUP BY `key`,`value`";

    pool.query(sql,[listId],function(err,result){
         if(err){
           return callback(err);
         }
         return callback(null,result);
    });    
}

/*
 Add property to Subscription
 @name addPropToSub
 @param subId{number} : Subcription List ID, primary index of list_subs
 @param propKey{string} : property key
 @param propValue{string} : property value
 @param callback 
 @callback {err}
*/
function addPropToSub(subId,propKey,propValue,callback){
   callback=callback||defaultCallback;

   var insertedPropId = null;  

   if(!subId){
       return callback({ code:500, code: "INITIAL_PARAMS", msg: "Sub Id is initial" });
   }

   if(!propKey){
       return callback({ code:500, code: "INITIAL_PARAMS", msg: "Prop key is initial" });
   }

   if(!propValue){
       return callback({ code:500, code: "INITIAL_PARAMS", msg: "prop Value is initial" });
   }

   async.series([


   /**
     Get the subscription property if exists
   */
   (cb)=>{
       var sql = "SELECT id FROM list_subs_props WHERE sub_id = ? AND `key` = ?";
       pool.query(sql,[subId,propKey],function(err,result){
         if(err){
           return cb(err);
         }

         if(result.length){
             insertedPropId = result[0].id   
         }   
         return cb();
       });
   },
   (cb)=>{

       var sql;
      /**
       If the sub. property exists, update it.
      */
       if(insertedPropId){
           
           sql = "UPDATE list_subs_props SET `value` = ? WHERE id = ?";
           pool.query(sql,[propValue,insertedPropId],function(err,result){
             if(err){
               return cb(err);
             }

             console.log(`[OK] Propery ${propKey} set to ${propValue} for subId ${subId}.`);   
             return cb();
           });

      /**
      Otherwise, create new propery.
      */               
       } else {

           sql = "INSERT INTO list_subs_props SET sub_id = ?, `key` = ?, `value` = ?";
           pool.query(sql,[subId,propKey,propValue],function(err,result){
             if(err){
               return cb(err);
             }

             console.log(`[OK] New Property (id:${result.insertId}) with key '${propKey}' set to '${propValue}' for subId ${subId}.`); 
             return cb();
           });

       }  
   } 
   ],(err)=>{
       callback(err);
   });

}