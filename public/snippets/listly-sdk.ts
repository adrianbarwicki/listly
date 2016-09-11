/*
* Copyright ViciQloud (http://viciqloud.com)
* Licensed under the Apache License, Version 2.0
* http://www.apache.org/licenses/LICENSE-2.0
* @author Adrian Barwicki (adrian.barwicki[@]viciqloud.com)
*/

declare var nanoajax: any;

class PlaceHolder {
        email:string;
        firstName:string;
        lastName:string;
        message:string;
        send:string;
}

class ListlySDK {
    
    apiUrl : string;
    cdnUrl : string;
    defaultLanguage : string;
    PLACEHOLDERS : Object;
    production : boolean;
    
    constructor() {
        this.defaultLanguage = "en";
        this.production=true;
        this.apiUrl = this.production ? "https://listly-api.viciqloud.com" : "http://localhost:8000";
        this.cdnUrl = this.production ? "https://listly-cdn.viciqloud.com" : "http://localhost:9000";
        this.PLACEHOLDERS = {
            en : {
                loading : "Loading",
                email : "Your email",
                firstName : "First name",
                lastName : "Last name",
                message : "Write your message here",
                send : "Send",
                thankyou : "Thank you!",
                error : "Error",
            },
            de : {
                loading : "Bitte warten",
                email : "E-mail-Addresse",
                firstName : "Vorname",
                lastName : "Nachname",
                message : "Ihre Nachricht",
                send : "Abschicken",
                thankyou : "Vielen Dank!",
                error : "Fehlgeschlagen"
            }
        };
    }
   
    appendListlyCss(){
        /* appends style link */
        let link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', this.apiUrl+"/snippets/listly.css");
        document.getElementsByTagName('head')[0].appendChild(link);
    }    
    
    addClass(node:HTMLElement, className:string) {
            if ((" " + node.className + " ").indexOf(" "+className+" ") >= 0) {
                node.className += " " + className;
            }
    }
    
    getParameterByName(name, url?) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    
    fillOutListlyContainers(){
  
         
     let possibleContainers=[["listly-subs-form","getSubcriptionFormHTML"],
                             ["listly-contact-form","getContactFormHTML"]];

     possibleContainers.forEach((item)=>{
        let lang:string;
        let publicKey:string;
        let buttonBgColor:string;
        let buttonLabel:string;

        let FormElement:HTMLElement = document.getElementById(item[0]);

        if(FormElement){
            // required attributes
            publicKey = FormElement.attributes["data-public-key"].nodeValue;
            // optional attributes
            
           
            let langAttr = FormElement.attributes["data-lang"];
            if(langAttr){
                lang = langAttr.nodeValue;  
            }
            
            let btnBgColorAttr=FormElement.attributes["data-button-bg-color"];
            if(btnBgColorAttr){
                buttonBgColor = btnBgColorAttr.nodeValue;
            }
            
            
            let btnLabelAttr=FormElement.attributes["data-button-label"];
            if(btnLabelAttr){
                buttonLabel = btnLabelAttr.nodeValue;
            }

            if(item[1]=="getSubcriptionFormHTML"){
                (FormElement).appendChild(this[item[1]](publicKey,lang,buttonBgColor,buttonLabel));
            }else{
                (FormElement).innerHTML=this[item[1]](publicKey,lang,buttonBgColor,buttonLabel);
            }
        }
     
    });
   }

    loadDeps(){
        this.load(this.cdnUrl+"/snippets/listly.css","css");
        this.load(this.cdnUrl+"/lib/nanoajax.min.js","js");
    }
    
    load(filename:string, filetype:string){
        var fileref;
        if (filetype=="js"){ //if filename is a external JavaScript file
            fileref=document.createElement('script')
            fileref.setAttribute("type","text/javascript")
            fileref.setAttribute("src", filename)
        }
        else if (filetype=="css"){ //if filename is an external CSS file
            fileref=document.createElement("link")
            fileref.setAttribute("rel", "stylesheet")
            fileref.setAttribute("type", "text/css")
            fileref.setAttribute("href", filename)
        }
        if (typeof fileref!="undefined")
            document.getElementsByTagName("head")[0].appendChild(fileref)
     }

    submitForm(formType:string){
        
        
        let FormElement:HTMLElement = document.getElementById(`listly-${formType}-form`);
        // required attributes
        let publicKey:string = FormElement.attributes["data-public-key"].nodeValue;
        
        //optional attributes
        let language:string = FormElement.attributes["data-lang"].nodeValue;
        
        // example : key1=value1&key2=value2
        let properties:string;
        let propertiesAttr = FormElement.attributes["data-props"];
        if(propertiesAttr){
            properties = propertiesAttr.nodeValue;
        }

        language=language||this.defaultLanguage;
        
        let url:string;
        let PLACEHOLDERS = this.PLACEHOLDERS;
        let PH = PLACEHOLDERS[language];
        let cdnUrl:string = this.cdnUrl;
        
        switch (formType) {
            case 'subs':
                url = this.apiUrl + "/add-to-list?public_key="+publicKey;
                break;
            case 'contact':
                url = this.apiUrl + "/send-message?public_key="+publicKey;
                break;
            default:
            throw 'I do not know what to do.'
        }
        
        
        let formContainer:HTMLElement=document.getElementById(`listly-${formType}-container`);
        let submitButton:HTMLElement=document.getElementById(`listly-${formType}-submit-button`);
        
        let email:string = (<HTMLInputElement>document.getElementById(`listly-${formType}-email`)).value;
        if(formType=="contact"){
            var firstName:string = (<HTMLInputElement>document.getElementById(`listly-${formType}-first-name`)).value;
            var lastName:string = (<HTMLInputElement>document.getElementById(`listly-${formType}-last-name`)).value;
            var message:string = (<HTMLInputElement>document.getElementById(`listly-${formType}-message`)).value;
        }   
        
        
        var requestBody = `email=${email}&firstName=${firstName}&lastName=${lastName}&message=${message}`;
        requestBody+=`&${properties}`;
        
        var request =  { 
                          url: url,
                          method: "POST", 
                          body: requestBody
                       };
        
    
 
        let loadingClass="listly-loading";

 

        formContainer.innerHTML=`<div class="listly-loader">
                                    <div>
                                        <img src="${cdnUrl}/loader.svg">
                                    </div>
                                 </div>`;
        /*
            submitButton.innerHTML="Loading";              
            submitButton["disabled"] = true; 
        */
        
        nanoajax.ajax(request,function(code,responseText){
                if(code!==200){
                    console.error(code,responseText);
                    //submitButton.innerHTML=`Error: ${code} ${responseText}`;
                    
                     let errorHTML = `<div class="listly-row">
                                        <img class="listly-img-success" src="${cdnUrl}/listly-error.png">
                                      </div>
                                      <div class="listly-row">
                                        <h3 class="listly-center listly-thankyou-text">
                                            ${PH.error}
                                        </h3>

                                        <p class="listly-center" style="max-width:200px;">
                                            ${code} ${responseText}
                                        </p>
                                      </div>`;
                    formContainer.innerHTML = errorHTML;
                } else {
                    let thankYouHTML = `<div class="listly-row">
                                            <img class="listly-img-success" src="${cdnUrl}/circle-with-check-symbol.png">
                                        </div>
                                        <div class="listly-row">
                                            <h3 class="listly-center listly-thankyou-text">${PH.thankyou}</h3> 
                                        </div>    
                                        `;
                    formContainer.innerHTML = thankYouHTML;
                }
        });

    }


createListlyContainer(id,className){
    var container = document.createElement("div");
    container.setAttribute("id", id);
    container.className=className;
    return container;
}



/**
Creates Listly Form Button
@params id,
@params className,
@params buttonBgColor,
@params buttonLabel
@returns button<HTMLButton>
*/
createFormButton(params){
    let PH = this.PLACEHOLDERS[params.language || this.defaultLanguage];
    var button = document.createElement("button");
    button.setAttribute("id", params.id);
    button.setAttribute("type", "submit");
    button.className=params.className;
    
    if(params.buttonBgColor){
        // style is of CSSStyleDeclarations type
        // https://developer.mozilla.org/de/docs/Web/API/CSSStyleDeclaration
        button.style.setProperty("background",params.buttonBgColor);
    }
    
    button.innerHTML=params.buttonLabel || PH.send;
    return button;
}


createForm(params){
    var form = document.createElement("form");
    form.className="listly-form";
    form.setAttribute("action","javascript:Listly.submitForm('subs');");
    return form;
}

/**
@params id{string}
@params type{string} enum("email","text","password")
@params placeholder{string}
@params required{boolean}
*/
createInputElement(params){
    var fieldset = document.createElement("fieldset");
    var input = document.createElement("input");
    input.setAttribute("id", params.id);
    input.setAttribute("type", params.type||"email");
    input.setAttribute("placeholder", params.placeholder);
    input.attributes["required"] = params.required?"required":""; 
    fieldset.appendChild(input);
    
    return fieldset;
}

getSubcriptionFormHTML(publicKey:string,language:string,buttonBgColor?:string,buttonLabel?:string){
    
    let PH = this.PLACEHOLDERS[language || this.defaultLanguage];

    let container = this.createListlyContainer("listly-subs-container","listly-container");
    let form = this.createForm({});



    let inputElementParams = {
                                  id:"listly-subs-email",
                                  type:"email",
                                  placeholder:PH.email,
                                  required:true
                              };

    let inputEmail = this.createInputElement(inputElementParams);




    let buttonParams = {
        id : "listly-subs-submit-button",
        buttonBgColor : null,
        className : null,
        buttonLabel : null
    };

    if(buttonBgColor){
        buttonParams.buttonBgColor=buttonBgColor;
    }else{
        buttonParams.className="listly-button-bg-color";
    }     
    buttonParams.buttonLabel=buttonLabel||PH.send;



    var formButton = this.createFormButton(buttonParams);


    form.appendChild(inputEmail);
    form.appendChild(formButton);
    container.appendChild(form);

    return container;
}
    
getContactFormHTML(publicKey:string,language?:string,buttonBgColor?:string,buttonLabel?:string){
        
        language = language || this.defaultLanguage;
        
        let PLACEHOLDERS = this.PLACEHOLDERS;
        let PH = PLACEHOLDERS[language];

        
        let innerHtml = '';
        innerHtml += '<div id="listly-contact-container" class="listly-container">';
        innerHtml += '<form class="contact" class="listly-form" action="javascript:Listly.submitForm(\'contact\');">';
        innerHtml += '<fieldset>';
        innerHtml += `<input id="listly-contact-email" type="email" placeholder="${PH.email}" required>`;
        innerHtml += `<input id="listly-contact-first-name" type="text" placeholder="${PH.firstName}" required>`;
        innerHtml += `<input id="listly-contact-last-name" type="text" placeholder="${PH.lastName}" required>`;
        innerHtml += `<textarea id="listly-contact-message" placeholder="${PH.message}"></textarea>`;
        innerHtml += '</fieldset>';
    
        if(buttonBgColor){
            innerHtml += `<button id="listly-contact-submit-button" style="background:${buttonBgColor}" type="submit">`;
        }else{
            innerHtml += `<button id="listly-contact-submit-button" class="listly-button-bg-color" type="submit">`;
        }
    
        if(buttonLabel){
            innerHtml += `${buttonLabel}</button>`;
        }else{
            innerHtml += `${PH.send}</button>`;
        }
    
        innerHtml += '</form></div>';
        innerHtml += '<!--<span style="margin:0 auto;">Powered by <a href="http://viciqloud.com">ViciQloud</a></span>--></div>'
        return innerHtml;
    }
    
    
}


var Listly;

function init(){
    Listly = new ListlySDK();
    Listly.loadDeps();
    Listly.fillOutListlyContainers();
}

init();
 


