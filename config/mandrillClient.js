var mandrill = require('mandrill-api/mandrill');
var mandrillSecretKey = process.env.LISTLY_MANDRILL_SECRET_KEY || "K59J9lVqpLY7_ix-GfEc7g";
var mandrillClient;

module.exports = function(){
   if(!mandrillClient){
       mandrillClient = new mandrill.Mandrill(mandrillSecretKey);
   }

   return mandrillClient;  
};