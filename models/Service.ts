declare var module: any;
declare var process: any;


class ServiceModel {

defaultCallback(err:any,data:any){

    if(module.parent) {
        err&&console.error(err);
        data&&console.log(data);
    } else {
        err&&console.error(err)&&process.exit(-1);
        data&&console.log(data);
        console.log("[COMPLETED]")
        process.exit();
    }

} 
   
}


module.exports = ServiceModel;
