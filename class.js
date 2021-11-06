~(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.Base64 = factory();
  }
}(this, function() {
    'use strict';   
    function Base64() {
        this._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    }
        Base64.prototype.encode = function (input) {
        var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
        input = this._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }
        return output;
    };
    Base64.prototype.decode = function (input) {
        var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = this._utf8_decode(output);
        return output;
    };
    Base64.prototype._utf8_encode = function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    Base64.prototype._utf8_decode = function (utftext) {
        var string = "", i = 0, c = 0, c1 = 0, c2 = 0, c3 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    };
    var Base64 = new Base64();
    return Base64;
}));
  function encode(code){
	 'use strict'; 
     var c= String.fromCharCode(code.charCodeAt(0)+code.length);
	 for(var i=1;i<code.length;i++){	     
	   c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));		 
     }
       return escape(c);
  }
  function decode(code){	  
	  'use strict';   
	   code=unescape(code);
	   var c= String.fromCharCode(code.charCodeAt(0)-code.length);
	   for(var i=1;i<code.length;i++){	     
	   c+=String.fromCharCode(code.charCodeAt(i)-code.charCodeAt(i-1));		 
     }
      return c ;
   } 
 function strdecode(string,encode,key){
	   'use strict';   
	   encode=encode||false; key=key||'xyplay';
	   var len=key.length; var code=''; var k='';
	   if(encode){string=Base64.encode(string);}else{string=Base64.decode(string);};
	   for(var i=0;i<string.length;i++){		   
	      k=i % len;  
		 code+= String.fromCharCode(string.charCodeAt(i)^key.charCodeAt(k));		   
	   };
	   if(encode){return Base64.encode(code);}else{return Base64.decode(code);};
    }
function _GET(name,isurl) { 
    isurl=isurl || false;
	var word="(^|&)" + name + "=([^&]*)(&|$)";
	if(isurl){word="(^|&)" + name + "=(.*?)$";}	
	var reg = new RegExp(word, "i");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) {
        return decodeURI(r[2]);
    };
    return "";
}
 function removeHTMLTag(str,all){      
             var str=str.replace(/&quot;/g, '"');  
             str=str.replace(/\+/g," ");          
            str = str.replace(/[ | ]*\n/g,'\n'); 
            str = str.replace(/\n[\s| | ]*\r/g,'\n'); 	
            //str=str.replace(/ /ig,'');    
            if(all){str = str.replace(/<\/?.*?$/g,'');}else{str.replace(/<[^>]+>/g,"");}
            return str;
    };
function isurl(flag, word,split) {
    if (!flag || !word) {
        return false;
    }
    var strs = new Array();	
	spli=!split ? "|":split;
	strs = flag.split(split);
    for (var i = 0; i < strs.length; i++) {
        if (word.indexOf(strs[i]) > -1) {
            return true;
        }
    }
    return false;
};
function setCookie(c_name, value, expireHours) {
    var exdate = new Date();
    exdate.setHours(exdate.getHours() + expireHours);
    document.cookie = c_name + "=" + escape(value) + ((expireHours === null) ? "" : ";expires=" + exdate.toGMTString());
}
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start !== -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end === -1) {
                c_end = document.cookie.length;
            };
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return '';
}
function is_mobile() {
    var regex_match = /(nokia|iphone|android|motorola|micromessenger|^mot-|softbank|foma|docomo|kddi|up.browser|up.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte-|longcos|pantech|gionee|^sie-|portalmmm|jigs browser|hiptop|^benq|haier|^lct|operas*mobi|opera*mini|320x320|240x320|176x220)/i;
    var u = navigator.userAgent;
    if (null === u) {
        return true;
    }
    var result = regex_match.exec(u);
    if (null === result) {
        return false;
    } else {
        return true;
    }
};
function is_time(time){
      if("undefined" !==typeof time && time!==null){
       var r = (/^(\d+)(.*?)$/i).exec(time);
       if(!r|| r.length < 2){return 0;}
       switch(r[2]){ 
          case "d":                   
            return r[1]*24*60*60*1000;
           case "h":                   
            return r[1]*60*60*1000; 
          case "m":                   
             return r[1]*60*1000;
          case "s":                   
             return r[1]*1000;       
          case "ms":                   
             return r[1];        
         default:  
              return r[1]*1000;  
       }    
        }else{
           return -1; 
       }
  }
function random(min, max) {
     min = Math.ceil(min);
     max = Math.floor(max);
     return Math.floor(Math.random() * (max - min + 1)) + min;
 }
 function random_rgb(min,max){
	 min=min||0;
	 max=max||256;
     var r=random(min,max);
     var g=random(min,max);
     var b=random(min,max);
     return "rgb("+r+','+g+','+b+")";
    } 