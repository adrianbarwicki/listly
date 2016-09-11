var MailDataModel = (function () {
    function MailDataModel() {
        this.SendTo = [];
    }
    MailDataModel.prototype.setReplyTo = function (ReplyTo) {
        this.ReplyTo = ReplyTo;
    };
    MailDataModel.prototype.setUrl = function (Url) {
        this.Url = Url;
    };
    MailDataModel.prototype.setProductName = function (ProductName) {
        this.ProductName = ProductName;
    };
    MailDataModel.prototype.setCompanyCEO = function (CompanyCEO) {
        this.CompanyCEO = CompanyCEO;
    };
    MailDataModel.prototype.setCompanyAddress = function (CompanyAddress) {
        this.CompanyAddress = CompanyAddress;
    };
    MailDataModel.prototype.setCompanyName = function (CompanyName) {
        this.CompanyName = CompanyName;
    };
    MailDataModel.prototype.setMessageImageUrl = function (MessageImageUrl) {
        this.MessageImageUrl = MessageImageUrl;
    };
    MailDataModel.prototype.setMessageBody = function (MessageBody) {
        this.MessageBody = MessageBody;
    };
    MailDataModel.prototype.setMessageHeader = function (MessageHeader) {
        this.MessageHeader = MessageHeader;
    };
    MailDataModel.prototype.setSendTo = function (SendTo) {
        var _this = this;
        if (typeof SendTo == "string") {
            this.SendTo.push(SendTo);
        }
        else {
            SendTo.forEach(function (email) {
                _this.SendTo.push(email);
            });
        }
    };
    MailDataModel.prototype.setMessageHTML = function (MessageHTML) {
        this.MessageHTML = MessageHTML;
    };
    MailDataModel.prototype.setMessageText = function (MessageText) {
        this.MessageText = MessageText;
    };
    MailDataModel.prototype.setMessageSubject = function (MessageSubject) {
        this.MessageSubject = MessageSubject;
    };
    MailDataModel.prototype.setCompanySlogan = function (CompanySlogan) {
        this.CompanySlogan = CompanySlogan;
    };
    return MailDataModel;
})();
module.exports = MailDataModel;
