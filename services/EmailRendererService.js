var ejs = require("ejs");
var fs = require("fs");

var Service = {
    renderInLayout : renderInLayout,
    renderWithData : renderWithData,
};


function itIsMaybeEjs(name){
    var splittedLayoutName = name.split(".");
    if(splittedLayoutName[splittedLayoutName.length-1]!=="ejs"){
        name+=".ejs"
    }
    return name;
}

if(module.parent){
    module.exports = Service;
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
    
    Service[functionName](arg1,arg2);
}

/*
    @name renderInLayout
    @param layoutName<String> : under <root>/layouts (with or without .ejs)
    @param contentName<String> : under <root>/email-bodies (with or without .ejs)
    @returns compiled HTML
*/
function renderInLayout(layoutName,contentName){
    
    var compiledEmail = ""; //returns
    var layout = ""; 
    var emailBody="";
    var layoutPath = "";
    var contentPath = "";
    var tmp;
    
    layoutName=itIsMaybeEjs(layoutName);
    contentName=itIsMaybeEjs(contentName);
    
    layoutPath = `${__dirname}/../layouts/${layoutName}`;
    console.log(`[INFO] Reading file under ${layoutPath}`);
    layout = fs.readFileSync(layoutPath,'utf8');
    
    contentName = `${__dirname}/../email-bodies/${contentName}`;
    console.log(`[INFO] Reading file under ${contentPath}`);
    emailBody = fs.readFileSync(contentName,'utf8');
    
    
    console.log(`[INFO] Rendering contents into layout. Compiling ejs...`);
    compiledEmail = ejs.render(layout,{body : emailBody});
    
    if(!module.parent){
        console.log(compiledEmail);
    }
    
    return compiledEmail;
}


/*
    @name renderWithData
    @desc renders layout with data and returns compiled HTML
    @param layoutName<String> : under <root>/layouts (with or without .ejs)
    @param MailData<Object>
    @returns compiled HTML
*/
function renderWithData(layoutName,MailData){
    
    var compiledEmail = ""; //returns
    var layout = ""; 
    var emailBody="";
    var layoutPath = "";
    var contentPath = "";
    var tmp;
    
    layoutName=itIsMaybeEjs(layoutName);
    
    
    layoutPath = `${__dirname}/../layouts/${layoutName}`;
    console.log(`[INFO] Reading file under ${layoutPath}`);
    layout = fs.readFileSync(layoutPath,'utf8');
    
    
    console.log(`[INFO] Rendering data into layout. Compiling ejs...`);
    compiledEmail = ejs.render(layout,{ MailData : MailData });
    
    if(!module.parent){
        console.log(compiledEmail);
    }
    
    return compiledEmail;
}


//console.log(layout);
//console.log(body);



/*
console.log("[st.render] : writing to file");
var writePath = "./compiled/"+bodyPath+".html";
fs.writeFileSync(writePath, compiled);
console.log("[st.render] [SUCCESS] ");
process.exit(-1);
*/