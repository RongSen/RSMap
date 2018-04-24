/**
 * 构造HashMap类
 * @returns
 */
function HashMap() {
	this.map = {};
}

HashMap.prototype = {
	put : function(key, value) {
		this.map[key] = value;
	},
	get : function(key) {
		if (this.map.hasOwnProperty(key)) {
			return this.map[key];
		}
		return null;
	},
	remove : function(key) {
		if (this.map.hasOwnProperty(key)) {
			return delete this.map[key];
		}
		return false;
	},
	removeAll : function() {
		this.map = {};
	},
	keySet : function() {
		var _keys = [];
		for ( var i in this.map) {
			_keys.push(i);
		}
		return _keys;
	},
	length : function(){
		var  length=0;
		for ( var i in this.map) {
			length++;
		}
		return length;
	}
};

HashMap.prototype.constructor = HashMap;

(function($) {
	$.getUUID = function() {
		var s = [];
		var hexDigits = "0123456789ABCDEF";
		for (var i = 0; i < 32; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[12] = "4";
		s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);
		var uuid = s.join("");
		return uuid;
	};
});

/**
 * 动态加载js
 */
function loadScript(url, callback){
	var script = document.createElement("script");
	script.type = "text/javascript";
	if(typeof(callback)!="undefined"){
		if(script.readyState){
			script.onreadystatechange = function(){
				if(script.readyState == "loaded" || script.readyState == "complete"){
					script.onreadystatechange = null;
					callback();
				}
			};
		}else{
			script.onload = function(){
				callback();
			};
		}
	}
	script.src = url;
	document.body.appendChild(script);
}