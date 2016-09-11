** Listly **

Subsription list module

Examples seen on:

* [viciqloud.com](https://viciqloud.com) (Contact and subcription form) 
* [studentask.de/contact](https://studentask.de/contact) (Contact form) 


#Installation
```
sudo npm install -g typescript gulp
git clone https://github.com/viciqloud/listly
cd listly
npm install
```

#Configuration
**Database connection**
```
export LISTLY_DB_HOST_NAME=yourhostname
export LISTLY_DB_USER=yourusername
export LISTLY_DB_PORT=3306
export LISTLY_DB_PASSWORD=yourpassword
export LISTLY_DB_DATABASE=yourdatabasename
```

**Mandrill Email Service**
```
export LISTLY_MANDRILL_SECRET_KEY=yourmandrillsecret
```

# Running
The application requires two servers, one for delivering static data (CDN) and one that handles the logic and exposes a RESTful API.

Starting CDN:
```
npm run startCDN
```

Starting API:
```
npm run startAPI
```

# Code snippet
Append the following code snippet to the end of the body:
```
<script>
    /**
      @param src : link to the listly-sdk.js or listly-sdk.min.js
      @param script : we spare ourselfs definitio and declaration of a variable, small trick.
    */
    (function(src,script){
        script = document.createElement(script);
        script.src=src;
        document.body.appendChild(script);
    }("https://listly-cdn.viciqloud.com//snippets/listly-sdk.min.js","script"));
</script>  
```

Now you can include the listly form:

**Subscription form**
```
<div style="width:300px;">
        <div id="listly-subs-form" 
              data-button-label="Hello, Submit me!" 
              data-lang="de" 
              data-public-key="XXXYourPublicKeyXXX" 
              data-button-bg-color="#00aeff"
              data-props="prop-campaign=campaign1&prop-source=test2&prop-test_property=test3" >
        </div>
</div>
```

**Contact form**
```
<div style="width:500px;">
    <div id="listly-contact-form" 
         data-lang="de" 
         data-public-key="yourpublickey">
    </div>
</div>  
```


## Contributors
Adrian Barwicki (adrian[dot]barwicki[@]viciqloud[dot]com)

##Licence
MIT

##Author
**Powering Web&Mobile Applications**

2016 ViciQloud (haftungsbeschränkt) [viciqloud.com](https://viciqloud.com) 

Robert-Bosch-Strasse 49 

69190 Walldorf

GERMANY 

Adrian Barwicki 
