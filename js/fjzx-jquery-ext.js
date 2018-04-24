/*!
 * jQuery Extention By Jam 2016-03-15
 * Released under the MIT, BSD, and GPL Licenses.
 */

//包的预定义函数
function MACRO_PACKAGE_DEFINE(packageName) {
	var names = packageName.split(".");
	var currentPackage = null;
	for (var i = 0; i < names.length; i++) {
		var name = names[i];
		if (i === 0) {
			if (!this[name])
				this[name] = {};
			currentPackage = this[name];
		} else {
			if (!currentPackage[name])
				currentPackage[name] = {};
			currentPackage = currentPackage[name];
		}
	}
}
//判断是否是IE
function isIE() { 
 if (!!window.ActiveXObject || "ActiveXObject" in window)
	 return true;
  else
	 return false;
 }
/**
 * 用来验证数据有效性的正则表达式
 */
var regexEnum = {
	integer : {
		reg : /^-?\d+$/,
		msg : "正确的格式示例：-102、0、23、88"
	}, // 整数
	integerPositive : {
		reg : /^[0-9]*[1-9][0-9]*$/,
		msg : "正确的格式示例：23、88"
	}, // 正整数
	integerNonnegative : {
		reg : /^\d+$/,
		msg : "正确的格式示例：0、23、88"
	}, // 非负整数
	double : {
		reg : /^(-?\d+)(\.\d+)?$/,
		msg : "正确的格式示例：-182.23、-97、0、25、33.15"
	}, // 浮点数
	doublePositive : {
		reg : /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/,
		msg : "正确的格式示例：25、33.15"
	}, // 正浮点数
	doubleNonnegative : {
		reg : /^\d+(\.\d+)?$/,
		msg : "正确的格式示例：0、25、33.15"
	}, // 非负浮点数
	date : {
		reg : /^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])\s+(20|21|22|23|[0-1]\d):[0-5]\d$/,
		msg : "正确的格式示例：2015-06-01 10:00"
	}
// 日期
};

/**
 * 判断字符串是否以某字符串结束
 */
String.prototype.endWith = function(str) {
	if (str == null || str == "" || this.length == 0
			|| str.length > this.length)
		return false;
	if (this.substring(this.length - str.length) == str)
		return true;
	else
		return false;
	return true;
};

/**
 * 判断字符串是否以某字符串开始
 */
String.prototype.startWith = function(str) {
	if (str == null || str == "" || this.length == 0
			|| str.length > this.length)
		return false;
	if (this.substr(0, str.length) == str)
		return true;
	else
		return false;
	return true;
};

/**
 * 将字符串中的s1全部替换为s2
 */
String.prototype.replaceAll = function(s1,s2){
	return this.replace(new RegExp(s1,"gm"),s2); 
};

/**
 * 获取指定对象在数组中的下标
 */
Array.prototype.indexOf = function(obj) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === obj) return i;
    }
    return -1;
};

/**
 * 判断数组中是否存在某元素
 */
Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
};

/**
 * 删除数组中指定元素
 */
Array.prototype.remove = function(obj) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] === obj) {
			this.splice(i, 1);
			break;
		}
	}
};

/**
 * 去除数组中重复元素，得到新数组
 */
Array.prototype.unique = function() {
	var result = [], hash = {};
	for (var i = 0, elem; (elem = this[i]) != null; i++) {
		if (!hash[elem]) {
			result.push(elem);
			hash[elem] = true;
		}
	}
	return result;
};

(function($) {
	/**
	 * Function: $.formatStr(String,Object) Date: 2009-02-28 Description: This
	 * function formats string with the attributes' value of Object. The string
	 * should contains pattern like "{text:...}",for example "My name is
	 * {text:name}" or contains pattern like "{html:...}",for example "My name
	 * is {html:name}". Example: var myName = 'Jam'; var a =
	 * {name:myName,age:22,city:'Shanghai',address:'Xuhui',color:'0xff2200'};
	 * var s = "<font color='{text:color}'>My name is {text:name}.</font>I am
	 * {text:age} years old.I live in {text:city}."; var result =
	 * $.formatStr(s,a); Finally the result is "My name is Jam.I am 22 years
	 * old.I live in Shanghai."
	 */
	$.formatStr = function(str, obj) {
		function replaceWithPattern(str, obj, isText) {
			str = str.toString();
			var pattern = /(\{text:(.*?)\})/;
			if (!isText)
				pattern = /(\{html:(.*?)\})/;
			var tmpStr = str;
			var match = pattern.exec(tmpStr);
			while (match) {
				if (obj[match[2]]) {
					var s = String(obj[match[2]]);
					if (isText) {
						s = s.replace(/</g, "&lt;");
						s = s.replace(/>/g, "&gt;");
					}
					str = str.replace(match[1], s);
				} else if (String(obj[match[2]]) == "0") {
					str = str.replace(match[1], "0");
				} else {
					str = str.replace(match[1], "");
				}
				tmpStr = tmpStr.replace(pattern, "");
				match = pattern.exec(tmpStr);
			}
			return str;
		}
		str = replaceWithPattern(str, obj, true);
		str = replaceWithPattern(str, obj, false);
		return str;
	};
	/**
	 * Function: $.jumpTo(location) Date: 2010-10-05 Description: jump to
	 * current page's refered location Example: <div id="header">header</div>
	 * $.jumpTo("#header");//this page will scroll to the $("#header")'s
	 * location
	 */
	$.jumpTo = function(location) {
		var target = $(location);
		if (!target)
			return;
		window.scrollTo(target.offset().left, target.offset().top);
	};
	$.openWindow = function(url) {
		var open = document.createElement("a");
		open.id = "openWindowTempAnchor";
		open.style.display = "none";
		open.target = '_blank';
		open.href = url;

		document.body.appendChild(open);
		if (document.all) {
			open.click();
		} else {
			window.open(url);
		}
		document.body.removeChild(open);
	};
	$.redirectTo = function(url) {
		window.location = url;
		location.href = url;
	};
	$.redirectToByPost = function(url) {
		var $form=$("<form></form>");//定义一个form表单
		$form.attr("target","");
		$form.attr("method","post");
		$form.attr("action",url);
		$form.submit();
	};
	$.closeWindow = function() {
		window.opener = null; 
		window.open('', '_self'); 
		window.close();
	};
	$.reloadWindow = function() {
		window.location.reload(true);
	};
	$.addBookMark = function(title, url) {
		if (document.all) {
			window.external.addFavorite(url, title);
		} else if (window.sidebar) {
			window.sidebar.addPanel(title, url, "");
		} else {
			alert("请使用Ctrl+D添加本页面到您的收藏夹");
		}
	};
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
	/**
	 * Function: $.copy(srcObj) Date: 2010-09-06 Description: Shallow Copy
	 * Example: var srcObj = {name:'Jam',address:'Shanghai'}; var newObj =
	 * {id:'1488'}; $.copy(newObj,srcObj); Finally the newObj is
	 * {id:'1488',name:'Jam',address:'Shanghai'}
	 */
	$.copy = function(desObj, srcObj) {
		for ( var element in srcObj) {
			desObj[element] = srcObj[element];
		}
	};
	$.cloneData = function(data){
		var dataStr = JSON.stringify(data);
		return JSON.parse(dataStr);
	},
	$.objectToArray = function(obj) {
		var array = [];
		for (elm in obj) {
			if (obj[elm] != undefined)
				array.push(elm);
		}
		return array;
	};
	$.debugObj = function(obj, caption) {
		var testArray = [];
		for (elm in obj) {
			testArray.push(elm);
		}
		if (!caption)
			caption = "auto caption";
		alert(caption + ":" + testArray.join(", "));
	};
	$.fn.enable = function() {
		this.removeAttr("disabled");
		return this;
	};
	$.fn.disable = function() {
		this.attr("disabled", "true");
		return this;
	};
	$.fn.writable = function() {
		this.removeAttr("readonly");
		return this;
	};
	$.fn.readonly = function() {
		this.attr("readonly", "readonly");
		return this;
	};
	$.fn.addDropDownBox = function(dataSource) {
		var thisBox = $(this);
		thisBox.autocomplete({
			minLength : 0,
			source : dataSource,
			select : multiSelectHandler
		});
		thisBox.click(function() {
			thisBox.autocomplete("search", "");
		});
	};
	$.getUrlParam = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return unescape(r[2]);
		return null;
	};
	/**
	 * Form tools
	 */
	$.disableFormElements = function($form) {
		$form.find("input:text,input:password,textarea").each(function() {
			$(this).readonly();
		});
		$form.find("input:radio,input:checkbox,select").each(function() {
			$(this).disable();
		});
	};
	$.enableFormElements = function($form) {
		$form.find("input:text,input:password,textarea").each(function() {
			$(this).writable();
		});
		$form.find("input:radio,input:checkbox,select").each(function() {
			$(this).enable();
		});
	};
	$.setFormData = function($form, data) {
		for (elm in data) {
			if (typeof (data[elm]) == "object") {
				var $checkbox = $form.find("input[name=" + String(elm)
						+ "]:checkbox");
				var array = $.makeArray(data[elm]);
				$checkbox.val(array);
			} else {
				var $inputTextOrTextarea = $form.find("input[fjzx_field_name="
						+ String(elm)
						+ "]:not(:radio),textarea[fjzx_field_name="
						+ String(elm) + "]");
				
				$inputTextOrTextarea.val(data[elm]);
				$form.find("input[fjzx_select_field_name=" + String(elm) + "]").attr("fjzx_select_field_value", data[elm]);
				$form.find("input[fjzx_select_tree_field_name=" + String(elm) + "]").attr("fjzx_select_tree_field_value", data[elm]);
				
				try{
					$form.find(
							"input[name='" + String(elm) + "'][value='" + data[elm]
									+ "']:radio").prop("checked", true);	
				}catch(e){
					
				}
			}
		}
	};
	
	$.setFormDataLabel = function($form, data) {
		for (elm in data) {
			if (typeof (data[elm]) == "object") {
				var $checkbox = $form.find("input[name=" + String(elm)
						+ "]:checkbox");
				var array = $.makeArray(data[elm]);
				$checkbox.val(array);
			} else {
				//console.log($form.find("label[fjzx_label_name=" + String(elm) + "]"));
				$form.find("label[fjzx_label_name=" + String(elm) + "]").text(data[elm]);
				//console.log(String(elm));
			}
		}
	};
	/*
	 * $.getFormData = function($form){ var result = {};
	 * $form.find("input:text,input:password,textarea").each(function(){ var
	 * inputText = $(this); result[inputText.attr("fjzx_field_name")] =
	 * inputText.val(); });
	 * $form.find("input.fjzx-prog-component-select").each(function(){ var
	 * inputText = $(this); result[inputText.attr("fjzx_select_field_name")] =
	 * inputText.attr("fjzx_select_field_value"); });
	 * $form.find("input:radio").each(function(){ var radio = $(this); var name =
	 * radio.attr("name"); if(!result[name]) result[name] = "";
	 * if(radio.prop("checked")){ result[name] = radio.val(); } });
	 * $form.find("input:checkbox").each(function(){ var checkbox = $(this); var
	 * name = checkbox.attr("name"); if(!result[name]) result[name] = [];
	 * if(checkbox.prop("checked")) result[name].push(checkbox.val()); });
	 * $.clearEscape(result); return result; };
	 */
	$.getFormData = function($form) {
		var dataTypes = [ "fjzx-prog-string", "fjzx-prog-boolean",
				"fjzx-prog-integer", "fjzx-prog-integer-nonnegative",
				"fjzx-prog-integer-positive", "fjzx-prog-double",
				"fjzx-prog-double-nonnegative", "fjzx-prog-double-positive",
				"fjzx-prog-date" ];
		function getDataType($elm) {
			for (var i = 0; i < dataTypes.length; i++) {
				if ($elm.hasClass(dataTypes[i]))
					return dataTypes[i];
			}
		}
		function isNullable($elm) {
			if ($elm.hasClass("fjzx-prog-not-null"))
				return false;
			else
				return true;
		}
		var result = {};
		$form.find("input:text[fjzx_field_name],input:password[fjzx_field_name],textarea[fjzx_field_name]").not(".fjzx-prog-component-select").not(".fjzx-prog-component-tree-select").each(function() {
			var inputText = $(this);
			var data = {};
			data.inputType = "text";
			data.dataType = getDataType(inputText);
			data.nullable = isNullable(inputText);
			data.tipName = inputText.attr("fjzx_field_tip_name");
			data.value = inputText.val();

			result[inputText.attr("fjzx_field_name")] = data;
		});

		$form.find("input.fjzx-prog-component-select[fjzx_field_name]").each(function(){
			var inputText = $(this);
			
			var data = {};
			data.inputType = "select";
			data.dataType = "fjzx-prog-string",
			data.nullable = isNullable(inputText);
			data.tipName = inputText.attr("fjzx_field_tip_name");
			data.value = inputText.attr("fjzx_select_field_value");
			if(!data.value)
				data.value = "";
			
			result[inputText.attr("fjzx_select_field_name")] = data;
			
			var dataSelect = {};
			dataSelect.inputType = "select";
			dataSelect.dataType = "fjzx-prog-string",
			dataSelect.nullable = true;
			dataSelect.tipName = inputText.attr("fjzx_field_tip_name");
			dataSelect.value = inputText.val();
			if(!dataSelect.value)
				dataSelect.value = "";

			result[inputText.attr("fjzx_field_name")] = dataSelect;
		});

		$form.find("input.fjzx-prog-component-tree-select[fjzx_field_name]").add($form.find("input.fjzx-prog-component-tree-explorer[fjzx_field_name]")).each(function(){
			var inputText = $(this);
			
			var data = {};
			data.inputType = "treeSelect";
			data.dataType = "fjzx-prog-string",
			data.nullable = isNullable(inputText);
			data.tipName = inputText.attr("fjzx_field_tip_name");
			data.value = inputText.attr("fjzx_select_tree_field_value");
			if(!data.value)
				data.value = "";
			
			result[inputText.attr("fjzx_select_tree_field_name")] = data;
			
			var dataSelect = {};
			dataSelect.inputType = "treeSelect";
			dataSelect.dataType = "fjzx-prog-string",
			dataSelect.nullable = true;
			dataSelect.tipName = inputText.attr("fjzx_field_tip_name");
			dataSelect.value = inputText.val();
			if(!dataSelect.value)
				dataSelect.value = "";

			result[inputText.attr("fjzx_field_name")] = dataSelect;
		});
 
		$form.find("input:radio[fjzx_field_name]").each(function() {
			var radio = $(this);
			var name = radio.attr("name");
			if (!result[name])
				result[name] = {
					dataType : "fjzx-prog-string",
					inputType : "radio",
					nullable : isNullable(radio),
					tipName : radio.attr("fjzx_field_tip_name"),
					value : ""
				};
			if (radio.prop("checked")) {
				result[name].value = radio.val();
			}
		});
		$form.find("input:checkbox[fjzx_field_name]").each(function() {
			var checkbox = $(this);
			var name = checkbox.attr("name");
			if (!result[name])
				result[name] = {
					dataType : "fjzx-prog-string",
					inputType : "checkbox",
					nullable : isNullable(checkbox),
					tipName : checkbox.attr("fjzx_field_tip_name"),
					value : []
				};
			if (checkbox.prop("checked")) {
				result[name].value.push(checkbox.val());
			}
		});
		$.clearEscape(result);
		
		return result;
	};
	$.formDataStrToRecord = function(formDataStr){
		var result = {};
		if(!formDataStr){
			alert("$.formDataStrToRecord的参数不可以为空");
			return result;
		}
		var formData = JSON.parse(formDataStr);
		for(elm in formData){
			result[elm]=formData[elm]["value"];
		}
		return result;
	};
	$.clearFormData = function($form) {
		$form.find("input:text,input:password,textarea").each(function() {
			$(this).val("");
		});
		$form.find("input[fjzx_select_field_value]").removeAttr("fjzx_select_field_value");
		
		$form.find("input[fjzx_select_tree_field_value]").removeAttr("fjzx_select_tree_field_value");
		
		$form.find("input:radio,input:checkbox").each(function() {
			$(this).prop("checked", false);
		});
	};
	$.resetFormData = function($form) {
		$form.trigger("reset");
		
		/*component select的input在触发reset时已经自动恢复了*/
		$form.find("input[fjzx_select_field_value]").each(function(){
			var $input = $(this);
			if($input.attr("fjzx_select_field_value_origin")){
				$input.attr("fjzx_select_field_value",$input.attr("fjzx_select_field_value_origin"));
			}else{
				$input.removeAttr("fjzx_select_field_value");
			}
		});

		/*component tree select的input在触发reset时已经自动恢复了*/
		$form.find("input[fjzx_select_tree_field_value]").each(function(){
			var $input = $(this);
			if($input.attr("fjzx_select_tree_field_value_origin")){
				$input.attr("fjzx_select_tree_field_value",$input.attr("fjzx_select_tree_field_value_origin"));
			}else{
				$input.removeAttr("fjzx_select_tree_field_value");
			}
		});
	};
	$.clearEscape = function(data) {
		for ( var name in data) {
			var value = data[name];
			if (typeof (value) == "string") {
				value = value.replace(/([\\])/g, "");
				data[name] = value;
			}
		}
	};
	//带兼容性的调试打印
	$.log = function(data) {
		if(isIE()){
			//字符串，数字，布尔型，函数等
			if(typeof(data)=="number" || typeof(data)=="string" || typeof(data) == "boolean" || typeof(data)=="function"){
				alert(data);
			//对象
			}else if(typeof(data)=="object"){
				var dataStr = JSON.stringify(data);
				alert(dataStr);
			}
		}else{
			console.log(data);
		}
	};
})(jQuery);
/**
 * format datetime<br />
 * eg: new Date().format('yyyy-MM-dd hh:mm:ss')//2009-10-19 16:21:30 new
 * Date().format('yyyy-MM-dd E hh:mm:ss')//2009-10-19 16:21:30 new
 * Date().format('yyyy-MM-dd EE hh:mm:ss')//2009-10-19 16:21:30 new
 * Date().format('yyyy-MM-dd EEE hh:mm:ss')//2009-10-19 16:21:30
 */
Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
		"S" : this.getMilliseconds()
	// millisecond
	};
	var week = {
		"0" : "\u65e5",
		"1" : "\u4e00",
		"2" : "\u4e8c",
		"3" : "\u4e09",
		"4" : "\u56db",
		"5" : "\u4e94",
		"6" : "\u516d"
	};
	if (/(y+)/.test(format))
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	if (/(E+)/.test(format))
		format = format
				.replace(
						RegExp.$1,
						((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f"
								: "\u5468")
								: "")
								+ week[this.getDay() + ""]);
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
	return format;
};

/*
 * String.prototype.parseDate = function() { var array = this.split(" "); var
 * arrayDate = array[0].split("-"); var year = arrayDate[0]; var month =
 * Number(arrayDate[1])-1; var date = arrayDate[2];
 * 
 * var arrayTime = array[1].split(":"); var hour = arrayTime[0]; var minute =
 * arrayTime[1];
 * 
 * return new Date(year,month,date,hour,minute); } var dateOption = {
 * changeYear: true, changeMonth: true, dateFormat: "yy-mm-dd", yearRange:
 * "2012:2030", autoSize: false, yearSuffix: "", showButtonPanel: true,
 * showWeek: true }; $.datepicker.setDefaults($.datepicker.regional["zh-CN"]);
 * 
 * function multiSelectHandler(event, ui){ var items = this.value.split(" ");
 * var map = {}; var result = []; for(var i=0;i<items.length;i++){
 * if(items[i]){ map[items[i]] = true; result.push(items[i]); } }
 * if(!map[ui.item.value]) result.push(ui.item.value); this.value =
 * result.join(" "); return false; }
 */