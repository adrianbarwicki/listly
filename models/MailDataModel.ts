class MailDataModel {
    MessageHeader : string;
    MessageBody : string;
    ReplyTo : string;
    SendTo : Array<Text>;
    MessageText : string;
    MessageHTML : string;
    MessageSubject : string;
    MessageImageUrl : string;
    CompanyName : string;
    CompanySlogan : string;
    CompanyAddress : string;
    CompanyCEO : string;
    ProductName : string;
    Url : string;                                                       
    
    constructor(){
      this.SendTo = [];
    }
    
    setReplyTo(ReplyTo:string){
        this.ReplyTo = ReplyTo;
    }
    
    setUrl(Url:string){
        this.Url = Url;
    }
    
    setProductName(ProductName:string){
        this.ProductName = ProductName;
    }
    
    setCompanyCEO(CompanyCEO:string){
        this.CompanyCEO = CompanyCEO;
    }
    
    setCompanyAddress(CompanyAddress:string){
        this.CompanyAddress = CompanyAddress;
    }
    
    setCompanyName(CompanyName:string){
        this.CompanyName = CompanyName;
    }
    
    setMessageImageUrl(MessageImageUrl:string){
        this.MessageImageUrl = MessageImageUrl;
    }
    
    setMessageBody(MessageBody:string){
        this.MessageBody = MessageBody;
    }
    
    setMessageHeader(MessageHeader:string){
        this.MessageHeader = MessageHeader;
    }
    
    setSendTo(SendTo:any){
        if(typeof SendTo == "string"){
            this.SendTo.push(SendTo);
        }else{
            SendTo.forEach((email)=>{
                this.SendTo.push(email);
            });
        }
    }
    
    setMessageHTML(MessageHTML:string){
        this.MessageHTML = MessageHTML;
    }
    
    setMessageText(MessageText:string){
        this.MessageText = MessageText;
    }
    
    setMessageSubject(MessageSubject:string){
        this.MessageSubject = MessageSubject;
    } 
    
    setCompanySlogan(CompanySlogan:string){
        this.CompanySlogan = CompanySlogan;
    } 
    
}

declare var module: any;
module.exports = MailDataModel;
