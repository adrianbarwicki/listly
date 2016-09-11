/*
* Copyright ViciQloud (http://viciqloud.com)
* Licensed under the Apache License, Version 2.0
* http://www.apache.org/licenses/LICENSE-2.0
* @author Adrian Barwicki (adrian.barwicki[@]viciqloud.com)
*/
var PlaceHolder = (function () {
    function PlaceHolder() {
    }
    return PlaceHolder;
})();
var ListlySDK = (function () {
    function ListlySDK() {
        this.defaultLanguage = "en";
        this.production = true;
        this.apiUrl = this.production ? "https://listly-api.viciqloud.com" : "http://localhost:8000";
        this.cdnUrl = this.production ? "https://listly-cdn.viciqloud.com" : "http://localhost:9000";
        this.PLACEHOLDERS = {
            en: {
                loading: "Loading",
                email: "Your email",
                firstName: "First name",
                lastName: "Last name",
                message: "Write your message here",
                send: "Send",
                thankyou: "Thank you!",
                error: "Error",
            },
            de: {
                loading: "Bitte warten",
                email: "E-mail-Addresse",
                firstName: "Vorname",
                lastName: "Nachname",
                message: "Ihre Nachricht",
                send: "Abschicken",
                thankyou: "Vielen Dank!",
                error: "Fehlgeschlagen"
            }
        };
    }
    ListlySDK.prototype.appendListlyCss = function () {
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', this.apiUrl + "/snippets/listly.css");
        document.getElementsByTagName('head')[0].appendChild(link);
    };
    ListlySDK.prototype.addClass = function (node, className) {
        if ((" " + node.className + " ").indexOf(" " + className + " ") >= 0) {
            node.className += " " + className;
        }
    };
    ListlySDK.prototype.getParameterByName = function (name, url) {
        if (!url)
            url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };
    ListlySDK.prototype.fillOutListlyContainers = function () {
        var _this = this;
        var possibleContainers = [["listly-subs-form", "getSubcriptionFormHTML"],
            ["listly-contact-form", "getContactFormHTML"]];
        possibleContainers.forEach(function (item) {
            var lang;
            var publicKey;
            var buttonBgColor;
            var buttonLabel;
            var FormElement = document.getElementById(item[0]);
            if (FormElement) {
                publicKey = FormElement.attributes["data-public-key"].nodeValue;
                var langAttr = FormElement.attributes["data-lang"];
                if (langAttr) {
                    lang = langAttr.nodeValue;
                }
                var btnBgColorAttr = FormElement.attributes["data-button-bg-color"];
                if (btnBgColorAttr) {
                    buttonBgColor = btnBgColorAttr.nodeValue;
                }
                var btnLabelAttr = FormElement.attributes["data-button-label"];
                if (btnLabelAttr) {
                    buttonLabel = btnLabelAttr.nodeValue;
                }
                if (item[1] == "getSubcriptionFormHTML") {
                    (FormElement).appendChild(_this[item[1]](publicKey, lang, buttonBgColor, buttonLabel));
                }
                else {
                    (FormElement).innerHTML = _this[item[1]](publicKey, lang, buttonBgColor, buttonLabel);
                }
            }
        });
    };
    ListlySDK.prototype.loadDeps = function () {
        this.load(this.cdnUrl + "/snippets/listly.css", "css");
        this.load(this.cdnUrl + "/lib/nanoajax.min.js", "js");
    };
    ListlySDK.prototype.load = function (filename, filetype) {
        var fileref;
        if (filetype == "js") {
            fileref = document.createElement('script');
            fileref.setAttribute("type", "text/javascript");
            fileref.setAttribute("src", filename);
        }
        else if (filetype == "css") {
            fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", filename);
        }
        if (typeof fileref != "undefined")
            document.getElementsByTagName("head")[0].appendChild(fileref);
    };
    ListlySDK.prototype.submitForm = function (formType) {
        var FormElement = document.getElementById("listly-" + formType + "-form");
        var publicKey = FormElement.attributes["data-public-key"].nodeValue;
        var language = FormElement.attributes["data-lang"].nodeValue;
        var properties;
        var propertiesAttr = FormElement.attributes["data-props"];
        if (propertiesAttr) {
            properties = propertiesAttr.nodeValue;
        }
        language = language || this.defaultLanguage;
        var url;
        var PLACEHOLDERS = this.PLACEHOLDERS;
        var PH = PLACEHOLDERS[language];
        var cdnUrl = this.cdnUrl;
        switch (formType) {
            case 'subs':
                url = this.apiUrl + "/add-to-list?public_key=" + publicKey;
                break;
            case 'contact':
                url = this.apiUrl + "/send-message?public_key=" + publicKey;
                break;
            default:
                throw 'I do not know what to do.';
        }
        var formContainer = document.getElementById("listly-" + formType + "-container");
        var submitButton = document.getElementById("listly-" + formType + "-submit-button");
        var email = document.getElementById("listly-" + formType + "-email").value;
        if (formType == "contact") {
            var firstName = document.getElementById("listly-" + formType + "-first-name").value;
            var lastName = document.getElementById("listly-" + formType + "-last-name").value;
            var message = document.getElementById("listly-" + formType + "-message").value;
        }
        var requestBody = "email=" + email + "&firstName=" + firstName + "&lastName=" + lastName + "&message=" + message;
        requestBody += "&" + properties;
        var request = {
            url: url,
            method: "POST",
            body: requestBody
        };
        var loadingClass = "listly-loading";
        formContainer.innerHTML = "<div class=\"listly-loader\">\n                                    <div>\n                                        <img src=\"" + cdnUrl + "/loader.svg\">\n                                    </div>\n                                 </div>";
        nanoajax.ajax(request, function (code, responseText) {
            if (code !== 200) {
                console.error(code, responseText);
                var errorHTML = "<div class=\"listly-row\">\n                                        <img class=\"listly-img-success\" src=\"" + cdnUrl + "/listly-error.png\">\n                                      </div>\n                                      <div class=\"listly-row\">\n                                        <h3 class=\"listly-center listly-thankyou-text\">\n                                            " + PH.error + "\n                                        </h3>\n\n                                        <p class=\"listly-center\" style=\"max-width:200px;\">\n                                            " + code + " " + responseText + "\n                                        </p>\n                                      </div>";
                formContainer.innerHTML = errorHTML;
            }
            else {
                var thankYouHTML = "<div class=\"listly-row\">\n                                            <img class=\"listly-img-success\" src=\"" + cdnUrl + "/circle-with-check-symbol.png\">\n                                        </div>\n                                        <div class=\"listly-row\">\n                                            <h3 class=\"listly-center listly-thankyou-text\">" + PH.thankyou + "</h3> \n                                        </div>    \n                                        ";
                formContainer.innerHTML = thankYouHTML;
            }
        });
    };
    ListlySDK.prototype.createListlyContainer = function (id, className) {
        var container = document.createElement("div");
        container.setAttribute("id", id);
        container.className = className;
        return container;
    };
    ListlySDK.prototype.createFormButton = function (params) {
        var PH = this.PLACEHOLDERS[params.language || this.defaultLanguage];
        var button = document.createElement("button");
        button.setAttribute("id", params.id);
        button.setAttribute("type", "submit");
        button.className = params.className;
        if (params.buttonBgColor) {
            button.style.setProperty("background", params.buttonBgColor);
        }
        button.innerHTML = params.buttonLabel || PH.send;
        return button;
    };
    ListlySDK.prototype.createForm = function (params) {
        var form = document.createElement("form");
        form.className = "listly-form";
        form.setAttribute("action", "javascript:Listly.submitForm('subs');");
        return form;
    };
    ListlySDK.prototype.createInputElement = function (params) {
        var fieldset = document.createElement("fieldset");
        var input = document.createElement("input");
        input.setAttribute("id", params.id);
        input.setAttribute("type", params.type || "email");
        input.setAttribute("placeholder", params.placeholder);
        input.attributes["required"] = params.required ? "required" : "";
        fieldset.appendChild(input);
        return fieldset;
    };
    ListlySDK.prototype.getSubcriptionFormHTML = function (publicKey, language, buttonBgColor, buttonLabel) {
        var PH = this.PLACEHOLDERS[language || this.defaultLanguage];
        var container = this.createListlyContainer("listly-subs-container", "listly-container");
        var form = this.createForm({});
        var inputElementParams = {
            id: "listly-subs-email",
            type: "email",
            placeholder: PH.email,
            required: true
        };
        var inputEmail = this.createInputElement(inputElementParams);
        var buttonParams = {
            id: "listly-subs-submit-button",
            buttonBgColor: null,
            className: null,
            buttonLabel: null
        };
        if (buttonBgColor) {
            buttonParams.buttonBgColor = buttonBgColor;
        }
        else {
            buttonParams.className = "listly-button-bg-color";
        }
        buttonParams.buttonLabel = buttonLabel || PH.send;
        var formButton = this.createFormButton(buttonParams);
        form.appendChild(inputEmail);
        form.appendChild(formButton);
        container.appendChild(form);
        return container;
    };
    ListlySDK.prototype.getContactFormHTML = function (publicKey, language, buttonBgColor, buttonLabel) {
        language = language || this.defaultLanguage;
        var PLACEHOLDERS = this.PLACEHOLDERS;
        var PH = PLACEHOLDERS[language];
        var innerHtml = '';
        innerHtml += '<div id="listly-contact-container" class="listly-container">';
        innerHtml += '<form class="contact" class="listly-form" action="javascript:Listly.submitForm(\'contact\');">';
        innerHtml += '<fieldset>';
        innerHtml += "<input id=\"listly-contact-email\" type=\"email\" placeholder=\"" + PH.email + "\" required>";
        innerHtml += "<input id=\"listly-contact-first-name\" type=\"text\" placeholder=\"" + PH.firstName + "\" required>";
        innerHtml += "<input id=\"listly-contact-last-name\" type=\"text\" placeholder=\"" + PH.lastName + "\" required>";
        innerHtml += "<textarea id=\"listly-contact-message\" placeholder=\"" + PH.message + "\"></textarea>";
        innerHtml += '</fieldset>';
        if (buttonBgColor) {
            innerHtml += "<button id=\"listly-contact-submit-button\" style=\"background:" + buttonBgColor + "\" type=\"submit\">";
        }
        else {
            innerHtml += "<button id=\"listly-contact-submit-button\" class=\"listly-button-bg-color\" type=\"submit\">";
        }
        if (buttonLabel) {
            innerHtml += buttonLabel + "</button>";
        }
        else {
            innerHtml += PH.send + "</button>";
        }
        innerHtml += '</form></div>';
        innerHtml += '<!--<span style="margin:0 auto;">Powered by <a href="http://viciqloud.com">ViciQloud</a></span>--></div>';
        return innerHtml;
    };
    return ListlySDK;
})();
var Listly;
function init() {
    Listly = new ListlySDK();
    Listly.loadDeps();
    Listly.fillOutListlyContainers();
}
init();
