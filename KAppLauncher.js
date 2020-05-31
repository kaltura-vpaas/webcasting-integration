// Base64 library (https://github.com/dankogai/js-base64)
(function(global){"use strict";var _Base64=global.Base64;var version="2.1.4";var buffer;if(typeof module!=="undefined"&&module.exports){buffer=require("buffer").Buffer}var b64chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var b64tab=function(bin){var t={};for(var i=0,l=bin.length;i<l;i++)t[bin.charAt(i)]=i;return t}(b64chars);var fromCharCode=String.fromCharCode;var cb_utob=function(c){if(c.length<2){var cc=c.charCodeAt(0);return cc<128?c:cc<2048?fromCharCode(192|cc>>>6)+fromCharCode(128|cc&63):fromCharCode(224|cc>>>12&15)+fromCharCode(128|cc>>>6&63)+fromCharCode(128|cc&63)}else{var cc=65536+(c.charCodeAt(0)-55296)*1024+(c.charCodeAt(1)-56320);return fromCharCode(240|cc>>>18&7)+fromCharCode(128|cc>>>12&63)+fromCharCode(128|cc>>>6&63)+fromCharCode(128|cc&63)}};var re_utob=/[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;var utob=function(u){return u.replace(re_utob,cb_utob)};var cb_encode=function(ccc){var padlen=[0,2,1][ccc.length%3],ord=ccc.charCodeAt(0)<<16|(ccc.length>1?ccc.charCodeAt(1):0)<<8|(ccc.length>2?ccc.charCodeAt(2):0),chars=[b64chars.charAt(ord>>>18),b64chars.charAt(ord>>>12&63),padlen>=2?"=":b64chars.charAt(ord>>>6&63),padlen>=1?"=":b64chars.charAt(ord&63)];return chars.join("")};var btoa=global.btoa?function(b){return global.btoa(b)}:function(b){return b.replace(/[\s\S]{1,3}/g,cb_encode)};var _encode=buffer?function(u){return new buffer(u).toString("base64")}:function(u){return btoa(utob(u))};var encode=function(u,urisafe){return!urisafe?_encode(u):_encode(u).replace(/[+\/]/g,function(m0){return m0=="+"?"-":"_"}).replace(/=/g,"")};var encodeURI=function(u){return encode(u,true)};var re_btou=new RegExp(["[À-ß][-¿]","[à-ï][-¿]{2}","[ð-÷][-¿]{3}"].join("|"),"g");var cb_btou=function(cccc){switch(cccc.length){case 4:var cp=(7&cccc.charCodeAt(0))<<18|(63&cccc.charCodeAt(1))<<12|(63&cccc.charCodeAt(2))<<6|63&cccc.charCodeAt(3),offset=cp-65536;return fromCharCode((offset>>>10)+55296)+fromCharCode((offset&1023)+56320);case 3:return fromCharCode((15&cccc.charCodeAt(0))<<12|(63&cccc.charCodeAt(1))<<6|63&cccc.charCodeAt(2));default:return fromCharCode((31&cccc.charCodeAt(0))<<6|63&cccc.charCodeAt(1))}};var btou=function(b){return b.replace(re_btou,cb_btou)};var cb_decode=function(cccc){var len=cccc.length,padlen=len%4,n=(len>0?b64tab[cccc.charAt(0)]<<18:0)|(len>1?b64tab[cccc.charAt(1)]<<12:0)|(len>2?b64tab[cccc.charAt(2)]<<6:0)|(len>3?b64tab[cccc.charAt(3)]:0),chars=[fromCharCode(n>>>16),fromCharCode(n>>>8&255),fromCharCode(n&255)];chars.length-=[0,0,2,1][padlen];return chars.join("")};var atob=global.atob?function(a){return global.atob(a)}:function(a){return a.replace(/[\s\S]{1,4}/g,cb_decode)};var _decode=buffer?function(a){return new buffer(a,"base64").toString()}:function(a){return btou(atob(a))};var decode=function(a){return _decode(a.replace(/[-_]/g,function(m0){return m0=="-"?"+":"/"}).replace(/[^A-Za-z0-9\+\/]/g,""))};var noConflict=function(){var Base64=global.Base64;global.Base64=_Base64;return Base64};global.Base64={VERSION:version,atob:atob,btoa:btoa,fromBase64:decode,toBase64:encode,utob:utob,encode:encode,encodeURI:encodeURI,btou:btou,decode:decode,noConflict:noConflict};if(typeof Object.defineProperty==="function"){var noEnum=function(v){return{value:v,enumerable:false,writable:true,configurable:true}};global.Base64.extendString=function(){Object.defineProperty(String.prototype,"fromBase64",noEnum(function(){return decode(this)}));Object.defineProperty(String.prototype,"toBase64",noEnum(function(urisafe){return encode(this,urisafe)}));Object.defineProperty(String.prototype,"toBase64URI",noEnum(function(){return encode(this,true)}))}}})(this);


function KAppLauncher(schemeName) {
    var _this = this;

    KAppLauncher.prototype.schemeName = (typeof(schemeName) == 'undefined') ? "KalturaWebcast" : schemeName;
    KAppLauncher.prototype.clsid = "44F65A05-B493-4CEB-8C00-2B8227089B77";
    // KAppLauncher.prototype.cabUrl = "KAppLauncher.cab";
    /*
     KAppLauncher.downloadUrl = 'http://download.skype.com/d87a1ec6dbbdb7250b682d3efbd1dbd5/SkypeSetup.exe';
     */

    // return the make of the browser in lower-case (firefox|chrome|msie|safari)
    getBrowserMake = function() {
        try {
            var ua = navigator.userAgent.toLowerCase();
            if (/firefox/.test(ua)) return 'firefox';
            if (/chrome/.test(ua)) return 'chrome';
            if (/safari/.test(ua)) return 'safari';
            return 'msie';
        }
        catch (err) {
            console.log(err);
            return 'chrome';
        }
    };
    startFireFox = function () {
        try {
            var i = document.createElement('iframe');
            i.style.display = 'none';
            document.body.appendChild(i);
            i.contentWindow.location.href = _this.urlToLoad;
            _this.isSupported = i.contentWindow.location.href !== 'about:blank';
            i.parentNode.removeChild(i);

            if(!_this.isSupported) {
                _this.failReason = "Unable to load CaptureSpace app";
            }
        }
        catch (e) {
            if (e.name == "NS_ERROR_UNKNOWN_PROTOCOL") {
                _this.isSupported = false;
                _this.failReason = "Unknown protocol";
            }
        }
    };

    startIE = function () {
        //windows 8 has new API
        //ignore!! doesn't work well and it's removed in windows 10!
        if (false && navigator.msLaunchUri) {
            navigator.msLaunchUri(_this.urlToLoad,
                function () {
                    _this.isSupported = true;
                }, //success
                function () {
                    _this.isSupported = false;
                    _this.failReason = "Not supported";
                });  //failure
        }
        // navigator.msLaunchUri is not supported. (windows 7 or lower)
        // @fixme: KAppLauncher code does not work. it will open a blank window and will return true allways.
        else {
            var activeXid = "KAppLauncher_ScriptableLabelControl";

            function testForActiveX(action) {
                var ax = document.getElementById(activeXid);
                try {
                    _this.isSupported = ax.TestScheme(_this.schemeName);

                    if (_this.isSupported) {
                        _this.failReason = undefined;
                    }
                    else {
                        _this.failReason = "Uninstalled";
                    }
                }
                catch (e) {
                    // catch the exception
                    _this.isSupported = false;
                    _this.failReason = e;
                }
                $('#'+activeXid).remove();
                action();
            }

            function checkForActiveX(action) {
                if (!_this.clsid) {
                    _this.isSupported = true;
                    action();
                    //no activeX defnied!
                    return;
                }

                if (typeof window.external.msActiveXFilteringEnabled != "undefined"
                    && window.external.msActiveXFilteringEnabled() == true) {
                    _this.isSupported = true;
                    action();
                    return;
                }

                $('#'+activeXid).remove();
                ax = document.createElement('object');
                ax.setAttribute('classid', 'CLSID:' + _this.clsid);
                ax.setAttribute('id', activeXid);
                if (_this.cabUrl) {
                    ax.setAttribute('codebase', _this.cabUrl);
                }
                document.body.appendChild(ax);

                testForActiveX(action);
            }

            checkForActiveX(function () {
                if (_this.isSupported) {
                    $('#KAppLauncher_hiddenIFrame').remove();
                    $('<iframe />', {
                        'id': 'KAppLauncher_hiddenIFrame',
                        'name': 'KAppLauncher_hiddenIFrame',
                        'src': _this.urlToLoad,
                        'style': 'display: none;'
                    }).appendTo("body");
                }
            });

        }
    };

    startChromeSafari = function(params) {
        _this.failReason = "browserNotAware";
        try {
            var decodedStr = atob(params);
            params = JSON.parse(decodedStr);
        } catch (e){
            //not base 64, we ignore the error and continue
        }
        if (typeof params === 'object' && params.instanceProfile === "teams") {
            //KAF teams context
            try {
                _this.isSupported = true;
                window.open(_this.urlToLoad, "_blank");
            } catch (e) {
                _this.failReason = e;
            }
        } else {
            _this.isSupported = false;
            ifrm = document.createElement("IFRAME");
            ifrm.setAttribute("src", _this.urlToLoad);
            ifrm.style.width = "0px";
            ifrm.style.height = "0px";
            document.body.appendChild(ifrm);
        }
    };

    //Start the captureAgent appication KAppLauncher function will identify the Browser and will start the application
    // will return true if application started and false if it needs to be installed
    startApp = function (params, onlyQueryString) {
        console.log("startApp start, params:");
        console.log(params);
        if (typeof(onlyQueryString) === 'undefined') {
            onlyQueryString = false;
        }
        _this.isSupported = undefined;
        _this.failReason = "";
        var queryString = "";
        if (typeof (params) === "object") {
            queryString = $.param(params);
        }
        else {
            if (typeof (params) === "string")
                queryString = params;
            else {
                throw "params type doesn't match"
            }
        }

        if (onlyQueryString) {
            _this.urlToLoad = _this.schemeName + ':';
            _this.urlToLoad += Base64.encode(queryString);
        } else {
            _this.urlToLoad = _this.schemeName + ':';
            _this.urlToLoad += queryString;
        }

        var browserMake = getBrowserMake();
        if (browserMake === 'firefox') {
            startFireFox();
        }
        else if (browserMake === 'msie') {
            startIE();
        }
        else { //chrome / safari
            startChromeSafari(params);
        }

        if(_this.failReason !== '') {
            console.log(_this.failReason);
        }
    };

    // try to start the application
    KAppLauncher.prototype.startApp = function (params, callback, timeout, onlyQueryString) {
        if (typeof(callback) == 'undefined') var callback = false;
        if (typeof(timeout) == 'undefined') var timeout = false;
        if (typeof(onlyQueryString) == 'undefined') var onlyQueryString = false;
        startApp(params, onlyQueryString);
        if (!timeout)
            timeout = 3000;
        var stop = false;
        var tries = timeout / 100;
        var interval = setInterval(function () {
            if (_this.isSupported != undefined) {
                stop = true;
            }
            else {
                tries--;
                if (tries <= 0) {
                    _this.failReason = "timeout";
                    stop = true;
                }

            }
            if (stop) {
                if (callback)
                    callback(_this.isSupported, _this.failReason);
                clearInterval(interval);
            }
        }, 100);
    };

    KAppLauncher.prototype.downloadFile = function (downloadUrl) {
        var hiddenIFrameID = 'KAppLauncher_hiddenDownloader';
        var iframe = document.getElementById(hiddenIFrameID);
        if (iframe === null) {
            iframe = document.createElement('iframe');
        }
        iframe.id = hiddenIFrameID;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        iframe.src = downloadUrl;
    }
};