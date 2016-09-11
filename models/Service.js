var ServiceModel = (function () {
    function ServiceModel() {
    }
    ServiceModel.prototype.defaultCallback = function (err, data) {
        if (module.parent) {
            err && console.error(err);
            data && console.log(data);
        }
        else {
            err && console.error(err) && process.exit(-1);
            data && console.log(data);
            console.log("[COMPLETED]");
            process.exit();
        }
    };
    return ServiceModel;
})();
module.exports = ServiceModel;
