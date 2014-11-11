xjs
===

A very small JavaScript library

xjs Methods:
---
  
- **$()**: Selector Method
- **ready()**: Document Ready Method
- **create()**: creates a HTML element
- **createFragment()**: creates a document fragment
- **createText()**: creates a Text Node element
- **trim()**: String.prototype.trim() compatibility
- **indexOf()**: Array.prototype.indexOf() compatibility
- **map()**: Array.prototype.map() compatibility
- **filter()**: Array.prototype.filter() compatibility
- **size()**: get size of an Array like Object
- **keys()**: Object.keys() compatibility
- **ajax()**: AJAX functionality
- **FormData()**: FormData() compatibility
- **setCookie()**: sets a cookie
- **getCookie()**: gets a cookie
- **getQueryString()**: returns an Array like Object containing the parameters and values of the query string

Examples:
---

```js
xjs.ready(function() {
  // do something after everything is loaded
});
```

Get an element by Id
```js
var c = xjs.$("#content");
```

Add class to element
```js
xjs.$("#content").addClass("text-red");
```