// Note: whenReady() function is copied from
// "Java-Script: The Definitive Guide", by David Flanagan (O’Reilly).
// Copyright 2011 David Flanagan, 978-0-596-80552-4.

var xjs = (function() {
  
  // This function returns the whenReady() function
  var _whenReady = (function() {
    var d = document, w = window;
    
    // The functions to run when we get an event
    var funcs = [];
    
    // Switches to true when the handler is triggered
    var ready = false;
    
    // The event handler invoked when the document becomes ready
    function handler(e) {
      
      // If we've already run once, just return
      if (ready) return;
      
      // If this was a readystatechange event where the state changed to
      // something other than "complete", then we're not ready yet
      if (e.type === "readystatechange" && document.readyState !== "complete")
        return;
      
      // Run all registered functions.
      // Note that we look up funcs.length each time, in case calling
      // one of these functions causes more functions to be registered.
      for(var i = 0; i < funcs.length; i++)
        funcs[i].call(document);
      
      // Now set the ready flag to true and forget the functions
      ready = true;
      funcs = null;
    }
    
    // Register the handler for any event we might receive
    if (d.addEventListener) {
      d.addEventListener("DOMContentLoaded", handler, false);
      d.addEventListener("readystatechange", handler, false);
      w.addEventListener("load", handler, false);
    }
    else if (d.attachEvent) {
      d.attachEvent("onreadystatechange", handler);
      w.attachEvent("onload", handler);
    }
    
    // Return the whenReady function
    return function whenReady(f) {
      
      // If already ready, just run it
      if (ready) f.call(document);
      
      // Otherwise, queue it for later.
      else funcs.push(f);
    }
  }());
  
  var _eventListeners = [];
  
  var _addEventListener = function(type, listener) {
    var self = this;
    var wrapper = function(e) {
      if(!e) var e = window.event;
    
      e.target = e.srcElement;
      e.currentTarget = self;
      
      if(!e.preventDefault)
        e.preventDefault = function() {
          this.returnValue = false;
          return false;
        }
      
      if(!e.stopPropagation)
        e.stopPropagation = function() {
          this.cancelBubble = true;
          return false;
        }
      
      if(listener.handleEvent) {
        listener.handleEvent(e);
      } else {
        listener.call(self, e);
      }
    }
    this.attachEvent("on" + type, wrapper);
    _eventListeners.push({
                          object: this, 
                          type: type, 
                          listener: listener, 
                          wrapper: wrapper
                        });
  }
    
    
  var _removeEventListener = function(type, listener) {
    var counter = 0;
    while (counter < _eventListeners.length) {
      var eventListener = _eventListeners[counter];
      if (eventListener.object == this 
          && eventListener.type == type 
          && eventListener.listener == listener) {
        
        this.detachEvent("on" + type, eventListener.wrapper);
        break;
      }
      ++counter;
    }
  }
  
  
  // This Function returns a static list of elements having a given className
  var _getElementsByClassName = function(obj, className) {
    if(obj == null)
      return [];
      
    if(typeof(obj.querySelectorAll) == "function")
      return obj.querySelectorAll("." + className);
  
    if(typeof(obj.getElementsByClassName) == "function") {
      var objs = obj.getElementsByClassName(className);
      var ret = [];
      for(var i = 0, len = objs.length; i < len; i++)
        ret[i] = objs[i];
        
      return ret;
    }
      
    var elements = obj.getElementsByTagName("*"), 
        ret = [], 
        regexp = new RegExp("\\s" + className + "\\s", "gi");
    for(var i = 0, len = elements.length; i < len; i++)
      if(elements[i].className.search(regexp) > -1)
        ret.push(elements[i]);
    
    return ret;
  }
  
  
  // This Function add compatibility for older browsers for Array.prototype.indexOf 
  // without changing the prototype
  var _indexOf = function(array, searchElement, fromIndex) {
    if(typeof(Array.prototype.indexOf) === "function") 
      return array.indexOf(searchElement, fromIndex);
      
    if (array == null) {
      throw new TypeError();
    }
      
    var n, k, t = Object(array),
        len = t.length >>> 0;

    if(len === 0) {
      return -1;
    }
    n = 0;
    if (arguments.length > 2) {
      n = Number(arguments[2]);
      if(n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n != 0 && n != Infinity && n != -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  }
  
  // Add compatibility to older browsers for Array.prototype.map()
  var _map = function (array, callback) {
    if(typeof(Array.prototype.map) === "function")
      return array.map(callback);
      
    var results = [];
    for(var i = 0, len = array.length; i < len; i++)
      if(i in array) results[i] = callback.call(null, array[i], i, array);
      
    return results;
  }
  
  var _filter = function(array, callback) {
  
    if(typeof(Array.prototype.filter) === "function")
      return array.filter(callback);

    if (array === void 0 || array === null)
      throw new TypeError();

    var t = Object(array);
    var len = t.length >>> 0;
    if (typeof(callback) != "function")
      throw new TypeError();

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i];
        
        if (callback.call(thisArg, val, i, t))
          res.push(val);
      }
    }

    return res;
  }
  
  // 
  var _size = function(arrayObject) {
    if(Object.keys)
      return Object.keys(arrayObject).length;
    
    if(typeof o != "object")
      return false;
      
    var i, count = 0;
    for(i in o) {
      if(o.hasOwnProperty(i)) {
        count++;
      }
    }
    
    return count;
  }
  
  // Add compatibility to older browsers for String.prototype.trim()
  var _trim = function(string) {
    if(typeof(String.prototype.trim) === "function")
      return string.trim();
      
    return string.replace(/^\s+/g, "").replace(/\s+$/g, "");
  }
  
  // Add compatibility to older browsers for FormData()
  var _FormData = function(form) {
    this.fields = {};
    this.boundary = (new Date).getTime() + Math.round(Math.random() * 1000) + Math.round(Math.random() * 1000);
    this.contentType = "multipart/form-data; boundary=" + this.boundary;
    this.eol = "\r\n";

    if (typeof form !== 'undefined') {
      for (var i = 0; i < form.elements.length; i++) {
        var e = form.elements[i];
        
        var name = (e.name !== null && e.name !== '') ? e.name : '__' + i;
        this.append(name, e);
      }
    }
    
    return this;
  }

  // Add the append() method to our FormData()
  _FormData.prototype.append = function(key, value) {
    return this.fields[key] = value;
  }
  
  // Add buildBody() method to our FormData()
  _FormData.prototype.buildBody = function() {
    var body, key, parts, value, _ref;
    parts = [];
    _ref = this.fields;
    for(key in _ref) {
      value = _ref[key];
      parts.push(this.buildPart(key, value));
    }
    body = "--" + this.boundary + this.eol;
    body += parts.join("--" + this.boundary + this.eol);
    body += "--" + this.boundary + "--" + this.eol;
    return body;
  }

  // Add buildPart() method to our FormData()
  _FormData.prototype.buildPart = function(key, value) {
    var part;
    if(typeof(value) === "string") {
      part = "Content-Disposition: form-data; name=\"" + key + "\"" + this.eol;
      part += "Content-Type: text/plain; charset=utf-8" + this.eol;
      part += this.eol;
      part += unescape(encodeURIComponent(value)) + this.eol;
    } else if (typeof(value) === typeof(File)) {
        part = "Content-Disposition: form-data; name=\"" + key + "\"; filename=\"" + value.fileName + "\"" + this.eol;
        part += "Content-Type: " + value.type + this.eol;
        part += this.eol;
        part += value.getAsBinary() + this.eol;
    } else if (typeof(value) === typeof(HTMLInputElement)) {
      if (value.type == 'file') {
        // Unsupported
      } else {
        part = "Content-Disposition: form-data; name=\"" + key + "\"" + this.eol;
        part += "Content-Type: text/plain; charset=utf-8" + this.eol;
        part += this.eol;
        part += unescape(encodeURIComponent(value.value)) + this.eol;
      }
    }
    return part;
  }

  
  // This Function returns the XMLHTTPRequest object (cross browsers)
  var _getXMLHTTPRequest = function() {
    var request;
    try {
      request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    catch(ex1) {
      try {
        request = new ActiveXObject("Msxml2.XMLHTTP");
      }
      catch(ex2) {
        request = null;
      }
    }
    if(!request && typeof(XMLHttpRequest) != "undefined") {
      request = new XMLHttpRequest();
    }
    return request;
  }
  
  var _ajax_busy = false;
  var _ajax_queue = [];

  
  // This functions handles an AJAX request
  var _ajax = function(url, type, data, callback_ok, callback_err, need_queue) {
    if(!need_queue) var need_queue = false;
    
    if(_ajax_busy && need_queue) {
    
      _ajax_queue.push([url, type, data, callback_ok, callback_err]);
    
    } else {
    
      _ajax_busy = true;
  
      var t = type.toLowerCase(), req = _getXMLHTTPRequest();
      
      if(req) {
        req.onreadystatechange = function(ajevnt) {
          if(req.readyState == 4) {
            if(req.status == 200) {
              if(callback_ok != null)
                setTimeout(function() { 
                  callback_ok.call(window, req.responseText, _ajax_queue.length > 0); 
                }, 0);
              } else {
                if(callback_err != null)
                  setTimeout(function() { 
                    callback_err.call(window, req.statusText, _ajax_queue.length > 0); 
                  }, 0);
              }
            
            _ajax_busy = false;
            if(_ajax_queue.length > 0) {
              var params = _ajax_queue[0];
              _ajax_queue.splice(0,1);
              _ajax(params[0], params[1], params[2], params[3], params[4]);
            }
          }
        }
      
        if (t == "post") {
          req.open("POST", url, true);
          
          if(typeof(data) != "object")
            req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
          else if(typeof(data.contentType) != "undefined")
            req.setRequestHeader("Content-type", data.contentType);
          
          if(typeof(data) == "object" && typeof(data.buildBody) == "function")
            req.send(data.buildBody());
          else
            req.send(data);
        
        } else if (t == "get") {
          req.open("GET", url + (data == "" ? "" : "?" + data), true);
          req.send();
        }
      }
      
    }
  }

  
  // This function sets a Cookie
  var _setCookie = function(c_name, value, exdays) {
    var exdate = new Date(), d = document;
    exdate.setDate(exdate.getDate() + exdays);
    var host = '.' + location.hostname.replace(/^www\./i, '');
    var c_value = escape(value) 
                  + ((host.length > 1) ? ";domain=" + host : "") 
                  + ";path=/" + ((exdays == null) ? "" : ";expires=" 
                  + exdate.toUTCString());
    d.cookie = escape(c_name) + "=" + c_value;
  }

  
  // This function gets a Cookie
  var _getCookie = function(c_name) {
    var d = document, 
        c_value = d.cookie, 
        c_start = c_value.indexOf(" " + c_name + "=");
    
    if (c_start == -1)
      c_start = c_value.indexOf(c_name + "=");
    
    if (c_start == -1) 
      c_value = null;
    else {
      c_start = c_value.indexOf("=", c_start) + 1;
      var c_end = c_value.indexOf(";", c_start);
      if (c_end == -1)
        c_end = c_value.length;
      
      c_value = unescape(c_value.substring(c_start, c_end));
    }
    return c_value;
  }

  
  // This functions gets the Query String
  var _getQueryString = function() {
    var w = window,
        query_string = {},
        qs = w.location.href.split("?");
    
    if(qs.length == 2) {
      qs = qs[1].split("#")[0];
      var parts = qs.split("&");
      for(var i in parts) {
        var p = parts[i].split("=");
        var a = p[0];
        var b = p[1];
        
        query_string[a] = b;
      }
    }
    return query_string;
  }
  
  
  // Check if an HTML object has the given class name
  var _hasClass = function(obj, className) {
    var classes = obj.className;
    if (!classes) return false;
    if (classes === className) return true;
    return (classes.search("\\b" + className + "\\b") != -1);
  }
  
  
  // This function extends a DOM Element / DOM Node (not the prototype)
  var _extend = function(objs) {
  
    if(typeof(objs.isVisible) == "function")
      return objs;
  
    objs.isVisible = function() {
      var list = this, list_len = list.length;
      
      if(list_len > 0)
        for(var i = 0; i < list_len; i++)
          if((list[i].offsetHeight > 0 && list[i].offsetWidth > 0) 
              || (list[i].style.display && list[i].style.display.toLowerCase() != "none")) {
            if(!list[i].style.visibility)
              return true;
              
            if(list[i].style.visibility && list[i].style.visibility.toLowerCase() != "hidden")
              return true;
          }
      
      return false;
    }
  
    objs.hide = function() {
      var list = this, list_len = list.length;
      
      if(list_len > 0) {
      
        for(var i = 0; i < list_len; i++)
          list[i].style.display = "none";
      }
      
      return list;
    }
    
    objs.show = function() {
      var list = this, list_len = list.length;
      
      if(list_len > 0) {
      
        for(var i = 0; i < list_len; i++)
          list[i].style.display = "block";
      }
      
      return list;
    }
  
    objs.removeClass = function(className) {
      var list = this, list_len = list.length;
      
      if(list_len > 0) {
        var regex  = new RegExp("\\b" + className + "\\b\\s*", "g");
        for(var i = 0; i < list_len; i++)
          list[i].className = _trim(list[i].className.replace(regex, ""));
      
      }
      return list;
    }
  
    objs.addClass = function(className) {
      
      var list = this, list_len = list.length;
      if(list_len > 0)
        for(var i = 0; i < list_len; i++) {
          if(_hasClass(list[i], className))
            return list;
          
          var classes = list[i].className;
          if (classes && classes[classes.length - 1] != " ")
            list[i].className += " " + className;
          else
            list[i].className += className;
        }
        
      return list;
    }
    
    objs.hasClass = function(className) {
      
      var list = this, list_len = list.length;
      if(list_len > 0)
        for(var i = 0; i < list_len; i++)
          if(_hasClass(list[i], className))
            return true;
        
      return false;
    }
    
    objs.on = function(evt, callback) {
      var list = this, list_len = list.length;
      
      if(list_len > 0) {
       
        for(var i = 0; i < list_len; i++) {
          var obj = list[i];
           
          if(!obj.addEventListener)
            obj.addEventListener = _addEventListener;
          
          obj.addEventListener(evt, callback, false);
        }
      }
      
      return list;
    }
    
    objs.off = function(evt, callback) {
      var list = this, list_len = list.length;
      
      if(list_len > 0) {
       
        for(var i = 0; i < list_len; i++) {
          var obj = list[i];
           
          if(!obj.removeEventListener)
            obj.removeEventListener = _removeEventListener;
          
          obj.removeEventListener(evt, callback);
        }
      }
      
      return list;
    }
    
    objs.html = function(html) {
      var list = this, list_len = list.length;
    
      if(list_len > 0)
        if(typeof(html) != "string")
          return list[0].innerHTML;
        else
          for(var i = 0; i < list_len; i++)
            list[i].innerHTML = html;
        
      return list;
    }
    
    objs.attr = function(name, value) {
      var list = this, list_len = list.length;
      
      if(list_len > 0)
        if(typeof(value) == "undefined")
          return list[0].getAttribute(name);
        else
          for(var i = 0; i < list_len; i++)
            list[i].setAttribute(name, value);
      
      return list;
    }
    
    objs.css = function(name, value) {
      var list = this, list_len = list.length;
      
      if(list_len > 0)
        if(typeof(value) == "undefined")
          return list[0].style[name];
        else
          for(var i = 0; i < list_len; i++)
            list[i].style[name] = value;
      
      return list;
    }
    
    objs.removeAttr = function(name) {
      var list = this, list_len = list.length;
      
      if(list_len > 0)
        for(var i = 0; i < list_len; i++)
          list[i].removeAttribute(name);
      
      return list;
    }
    
    objs.append = function(el) {
      var list = this, list_len = list.length, el_len = el.length;
      
      if(list_len > 0 && el_len > 0)
        for(var i = 0; i < list_len; i++)
          for(var j = 0; j < el_len; j++)
            list[i].appendChild(el[j]);
      
      return list;
    }
    
    objs.after = function(el) {
      var list = this, list_len = list.length, el_len = el.length;
      
      if(list_len > 0 && el_len > 0)
        for(var i = 0; i < list_len; i++)
          for(var j = 0; j < el_len; j++)
            list[i].parentNode.insertBefore(el[j], list[i].nextSibling);
      
      return list;
    }
    
    objs.before = function(el) {
      var list = this, list_len = list.length, el_len = el.length;
      
      if(list_len > 0 && el_len > 0)
        for(var i = 0; i < list_len; i++)
          for(var j = 0; j < el_len; j++)
            list[i].parentNode.insertBefore(el[j], list[i]);
      
      return list;
    }
    
    objs.remove = function(el) {
      var list = this, list_len = list.length, el_len = el.length;
      
      if(list_len > 0 && el_len > 0)
        for(var i = 0; i < list_len; i++)
          for(var j = 0; j < el_len; j++)
            list[i].removeChild(el[j]);
            
      return list;
    }
    
    objs.left = function(pos) {
      var list = this, list_len = list.length;
        
      if(list_len > 0)
        if(typeof(pos) != "number")
          return 0;
        else
          for(var i = 0; i < list_len; i++)
            list[i].style.left = pos + "px";
       

      return list;
    }
    
    objs.top = function(pos) {
      var list = this, list_len = list.length;
        
      if(list_len > 0)
        if(typeof(pos) != "number")
          return 0;
        else
          for(var i = 0; i < list_len; i++)
            list[i].style.top = pos + "px";
       

      return list;
    }
    
    objs.width = function(pos) {
      var list = this, list_len = list.length;
        
      if(list_len > 0)
        if(typeof(pos) != "number")
          return 0;
        else
          for(var i = 0; i < list_len; i++)
            list[i].style.width = pos + "px";
       

      return list;
    }
    
    objs.height = function(pos) {
      var list = this, list_len = list.length;
        
      if(list_len > 0)
        if(typeof(pos) != "number")
          return 0;
        else
          for(var i = 0; i < list_len; i++)
            list[i].style.height = pos + "px";
       

      return list;
    }
    
    objs.parent = function() {
      var list = this, list_len = list.length;
        
      if(list_len > 0)
        for(var i = 0; i < list_len; i++)
          if(list[i].parentNode)
            return _extend([list[i].parentNode]);
      
      return _extend([document.body]);
    }
    
    objs.val = function(value) {
      var list = this, list_len = list.length;
        
      if(list_len > 0)
        if(typeof(value) != "string")
          return list[0].value ? list[0].value : "";
        else
          for(var i = 0; i < list_len; i++)
            list[i].value = value;
      
      return list;
    }
   
    return objs;
  }

  
  // This function gets a DOM element by its ID or class or tag name and extends it
  var _$ = function(args, parent) {
    if(!parent) var parent = document;
  
    if(typeof(args) == "string") {
      
      switch(args.substr(0, 1)) {
        
        case "#":
        
          var o = parent.getElementById(args.substr(1));
          
          if(o != null)
            return _extend([o]);
          
          break;
        
        case ".":
          var objs = _getElementsByClassName(parent, args.substr(1));
          return _extend(objs);
          break;
          
        default:
          var objs = parent.getElementsByTagName(args);
          return _extend(objs);
          break;
      }
      
    } else if(typeof(args) == "object") {
      return _extend([args]);
    }
    
    return _extend([]);
  }
  
  
  // This function creates an Element and extends it
  var _create = function(el) {
    var d = document, obj = d.createElement(el);
    obj = obj ? [obj] : [];
    
    return _extend(obj);
  }
  
  // This function creates a Document Fragment and extends it
  var _createFragment = function() {
    var d = document, obj = d.createDocumentFragment();
    obj = obj ? [obj] : [];
    
    return _extend(obj);
  }
  
  // This function creates a TextNode and extends it
  var _createText = function(text) {
    var d = document, obj = d.createTextNode(text);
    obj = obj ? [obj] : [];
    
    return _extend(obj);
  }  
  
  //
  var _preventDefault = function(e) {
    if(!e) var e = window.event;

    if (e.preventDefault) e.preventDefault();
    else if (e.returnValue) e.returnValue = false;
    return false;
  }
  
  
  //
  var _stopPropagation = function(e) {
    if(!e) var e = window.event; 
    
    if(typeof(e.stopPropagation) == "function") 
      e.stopPropagation(); 
      
    if(typeof(e.cancelBubble) == "boolean") 
      e.cancelBubble = true;
      
    return false;
  }
  
  
  // This function implements the xjs AJAX request
  var _xjsAjax = function(params) {
    if(typeof(params) != "object")
      return false;
  
    if(!"url" in params)
      return false;
    
    if(!"type" in params)
      return false;
      
    if(!"data" in params)
      params.data = "";
      
    if(!"success" in params)
      params.success = null;
    
    if(!"error" in params)
      params.error = null;
      
    if(!"queue" in params)
      params.queue = false;
  
    return _ajax(params["url"], 
                  params["type"], 
                  params["data"], 
                  params["success"], 
                  params["error"], 
                  params["queue"]
                );
  }

  
  // Return everything needs the XJS
  return {
    ready          : _whenReady,
    $              : _$,
    create         : _create,
    createFragment : _createFragment,
    createText     : _createText,
    trim           : _trim,
    indexOf        : _indexOf,
    map            : _map,
    filter         : _filter,
    size           : _size,
    ajax           : _xjsAjax,
    FormData       : _FormData,
    setCookie      : _setCookie,
    getCookie      : _getCookie,
    getQueryString : _getQueryString
  }
  
})();