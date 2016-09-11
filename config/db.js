var mysql = require('mysql');

var host=process.env.LISTLY_DB_HOST_NAME;
var port=process.env.LISTLY_DB_PORT || 3306;
var user=process.env.LISTLY_DB_USER;
var password=process.env.LISTLY_DB_PASSWORD;
var database=process.env.LISTLY_DB_DATABASE || "listly";


if(!host){
  throw new Error("DB config: Host name missing (LISTLY_DB_HOST_NAME)");
}

if(!port){
  console.log("DB config: port missing (LISTLY_DB_PORT), default : 3306");
}

if(!user){
  throw new Error("DB config: User missing (LISTLY_DB_USER)");
}

if(!password){
  throw new Error("DB config: Password missing (LISTLY_DB_PASSWORD)");
}

if(!database){
  console.log("DB config: port missing (LISTLY_DB_PORT), default : listly");
}

var pool

module.exports=function(){
  if(!pool){
      pool  = mysql.createPool({
        connectionLimit : 10,	
        host     : host || 'vicigo.cvkgvqrbvwfn.eu-central-1.rds.amazonaws.com',
        port: port || 3306,
        user     : user || 'vicigo',
        password : password || 'mufjpkzubpien314',
        database : database || 'listly'	
     });
  }

  return pool;  
};