/*!
 * jQuery UI Framework By Jam 2016-04-07
 */

MACRO_PACKAGE_DEFINE("fjzx.ui");
//fjzx.ui具有的方法一览
fjzx.ui.functionList = {
	//创建List的工厂函数
	createList: function(selector,onCreateCallback){},
	//创建CachedList的工厂函数
	createCachedList: function(selector,onCreateCallback){},
	//创建FormPage的工厂函数
	createFormPage: function(selector,onCreateCallback){},
	//创建FormDialog的工厂函数
	createFormDialog: function(selector,onCreateCallback,option){},
	//创建下拉框组件的工厂函数
	createComponentSelect: function($componentSelect){},
	//创建TreeSelect组件的工厂函数
	createComponentTreeSelect: function($componentRadio){},
	//获取下拉框组件
	getComponentSelect: function(fjzxSelectFieldName){},
	//获取树形下拉框组件
	getComponentTreeSelect: function(fjzxSelectTreeFieldName){},
	//创建iframe标签页，主要用于菜单
	createFrameTabs: function(selector){},
	//创建page标签页，主要用于主从表
	createPageTabs: function(selector){},
	//检查$container中是否有不支持的html元素，$container是一个jQuery选择集
	validateElement: function($container){},
	//检查页面所有的表单元素都必须符合fjzx的编码规范
	validateFjzxFormField: function(){},
	//检查给定的selector字符串对应的jQuery选择集在containerSelector对应的jQuery选择集中是否存在，如果containerSelector不存在，则检查全页面
	checkSelectorUnique: function(selector,containerSelector){},
	//检查给定的变量是不是合法的函数变量
	checkValidFunction: function(callback){},
	//通用消息显示框
	showMessageCommon: function(message,type,title,onCloseCallback){},
	//提示框
	showMessage: function(message,onCloseCallback){},
	//警告提示框
	showMessageWarning: function(message,onCloseCallback){},
	//出错提示框
	showMessageError: function(message,onCloseCallback){},
	//确认框
	showConfirm: function(message){},
	//登录框
	showLoginDialog: function(onLoginSuccessCallback){},
	//TreeSelect选择框
	showTreeSelectDialog: function(){},
	//高拍仪扫描框
	showScanner: function(){},
	//RFID读取框
	showRfidReadDialog: function(){},
	//RFID写入框
	showRfidWriteDialog: function(){},
	//附件管理框
	showAttachmentManager: function(){},
	//扫描文件管理框
	showScannerFileManager: function(){},
	//验证所有数据有效性
	validateDataType: function($container){},
	//验证不可以为空
	validateNotNull: function($container){},
	//初始化带查询和分页的下拉select组件
	initAllComponentSelect: function(){},
	//关闭所有下拉select组件
	closeAllComponentSelect: function(){},
	//初始化所有日期组件
	initAllComponentDate: function(){},
	//初始化所有TreeSelect组件
	initAllComponentTreeSelect: function(){},
	//初始化所有TreeExplorer组件
	initAllComponentTreeExplorer: function(){},
	//检查主表是否有数据,没有数据则跳转到第一个页签
	checkHeaderHasData: function(gotoPath,headerList,message,tabs){}
};
//fjzx.ui方法实现
fjzx.ui = {
	zIndexForAllDialogs: 1000, 
	componentSelectList: [],
	componentTreeSelectList: [],
	//创建List的工厂函数
	createList: function(selector,onCreateCallback){
		return new fjzx.ui.TableList(selector,onCreateCallback);
	},
	//创建CachedList的工厂函数
	createCachedList: function(selector,onCreateCallback){
		return new fjzx.ui.CachedTableList(selector,onCreateCallback);
	},
	//创建FormPage的工厂函数
	createFormPage: function(selector,onCreateCallback){
		return new fjzx.ui.FormPage(selector,onCreateCallback);
	},
	//创建FormDialog的工厂函数
	createFormDialog: function(selector,onCreateCallback,option){
		return new fjzx.ui.FormDialog(selector,onCreateCallback,option);
	},
	//创建下拉框组件的工厂函数
	createComponentSelect: function($componentSelect){
		return new fjzx.ui.ComponentSelect($componentSelect);
	},
	//创建TreeSelect组件的工厂函数
	createComponentTreeSelect: function($componentRadio){
		return new fjzx.ui.ComponentTreeSelect($componentRadio);
	},
	//创建TreeExplorer组件的工厂函数
	createComponentTreeExplorer: function($componentRadio){
		return new fjzx.ui.ComponentTreeExplorer($componentRadio);
	},
	//获取下拉框组件
	getComponentSelect: function(fjzxSelectFieldName){
		for(var i=0;i<this.componentSelectList.length;i++){
			var componentSelect = this.componentSelectList[i];
			if(componentSelect.name===fjzxSelectFieldName)
				return componentSelect.instance;
		}
		return null;
	},
	//获取下拉框组件
	getComponentTreeSelect: function(fjzxSelectTreeFieldName){
		for(var i=0;i<this.componentTreeSelectList.length;i++){
			var componentTreeSelect = this.componentTreeSelectList[i];
			if(componentTreeSelect.name===fjzxSelectTreeFieldName)
				return componentTreeSelect.instance;
		}
		return null;
	},
	//创建iframe标签页，主要用于菜单
	createFrameTabs: function(selector){
		return new fjzx.ui.FrameTabs(selector);
	},
	//创建page标签页，主要用于主从表
	createPageTabs: function(selector){
		return new fjzx.ui.PageTabs(selector);
	},
	//检查$container中是否有不支持的html元素，$container是一个jQuery选择集
	validateElement: function($container){
		var $inputs = $container.find("input[type=button],input[type=submit],input[type=reset],select");
		if($inputs.size()>0){
			alert("本框架不支持如下元素：\ninput[type=button]\ninput[type=submit]\ninput[type=reset]\nselect\n\n请使用如下元素：\nbutton\nbutton[type=submit]\nbutton[type=reset]\nfjzx-select");
		}
	},
	//检查页面所有的表单元素都必须符合fjzx的编码规范
	validateFjzxFormField: function(){
		var dataTypes = [
			 "fjzx-prog-string"
			 ,"fjzx-prog-boolean"
			 ,"fjzx-prog-integer"
			 ,"fjzx-prog-integer-nonnegative"
			 ,"fjzx-prog-integer-positive"
			 ,"fjzx-prog-double"
			 ,"fjzx-prog-double-nonnegative"
			 ,"fjzx-prog-double-positive"
			 ,"fjzx-prog-date"];
		function hasFjzxDataTypeClass($item){
			for(var i=0;i<dataTypes.length;i++){
				var type = dataTypes[i];
				if($item.hasClass(type)){
					return true;
				}
			}
			return false;
		}
		function hasFjzxDataTipName($item){
			if($item.attr("fjzx_field_tip_name"))
				return true;
			else
				return false;
		}
		$("input[fjzx_field_name]").each(function(){
			var $thisInput = $(this);
			if(!hasFjzxDataTypeClass($thisInput)){
				alert("input[fjzx_field_name="+$thisInput.attr("fjzx_field_name")+"]没有指定数据类型");
			}
		});
		$("input[fjzx_field_name]").each(function(){
			var $thisInput = $(this);
			if(!hasFjzxDataTipName($thisInput)){
				alert("input[fjzx_field_name="+$thisInput.attr("fjzx_field_name")+"]没有设置属性\"fjzx_field_tip_name\"");
			}
		});
	},
	//检查给定的selector字符串对应的jQuery选择集在containerSelector对应的jQuery选择集中是否存在，如果containerSelector不存在，则检查全页面
	checkSelectorUnique: function(selector,containerSelector){
		if(containerSelector){
			var $containerSelector = $(containerSelector);
			if($containerSelector.size()<=0){
				alert("容器\""+containerSelector+"\"不存在");
				return false;
			}
			if($containerSelector.size()>1){
				alert("容器\""+containerSelector+"\"存在个数大于1");
				return false;
			}
			
			var $selector = $containerSelector.find(selector);
			if($selector.size()<=0){
				alert("容器\""+containerSelector+"\"的元素\""+selector+"\"不存在");
				return false;
			}
			if($selector.size()>1){
				alert("容器\""+containerSelector+"\"的元素\""+selector+"\"的存在个数大于1");
				return false;
			}
		}else{
			var $selector = $(selector);
			if($selector.size()<=0){
				alert("元素\""+selector+"\"不存在");
				return false;
			}
			if($selector.size()>1){
				alert("元素\""+selector+"\"存在个数大于1");
				return false;
			}
		}
		return true;
	},
	//检查给定的变量是不是合法的函数变量
	checkValidFunction: function(callback){
		if(typeof(callback)!="function")
			alert("不是合法的函数");
	},
	//通用消息显示框
	showMessageCommon: function(message,messageType,title,onCloseCallback){
		//防止重复弹出弹出框
		if($("div.fjzx-prog-body").text()==message || $("div.fjzx-prog-body").html()==message)
			return;
		
		if(onCloseCallback)
			this.checkValidFunction(onCloseCallback);
		if(!message){
			alert("fjzx.ui.alert方法调用不正确，正确格式如下：\nfjzx.ui.alert(message,[\"text\"|\"html\"],[title]);");
			return;
		}
		
		var $dialog = $("<div class='modal fade'>\
			<div class='modal-header'>\
				<button type='button' class='close' data-dismiss='modal'>×</button>\
				<h3 class='fjzx-prog-title'></h3>\
			</div>\
			<div class='fjzx-prog-body modal-body'>\
			</div>\
			<div class='modal-footer'>\
				<button class='fjzx-prog-close btn' aria-hidden='true'><span class='fa-eye-open mr3'></span>我知道了</button>\
			</div>\
		</div>");
		$("body").append($dialog);

		this.zIndexForAllDialogs = this.zIndexForAllDialogs + 100;
		$dialog.css("z-index",this.zIndexForAllDialogs);
		
		if(!messageType || messageType==="text"){
			$dialog.find(".fjzx-prog-body").text(message);
		}else if(messageType==="html"){
			$dialog.find(".fjzx-prog-body").html(message);
		}else if(messageType){
			alert("无法识别的type参数，应为\"text\"或者\"html\"之一");
			return;
		}
		$dialog.find(".fjzx-prog-title").text(title);
		$dialog.find(".fjzx-prog-close").click(function(){
			$dialog.modal("hide").remove();
			if(onCloseCallback)
				onCloseCallback();
		});
		
		var width = 600;
		$dialog.css({
			width: width+"px",
			"margin-left": (-width/2)+"px",
			"top":"50%",
			"z-index":this.zIndexForAllDialogs
		});
		var height = -($dialog.height()/2);
		$dialog.css("margin-top",height+"px");

		$dialog.modal({show:false, backdrop: 'static', keyboard: false});
		$dialog.on("shown",function(){
			$dialog.find("button.fjzx-prog-close").focus();
		});
		$dialog.modal("show");
	},
	//提示框
	showMessage: function(message,onCloseCallback){
		fjzx.ui.showMessageCommon(message,"text","提示",onCloseCallback);
	},
	//警告提示框
	showMessageWarning: function(message,onCloseCallback){
		var html = $.formatStr("<font color='red'>{html:message}</font>",{message:message});
		fjzx.ui.showMessageCommon(html,"html","警告",onCloseCallback);
	},
	//出错提示框
	showMessageError: function(message,onCloseCallback){
		var html = $.formatStr("<font color='red'>{html:message}</font>",{message:message});
		fjzx.ui.showMessageCommon(html,"html","出错了",onCloseCallback);
	},
	//确认框
	showConfirm: function(message,onConfirmCallback,onCancellCallback){
		if(!message || !onConfirmCallback){
			alert("fjzx.ui.alert方法调用不正确，正确格式如下：\nfjzx.ui.alert(message,[\"text\"|\"html\"],[title]);");
			return;
		}
		this.checkValidFunction(onConfirmCallback);
		if(onCancellCallback)
			this.checkValidFunction(onCancellCallback);
		
		var $dialog = $("<div class='modal fade' id='"+$.getUUID()+"'>\
			<div class='modal-header'>\
				<button type='button' class='fjzx-prog-close close'>×</button>\
				<h3 class='fjzx-prog-title'></h3>\
			</div>\
			<div class='fjzx-prog-body modal-body'>\
			</div>\
			<div class='modal-footer'>\
				<button class='fjzx-prog-cancel btn'><span class='fa-remove mr3'></span>取消</button>\
				<button class='fjzx-prog-ok btn btn-primary'><span class='fa-ok fa-white mr3'></span>确定</button>\
			</div>\
		</div>");
		$("body").append($dialog);
		
		$dialog.find(".fjzx-prog-body").html(message);
		$dialog.find(".fjzx-prog-title").text("需要您的确认");
		$dialog.find(".fjzx-prog-ok").click(function(){
			$dialog.modal("hide").remove();
			onConfirmCallback($dialog);
		});
		$dialog.find(".fjzx-prog-close").click(function(){
			$dialog.modal("hide").remove();
			if(onCancellCallback)
				onCancellCallback();
		});
		$dialog.find(".fjzx-prog-cancel").click(function(){
			$dialog.modal("hide").remove();
			if(onCancellCallback)
				onCancellCallback();
		});

		this.zIndexForAllDialogs = this.zIndexForAllDialogs + 100;
		$dialog.css("z-index",this.zIndexForAllDialogs);
		
		var width = 600;
		$dialog.css({
			width: width+"px",
			"margin-left": (-width/2)+"px",
			"top":"50%",
			"z-index":this.zIndexForAllDialogs
		});
		var height = -($dialog.height()/2);
		$dialog.css("margin-top",height+"px");

		$dialog.modal({show:false, backdrop: 'static', keyboard: false});
		$dialog.on("shown",function(){
			$dialog.find("button.fjzx-prog-cancel").focus();
		});
		$dialog.modal("show");
	},
	//登录框
	showLoginDialog: function(onLoginSuccessCallback){
		if($("div.dynamic-login-box").length>0)
			return;
		var $dialog = $("<div class='modal fade' id='"+$.getUUID()+"' style='width: 500px;'>\
			<form>\
				<div class='modal-header'>\
					<h3 class='fjzx-prog-title'>登录</h3>\
				</div>\
				<div class='fjzx-prog-body modal-body' style='height: 150px;'>\
					<div class='fjzx-prog-message' style='color: red;font-size: 16px;margin: 15px 0px 20px 0px;text-align: center;'>您没有登录或者登录已过期，请重新登录</div>\
					<div class='wrapper'>\
						<div class='dynamic-login-box'>\
							<div class='login'>\
								<div class='control-group'>\
									<input class='form-control fjzx-prog-string fjzx-prog-not-null' fjzx_field_name='loginId' fjzx_field_tip_name='用户名' placeholder='用户名'  type='text' />\
									<span class='fa-user'></span>\
								</div>\
								<div class='control-group'>\
									<input class='form-control fjzx-prog-string fjzx-prog-not-null' fjzx_field_name='password' fjzx_field_tip_name='密码' placeholder='密码'  type='password' />\
									<span class='fa-lock'></span>\
								</div>\
							</div>\
							<div class='position' style='padding-left: 20px;padding-right: 20px;display: none;'>\
							</div>\
						</div>\
					</div>\
				</div>\
				<div class='modal-footer' style='text-align: center;'>\
					<button type='submit' class='fjzx-prog-ok btn btn-primary'><span class='fa-user fa-white mr3'></span>登录</button>\
				</div>\
			</form>\
		</div>");
		$("body").append($dialog);
		
		var loginMode = "normal";
		
		var $message = $dialog.find("div.fjzx-prog-message");
		var $inputPassword = $dialog.find("input[fjzx_field_name=password]");
		var $login = $dialog.find("div.login");
		var $position = $dialog.find("div.position");
		
		var $form = $dialog.find("form");
		$form.submit(function(e){
			e.preventDefault();
			
			if(!fjzx.ui.validateDataType($(this))){
				return;
			}
			
			var formData = $.getFormData($form);
			
			function reloadWindow(){
				if(window.parent){
					window.parent.reloadWindow();
				}else{
					window.reloadWindow();
				}
			}
			
			if(loginMode==="normal"){
				User.login(
					JSON.stringify(formData),
					function(data){
						if(data.code==="ok"){
							if(!data.needSelectPosition){
								$dialog.modal("hide").remove();
								if(typeof(onLoginSuccessCallback)==="function"){
									onLoginSuccessCallback();
								}
								if(data.loginIdChanged){
									reloadWindow();
								}
							}else{
								$message.hide().text("请选择岗位").fadeIn(500);
								$login.hide();
								$position.show();
								
								$position.empty();
								var $ul = $("<ul></ul>");
								var template = "<li><input type='radio' value='{text:id}' id='{text:elmId}' name='rdoSelectPosition'/><label for='{text:elmId}'>{text:code}</label></li>";
								var positionList = data.positionList;
								for(var i=0;i<positionList.length;i++){
									var position = positionList[i];
									var elmId = $.getUUID();
									var $item = $($.formatStr(template,{id:position.id,code:position.code,elmId:elmId}));
									$ul.append($item);
								}
								$ul.find("input:radio:first").prop("checked","true");
								$position.append($ul);
								loginMode = "withPosition";
							}
						}else{
							$message.hide().text(data.msg).fadeIn(500);
							$inputPassword.focus().select();
						}
					},
					function(){
					}
				);
			}else{
				var positionId = $position.find("input:radio:checked").val();
				User.loginWithPosition(
					positionId,
					JSON.stringify(formData),
					function(data){
						if(data.code==="ok"){
							$dialog.modal("hide").remove();
							if(typeof(onLoginSuccessCallback)==="function"){
								onLoginSuccessCallback();
							}
							if(data.loginIdChanged){
								reloadWindow();
							}
						}else{
							$message.hide().text(data.msg).fadeIn(500);
							$inputPassword.focus().select();
						}
					},
					function(){
					}
				);
			}
		});

		this.zIndexForAllDialogs = this.zIndexForAllDialogs + 100;
		$dialog.css("z-index",this.zIndexForAllDialogs);
		
		var width = 500;
		$dialog.css({
			width: width+"px",
			"margin-left": (-width/2)+"px",
			"top":"50%",
			"z-index":this.zIndexForAllDialogs
		});
		var height = -($dialog.height()/2);
		$dialog.css("margin-top",height+"px");

		$dialog.modal({show:false, backdrop: 'static', keyboard: false});
		$dialog.on("shown",function(){
			$dialog.find("input[fjzx_field_name=loginId]").focus();
		});
		$dialog.modal("show");
	},
	//初始化TreeSelect单例界面
	_initTreeSelectDialog: function(){
		if(this._treeRadioDialogInitialized)
			return;
		this._$treeDialog = $("<div id='_inner_fjzx-prog-tree-select-dialog' class='modal fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>\
			<div class='modal-header'>\
				<button type='button' class='fjzx-prog-close close' aria-hidden='true'>×</button>\
				<h3 id='_inner_tree_dialog_caption'>选择</h3>\
			</div>\
			<div class='modal-body' style='min-height: 300px;max-height: 300px;'>\
				<ul id='_inner_tree_radio' class='ztree'></ul>\
			</div>\
			<div class='modal-footer'>\
				<button class='fjzx-prog-cancel btn'><span class='fa-remove mr6'></span>取消</button>\
				<button class='fjzx-prog-ok btn btn-primary'><span class='fa-save mr6'></span>确定</button>\
			</div>\
		</div>");
		$("body").append(this._$treeDialog);
		this._$treeList = this._$treeDialog.find("ul#_inner_tree_radio");

		var options = {confirmCancel: false};
		this._treeRadioFormDialog = fjzx.ui.createFormDialog(
			"div#_inner_fjzx-prog-tree-select-dialog",
			function($container){
				
			},
			options
		);
		var thisTreeRadioFormDialog = this._treeRadioFormDialog;
		this._treeRadioFormDialog.find("button.fjzx-prog-ok").setAction(
			function(record,formDataStr,$container){
				if(typeof(thisTreeRadioFormDialog._onConfirmCallback)==="function"){
					var zTree = $.fn.zTree.getZTreeObj("_inner_tree_radio");
					
					var nodesChecked = zTree.getCheckedNodes(true);
					var nodesUnChecked = zTree.getCheckedNodes(false);
					
					var recordsChecked = [];
					for(var i=0;i<nodesChecked.length;i++){
						var recordChecked = {};
						$.copy(recordChecked,nodesChecked[i]);
						recordsChecked.push(recordChecked);
					}
					
					var recordsUnChecked = [];
					for(var i=0;i<nodesUnChecked.length;i++){
						var recordUnChecked = {};
						$.copy(recordUnChecked,nodesUnChecked[i]);
						recordsUnChecked.push(recordUnChecked);
					}
					
					if(thisTreeRadioFormDialog._onConfirmCallback(recordsChecked,recordsUnChecked)){
						thisTreeRadioFormDialog.close();
					}
				}else
					thisTreeRadioFormDialog.close();
			}
		);
		this._treeRadioFormDialog.find("button.fjzx-prog-cancel").setActionClose(function(){
			if(typeof(thisTreeRadioFormDialog._onCancelCallback)==="function"){
				thisTreeRadioFormDialog._onCancelCallback();
			}
		});
		
		this._treeRadioDialogInitialized = true;
	},
	/*TreeSelect选择框*/
	//selectType：选择Tree的id
	//extraParams程序员额外提供的参数，框架原样传给存储过程
	//options选项，{
	//                        caption:"xxx",
	//                        chkStyle: "checkbox",//"radio"
	//                        radioType: "all",//chkStyle="radio"时起作用，"all"整棵树单选一个，"level"各级内单选一个
	//                        chkboxType: {"Y":"ps","N":"ps"},//Y表示选中，N表示取消选中，"p"表示对父级联动状态，"s"表示对子级联动状态
	//                      }
	//onConfirmCallback监听确定按钮
	//onCancelCallback监听取消按钮
	//onFetchData监听获取数据事件
	showTreeSelectDialog: function(selectType,extraParams,options,checkedValuesStr,onConfirmCallback,onCancelCallback,onFetchData){
		this._initTreeSelectDialog();
		
		var thisComponent = this;
		this._treeRadioFormDialog._onConfirmCallback = onConfirmCallback;
		this._treeRadioFormDialog._onCancelCallback = onCancelCallback;
		if(options.caption){
			this._$treeDialog.find("#_inner_tree_dialog_caption").text(options.caption);
		}
		SystemCode.getComponentTreeList(
			selectType,
			extraParams,
			function(data){
				if(typeof(onFetchData)==="function")
					onFetchData(data.list);
				var checkedValues = checkedValuesStr.split(",");
				
				var checkedMap = {};
				for(var i=0;i<checkedValues.length;i++){
					checkedMap[checkedValues[i]] = true;
				}
				
				for(var i=0;i<data.list.length;i++){
					var record = data.list[i];
					if(checkedMap[record.id]){
						record.checked = true;
					}else{
						record.checked = false;
					}
				}
				
				var setting = {
					view: {
						selectedMulti: false
					},
					edit: {
						enable: false,
						editNameSelectAll: true,
						showRemoveBtn: false,
						showRenameBtn: false
					},
					data: {
						simpleData: {
							enable: true
						}
					},
					check: {
						chkStyle: "radio",
						radioType: "all",
						chkboxType: {"Y":"ps","N":"ps"},
						enable: true
					}
				};
				if(options)
					$.copy(setting.check,options);
				var zTree = $.fn.zTree.init(thisComponent._$treeList, setting, data.list);
				if(typeof(options.expandAll)=="undefined")
					options.expandAll = true;
				zTree.expandAll(options.expandAll);
				thisComponent._treeRadioFormDialog.open(null,function(){
					
				});
			},
			function(){
				
			}
		);
	},
	//初始化TreeExplorer单例界面
	_initTreeExplorerDialog: function(extraParams,isMulSelect){
		if(this._treeExplorerDialogInitialized)
			//return;
			this._$treeDialog.remove();
		//判断是人员树还是网格树
		var dialogTitle = "选择人员";
		if(extraParams.indexOf("DEPARTMENT")>-1)
			dialogTitle = "选择网格";
		this._$treeDialog = $("<div id='_inner_fjzx-prog-tree-explorer-dialog' class='modal fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>\
			<div class='modal-header'>\
				<button type='button' class='fjzx-prog-close close' aria-hidden='true'>×</button>\
				<h3 id='_inner_tree_dialog_caption'>"+dialogTitle+"</h3>\
			</div>\
			<div class='search-form-box'>\
				<div class='query-form search-form-list-layout c'>\
					<ul class='fjzx-prog-query-form-list ca'>\
						<li style='padding-top: 10px;'><span class='control-label'>查询条件</span><div class='controls' style='width: 100%;padding-top: 10px;'>\
							<input class='_inner_fjzx-prog-query-text' type='text' />\
							<button class='fjzx-prog-button-query btn btn-primary' type='submit'><span class='fa-search mr6'></span>查询</button>\
						</div></li>\
					</ul>\
				</div>\
			</div>\
			<div class='fjzx-prog-tree-bread'>\
				<ul class='fjzx-prog-tree-bread-list'>\
					<li><label>路径</label></li>\
				</ul>\
				<div style='clear: both;'></div>\
			</div>\
			<div class='modal-body' style='min-height: 400px;max-height: 400px;'>\
				<div class='wrap-overflow' style='width: 68%;float: left;'>\
					<table class='fjzx-prog-tree-explorer-list table'>\
						<thead><tr><th>名称</th><th style='width: 100px;'>选择</th></tr></thead>\
						<tbody>\
						</tbody>\
					</table>\
				</div>\
				<div class='wrap-overflow' style='width: 30%;float: left;margin-left: 2%;'>\
					<table class='fjzx-prog-tree-explorer-select-list table'>\
						<thead><tr><th>已选择</th><th style='width: 80px;'>删除</th><tr></thead>\
						<tbody>\
						</tbody>\
					</table>\
				</div>\
			</div>\
			<div class='modal-footer'>\
				<div class='fjzx-prog-dropdown-select-pagination pagination pagination-small' style='width: 100px;text-align: left;float: left;'>\
					<ul>\
						<li><a class='fjzx-prog-prev' href='javascript: void(0);'>&laquo;</a></li><!--上一页-->\
						<li><a class='fjzx-prog-next' href='javascript: void(0);'>&raquo;</a></li><!--下一页-->\
					</ul>\
				</div>\
				<button class='fjzx-prog-cancel btn'><span class='fa-remove mr6'></span>取消</button>\
				<button class='fjzx-prog-ok btn btn-primary'><span class='fa-save mr6'></span>确定</button>\
			</div>\
		</div>");
		$("body").append(this._$treeDialog);

		var thisComponent = this;
		
		this._$treeExplorerQueryText = this._$treeDialog.find("input._inner_fjzx-prog-query-text");
		this._$treeExplorerTreeBreadList = this._$treeDialog.find("ul.fjzx-prog-tree-bread-list");
		this._$treeExplorerListContainer = this._$treeDialog.find("table.fjzx-prog-tree-explorer-list tbody");
		this._$treeExplorerBtnQuery = this._$treeDialog.find("button.fjzx-prog-button-query");
		this._$treeExplorerBtnPrev = this._$treeDialog.find("a.fjzx-prog-prev");
		this._$treeExplorerBtnNext = this._$treeDialog.find("a.fjzx-prog-next");
		this._$treeExplorerSelectList = this._$treeDialog.find("table.fjzx-prog-tree-explorer-select-list tbody");
		
		function submitQuery(){
			thisComponent._treeExplorerQueryPage = 1;
			thisComponent._treeExplorerFormDialog._reloadData();
		}
		
		this._$treeExplorerQueryText.keydown(function(e){
			if(event.keyCode == "13"){
				submitQuery();
			}
		});
		this._$treeExplorerBtnQuery.click(function(){
			submitQuery();
		});
		
		var options = {confirmCancel: false};
		this._treeExplorerFormDialog = fjzx.ui.createFormDialog(
			"div#_inner_fjzx-prog-tree-explorer-dialog",
			function($container){
				
			},
			options
		);
		var thisTreeRadioFormDialog = this._treeExplorerFormDialog;
		this._treeExplorerFormDialog.find("button.fjzx-prog-ok").setAction(
			function(record,formDataStr,$container){
				if(typeof(thisTreeRadioFormDialog._onConfirmCallback)==="function"){
					var dataArray = [];
					thisComponent._$treeExplorerSelectList.find("tr").each(function(){
						dataArray.push($(this).data());
					});
					if(thisTreeRadioFormDialog._onConfirmCallback(dataArray)){
						thisTreeRadioFormDialog.close();
					}
				}else
					thisTreeRadioFormDialog.close();
			}
		);
		this._treeExplorerFormDialog.find("button.fjzx-prog-cancel").setActionClose(function(){
			if(typeof(thisTreeRadioFormDialog._onCancelCallback)==="function"){
				thisTreeRadioFormDialog._onCancelCallback();
			}
		});
		this._treeExplorerFormDialog._reloadData = function(){
			thisComponent._treeExplorerQueryType = "BY_TEXT";
			var queryText = thisComponent._$treeExplorerQueryText.val();
			var queryPage = thisComponent._treeExplorerQueryPage;
			TreeExplorer.queryByText(
				extraParams,
				queryText,
				queryPage,
				function(data){
					if(typeof(thisComponent._onFetchData)==="function")
						thisComponent._onFetchData(data.list);
					thisComponent._treeExplorerFormDialog._buildBread(data.path);
					thisComponent._treeExplorerFormDialog._buildList(data.list);
					thisComponent._treeExplorerFormDialog._buildPageInfo(data.sizeInfo);
				},
				function(){
					
				}
			);
		};
		this._treeExplorerFormDialog._buildPageInfo = function(sizeInfo){
			thisComponent._$treeExplorerBtnPrev.unbind("click");
			thisComponent._$treeExplorerBtnNext.unbind("click");
			if(thisComponent._treeExplorerQueryType=="BY_NODE"){
				this._buildPageInfoByNode(sizeInfo);
			}else if(thisComponent._treeExplorerQueryType=="BY_TEXT"){
				this._buildPageInfoByText(sizeInfo);
			}
		};
		this._treeExplorerFormDialog._buildPageInfoByNode = function(sizeInfo){
			if(sizeInfo.page>1){
				thisComponent._$treeExplorerBtnPrev.removeClass("fjzx-disabled");
				thisComponent._$treeExplorerBtnPrev.click(function(){
					thisComponent._treeExplorerQueryPage--;
					thisComponent._treeExplorerFormDialog._reloadDataByNodeId(thisComponent._treeExplorerQueryNodeType,thisComponent._treeExplorerQueryNodeId);
				});
			}else{
				thisComponent._$treeExplorerBtnPrev.addClass("fjzx-disabled");
			}
			if(sizeInfo.page<sizeInfo.maxPage){
				thisComponent._$treeExplorerBtnNext.removeClass("fjzx-disabled");
				thisComponent._$treeExplorerBtnNext.click(function(){
					thisComponent._treeExplorerQueryPage++;
					thisComponent._treeExplorerFormDialog._reloadDataByNodeId(thisComponent._treeExplorerQueryNodeType,thisComponent._treeExplorerQueryNodeId);
				});
			}else{
				thisComponent._$treeExplorerBtnNext.addClass("fjzx-disabled");
			}
		};
		this._treeExplorerFormDialog._buildPageInfoByText = function(sizeInfo){
			if(sizeInfo.page>1){
				thisComponent._$treeExplorerBtnPrev.removeClass("fjzx-disabled");
				thisComponent._$treeExplorerBtnPrev.click(function(){
					thisComponent._treeExplorerQueryPage--;
					thisComponent._treeExplorerFormDialog._reloadData();
				});
			}else{
				thisComponent._$treeExplorerBtnPrev.addClass("fjzx-disabled");
			}
			if(sizeInfo.page<sizeInfo.maxPage){
				thisComponent._$treeExplorerBtnNext.removeClass("fjzx-disabled");
				thisComponent._$treeExplorerBtnNext.click(function(){
					thisComponent._treeExplorerQueryPage++;
					thisComponent._treeExplorerFormDialog._reloadData();
				});
			}else{
				thisComponent._$treeExplorerBtnNext.addClass("fjzx-disabled");
			}
		};
		this._treeExplorerFormDialog._buildBread = function(path){
			thisComponent._$treeExplorerTreeBreadList.empty();
			var $root = $("<li><label'>路径</label></li>");
			thisComponent._$treeExplorerTreeBreadList.append($root);
			$root.click(function(){
				submitQuery();
				});
			if(path){
				for(var i=0;i<path.length;i++){
					thisComponent._treeExplorerFormDialog._appendPath(path[i]);
				}
			}
		};
		this._treeExplorerFormDialog._appendPath = function(record){
			var itemTemplate = "<li><span class='fa-angle-right'></span><label>{text:name}</label></li>";
			var $item =$($.formatStr(itemTemplate,record));
			$item.click(function(){
				thisComponent._$treeExplorerQueryText.val("");
				thisComponent._treeExplorerQueryPage = 1;
				thisComponent._treeExplorerFormDialog._reloadDataByNodeId(record.nodeType,record.id);
			});
			thisComponent._$treeExplorerTreeBreadList.append($item);
		},
		this._treeExplorerFormDialog._buildList = function(list){
			thisComponent._$treeExplorerListContainer.empty();
			if(list.length>0){
				for(var i=0;i<list.length;i++){
					this._append(list[i]);
				}
			}else
				thisComponent._$treeExplorerListContainer.append("<tr><td style='cursor: pointer;'>&lt;无数据&gt;</td></tr>");
		};
		this._treeExplorerFormDialog._append = function(record){
			var itemTemplate = "<tr><td><label for='tree_explorer_label_{text:id}'>{text:name}</label><span class='fa-angle-right' style='margin-left: 5px;'></td><td><button class='fjzx-prog-add-all btn-link-success'>添加全部<span class='fa-caret-right' style='margin-left: 6px;'></span><span class='fa-caret-right'></span></button><button class='fjzx-prog-add btn-link-success'>添加<span class='fa-caret-right' style='margin-left: 6px;'></span></button></td></tr>";
			//判断单选（是否需要添加全部按钮）
			if(isMulSelect == "ONE_SELECT"){
				itemTemplate = "<tr><td><label for='tree_explorer_label_{text:id}'>{text:name}</label><span class='fa-angle-right' style='margin-left: 5px;'></td><td><button class='fjzx-prog-add btn-link-success'>添加<span class='fa-caret-right' style='margin-left: 6px;'></span></button></td></tr>";
			}
			var $item = $($.formatStr(itemTemplate,record));
			$item.hover(
				function(){
					$item.addClass("fjzx-hover");
				},
				function(){
					$item.removeClass("fjzx-hover");
				}
			);
			if(record.nodeType=='BRANCH'){
				if(record.isOption!="true"){//是否可以选择父节点级别
					$item.find("button.fjzx-prog-add").remove();
				}else{
					$item.find("button.fjzx-prog-add-all").remove();
					$item.find("span.fa-angle-right").remove();
				}
				$item.find("label").parent().click(function(){
					thisComponent._$treeExplorerQueryText.val("");
					thisComponent._treeExplorerQueryPage = 1;
					thisComponent._treeExplorerFormDialog._reloadDataByNodeId(record.nodeType,record.id);
				});
				$item.find("button.fjzx-prog-add").click(function(){
					thisComponent._treeExplorerFormDialog._addSelected(record,isMulSelect);
				});
				$item.find("button.fjzx-prog-add-all").click(function(e){
					e.stopPropagation();
					TreeExplorer.queryAllLeaf(
						extraParams,
						record.id,
						function(data){
							for(var i=0;i<data.list.length;i++){
								var leafRecord = data.list[i];
								thisComponent._treeExplorerFormDialog._addSelected(leafRecord,isMulSelect);
							}
						},
						function(){
							
						}
					);
				});
			}else{
				$item.find("button.fjzx-prog-add-all").remove();
				$item.find("span.fa-angle-right").remove();
				$item.find("button.fjzx-prog-add").click(function(){
					thisComponent._treeExplorerFormDialog._addSelected(record,isMulSelect);
				});
			}
			thisComponent._$treeExplorerListContainer.append($item);
		};
		this._treeExplorerFormDialog._exists = function(record){
			var result = false;
			thisComponent._$treeExplorerSelectList.find("tr").each(function(){
				var dataId = $(this).data().id;
				if(dataId == record.id)
					result = true;
			});
			return result;
		};
		this._treeExplorerFormDialog._addSelected = function(record,isMulSelect){
			if(thisComponent._treeExplorerFormDialog._exists(record)){
				return;
			}
			if(isMulSelect == "ONE_SELECT"){
				thisComponent._$treeExplorerSelectList.empty()
			}
			
			
			var $item = $($.formatStr("<tr><td>{text:name}</td><td><button class='fjzx-prog-remove btn-link-danger'><span class='fa-remove mr6'></span>删除</button></td></tr>",record));
			$item.find("button.fjzx-prog-remove").click(function(){
				$item.remove();
			});
			$item.data(record);
			thisComponent._$treeExplorerSelectList.append($item);
		};
		this._treeExplorerFormDialog._reloadDataByNodeId = function(queryNodeType,queryNodeId){
			thisComponent._treeExplorerQueryType = "BY_NODE";
			thisComponent._treeExplorerQueryNodeType = queryNodeType;
			thisComponent._treeExplorerQueryNodeId = queryNodeId;
			var queryPage = thisComponent._treeExplorerQueryPage;
			TreeExplorer.queryByNode(
				extraParams,
				queryNodeType,
				queryNodeId,
				queryPage,
				function(data){
					if(typeof(thisComponent._onFetchData)==="function")
						thisComponent._onFetchData(data.list);
					thisComponent._treeExplorerFormDialog._buildBread(data.path);
					thisComponent._treeExplorerFormDialog._buildList(data.list);
					thisComponent._treeExplorerFormDialog._buildPageInfo(data.sizeInfo);
				},
				function(){
					
				}
			);
		};
		
		this._treeExplorerDialogInitialized = true;
	},
	/*TreeExplorer选择框*/
	showTreeExplorerDialog: function(selectType,extraParams,isMulSelect,dataArrayStr,onConfirmCallback,onCancelCallback,onFetchData){
		this._initTreeExplorerDialog(extraParams,isMulSelect);
		
		var thisComponent = this;
		this._treeExplorerFormDialog._onConfirmCallback = onConfirmCallback;
		this._treeExplorerFormDialog._onCancelCallback = onCancelCallback;
		this._treeExplorerFormDialog._onFetchData = onFetchData;

		this._$treeExplorerSelectList.empty();
		var dataArray = JSON.parse(dataArrayStr);
		for(var i=0;i<dataArray.length;i++){
			this._treeExplorerFormDialog._addSelected(dataArray[i],isMulSelect);
		}
		
		this._$treeExplorerQueryText.val("");
		this._treeExplorerQueryPage = 1;
		
		thisComponent._treeExplorerFormDialog.open(null,function(){
			thisComponent._treeExplorerFormDialog._reloadData();
		});
	},
	_initScanner: function(){
		if(this._scannerDialogInitialized)
			return;
		var thisComponent = this;
		this._$scannerDialog = $("<div  id='fjzx-prog-form-dialog-scanner' class='modal fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>\
			<div class='modal-header'>\
				<button type='button' class='fjzx-prog-close close' aria-hidden='true'>×</button>\
				<h3 id='myModalLabel'>扫描</h3>\
			</div>\
			<div class='modal-body' style='max-height: 500px;'>\
				<object classid='clsid:454C18E2-8B7D-43C6-8C17-B1825B49D7DE' id='capture' width='360px' height='480px' align='middle'></object>\
			</div>\
			<div class='modal-footer'>\
				<button class='fjzx-prog-take-photo btn btn-primary' style='float: left;'><span class='fa-film mr6'></span>采集</button>\
				<button class='fjzx-prog-scan-close btn'><span class='fa-remove mr6'></span>关闭</button>\
			</div>\
		</div>");
		$("body").append(this._$scannerDialog);

		var options = {confirmCancel: false,width: 390,zIndex: 9999};
		this._formDialogScanner = fjzx.ui.createFormDialog(
			"div#fjzx-prog-form-dialog-scanner",
			function($container){
			},
			options
		 );
		this._formDialogScanner.find("button.fjzx-prog-take-photo").setAction(
			function(record,formDataStr,$container){
				var directory = ocxScannerBasePath;
				var imgName = "scanner" + new Date().getTime();
		
				if(isIE()){
					if(capture.bSaveJPG(directory, imgName)){
						var filePath = directory + imgName + ".jpg";
						
						var responseText = capture.sUpLoadImageEx2(filePath,serverName,serverPort,contextPath+"/do.upload?uploadDownloadControllerId=scanner&cookie="+document.cookie,false,false);
						
						thisComponent._$scannerDialog.find("#myModalLabel").hide().css("color","green").text("扫描执行成功!").fadeIn(500);
						if(typeof(thisComponent._onScanFileCallback)==="function"){
							var response = JSON.parse(responseText);
							if(response.code==="ok"){
								thisComponent._onScanFileCallback(response.data);
							}
						}
				    }
				}
					
			}
		 ); 
		this._formDialogScanner.find("button.fjzx-prog-scan-close").setActionClose(function($container){

			if(isIE()){
				capture.bStopPlay();//停止拍照
			}	
		});
		this._scannerDialogInitialized = true;
	},
	//高拍仪扫描框
	showScanner: function(onScanFileCallback){
		this._initScanner();
		this._onScanFileCallback = onScanFileCallback;

		this._formDialogScanner.open(null,function($container){
			$container.find("#myModalLabel").css("color","black").text("扫描");
			//初始化拍照
			if(isIE()){
				capture.bStopPlay();
				capture.bStartPlayRotate(90);
				capture.vSetDelHBFlag(0);
				capture.vSetSkewFlag(0);
			}
		});
	},
	_initRfidReader: function(){
		if(this._rfidReaderDialogInitialized)
			return;
		var thisComponent = this;
		this._$rfidReaderDialog = $("<div  id='fjzx-prog-form-dialog-rfid-reader' class='modal fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>\
			<div class='modal-header'>\
				<button type='button' class='fjzx-prog-close close' aria-hidden='true'>×</button>\
				<h3 id='myModalLabel'>读取电子标签</h3>\
			</div>\
			<div class='modal-body' style='max-height: 300px;text-align: center;'>\
				<div style='height: 10px;'><img /></div>\
				<div class='fjzx-prog-epc-read' style='height: 30px;margin-bottom: 10px;'>&nbsp;</div>\
			</div>\
			<div class='modal-footer'>\
				<button class='fjzx-prog-cancel btn'><span class='fa-remove mr6'></span>取消</button>\
				<button class='fjzx-prog-confirm btn btn-primary'><span class='fa-check mr6'></span>确定</button>\
			</div>\
		</div>");
		$("body").append(this._$rfidReaderDialog);
		this._$rfidReaderDialog.find("img").attr('src',BasePath+"images/interacting.gif");

		var options = {confirmCancel: false,width: 420};
		this._formDialogRfidReader = fjzx.ui.createFormDialog(
			"div#fjzx-prog-form-dialog-rfid-reader",
			function($container){
			},
			options
		 );
		this._formDialogRfidReader.find("button.fjzx-prog-confirm").setAction(function(){
			if(typeof(thisComponent._onRfidReadSuccessCallback)=="function" && thisComponent._epcRead){
				thisComponent._onRfidReadSuccessCallback({"epc":thisComponent._epcRead});
				thisComponent._formDialogRfidReader.close();
			}
		});
		this._formDialogRfidReader.find("button.fjzx-prog-cancel").setActionClose();
		
		this._rfidReaderDialogInitialized = true;
	},
	//RFID读取框
	showRfidReadDialog: function(sCallback){
		this._initRfidReader();
		this._onRfidReadSuccessCallback = sCallback;
		this._epcRead = "";
		this._$rfidReaderDialog.find("img").show();
		this._$rfidReaderDialog.find("div.fjzx-prog-epc-read").text("");
		
		var thisComponent = this;
		
		function displayReadResult(epc){
			thisComponent._epcRead = epc;
			thisComponent._$rfidReaderDialog.find("img").hide();
			thisComponent._$rfidReaderDialog.find("div.fjzx-prog-epc-read").text(epc);
		}
		
		function startReading(){
			Local.readEpc(
				function(data){
					displayReadResult(data.epc);
				},
				function(){
					
				}
			);
		}

		this._formDialogRfidReader.open(null,function($container){
			startReading();
		});
	},
	_initRfidWriter: function(){
		if(this._rfidWriterDialogInitialized)
			return;
		var thisComponent = this;
		this._$rfidWriterDialog = $("<div  id='fjzx-prog-form-dialog-rfid-writer' class='modal fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>\
			<div class='modal-header'>\
				<button type='button' class='fjzx-prog-close close' aria-hidden='true'>×</button>\
				<h3 id='myModalLabel'>写入新电子标签</h3>\
			</div>\
			<div class='modal-body' style='max-height: 300px;text-align: center;'>\
				<div style='height: 10px;'><img /></div>\
				<div class='fjzx-prog-new-epc' style='height: 30px;margin-bottom: 10px;'>&nbsp;</div>\
			</div>\
			<div class='modal-footer'>\
				<button class='fjzx-prog-cancel btn'><span class='fa-remove mr6'></span>取消</button>\
				<button class='fjzx-prog-confirm btn btn-primary'><span class='fa-check mr6'></span>确定</button>\
			</div>\
		</div>");
		$("body").append(this._$rfidWriterDialog);
		this._$rfidWriterDialog.find("img").attr('src',BasePath+"images/interacting.gif");

		var options = {confirmCancel: false,width: 420};
		this._formDialogRfidWriter = fjzx.ui.createFormDialog(
			"div#fjzx-prog-form-dialog-rfid-writer",
			function($container){
			},
			options
		 );
		this._formDialogRfidWriter.find("button.fjzx-prog-confirm").setAction(function(){
			if(typeof(thisComponent._onRfidWriteSuccessCallback)=="function" && thisComponent._newEpcWritten){
				thisComponent._onRfidWriteSuccessCallback({"newCode":thisComponent._newEpcWritten,"oldCode":thisComponent._oldEpcCode});
				thisComponent._formDialogRfidWriter.close();
			}
		});
		this._formDialogRfidWriter.find("button.fjzx-prog-cancel").setActionClose();
		
		this._rfidWriterDialogInitialized = true;
	},
	//RFID写入框
	showRfidWriteDialog: function(sCallback){
		this._initRfidWriter();
		this._onRfidWriteSuccessCallback = sCallback;
		this._newEpcWritten = "";
		this._oldEpcCode = "";
		this._$rfidWriterDialog.find("img").show();
		this._$rfidWriterDialog.find("div.fjzx-prog-new-epc").text("");
		
		var thisComponent = this;
		
		function displayWriteResult(epc,currentEpc){
			thisComponent._newEpcWritten = epc;
			thisComponent._oldEpcCode = currentEpc;
			thisComponent._$rfidWriterDialog.find("img").hide();
			thisComponent._$rfidWriterDialog.find("div.fjzx-prog-new-epc").text(epc);
		}
		
		function stopAction(){
			thisComponent._$rfidWriterDialog.find("img").hide();
		}
		
		function startWriting(){
			Local.readEpc(
				function(data){
					var currentEpc = data.epc;
					if(!currentEpc)
						return;
					RfidLabel.queryEpcExistence(
						currentEpc,
						function(data){
							if(data.exists){
								fjzx.ui.showMessageError(
									"<p>该电子标签"+data.record.bindTypeName+"，必须解绑后才能写入新的EPC</p><p>需解绑的电子标签EPC: "+currentEpc+"</p>",
									function(){
										startWriting();
									}
								);
							}else{
								Local.writeEpc(
									"",
									function(data){
										displayWriteResult(data.epc,currentEpc);
									},
									function(){
										stopAction();
									}
								);
							}
						},
						function(){
							
						}
					);
				},
				function(){
					
				}
			);
		}

		this._formDialogRfidWriter.open(null,function($container){
			startWriting();
		});
	},
	/*附件管理框*/
	_initAttachmentManager: function(){
		if(this._attachmentManagerDialogInitialized){
			if(this._attachmentManagerOptions.readonly){
				this._$attachmentManagerDialog.find("td.fjzx-prog-operations").hide();
			}else{
				this._$attachmentManagerDialog.find("td.fjzx-prog-operations").show();
			}
			return;
		}
		var thisComponent = this;
		this._$attachmentManagerDialog = $("<div  id='fjzx-prog-form-dialog-attachment-manager' class='modal fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>\
		   <div class='modal-header'>\
				<button type='button' class='fjzx-prog-close close' aria-hidden='true'>×</button>\
				<h3 id='myModalLabel'>附件列表</h3>\
			</div>\
			<div class='modal-body wrap-overflow' style='min-height: 500px;max-height: 400px;'>\
				<table class='table' style='margin-bottom: 0px;'>\
					<thead><th style='text-align: center;'><input class='fjzx-prog-select-all' type='checkbox' /></th><th>缩略图</th><th>附件名</th><th>操作</th></thead>\
					<tbody class='fjzx-prog-table-body'></tbody>\
				</table>\
			</div>\
			<div class='modal-footer'>\
				<table style='width: 100%;'><tr>\
					<td class='fjzx-prog-operations' style='width: 97px;'>\
						<button class='fjzx-prog-batch-remove btn'><span class='fa-remove mr6'></span>批量删除</button>\
					</td>\
					<td class='fjzx-prog-operations' style='width: 97px;'>\
						<button id='fjzx-prog-add-attachment' class='fjzx-prog-add-attachment btn btn-primary' style='float: left;'><span class='fa-plus mr6'></span>上传附件</button>\
					</td>\
					<td style='text-align: right;'>\
						<button class='fjzx-prog-close-dialog btn' style='float: right;'><span class='fa-remove mr6'></span>关闭</button>\
					</td>\
				</tr></table>\
			</div>\
		</div>");
		$("body").append(this._$attachmentManagerDialog);
		if(this._attachmentManagerOptions.readonly){
			this._$attachmentManagerDialog.find("td.fjzx-prog-operations").hide();
		}else{
			this._$attachmentManagerDialog.find("td.fjzx-prog-operations").show();
		}

		var dialogOptions = {confirmCancel: false};
		this._formDialogAttachmentManager = fjzx.ui.createFormDialog(
			"div#fjzx-prog-form-dialog-attachment-manager",
			function($container){
				$container.find("input.fjzx-prog-select-all").click(function(e){
					e.stopPropagation();
					var $thisCheckbox = $(this);
					if($thisCheckbox.prop("checked")){
						$container.find("input.fjzx-prog-select").prop("checked",true);
					}else{
						$container.find("input.fjzx-prog-select").removeProp("checked");
					}
				});
				$container.find("input.fjzx-prog-select-all").parents("th:first").hover(
					function(){
						$(this).css("background-color","#ffffe1");
					},
					function(){
						$(this).css("background-color","");
					}
				).click(function(){
					var $checkbox = $container.find("input.fjzx-prog-select-all");
					$checkbox.click();
				}).css("cursor","pointer");
				
				var $tbody = $container.find("tbody.fjzx-prog-table-body");
				$container.find("button.fjzx-prog-batch-remove").click(function(){
					fjzx.ui.showConfirm(
							"确实要批量删除附件吗？",
							function(){
								var trList = [];
								$tbody.find("tr").each(function(){
									var $tr = $(this);
									if($tr.find("input.fjzx-prog-select").is(":checked")){
										trList.push($tr);
									}
								});
								if(thisComponent._attachmentManagerOptions.onRemoveListener){
									var fileIdList = [];
									for(var i=0;i<trList.length;i++){
										var record = trList[i].data("record");
										fileIdList.push(record.id);
									}
									thisComponent._attachmentManagerOptions.onRemoveListener(fileIdList,function(){
										for(var i=0;i<trList.length;i++)
											trList[i].remove();
										$container.find("input.fjzx-prog-select-all").removeProp("checked");
									});
								}else{
									for(var i=0;i<trList.length;i++)
										trList[i].remove();
									$container.find("input.fjzx-prog-select-all").removeProp("checked");
								}
							},
							function(){
								
							}
						);
				});
			},
			dialogOptions
		 );
		this._formDialogAttachmentManager.find("button.fjzx-prog-close-dialog").setActionClose();
		
		var fileIdList = [];
		fjzx.upload.createUploader(
			"button#fjzx-prog-add-attachment",//要生成上传组件按钮的位置元素
			"common",//这是UploadController的id
			function(){
				fileIdList = [];//初始化
				return {};
			},
			//单个文件上传动作结束，参数data是UploadController的方法onTempFileSaved返回的JSON对象
			function(data){
				fileIdList.push(data.record.id);
			},
			//全部文件上传动作结束
			function(){
				if(typeof(thisComponent._attachmentManagerOptions.onAddListener)==="function"){
					thisComponent._attachmentManagerOptions.onAddListener(fileIdList,function(){
						thisComponent._addAttachmentManagerList(fileIdList);
					});
				}
			},
			{
				buttonImg: BasePath+'images/btnUploadAttachment.gif',
				width: 95,
				height: 34
			}
		);
		
		this._attachmentManagerDialogInitialized = true;
	},
	_addAttachmentManagerList: function(list){
		var $tbody = this._$attachmentManagerDialog.find("tbody.fjzx-prog-table-body");
		var thisComponent = this;
		if(list){
			UploadFile.getUploadFileList(
				JSON.stringify(list),
				function(data){
					thisComponent._addAttachmentDataList($tbody,data.list);
				},
				function(){
					
				}
			);
		}
	},
	_addAttachmentDataList: function($tbody,list){
		var thisComponent = this;
		var itemTemplate = "<tr>\
			<td style='width: 24px;text-align: center;'>\
				<input class='fjzx-prog-select' type='checkbox' />\
			</td>\
			<td style='width: 80px;'>\
				<a href='file.download?uploadDownloadControllerId=common&&fileId={text:id}' target='_blank'>\
					<img src='showImage.download?uploadDownloadControllerId=common&&fileId={text:id}&&length=50' style='width: 50px;height: 50px;' title='{text: originalFileName}' alt='{text: originalFileName}' />\
				</a>\
			</td>\
			<td>\
				<a href='file.download?uploadDownloadControllerId=common&&fileId={text:id}' target='_blank'>\
					{text:originalFileName}\
				</a>\
			</td>\
			<td style='width: 80px;'><button class='fjzx-prog-remove btn' type='button'><span class='fa-remove mr6'></span>删除</button></td>\
		</tr>";
		for(var i=0;i<list.length;i++){
			var $item = $($.formatStr(itemTemplate,list[i]));
			$item.data("record",list[i]);
			$tbody.append($item);
			
			$item.find("input.fjzx-prog-select").click(function(e){
				e.stopPropagation();
			});
			$item.find("input.fjzx-prog-select").parents("td:first").hover(
				function(){
					$(this).css("background-color","#ffffe1");
				},
				function(){
					$(this).css("background-color","");
				}
			).click(function(){
				var $checkbox = $(this).find("input.fjzx-prog-select");
				$checkbox.click();
			}).css("cursor","pointer");
			if(this._attachmentManagerOptions.readonly){
				$item.find("button.fjzx-prog-remove").remove();
			}
			$item.find("button.fjzx-prog-remove").click(function(){
				var $tr = $(this).parents("tr:first");
				var record = $tr.data("record");
				fjzx.ui.showConfirm(
					"确实要删除附件吗？",
					function(){
						if(thisComponent._attachmentManagerOptions.onRemoveListener){
							thisComponent._attachmentManagerOptions.onRemoveListener([record.id],function(){
								$tr.remove();
							});
						}else{
							$tr.remove();
						}
					},
					function(){
						
					}
				);
			});
		}
	},
	_initAttachmentManagerList: function(){
		var $tbody = this._$attachmentManagerDialog.find("tbody.fjzx-prog-table-body");
		$tbody.empty();
		this._addAttachmentManagerList(this._attachmentManagerOptions.fileIdArrayInit);
	},
	//附件管理框
	showAttachmentManager: function(options){
//options示例如下：
//		options={
//			fileIdArrayInit: ["0-55GENKJ6qWTWzWlgIuap","0-l2BI6jd3xUz0bDcwcfOG","00AEI_GL9f8UkHoa5FAAaC","00SFFI9Op9P8ZScoN7-sMh"],//打开附件管理框时要显示的附件列表的id
//			onAddListener: function(fileIdArrayAdded,refreshAddCallback){//附件管理框中，点击上传附件，文件上传成功后的回调
//				Case.doAdd(
//					caseId,
//					JSON.stringify(fileIdArrayAdded),
//					function(data){
//						refreshAddCallback(fileIdArrayAdded);//必须执行，执行后附件管理框列表才会刷新
//					}
//				);
//			},
//			onRemoveListener: function(fileIdArrayRemoved,refreshRemoveCallback){{//附件管理框中，删除文件的回调
//				Case.doAdd(
//					caseId,
//					JSON.stringify(fileIdArrayRemoved),
//					function(data){
//						refreshRemoveCallback(fileIdArrayRemoved);//必须执行，执行后附件管理框列表才会刷新
//					}
//				);
//			}
//		}
		this._attachmentManagerOptions = options;
		this._initAttachmentManager();
		this._initAttachmentManagerList();
		this._formDialogAttachmentManager.open(null,function($container){
			
		});
	},
	/*扫描文件管理框*/
	_initScannerFileManager: function(){
		if(this._scannerFileManagerDialogInitialized){
			if(this._scannerFileManagerOptions.readonly){
				this._$scannerFileManagerDialog.find("td.fjzx-prog-operations").hide();
			}else{
				this._$scannerFileManagerDialog.find("td.fjzx-prog-operations").show();
			}
			return;
		}
		var thisComponent = this;
		this._$scannerFileManagerDialog = $("<div  id='fjzx-prog-form-dialog-scanner-file-manager' class='modal fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>\
		   <div class='modal-header'>\
				<button type='button' class='fjzx-prog-close close' aria-hidden='true'>×</button>\
				<h3 id='myModalLabel'>扫描文件列表</h3>\
			</div>\
			<div class='modal-body wrap-overflow' style='min-height: 500px;max-height: 400px;'>\
				<div id='fjzx-prog-form-page-scan-file-list-container' class='fjzx-prog-form-page-image-file-list wrap-overflow'>\
					<ul class='fjzx-prog-scan-file-ul'></ul>\
				</div>\
			</div>\
			<div class='modal-footer'>\
				<table style='width: 100%;'><tr>\
					<td class='fjzx-prog-operations' style='width: 97px;'>\
						<button id='fjzx-prog-add-scanner-file' class='fjzx-prog-add-scanner-file btn btn-primary' style='float: left;'><span class='fa-camera mr6'></span>扫描</button>\
					</td>\
					<td style='text-align: right;'>\
						<button class='fjzx-prog-close-dialog btn' style='float: right;'><span class='fa-remove mr6'></span>关闭</button>\
					</td>\
				</tr></table>\
			</div>\
		</div>");
		$("body").append(this._$scannerFileManagerDialog);
		if(this._scannerFileManagerOptions.readonly){
			this._$scannerFileManagerDialog.find("td.fjzx-prog-operations").hide();
		}else{
			this._$scannerFileManagerDialog.find("td.fjzx-prog-operations").show();
		}

		var dialogOptions = {confirmCancel: false,width: 900};
		this._formDialogScannerFileManager = fjzx.ui.createFormDialog(
			"div#fjzx-prog-form-dialog-scanner-file-manager",
			function($container){				
				$container.find("button.fjzx-prog-add-scanner-file").click(function(){
					fjzx.ui.showScanner(function(msg){
						var fileIdList = [msg.record.id];
						if(typeof(thisComponent._scannerFileManagerOptions.onAddListener)==="function"){
							thisComponent._scannerFileManagerOptions.onAddListener(fileIdList,function(){
								thisComponent._addScannerFileManagerList(fileIdList);
							});
						}
					});
				});
			},
			dialogOptions
		 );
		this._formDialogScannerFileManager.find("button.fjzx-prog-close-dialog").setActionClose();
		
		this._scannerFileManagerDialogInitialized = true;
	},
	_addScannerFileManagerList: function(list){
		var $tbody = this._$scannerFileManagerDialog.find("ul.fjzx-prog-scan-file-ul");
		var thisComponent = this;
		if(list){
			UploadFile.getUploadFileList(
				JSON.stringify(list),
				function(data){
					thisComponent._addScannerFileDataList($tbody,data.list);
				},
				function(){
					
				}
			);
		}
	},
	_addScannerFileDataList: function($tbody,list){
		var thisComponent = this;

		var itemTemplate = "<li style='width:150px;height:200px;'>\
			<a href=\"showImage.download?uploadDownloadControllerId=scanner&&fileId={text:id}\" target=\"_blank\"><img src=\"showImage.download?uploadDownloadControllerId=scanner&&fileId={text:id}&&height=100\" title='' alt='' style='width:150px;height:200px;' /></a>\
			<span class='fjzx-prog-btn-remove'>X</span>\
		</li>";
		for(var i=0;i<list.length;i++){
			var $item = $($.formatStr(itemTemplate,list[i]));
			$item.data("record",list[i]);
			$tbody.append($item);

			if(this._scannerFileManagerOptions.readonly){
				$item.find("span.fjzx-prog-btn-remove").remove();
			}
			$item.find("span.fjzx-prog-btn-remove").click(function(){
				var $tr = $(this).parents("li:first");
				var record = $tr.data("record");
				fjzx.ui.showConfirm(
					"确实要删除扫描文件吗？",
					function(){
						if(thisComponent._scannerFileManagerOptions.onRemoveListener){
							thisComponent._scannerFileManagerOptions.onRemoveListener([record.id],function(){
								$tr.remove();
							});
						}else{
							$tr.remove();
						}
					},
					function(){
						
					}
				);
			});
		}
	},
	_initScannerFileManagerList: function(){
		var $tbody = this._$scannerFileManagerDialog.find("ul.fjzx-prog-scan-file-ul");
		$tbody.empty();
		this._addScannerFileManagerList(this._scannerFileManagerOptions.fileIdArrayInit);
	},
	//扫描文件管理框
	showScannerFileManager: function(options){
//options示例如下：
//		options={
//			fileIdArrayInit: ["0-55GENKJ6qWTWzWlgIuap","0-l2BI6jd3xUz0bDcwcfOG","00AEI_GL9f8UkHoa5FAAaC","00SFFI9Op9P8ZScoN7-sMh"],//打开扫描文件管理框时要显示的扫描文件列表的id
//			onAddListener: function(fileIdArrayAdded,refreshAddCallback){//扫描文件管理框中，点击上传扫描文件，文件上传成功后的回调
//				Case.doAdd(
//					caseId,
//					JSON.stringify(fileIdArrayAdded),
//					function(data){
//						refreshAddCallback(fileIdArrayAdded);//必须执行，执行后扫描文件管理框列表才会刷新
//					}
//				);
//			},
//			onRemoveListener: function(fileIdArrayRemoved,refreshRemoveCallback){{//扫描文件管理框中，删除文件的回调
//				Case.doAdd(
//					caseId,
//					JSON.stringify(fileIdArrayRemoved),
//					function(data){
//						refreshRemoveCallback(fileIdArrayRemoved);//必须执行，执行后扫描文件管理框列表才会刷新
//					}
//				);
//			}
//		}
		this._scannerFileManagerOptions = options;
		this._initScannerFileManager();
		this._initScannerFileManagerList();
		this._formDialogScannerFileManager.open(null,function($container){
			
		});
	},
	/**
	 * QueryForm、FormDialog在查询、新增提交、修改提交时会自动对数据进行验证
	 * 
	 * 自动验证数据类型（css类，用在input中）
	 * 
	 * fjzx-prog-string
	 * fjzx-prog-boolean
	 * fjzx-prog-integer 整数
	 * fjzx-prog-date 日期
	 * fjzx-prog-double 浮点数
	 * 
	 * fjzx-prog-integer-nonnegative 非负整数数
	 * fjzx-prog-integer-positive 正整数
	 * fjzx-prog-double-nonnegative 非负浮点数
	 * fjzx-prog-double-positive 正浮点数
	 * 
	 * 自动验证数据约束（css类，用在input中）
	 * fjzx-prog-not-null 不可为空
	 * 
	 * 自动验证提示框使用到的属性
	 *  fjzx_field_tip_name='代码序号"，用在input中
	 *  提示框提示验证结果的例子如下：
	 * 1、 "代码序号"不可以为空
	 *  2、"代码序号"格式不正确，正确的格式示例：23、88
	 */
	//验证所有数据有效性
	validateDataType: function($container){
		
		//内部函数，验证一种数据有效性
		function validateDataTypeOne($container,cssClass,regexp){
			var $elms = $container.find("."+cssClass);
			for(var i=0;i<$elms.size();i++){
				var $item = $($elms.get(i));
				var itemValue = $item.val();
				if(!itemValue)
					continue;
				if(!regexp.reg.test(itemValue)){
					var msg = regexp.msg;
					var fjzxFieldTip = $item.attr("fjzx_field_tip_name"); 
					if(fjzxFieldTip)
						msg = "\""+fjzxFieldTip+"\"格式不正确，"+msg;
					fjzx.ui.showMessageError(msg,function(){
						$item.focus();
					});
					return false;
				}
			}
			return true;
		}
		
		var resultOk;
		
		resultOk = this.validateNotNull($container);
		if(!resultOk)
			return false;
		
		resultOk = validateDataTypeOne($container,"fjzx-prog-integer",regexEnum.integer);
		if(!resultOk)
			return false;
		
		resultOk = validateDataTypeOne($container,"fjzx-prog-integer-positive",regexEnum.integerPositive);
		if(!resultOk)
			return false;
		
		resultOk = validateDataTypeOne($container,"fjzx-prog-integer-nonnegative",regexEnum.integerNonnegative);
		if(!resultOk)
			return false;
		
		resultOk = validateDataTypeOne($container,"fjzx-prog-double",regexEnum.double);
		if(!resultOk)
			return false;
		
		resultOk = validateDataTypeOne($container,"fjzx-prog-double-positive",regexEnum.doublePositive);
		if(!resultOk)
			return false;
		
		resultOk = validateDataTypeOne($container,"fjzx-prog-double-nonnegative",regexEnum.doubleNonnegative);
		if(!resultOk)
			return false;
		
		resultOk = validateDataTypeOne($container,"fjzx-prog-date",regexEnum.date);
		if(!resultOk)
			return false;
		return true;
	},
	//验证不可以为空
	validateNotNull: function($container){
		var $elms = $container.find(".fjzx-prog-not-null");
		for(var i=0;i<$elms.size();i++){
			var $item = $($elms.get(i));
			if($item.is(":text")||$item.is(":password")||$item.prop("tagName")=="TEXTAREA"){
				var itemValue = $item.val();
				if(!itemValue || itemValue==""){
					var msg = "不可以为空";
					var fjzxFieldTip = $item.attr("fjzx_field_tip_name"); 
					if(fjzxFieldTip)
						msg = "\""+fjzxFieldTip+"\""+msg;
					this.showMessageError(msg,function(){
						$item.focus();
					});
					return false;
				}
			}else if($item.is(":radio")||$item.is(":checkbox")){
				var fjzxFieldName = $item.attr("fjzx_field_name");
				var $radioSet = $container.find("input[fjzx_field_name="+fjzxFieldName+"]:checked");
				if($radioSet.size()<=0){
					var msg = "不可以为空";
					var fjzxFieldTip = $item.attr("fjzx_field_tip_name"); 
					if(fjzxFieldTip)
						msg = "\""+fjzxFieldTip+"\""+msg;
					this.showMessageError(msg,function(){
						$item.focus();
					});
					return false;
				}
			}
		}
		return true;
	},
	//初始化带查询和分页的下拉select组件
	// fjzx-prog-component-select fjzx_select_type="CUSTOMER_TYPE" fjzx_select_field_name="createBy" (fjzx_field_name="createByName")
	initAllComponentSelect: function(){
		$("div.fjzx-prog-dropdown").each(function(){
			var $thisComponentSelect = $(this);
			fjzx.ui.createComponentSelect($thisComponentSelect);
		});
	},
	//关闭所有下拉select组件
	closeAllComponentSelect: function(){
		for(var i=0;i<fjzx.ui.componentSelectList.length;i++){
			fjzx.ui.componentSelectList[i].instance.close();
		}
	},
	//初始化所有日期组件
	initAllComponentDate: function(){
		$("input.fjzx-prog-date").each(function(){
			var $thisComponentDate = $(this);
			//add by Jam 2016-05-03 -begin- 解决FormDialog模态显示时，其中的日期选择框无法显示，另一部分相关代码见jQuery-ui.js的datepicker_getZindex方法
			$thisComponentDate.attr("fjzx-z-index",99999);
			//add by Jam 2016-05-03 -end-
//			$thisComponentDate.datepicker({//开始日期
//				showOtherMonths: true,
//				selectOtherMonths: false,
//				changeMonth: true,//月份可改变
//				changeYear: true,//年份可改变
//				dateFormat: 'yy-mm-dd', inline: true,
//				monthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
//				monthNamesShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
//				dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"]
//			});
			$.datetimepicker.setLocale('ch');
			$thisComponentDate.datetimepicker({
				lang:'ch',
				format:'Y-m-d H:i',
				formatTime:'H:i',
				formatDate:'Y-m-d',
				step: 1, // 设置时间时分的间隔
			});
		});
	},
	//初始化所有TreeSelect组件
	initAllComponentTreeSelect: function(){
		$("div.fjzx-prog-dropdown-tree-select").each(function(){
			var $thisComponentTreeSelect = $(this);
			fjzx.ui.createComponentTreeSelect($thisComponentTreeSelect);
		});
	},
	//初始化所有TreeExplorer组件
	initAllComponentTreeExplorer: function(){
		$("div.fjzx-prog-dropdown-tree-explorer").each(function(){
			var $thisComponentTreeExplorer = $(this);
			fjzx.ui.createComponentTreeExplorer($thisComponentTreeExplorer);
		});
	},
	//检查主表是否有数据,没有数据则跳转到第一个页签
	checkHeaderHasData: function(gotoPath,headerList,message,tabs){
		var listSize=0;
		headerList.eachItem(function($item,record){
			if(record){
				listSize++;
			}
		});
		if(listSize==0){
			fjzx.ui.showMessageError(message,function(){
				tabs.gotoTab(gotoPath);
			});
	    }
		return listSize;
	}
	
};


/**
 * 全局变量，判断ui是否处于FormDialog编辑模式，如果处于编辑模式，那么尝试关闭网页会弹出提示
 */
fjzx.ui.inEditing = false;

/**
* 通用表格编辑
*
* 构造器：
* FormDialog = function(selector,onCreateCallback)
*
* 事件：
* onNewSubmitCallback = function(formDataStr)
* onEditSubmitCallback = function(editIdStr,formDataStr)
* 
* 开放的方法：
* newRecordSubmit: function(onNewSubmitCallback,onBeforeNewSubmitCallback)
* editRecordSubmit: function(onEditSubmitCallback,onBeforeEditSubmitCallback)
* newRecord: function(newRecordCallback)
* editRecord:  function(editIdStr,formData,editRecordCallback)
* close: function()
*/
fjzx.ui.FormDialog = function(selector,onCreateCallback,option){
	var thisDialog = this;
	fjzx.ui.checkSelectorUnique(selector);
	this._containerSelector = selector;
	this._$container = $(selector);
	this._tabEmulatorBuilt = false;
	this._$form = this._$container.find("form");
	this._$closeButton = this._$container.find(".fjzx-prog-close");
	this._$customInputContainer = this._$container.find("span[fjzx_custom_input_field_name]");
	if(this._$customInputContainer.size()==1)
		this._fjzxCustomInputFieldName = this._$customInputContainer.attr("fjzx_custom_input_field_name");
	else if(this._$customInputContainer.size()>1)
		alert("一个Dialog中只允许存在一个自定义输入组件");

	var thisContainer = this._$container;
	thisContainer.modal({
		show: false,
		backdrop: 'static',
		keyboard: false
	});
	thisContainer.on("hide",function(){
		fjzx.ui.inEditing = false;
		if(thisDialog._closeByCancelled){
			if(typeof(thisDialog._closeCallback)=="function"){
				thisDialog._closeCallback(thisContainer);
			}
		}
		return true;
	});
	thisContainer.on("shown.bs.modal",function(){
		thisDialog._closeByCancelled = false;
		var $allInputs = thisContainer.find("input[fjzx_field_name]").not("input.fjzx-prog-disabled[fjzx_field_name]");
		if($allInputs.size()>0){
			var $firstInput = $($allInputs.get(0));
			if(!$firstInput.attr("fjzx_select_type"))
				$firstInput.focus();
		}
		if(!thisDialog._tabEmulatorBuilt)
			thisDialog._buildTabEmulator();
		if(typeof(thisDialog._onShowListener)==="function")
			thisDialog._onShowListener(thisContainer);
	});
	
	this._option = {
		confirmCancel: false
	};
	$.extend(this._option,option);
	
	if(typeof(onCreateCallback)=="function")
		onCreateCallback(thisContainer);
	
	this._$form.bind("reset",function(e){
		e.preventDefault();
		e.stopPropagation();
	});
	
	this._$closeButton.click(function(){
		thisDialog._closeByConfirm();
	});
	
	this._initCss();
};
fjzx.ui.FormDialog.prototype = {
	/*私有方法 -开始-*/
	_initCss: function(){
		fjzx.ui.zIndexForAllDialogs = fjzx.ui.zIndexForAllDialogs + 100;
		
		var zIndex = fjzx.ui.zIndexForAllDialogs;
		if(this._option.zIndex){
			zIndex = this._option.zIndex;
		}
		var width = 640;
		if(this._option.width)
			width = this._option.width;
		this._$container.css({
			width: width+"px",
			"margin-left": (-width/2)+"px",
			"top":"50%",
			"z-index": zIndex
		});
		if(this._option.height){
			var height = this._option.height;
			this._$container.css({
				"max-height": "",
				"height": height+"px"
			});
		}
		
		var height = -(this._$container.height()/2);
		this._$container.css("margin-top",height+"px");
	},
	_resetTop: function(){
		var height = -(this._$container.height()/2);
		this._$container.css("margin-top",height+"px");
	},
	_disableElements: function(){
		this._$container.find("input.fjzx-prog-disabled:text,input.fjzx-prog-disabled:password,textarea.fjzx-prog-disabled").each(function(){
			$(this).readonly();
		});
		this._$container.find("input.fjzx-prog-disabled:radio,input.fjzx-prog-disabled:checkbox,select.fjzx-prog-disabled").each(function(){
			$(this).disable();
		});
	},
	_enableElements: function(){
		this._$container.find("input.fjzx-prog-input:text,input.fjzx-prog-input:password,textarea.fjzx-prog-input").each(function(){
			$(this).writable();
		});
		this._$container.find("input.fjzx-prog-input:radio,input.fjzx-prog-input:checkbox,select.fjzx-prog-input").each(function(){
			$(this).enable();
		});
	},
	_setFormData: function(data){
		$.setFormData(this._$container,data);
		this.setFormDataCustomInfo(data);
	},
	_getFormData: function(){
		var formData = $.getFormData(this._$container);
		return this.getFormDataCustomInfo(formData);
	},
	_clearForm: function(){
		$.clearFormData(this._$container);
	},
	_show: function(opencallback){
		var that = this;
		this._$container.modal({ 
			show:true, //必须要有这个属性
			onShow:opencallback, //提供给open业务的回调
			$container: this._$container, //弹出框的jq选择集
			onShowForUi: function(ct){ //程序框架自身需要用的回调，用于框架处理UI
				that._autoSetHeight(ct,that);
			} 
		});
	},
	_autoSetHeight: function(ct, that){
		var $modalHeader = ct.find('.modal-header');
		var $modalBody =  ct.find('.modal-body');
		var $modalBodyForm = ct.find('.modal-body form');
		var $modalFooter = ct.find('.modal-footer');
		var $modalBackdrop = $('.modal-backdrop');
		
		var modalBackdropHeight = $modalBackdrop.height();
		var modalHeaderHeight = $modalHeader.height();
		var modalBodyFormHeight = $modalBodyForm.height();
		var modalFooterHeight = $modalFooter.height();
		
		if(modalHeaderHeight + modalBodyFormHeight + modalFooterHeight > modalBackdropHeight ){
			ct.css({
				'height': (modalBackdropHeight - 30) + 'px',
				'top': '50%',
				'margin-top': -(modalBackdropHeight)/2 + 'px'
			});
			var max_height = modalBackdropHeight - modalHeaderHeight - modalFooterHeight - 80;
			var min_height = parseInt($modalBody.css("min-height"));
			if(max_height < min_height)
				min_height = max_height;
			$modalBody.css({
				'max-height': max_height + 'px',
				'min-height':min_height+'px'
			});
		}else{
			if(that._option.height){
				ct.css({
					'height': that._option.height + 'px',
					'top': '50%',
					'margin-top': -that._option.height/2 + 'px'
				});
				
				var max_height = that._option.height - modalHeaderHeight - modalFooterHeight - 80;
				var min_height = parseInt($modalBody.css("min-height"));
				if(max_height < min_height)
					min_height = max_height;
				
				$modalBody.css({
					'max-height': max_height + 'px',
					'min-height':min_height+'px'
				});
			}else{
				ct.css({'height': 'auto'});
			}
			
		}
		
	},
	_buildTabEmulator: function(){
		return; //by Jam 2016-08-18 暂时去掉，等扫描动作做完后再修改并加上
		
		var thisDialog = this;
		
		var selectors = "";
		for(var selector in thisDialog._actionMap){
			selectors = selectors + "," + selector;
		}
		var $allInputs = this._$container.find("input[fjzx_field_name]"+selectors);
		$allInputs.keydown(function(e){
			var index = $allInputs.index($(this));
			if(($(e.target).hasClass("fjzx-prog-ok") || $(e.target).hasClass("fjzx-prog-cancel")) && e.keyCode==13){
				return;
			}else if (e.keyCode==13 || e.keyCode==40){//enter、down
				index = index + 1;
				if(index>$allInputs.size()-1)
					index = 0;
				e.preventDefault();
				e.stopPropagation();
				$($allInputs.get(index)).focus();
			}else if(e.keyCode==38){//up
				index = index - 1;
				if(index<0)
					index = $allInputs.size() - 1;
				e.preventDefault();
				e.stopPropagation();
				$($allInputs.get(index)).focus();
			}else if(e.keyCode==37){//left
				if($(e.target).is(":button")){
					index = index - 1;
					if(index<0)
						index = $allInputs.size() - 1;
					e.preventDefault();
					e.stopPropagation();
					$($allInputs.get(index)).focus();
				}else if($(e.target).is(":radio")){
					e.preventDefault();
					e.stopPropagation();
				}
			}else if(e.keyCode==39){//right
				if($(e.target).is(":button")){
					index = index + 1;
					if(index>$allInputs.size()-1)
						index = 0;
					e.preventDefault();
					e.stopPropagation();
					$($allInputs.get(index)).focus();
				}else if($(e.target).is(":radio")){
					e.preventDefault();
					e.stopPropagation();
				}
			}
		});
		this._tabEmulatorBuilt = true;
	},
	_processAction: function(selector){
		var thisDialog = this;
		if(!fjzx.ui.validateDataType(thisDialog._$container)){
			return;
		}
		var formData = thisDialog._getFormData();
		var actionCallback = thisDialog._actionMap[selector];
		if(typeof(actionCallback)=="function")
			actionCallback(thisDialog._inputFormData,JSON.stringify(formData),thisDialog._$container);
	},
	_closeByConfirm: function(closeCallback){
		if(this._option.confirmCancel){
			var thisDialog = this;
			fjzx.ui.showConfirm("确实要取消吗？",function(){
				thisDialog._closeByCancelled = true;
				thisDialog._$container.modal("hide");
			});
		}else{
			this._closeByCancelled = true;
			this._$container.modal("hide");
		}
	},
	_addOneCustomInfo: function(record){
		var thisDialog = this;
		var itemTemplate = "<div class='control-group'>\
			<label class='control-label'>{text:propName}</label>\
			<div class='controls'>\
				<div class='fjzx-prog-dropdown-custom-input'>\
					<div class='fjzx-prog-component-custom-input-select-wrapper custom-input-group custom-input-control'>\
						<input type='text' class='fjzx-custom-input form-control' />\
						<span class='custom-input-group-addon'>\
							<span class='icon fa-ellipsis-horizontal'></span>\
						</span>\
					</div>\
				</div>\
			</div>\
		</div>";
		var $item = $($.formatStr(itemTemplate,record));
		var $input = $item.find("input.fjzx-custom-input");
		$input.data("record",record);
		if(record.propHasValue!="true"){
			$input.val(record.propDefaultValue);
		}else{
			$input.val(record.propValue);
		}
		var $span = $item.find("span.custom-input-group-addon");
		$span.css("cursor","pointer");
		$span.click(function(){
			thisDialog._showCustomInfoOptionalValues($input,record.propOptionalValues);
		});
		this._$customInputContainer.append($item);
	},
	_initCustomInfoDropdownBox: function(){
		var thisDialog = this;
		thisDialog._mouseOver = false;
		var template = "<div class='fjzx-prog-dropdown-custom-input-select'>\
				<ul class='fjzx-prog-dropdown-custom-input-select-list'>\
				</ul>\
			</div>";
		this._$customInfoDropdownBox = $(template);
		this._$customInfoDropdownBox.find("button.fjzx-prog-dropdown-custom-input-select-close").click(function(){
			thisDialog._$customInfoDropdownBox.hide();
		});
	},
	_setCustomInfoDropdownBoxValues: function($input,values){
		var thisDialog = this;
		if(!this._$customInfoDropdownBox){
			this._initCustomInfoDropdownBox();
		}
		var $ul = this._$customInfoDropdownBox.find("ul.fjzx-prog-dropdown-custom-input-select-list");
		$ul.empty();
		for(var i=0;i<values.length;i++){
			var $item = $($.formatStr("<li>{text:value}</li>",{value:values[i]}));
			$item.data("value",values[i]);
			$ul.append($item);
			$item.click(function(){
				$input.val($(this).data("value"));
				$input.focus();
				thisDialog._$customInfoDropdownBox.hide();
				thisDialog._mouseOver = false;
			});
		}
	},
	_showCustomInfoOptionalValues: function($input,propOptionalValues){
		var thisDialog = this;
		if(!this._$customInfoDropdownBox){
			this._initCustomInfoDropdownBox();
		}
		this._setCustomInfoDropdownBoxValues($input,propOptionalValues);
		$input.parent().after(this._$customInfoDropdownBox);
		this._$customInfoDropdownBox.show();
		$input.focus();
		
		$input.unbind("blur").blur(function(){
			if(!thisDialog._mouseOver)
				thisDialog._$customInfoDropdownBox.hide();
		});

		this._$customInfoDropdownBox.unbind("mouseover").mouseover(function(){
			thisDialog._mouseOver = true;
		});
		
		this._$customInfoDropdownBox.unbind("mouseout").mouseout(function(){
			thisDialog._mouseOver = false;
		});
	},
	/*私有方法 -结束-*/

	/*公有方法 -开始-*/
	close: function(){
		this._$container.modal("hide");
		this._$container.find("input,select").blur();
	},
	open: function(inputFormData,openCallback){
		
		var _this = this;
		this._inputFormData = inputFormData;
		this._clearForm();
		if(inputFormData){
			this._setFormData(inputFormData);
		}
		this._enableElements();
		this._disableElements();
		this._show(openCallback);
		fjzx.ui.inEditing = true;
		/*if(typeof(openCallback)=="function"){   //up by YFC, 回调函数在底层bootstrap中实现，解决打开后不能正确获取元素的bug
			setTimeout(function(){
				openCallback(_this._$container);
			},1000);
		}*/
			
	},
	find: function(selector){
		var thisDialog = this;
		fjzx.ui.checkSelectorUnique(selector,thisDialog._$container);
		if(!thisDialog._actionMap)
			thisDialog._actionMap = {};
		return {
			setAction: function(actionCallback){
				var $selector = thisDialog._$container.find(selector);
				$selector.click(function(e){
					e.preventDefault();
					thisDialog._processAction(selector);
				});
				thisDialog._actionMap[selector] = actionCallback;
			},
			setActionClose: function(closeCallback){
				thisDialog._closeCallback = closeCallback;
				var $selector = thisDialog._$container.find(selector);
				$selector.click(function(e){
					e.preventDefault();
					thisDialog._closeByConfirm();
				});
			}
		};
	},
	setOnShowListener: function(onShowListener){
		this._onShowListener = onShowListener;
	},
	setFormDataCustomInfo: function(data){
		if(!this._fjzxCustomInputFieldName)
			return;
		
		if(!data[this._fjzxCustomInputFieldName]){
			alert("record中没有自定义信息字段（\""+this._fjzxCustomInputFieldName+"\"）的值");
			return;
		}
		
		this._$customInputContainer.empty();
		var values = JSON.parse(data[this._fjzxCustomInputFieldName]);
		for(var i=0;i<values.length;i++){
			var value = values[i];
			this._addOneCustomInfo(value);
		}
		this._resetTop();
	},
	getFormDataCustomInfo: function(formData){
		if(!this._fjzxCustomInputFieldName)
			return formData;
		
		var resultArray = [];
		this._$customInputContainer.find("input.fjzx-custom-input").each(function(){
			var record = $(this).data("record");
			var resultRecord = $.cloneData(record);
			
			resultRecord.propValue = $(this).val();
			resultRecord.propHasValue = "true";
			resultArray.push(resultRecord);
		});

		var data = {};
		data.inputType = "text";
		data.dataType = "fjzx-prog-string";
		data.nullable = false;
		data.tipName = "自定义信息";
		data.value = JSON.stringify(resultArray);
		
		formData[this._fjzxCustomInputFieldName] = data;
		
		return formData;
	}
	/*公有方法 -结束-*/
};

/**
 * 通用列表
 */
fjzx.ui.TableList = function(selector,onCreateCallback){
	fjzx.ui.checkSelectorUnique(selector);
	this._containerSelector = selector;
	this._$container = $(selector);
	this._$tableContainer = $("<div class='wrap-overflow'>\
		<table class='table' style='margin-bottom: 0px;'>\
			<thead><tr></tr></thead>\
			<tbody></tbody>\
		</table>\
	</div>");
	this._$table = this._$tableContainer.find("table"); 
	this._$container.append(this._$tableContainer);
	this._page = 1;
	this._$queryForm = null;

	this._itemList = [];

	this._$pagePanel = $("<div class='pagination' style='margin-top: 10px;'><ul class='l'></ul><div class='pagination-info'></div></div>");
	this._$pageContainer = this._$pagePanel.find("ul");
	this._$paginationInfo = this._$pagePanel.find("div.pagination-info");
	this._$container.append(this._$pagePanel);

	if(typeof(onCreateCallback)=="function")
		onCreateCallback(this._$container);
};
fjzx.ui.TableList.prototype = {
	setColumns: function(array){
		var totalWidth = 0;
		for(var i=0;i<array.length;i++){
			totalWidth = totalWidth + Number(array[i].width);
		}
		/*
		var $tableParent = this._$table.parents(".fjzx-prog-page-tabs-content:first");
		var tableParentWidth = $tableParent.width();
		if(totalWidth>0){
			var width = totalWidth;
			if(width<tableParentWidth)
				width = tableParentWidth;
			this._$table.width(width);
			this._$table.css("max-width",width);//ie8没这一句则指定宽度无效，因为bootstrap默认设置table的max-width为100%
		}else{
			this._$table.css("width","100%");
		}*/
		this._$table.css("width","100%");

		var $headTr = this._$table.find(">thead>tr");
		for(var i=0;i<array.length;i++){
			var $th = $("<th></th>");
			$th.html(array[i].caption);
			$th.width(Number(array[i].width));
			$headTr.append($th);
		}
		this._maxColspan = array.length;
		var colspan = {colspan: this._maxColspan};
		this._emptyTemplate = $.formatStr("<tr><td colspan={text:colspan}>\
			<div style='height: 30px;text-align: center;'>没有符合条件的记录</div>\
		</td></tr>",colspan);
	},
	changeColumns: function(array){
		var totalWidth = 0;
		for(var i=0;i<array.length;i++){
			totalWidth = totalWidth + Number(array[i].width);
		}
		this._$table.css("width","100%");

		var $headTr = this._$table.find(">thead>tr");
		$headTr.empty();
		for(var i=0;i<array.length;i++){
			var $th = $("<th></th>");
			$th.html(array[i].caption);
			$th.width(Number(array[i].width));
			$headTr.append($th);
		}
		this._maxColspan = array.length;
		var colspan = {colspan: this._maxColspan};
		this._emptyTemplate = $.formatStr("<tr><td colspan={text:colspan}>\
			<div style='height: 30px;text-align: center;'>没有符合条件的记录</div>\
		</td></tr>",colspan);
	},
	setItemView: function(itemView){
		this._itemView = itemView;
	},
	setOnLoadPageListener: function(loadDataCallback){
		this._loadDataCallback = loadDataCallback;
	},
	reload: function(activeId,reloadFinishedCallback){
		this.load(this._page,activeId);
		this._reloadFinishedCallback = reloadFinishedCallback;
	},
	load: function(page,activeId){
		this._page = page;
		this._loadDataCallback(page,this._getQueryFormData(),activeId);
	},
	setOnItemListener: function(append,beforeAppend){
		this._append = append;
		this._beforeAppend = beforeAppend;
	},
	_clearActive: function(){
			this._$table.find("tr.fjzx-active").removeClass("fjzx-active");
	},
	setActive: function($item){
		this._clearActive();
		$item.addClass("fjzx-active");
	},
	getActiveId: function(){
		var activeRecord = this.getActiveRecord();
		if(activeRecord.id)
			return activeRecord.id;
		else
			return "";
	},
	getActiveRecord: function(){
		var $trActive = this._$table.find("tr.fjzx-active");
		if($trActive.size()>0){
				return $trActive.data("record");
		}
		$trActive = this._$table.find("tbody tr:first");
		if($trActive.size()<=0 || !$trActive.data("record"))
			return {id:"ID not exists!"};
		
		$trActive.addClass("fjzx-active");
		return $trActive.data("record");
	},
	_buildBody: function(list,activeId,pageSize){
		this._itemList = [];
		var tbodySelector = "tbody";
		fjzx.ui.checkSelectorUnique(tbodySelector,this._containerSelector);
		var $tbody = this._$table.find(tbodySelector);
		$tbody.empty();
		if(list.length<=0){
			var $itemEmpty = $(this._emptyTemplate);
			fjzx.ui.validateElement($itemEmpty);
			$tbody.append($itemEmpty);
			$itemEmpty.find("span").hide().fadeIn(1000);
			pageSize--;
		}
		for(var i=0;i<pageSize;i++){
			if(i<list.length){
				if(typeof(this._beforeAppend)=="function"){
					this._beforeAppend(list[i]);
				}
				var $item = $($.formatStr(this._itemView,list[i]));
				$item.data("record",list[i]);
				if(i%2 != 0)
					$item.addClass("tr-odd");
				if(activeId && list[i].id==activeId)
					this.setActive($item);
				fjzx.ui.validateElement($item);
				$item.hover(
					function(){
						$(this).addClass("fjzx-hover");
					},
					function(){
						$(this).removeClass("fjzx-hover");
					}
				);
				if(typeof(this._append)=="function"){
					if(this._append($item,list[i]))
						$tbody.append($item);
				}else
					$tbody.append($item);
				this._itemList.push({item:$item,record:$.cloneData(list[i])});
			}else{
				var $emptyLine = $($.formatStr("<tr><td colspan={text:colspan}><div style='width: 30px;height: 30px;'></div></td></tr>",{colspan:this._maxColspan}));
				if(i%2 != 0)
					$emptyLine.addClass("tr-odd");
				$tbody.append($emptyLine);
			}
		}
	},
	_buildFoot: function(sizeInfo){
		if(sizeInfo.hide){
			this._$pagePanel.hide();
			return;
		}else{
			this._$pagePanel.show();
		}
		page = Number(sizeInfo.page);
		pageSize = Number(sizeInfo.pageSize);
		maxPage = Number(sizeInfo.maxPage);
		maxSize = Number(sizeInfo.maxSize);
		if(maxPage==0)
			maxPage = 1;
		
		var startPage = page - 5;
		var endPage = page + 5;
		if(startPage<1){
			endPage = endPage - startPage;
			startPage = 1;
		}
		if(endPage>maxPage)
			endPage = maxPage;
		
		this._$pageContainer.empty();
		var item;
		var thisTableList = this;
		if(page>1){
			item = $("<li targetPage='"+1+"'><a href='javascript:void(0);'>首页</a></li>");
			item.click(function(){
				var targetPage = $(this).attr("targetPage");
				thisTableList.load(Number(targetPage),thisTableList._getQueryFormData());
			});
			this._$pageContainer.append(item);
			var prevPage = page-1;
			item = $("<li targetPage='"+prevPage+"'><a href='javascript:void(0);'>前页</a></li>");
			item.click(function(){
				var targetPage = $(this).attr("targetPage");
				thisTableList.load(Number(targetPage),thisTableList._getQueryFormData());
			});
			this._$pageContainer.append(item);
		}else{
			item = $("<li class='disabled'><a href='javascript:void(0);'>首页</a></li>");
			this._$pageContainer.append(item);
			item = $("<li class='disabled'><a href='javascript:void(0);'>前页</a></li>");
			this._$pageContainer.append(item);
		}
		for(var i=startPage;i<endPage+1;i++){
			var index = i;
			if(page==index){
				item = $("<li class='active' targetPage='"+index+"' title='刷新本页'><a href='javascript:void(0);'>"+index+"</a></li>");
			}else{
				item = $("<li targetPage='"+index+"'><a href='javascript:void(0);'>"+index+"</a></li>");
			}
			item.click(function(){
				var targetPage = $(this).attr("targetPage");
				thisTableList.load(Number(targetPage),thisTableList._getQueryFormData());
			});
			this._$pageContainer.append(item);
		}
		if(page<maxPage){
			var nextPage = page+1;
			item = $("<li targetPage='"+nextPage+"'><a href='javascript:void(0);'>后页</a></li>");
			item.click(function(){
				var targetPage = $(this).attr("targetPage");
				thisTableList.load(Number(targetPage),thisTableList._getQueryFormData());
			});
			this._$pageContainer.append(item);
			item = $("<li targetPage='"+maxPage+"'><a href='javascript:void(0);'>末页</a></li>");
			item.click(function(){
				var targetPage = $(this).attr("targetPage");
				thisTableList.load(Number(targetPage),thisTableList._getQueryFormData());
			});
			this._$pageContainer.append(item);
		}else{
			item = $("<li class='disabled'><a href='javascript:void(0);'>后页</a></li>");
			this._$pageContainer.append(item);
			item = $("<li class='disabled'><a href='javascript:void(0);'>末页</a></li>");
			this._$pageContainer.append(item);
		}
		var $fromGotoPage = $("<form>第<input class='gotoPageValue' type='text' value='"+page+"' />页/"+maxPage+"页 共"+maxSize+"条 "+pageSize+"条/页<button type='submit' style='display: none;'></button></form>");
		$fromGotoPage.find("input:text").keyup(function(e){
			this.value=this.value.replace(/\D/g,'');
		});
		$fromGotoPage.find("input:text").attr("onafterpaste",function(e){
			this.value=this.value.replace(/\D/g,'');
		});
		$fromGotoPage.submit(function(e){
			e.preventDefault();
			var targetPageStr = $fromGotoPage.find("input.gotoPageValue").val();
			thisTableList.load(Number(targetPageStr),thisTableList._getQueryFormData());
		});
		this._$paginationInfo.empty().append($fromGotoPage);
	},
	buildList: function(list,sizeInfo,activeId){
		this._buildBody(list,activeId,sizeInfo.pageSize);
		this._buildFoot(sizeInfo);
		if(this._reloadFinishedCallback){
			this._reloadFinishedCallback();
			this._reloadFinishedCallback = undefined;
		}
	},
	remove: function($item,doRemove){
		$item.addClass("error");
		fjzx.ui.showConfirm(
			"确实要删除吗？删除后将无法恢复",
			function(){
				if(typeof(doRemove)=="function"){
					doRemove(function(){
						$item.removeClass("error");
					});
				}
			},
			function(){
				$item.removeClass("error");
			}
		);
	},
	clearData: function(){
		var $tbody = this._$table.find("tbody");
		$tbody.empty();
		var $itemEmpty = $(this._emptyTemplate);
		$tbody.append($itemEmpty);
		$itemEmpty.find("span").hide().fadeIn(1000);
	},
	_getQueryFormData: function(){
		if(this._$queryForm){
			return JSON.stringify($.getFormData(this._$queryForm));
		}else{
			return "{}";
		}
	},
	_expandQueryForm: function(){
		this._$queryForm.find("ul.fjzx-prog-query-form-list>li.fjzx-prog-query-form-list-item-collapsed").removeClass("fjzx-prog-query-form-list-item-collapsed");
		this._$buttonCollapse.show();
		this._$buttonExpand.hide();
	},
	_collpaseQueryForm: function(){
		this._$queryForm.find("ul.fjzx-prog-query-form-list>li.fjzx-prog-query-form-list-item-collapsed-original").addClass("fjzx-prog-query-form-list-item-collapsed");
		this._$buttonCollapse.hide();
		this._$buttonExpand.show();
	},
	setQueryForm: function(formSelector){
		fjzx.ui.checkSelectorUnique(formSelector);
		var thisTableList = this;
		this._$queryForm = $(formSelector);
		this._$queryForm.submit(function(e){
			e.preventDefault();
			if(!fjzx.ui.validateDataType(thisTableList._$queryForm))
				return;
			thisTableList.load(1);
		});
		fjzx.ui.checkSelectorUnique(formSelector);
		var buttonResetSelector = "button.fjzx-prog-reset";
		fjzx.ui.checkSelectorUnique(buttonResetSelector,formSelector);
		this._$queryForm.find(buttonResetSelector).click(function(e){
			e.preventDefault();
			$.resetFormData(thisTableList._$queryForm);
			thisTableList.load(1);
		});
		var buttonExpandSelector = "button.fjzx-prog-button-query-form-expand";
		fjzx.ui.checkSelectorUnique(buttonExpandSelector,formSelector);
		this._$buttonExpand = this._$queryForm.find(buttonExpandSelector);
		this._$buttonExpand.click(function(){
			thisTableList._expandQueryForm();
		});
		var buttonCollapseSelector = "button.fjzx-prog-button-query-form-collapse";
		fjzx.ui.checkSelectorUnique(buttonCollapseSelector,formSelector);
		this._$buttonCollapse = this._$queryForm.find(buttonCollapseSelector);
		this._$buttonCollapse.click(function(){
			thisTableList._collpaseQueryForm();
		});
		var $collapseLi = this._$queryForm.find("ul.fjzx-prog-query-form-list>li.fjzx-prog-query-form-list-item-collapsed");
		if($collapseLi.size()>0){
			this._$buttonExpand.show();
			$collapseLi.each(function(){
				$(this).addClass("fjzx-prog-query-form-list-item-collapsed-original");
			});
		}
	},
	eachItem: function(eachItemCallback){
		for(var i=0;i<this._itemList.length;i++){
			var $item = this._itemList[i].item;
			var record = this._itemList[i].record;
			eachItemCallback($item,record);
		}
	}
};

/**
 * 下拉选择框
 */
fjzx.ui.ComponentSelect = function($componentSelect){
	var thisComponent = this;
	this._mouseOver = false;
	
	this._$selectDialog = $("<div class='fjzx-prog-dropdown-select' style='display: none;'>\
		<div class='fjzx-prog-dropdown-select-search-wrapper input-append'>\
			<form>\
				<table style='width: 100%;'>\
					<tr>\
						<td style='padding-right: 21px;'><input class='fjzx-prog-dropdown-select-search-input' placeholder='搜索' value='' type='text' style='width: 100%;'/></td>\
						<td style='width: 32px;'><button class='fjzx-prog-dropdown-select-search-button btn' type='submit'><span class='icon fa-search'></span></button></td>\
					</tr>\
				</table>\
			</form>\
		</div>\
		<ul class='fjzx-prog-dropdown-select-list'></ul>\
		<table style='width: 100%;'>\
			<tr>\
				<td nowrap>\
					<div class='fjzx-prog-dropdown-select-pagination pagination pagination-small'>\
						<ul>\
							<li><a class='fjzx-prog-prev' href='javascript: void(0);'>&laquo;</a></li><!--上一页-->\
							<li><input class='fjzx-prog-page-input' type='text' value='1' readonly style='cursor: default;' /></li><!--当前页数-->\
							<li><a class='fjzx-prog-next' href='javascript: void(0);'>&raquo;</a></li><!--下一页-->\
						</ul>\
					</div>\
				</td>\
				<td nowrap style='text-align: right;padding-right: 10px;'>\
					<button class='fjzx-prog-dropdown-select-reset btn' type='button' style='padding: 2px 6px;vertical-align: baseline;'>清空</button>\
					<button class='fjzx-prog-dropdown-select-close btn' type='button' style='padding: 2px 6px;vertical-align: baseline;'>关闭</button>\
					<button class='fjzx-prog-dropdown-select-confirm btn btn btn-primary' type='button' style='padding: 2px 6px;vertical-align: baseline;'>确定</button>\
				</td>\
			</tr>\
		</table>\
	</div>");
	$componentSelect.append(this._$selectDialog);

	this._$input = $componentSelect.find("input.fjzx-prog-component-select");
	this._$inputWrapper = $componentSelect.find("div.fjzx-prog-component-select-wrapper");
	this._$form = $componentSelect.find("form");
	
	this._$searchInput = this._$selectDialog.find("input.fjzx-prog-dropdown-select-search-input");
	this._$list = this._$selectDialog.find("ul.fjzx-prog-dropdown-select-list");
	
	this._$buttonSearch = this._$selectDialog.find("button.fjzx-prog-dropdown-select-search-button");
	this._$buttonReset = this._$selectDialog.find("button.fjzx-prog-dropdown-select-reset");
	this._$buttonClose = this._$selectDialog.find("button.fjzx-prog-dropdown-select-close");
	this._$buttonConfirm = this._$selectDialog.find("button.fjzx-prog-dropdown-select-confirm");
	
	this._$panelSearch = this._$selectDialog.find("div.fjzx-prog-dropdown-select-search-wrapper");
	this._$panelPage = this._$selectDialog.find("div.fjzx-prog-dropdown-select-pagination");
	
	this._$buttonPrevPage = this._$panelPage.find("a.fjzx-prog-prev");
	this._$pageInfo = this._$panelPage.find("input.fjzx-prog-page-input");
	this._$buttonNextPage = this._$panelPage.find("a.fjzx-prog-next");
	
	//获取多选属性
	var multiSelect = this._$input.attr("fjzx_multi_select");
	if(multiSelect && multiSelect.toLowerCase()=="true")
		this._multiSelect = true;
	else
		this._multiSelect = false;
	if(this._multiSelect){
		this._$buttonClose.remove();
	}else{
		this._$buttonConfirm.remove();
	}

	//获取parent component fjzx_select_field_name
	this._parentId = this._$input.attr("fjzx_select_field_name_parent");
	//获取parent component fjzx_select_field_name
	this._treeParentId = this._$input.attr("fjzx_tree_select_field_name_parent");
	//获取descendent component fjzx_select_field_name
	var ids = this._$input.attr("fjzx_select_field_name_descendent");
	if(ids){
		this._descendentIdList = ids.split(",");
	}else{
		this._descendentIdList = [];
	}
	
	//查询框提交
	this._$form.submit(function(e){
		e.preventDefault();
		e.stopPropagation();
		
		thisComponent._doLoadData(1);
	});
	
	//组件获得焦点时，查询并加载第一页，并显示选择框
	this._$input.focus(function(){
		thisComponent._$searchInput.val("");
		thisComponent._doLoadData(1);
	});
	//关闭按钮事件
	this._$buttonClose.click(function(){
		thisComponent._hide();
	});
	//清空按钮事件
	this._$buttonReset.click(function(){
		thisComponent.setValue("", "");
		thisComponent._resetDescendentComponentSelect();
		thisComponent.close();
	});
	//鼠标进入选择框时记录状态，有了_mouseOver这个状态，就可以让查询输入框blur并且鼠标在选择框之外时关闭选择框
	this._$selectDialog.mouseover(function(){
		thisComponent._mouseOver = true;
	});
	//鼠标离开选择框时记录状态
	this._$selectDialog.mouseout(function(){
		thisComponent._mouseOver = false;
	});
	//选择框中上下键可以进行选择
	this._$searchInput.keydown(function(e){
		thisComponent._doUpDownSelectActivate(e);
	});
	//查询输入框blur并且鼠标在选择框之外时关闭选择框
	this._$searchInput.blur(function(){
		if(!thisComponent._mouseOver)
			thisComponent._hide();
	});
	//多选时可以点击确定按钮
	this._$buttonConfirm.click(function(e){
		e.preventDefault();
		e.stopPropagation();

		var valueList = [];
		var nameList = [];
		for(var i=0;i<thisComponent._values.length;i++){
			valueList.push(thisComponent._values[i].value);
			nameList.push(thisComponent._values[i].name);
		}
		
		var newName = nameList.join(",");
		var newValue = valueList.join(",");
		
		var oldValue = thisComponent._$input.attr("fjzx_select_field_value");
		if(oldValue!=newValue){
			thisComponent.setValue(newValue, newName);
			thisComponent._resetDescendentComponentSelect();
			if(typeof(thisComponent._onChangeCallback)==="function"){
				thisComponent._onChangeCallback(newValue,newName,oldValue);
			}
		}
		//将焦点跳转到下一个input[fjzx_field_name]
		thisComponent._switchToNextFocus();
		
		thisComponent._hide();
	});
	this._values = [];
	
	var id = $componentSelect.find("input[fjzx_select_field_name]").attr("fjzx_select_field_name");
	
	for(var i=0;i<fjzx.ui.componentSelectList.length;i++){
		var componentSelect = fjzx.ui.componentSelectList[i];
		if(componentSelect.name===id){
			if(this._$input.attr("fjzx_select_field_name_parent")!="" || this._$input.attr("fjzx_select_field_name_descendent")!=""){
				alert("ComponentSelect组件id已经存在，id='"+id+"'");
				return;	
			}
		}
	}
	fjzx.ui.componentSelectList.push({name:id,instance:this});
};

fjzx.ui.ComponentSelect.prototype = {
		/*私有方法 -开始-*/
		_show: function(){
			fjzx.ui.closeAllComponentSelect();
			if(this._$input.hasClass("fjzx-prog-disabled")){
				return;
			}
			this._values = [];
			this._initValues();
			var scrollTopValue = $('.wrap-overflow').scrollTop();
			var inputWidth = this._$inputWrapper.width();
			var inputHeight = parseInt(this._$inputWrapper.height());
			this._$selectDialog.css({'width':inputWidth});
			this._$inputWrapper.addClass("fjzx-prog-component-select-wrapper-focus");
			this._$selectDialog.show();
			//优化formDialog 下拉组件 出现滚动条不美观问题
			var inputOffsetTop = parseInt(this._$inputWrapper.offset().top);
			var docHeight = parseInt($('.modal-backdrop').height());
			this._selectDialogHeight = parseInt(this._$selectDialog.height());
			this._selectDialogOffsetTop = parseInt(this._$selectDialog.offset().top);
			
			if(docHeight - inputOffsetTop - inputHeight < this._selectDialogHeight) {
				var selectDialogTop = inputOffsetTop - this._selectDialogHeight - inputHeight - scrollTopValue + 17;
				this._$selectDialog.css({'top':selectDialogTop});
			}else {
				var normalTopValue = inputOffsetTop + inputHeight;
				if(normalTopValue<=0){
					normalTopValue=0;
				}
				this._$selectDialog.css({'top':normalTopValue});
			}
			
			this._$searchInput.focus();
		},
		_initValues: function(){
			var values = this._$input.attr("fjzx_select_field_value");
			if(values){
				var valueList = values.split(",");
				var names = this._$input.val();
				var nameList = names.split(",");
				for(var i=0;i<valueList.length;i++){
					this._values.push({
						value: valueList[i],
						name: nameList[i]
					});
				}
			}
		},
		_hide: function(){
			this._$inputWrapper.removeClass("fjzx-prog-component-select-wrapper-focus");
			this._$selectDialog.hide();
		},
		_doLoadData: function(page){
			var thisComponent = this;
			var queryParentId = "";
			if(this._parentId){
				var parentComponentSelect = fjzx.ui.getComponentSelect(this._parentId);
				var v = parentComponentSelect.getValue();
				queryParentId = v.value;
			}else if(this._treeParentId){
				var parentTreeComponentSelect = fjzx.ui.getComponentTreeSelect(this._treeParentId);
				var v = parentTreeComponentSelect.getValue();
				queryParentId = v.value;
			}
			var queryValue = this._$searchInput.val();
			var selectType = this._$input.attr("fjzx_select_type");
			SystemCode.getComponentSelectList(
					selectType,
					queryParentId,
					queryValue,
					page,
					function(data){
						thisComponent._buildList(data.list);
						thisComponent._buildPageInfo(data.sizeInfo);
						thisComponent._show();
					},
					function(){
					}
			);
		},
		_buildList: function(list){
			var thisComponent = this;
			var id = $.getUUID();
			this._$list.empty();
			for(var i=0;i<list.length;i++){
				var template = "<li><input id='{text:id}_{text:index}' type='checkbox' /><label for='{text:id}_{text:index}' style='margin-left: 2px;'></label></li>";
				var $item = $($.formatStr(template,{id:id,index:i}));
				$item.attr("fjzx_prog_code_value",list[i].codeValue);
				$item.attr("fjzx_prog_code_name",list[i].codeName);
				$item.find("label").text(list[i].codeName);
				if(!this._multiSelect){
					$item.find("input:checkbox").remove();
					$item.click(function(){
						thisComponent._doSelectValue($(this));
					});
				}else{
					if(thisComponent._existsValue(list[i].codeValue))
						$item.find("input:checkbox").prop("checked","true");
					$item.find("input:checkbox").click(function(e){
						var checked = $(this).prop("checked");
						var $thisItem = $(this).parents("li:first");
						if(checked){
							thisComponent._doAddSelectValue({
								value:$thisItem.attr("fjzx_prog_code_value"),
								name:$thisItem.attr("fjzx_prog_code_name")
							});	
						}else{
							thisComponent._doRemoveSelectValue($thisItem.attr("fjzx_prog_code_value"));	
						}
					});
				}
				this._$list.append($item);
			}
		},
		_existsValue: function(value){
			for(var i=0;i<this._values.length;i++){
				if (this._values[i].value == value) {
					return true;
				}
			}
			return false;
		},
		_doAddSelectValue: function(data){
			this._values.push(data);
		},
		_doRemoveSelectValue: function(value){
			for(var i=this._values.length-1;i>=0;i--){
				if (this._values[i].value == value) {
					this._values.splice(i, 1);
				}
			}
		},
		_buildPageInfo: function(sizeInfo){
			this._setPanelPageInfo(sizeInfo);
		},
		_setPanelPageInfo: function(sizeInfo){
			var thisComponent = this;
			
			var page = Number(sizeInfo.page);
			var maxPage = Number(sizeInfo.maxPage);
			
			this._$buttonPrevPage.unbind("click").click(function(e){
				e.preventDefault();
				e.stopPropagation();
			});
			this._$pageInfo.val(page+"/"+maxPage);
			this._$buttonNextPage.unbind("click").click(function(e){
				e.preventDefault();
				e.stopPropagation();
			});
			
			var prevPage = page - 1;
			if(prevPage<1)
				prevPage = undefined;
			var nextPage = page + 1;
			if(nextPage>maxPage)
				nextPage = undefined;
			
			if(prevPage)
				this._$buttonPrevPage.click(function(e){
					e.preventDefault();
					e.stopPropagation();
					
					thisComponent._doLoadData(prevPage);
				});
			if(nextPage)
				this._$buttonNextPage.click(function(e){
					e.preventDefault();
					e.stopPropagation();
					
					thisComponent._doLoadData(nextPage);
				});
		},
		_doUpDownSelectActivate: function(e){
			var thisComponent = this;
			if (e.keyCode===13){//enter
				var $li = thisComponent._$list.find("li.active:first");
				if($li.size()>0){
					thisComponent._doSelectValue($li);
					
					e.preventDefault();
					e.stopPropagation();					
				}
			}else if(e.keyCode===38){//up
				var $li = thisComponent._$list.find("li.active:first");
				if($li.size()>0){
					var $prev = $li.prev();
					$prev.addClass("active");
					$li.removeClass("active");
				}else{
					thisComponent._$list.find("li:last").addClass("active");
				}
				e.preventDefault();
				e.stopPropagation();
			}else if(e.keyCode===40){//down
				var $li = thisComponent._$list.find("li.active:first");
				if($li.size()>0){
					var $next = $li.next();
					$next.addClass("active");
					$li.removeClass("active");
				}else{
					thisComponent._$list.find("li:first").addClass("active");
				}
				e.preventDefault();
				e.stopPropagation();
			}else if(e.keyCode===27){
				thisComponent._hide();
				thisComponent._switchToNextFocus();
				
				e.preventDefault();
				e.stopPropagation();
			}
		},
		_doSelectValue: function($item){
			var newName = $item.attr("fjzx_prog_code_name");
			var newValue = $item.attr("fjzx_prog_code_value");
			
			var oldValue = this._$input.attr("fjzx_select_field_value");
			if(oldValue!=newValue){
				this.setValue(newValue, newName);
				this._resetDescendentComponentSelect();
				if(typeof(this._onChangeCallback)==="function"){
					this._onChangeCallback(newValue,newName,oldValue);
				}
			}
			//将焦点跳转到下一个input[fjzx_field_name]
			this._switchToNextFocus();
			
			this._hide();
		},
		_switchToNextFocus: function(){
			var $form = this._$input.parents("form:first");
			var allInputs = $form.find("input[fjzx_field_name]");
			var index = allInputs.index(this._$input);
			index++;
			if(index<allInputs.size()){
				$nextInput = $(allInputs.get(index))
				if(!$nextInput.hasClass("fjzx-prog-component-select") && !$nextInput.hasClass("fjzx-prog-component-tree-select") && !$nextInput.hasClass("fjzx-prog-date"))
					$nextInput.focus();
			}
		},
		_resetDescendentComponentSelect: function(){
			if(this._descendentIdList.length>0){
				for(var i=0;i<this._descendentIdList.length;i++){
					var descendentId = this._descendentIdList[i];
					var descendentComponentSelect = fjzx.ui.getComponentSelect(descendentId);
					descendentComponentSelect.setValue("","");
				}
			}
		},
		/*私有方法 -结束-*/
		
		/*公有方法 -开始-*/
		close: function(){
			this._hide();
		},
		setOnChange: function(onChangeCallback){
			this._onChangeCallback = onChangeCallback;
		},
		setValue: function(newValue,newName){
			this._$input.val(newName);
			this._$input.attr("fjzx_select_field_value",newValue);
		},
		getValue: function(){
			return {
				value: this._$input.attr("fjzx_select_field_value"),
				name: this._$input.val()
			};
		},
		enable: function(){
			this._$input.removeClass("fjzx-prog-disabled");
		},
		disable: function(){
			this._$input.addClass("fjzx-prog-disabled");
		}
		/*公有方法 -结束-*/
};

/**
 * 用iframe实现的tabs，可以动态增、删tab
 * 主要用于菜单
 * @param selector
 */
fjzx.ui.FrameTabs = function(selector){
	this._$container = $(selector);
	this._$navContainer = this._$container.find("ul.fjzx-prog-frame-tabs-nav");
	this._$contentContainer = this._$container.find("div.fjzx-prog-frame-tabs-content");
	this._tabList = [];
	this._tabMap = {};
	this._minTop = -1;//内部变量，记录所有$tabNav的最小offset().top，如果比这个大的$tabNav，则说明该$tabNav被折行了
	
	this._initTabs();
};

fjzx.ui.FrameTabs.prototype = {
	/*私有方法 -开始-*/
	_initTabs: function(){
		var thisTabs = this;

		this._$buttonCloseAll = $("<li class='fjzx-prog-frame-tabs-nav-close-all'><a href='javascript: void(0);' title='关闭全部菜单'>×</a></li>");
		/*解决后面this._$buttonCloseAll.remove()方法不存在的问题-begin-*/
		this._$navContainer.append(this._$buttonCloseAll);
		this._$buttonCloseAll.remove();
		this._tabMap["fjzx-prog-frame-tabs-nav-close-all"] = this._$buttonCloseAll;/*this._tabMap是用来删除全部tab的，这里加上，这样删除的时候才能将按钮“全部删除”本身也删除*/
		/*-end-*/
		
		this._$dropdownMenu = this._$navContainer.find("li.fjzx-prog-frame-tabs-nav-more>ul.fjzx-prog-dropdown-menu");
		this._$dropdownMenu.remove();//脱离文档流
		$("body").append(this._$dropdownMenu);//重新加入body文档流
		
		this._getTabNavDropdownAble().each(function(){
			var $thisTabNav = $(this);
			var contentId = $thisTabNav.attr("fjzx_prog_tab_target");
			var $content = thisTabs._$container.find("div#"+contentId);
			$thisTabNav.$content = $content;
			$thisTabNav.click(function(){
				thisTabs._clearDropdownTabNavActivated();
				thisTabs._activateTab($thisTabNav);
			});
			$thisTabNav.find(".fjzx-prog-close-menu-tab").click(function(){
				thisTabs._removeTab(contentId);
			});
			
			thisTabs._tabList.push($thisTabNav);
			thisTabs._tabMap[contentId] = $thisTabNav;
			
			thisTabs._arrangeTabs();
		});
		
		this._$dropdownMenu.mouseover(function(){
			thisTabs._tabNavDropdownMouseIn = true;
		});
		this._$dropdownMenu.mouseout(function(){
			thisTabs._tabNavDropdownMouseIn = false;
		});
		
		this._$buttonTabsNavMore = this._$navContainer.find("li.fjzx-prog-frame-tabs-nav-more>a");
		this._$buttonTabsNavMore.click(function(){
			var $buttonTabsNavMoreContainer = $(this).parent("li");
			thisTabs._$dropdownMenu.show();
			thisTabs._$dropdownMenu.css("top",$buttonTabsNavMoreContainer.offset().top+$buttonTabsNavMoreContainer.height()+"px");
			$(this).find("input").focus();
		});
		this._$buttonTabsNavMore.find("input").blur(function(){
			if(!thisTabs._tabNavDropdownMouseIn)
				thisTabs._$dropdownMenu.hide();
		});
		
		$(window).resize(function(){
			thisTabs._arrangeTabs();
		});
	},
	_deactivateAllTabs: function(){
		this._$container.find(".fjzx-prog-frame-tabs-nav-active").removeClass("fjzx-prog-frame-tabs-nav-active");
		this._$container.find(".fjzx-prog-frame-tabs-content-active").removeClass("fjzx-prog-frame-tabs-content-active");
	},
	_activateTab: function($tabNav,refresh){
		this._deactivateAllTabs();
		if(refresh){
			$tabNav.$content.find('iframe').attr('src', $tabNav.$content.find('iframe').attr('src'));
		}
		if($tabNav.hasClass("fjzx-prog-frame-tabs-nav-close-all"))
			return;
		$tabNav.addClass("fjzx-prog-frame-tabs-nav-active");
		$tabNav.$content.addClass("fjzx-prog-frame-tabs-content-active");
		
		var top = $tabNav.offset().top;
		if(this._minTop===-1||top<this._minTop)
			this._minTop = top;
	},
	_arrangeTabs: function(){
		this._addButtonCloseAll();
		this._arrangeTabsIntoDropdown();
	},
	_addButtonCloseAll: function(){
		var thisTabs = this;
		
		this._tabList.remove(this._$buttonCloseAll);
		this._$buttonCloseAll.remove();
		
		var size = this._getTabNavCommon().size();
		if(size>0){
			this._$buttonCloseAll.click(function(){
				thisTabs._removeAllTabs();
				thisTabs._arrangeTabs();
			});
			this._$navContainer.append(this._$buttonCloseAll);
			this._tabList.push(this._$buttonCloseAll);
		}
	},
	_getTabNavCommon: function(){
		return this._$navContainer.find(">li")
			.not(".fjzx-prog-frame-tabs-nav-uncloseable")
			.not(".fjzx-prog-frame-tabs-nav-more")
			.not(".fjzx-prog-frame-tabs-nav-close-all");
	},
	_getTabNavDropdownAble: function(){
		return this._$navContainer.find(">li")
		.not(".fjzx-prog-frame-tabs-nav-more");
	},
	_arrangeTabsIntoDropdown: function(){
		var thisTabs = this;
		var $ulMore = this._$dropdownMenu;
		$ulMore.empty();
		
		$.each(this._tabList,function(index,$tabNav){
			var top = $tabNav.offset().top;
			if(thisTabs._minTop!=-1 && top!=thisTabs._minTop){
				$ulMore.append(thisTabs._getDropdownTabNav($tabNav));
			}
		});
		if($ulMore.find("li").size()>0)
			thisTabs._getButtonMore().show();
		else
			thisTabs._getButtonMore().hide();
	},
	_getButtonMore: function(){
		return this._$navContainer.find("li.fjzx-prog-frame-tabs-nav-more");
	},
	_getDropdownTabNav: function($tabNav){
		var thisTabs = this;
		
		var caption = $tabNav.find(">a").text();
		var $dropdownTabNav = $($.formatStr("<li><a href='javascript: void(0);' title='{text:caption}'>{text:caption}</a></li>",{caption:caption}));
		if($tabNav.hasClass("fjzx-prog-frame-tabs-nav-close-all"))
			$dropdownTabNav = $($.formatStr("<li><a href='javascript: void(0);' title='{text:caption}'><span class='icon fa-remove' style='font-size: 15px;top: -2px;left: -2px;'></span>{text:caption}</a></li>",{caption:"关闭全部菜单"}));
		$dropdownTabNav.click(function(){
			thisTabs._clearDropdownTabNavActivated();
			var $thisTabNav = $(this);
			thisTabs._activateDropdownTab($thisTabNav);
			if($tabNav.hasClass("fjzx-prog-frame-tabs-nav-close-all"))
				$tabNav.click();
			else
				thisTabs._activateTab($tabNav);
			thisTabs._$dropdownMenu.hide();
		});
		
		return $dropdownTabNav;
	},
	_clearDropdownTabNavActivated: function(){
		this._$dropdownMenu.find("li.fjzx-prog-dropdown-menu-item-activate").removeClass("fjzx-prog-dropdown-menu-item-activate");
	},
	_activateDropdownTab: function($thisTabNav){
		$thisTabNav.addClass("fjzx-prog-dropdown-menu-item-activate");
	},
	_removeTab: function(id){
		var $tabNav = this._tabMap[id];
		var index = this._tabList.indexOf($tabNav);
		if(!$tabNav.hasClass("fjzx-prog-frame-tabs-nav-uncloseable")&&!$tabNav.hasClass("fjzx-prog-frame-tabs-nav-more")){
			$tabNav.remove();
			if(!$tabNav.hasClass("fjzx-prog-frame-tabs-nav-close-all"))
				$tabNav.$content.remove();
			this._tabList.remove($tabNav);
			delete this._tabMap[id];
			
			if(index>this._tabList.length-1)
				index--;
			if(this._tabList[index].hasClass("fjzx-prog-frame-tabs-nav-close-all"))
				index--;
			
			if(index>=0){
				var $currentTabNav = this._tabList[index];
				if($currentTabNav)
					this._activateTab($currentTabNav);
			}
			
			this._arrangeTabs();
		}
	},
	_removeAllTabs: function(){
		this._$buttonCloseAll.remove();
		delete this._tabMap["fjzx-prog-frame-tabs-nav-close-all"];
		for(id in this._tabMap){
			this._removeTab(id);
		}
	},
	/*私有方法 -结束-*/
	/*公有方法 -开始-*/
	gotoTab: function(id,caption,url,refresh,remark){
		var thisTabs = this;
		
		//如果id对应的tab已存在，则切换都该tab
		if(this._tabMap[id]){
			var $tabNav = this._tabMap[id];
			if(refresh){
				$tabNav.$content.find('iframe').attr('src', url);
			}
			this._activateTab($tabNav,refresh);
			return;
		}
		
		if(!remark)
			remark = caption;
		
		//如果id对应的tab不存在，则创建tab
		var $newTabNav = $($.formatStr("<li fjzx_prog_tab_target='{text:id}'><a href='javascript: void(0);' title='{text:remark}'>{text:caption}</a><span class='fjzx-prog-close-menu-tab' title='关闭'>×</span></li>",{id:id,caption:caption,remark:remark}));
		this._$navContainer.append($newTabNav);

		var tabContentTemplate = "<div class='fjzx-prog-frame-tabs-content-active'>\
				<iframe scrolling='no' frameborder='0' marginwidth='0' marginheight='0' src='{text:url}'></iframe>\
			</div>";
		var $newTabContent = $($.formatStr(tabContentTemplate,{url:url}));
		this._$contentContainer.append($newTabContent);
		
		$newTabNav.$content = $newTabContent;
		$newTabNav.click(function(){
			thisTabs._clearDropdownTabNavActivated();
			thisTabs._activateTab($newTabNav);
		});
		$newTabNav.find(".fjzx-prog-close-menu-tab").click(function(){
			thisTabs._removeTab(id);
		});
		
		this._tabList.push($newTabNav);
		this._tabMap[id] = $newTabNav;
		this._activateTab($newTabNav);
		
		this._arrangeTabs();
		
		return $newTabNav;
	},
	closeAllTabs: function(){
		this._removeAllTabs();
	}
	/*公有方法 -结束-*/
};

/**
 * 静态通用的tabs，用来将页面上已经设计好的元素组织成tabs，不能动态增、删tab
 * 主要用于主从表
 * @param selector
 */
fjzx.ui.PageTabs = function(selector){
	this._$container = $(selector);
	this._$navContainer = this._$container.find("ul.fjzx-prog-page-tabs-nav");
	this._$contentContainer = this._$container.find("div.fjzx-prog-page-tabs-content");
	this._tabMap = {};
	this._onTabActiveListenerList = [];
	
	this._initTabs();
};

fjzx.ui.PageTabs.prototype = {
	/*私有方法 -开始-*/
	_initTabs: function(){
		var thisTabs = this;
		this._$navContainer.find(">li").each(function(){
			var $thisTabNav = $(this);
			var contentId = $thisTabNav.attr("fjzx_prog_tab_target");
			var $content = thisTabs._$container.find("div#"+contentId);
			$thisTabNav.$content = $content;
			$thisTabNav.click(function(){
				thisTabs._activateTab($thisTabNav);
			});
			
			thisTabs._tabMap[contentId] = $thisTabNav;
		});
	},
	_deactivateAllTabs: function(){
		this._$container.find(".fjzx-prog-page-tabs-nav-active").removeClass("fjzx-prog-page-tabs-nav-active");
		this._$container.find(".fjzx-prog-page-tabs-content-active").removeClass("fjzx-prog-page-tabs-content-active");
	},
	_activateTab: function($tabNav){
		if($tabNav.hasClass("fjzx-prog-page-tabs-nav-disabled"))
			return;
		
		this._deactivateAllTabs();
		
		$tabNav.addClass("fjzx-prog-page-tabs-nav-active");
		$tabNav.$content.addClass("fjzx-prog-page-tabs-content-active");

		var id = $tabNav.attr("fjzx_prog_tab_target");
		this._triggerOnTabActiveListener(id);
		
		if($tabNav.$content.find("iframe")){
			$tabNav.$content.find("iframe").each(function(){
				$(this).attr('src', $(this).attr('src'));
			});
			
		}
		
		
	},
	_triggerOnTabActiveListener: function(id){
		for(var i=0;i<this._onTabActiveListenerList.length;i++){
			var listener = this._onTabActiveListenerList[i];
			if(listener.id === id){
				var $tabNav = this._tabMap[id];
				listener.onTabActiveListener($tabNav,$tabNav.$content);
			}
		}
	},
	/*私有方法 -结束-*/
	/*公有方法 -开始-*/
	gotoTab: function(id){
		if(this._tabMap[id]){
			var $tabNav = this._tabMap[id];
			this._activateTab($tabNav);
		}
	},
	addOnTabActiveListener: function(id,onTabActiveListener){
		this._onTabActiveListenerList.push({id:id,onTabActiveListener:onTabActiveListener});
	},
	enableTab: function(id,enable){
		var $tabNav = this._tabMap[id];
		if(enable)
			$tabNav.removeClass("fjzx-prog-page-tabs-nav-disabled");
		else
			$tabNav.addClass("fjzx-prog-page-tabs-nav-disabled");
	}
	/*公有方法 -结束-*/
};

/**
 * 通用Form组件，非弹出框式，主要用于页面直接编辑
 * @param selector
 */
fjzx.ui.FormPage = function(selector,onCreateCallback){
	fjzx.ui.checkSelectorUnique(selector);
	this._containerSelector = selector;
	this._$container = $(selector);
	this._$form = this._$container.find("form");

	var thisContainer = this._$container;
	
	if(typeof(onCreateCallback)=="function")
		onCreateCallback(thisContainer);

	this._buildTabEmulator();
};
fjzx.ui.FormPage.prototype = {
	/*私有方法 -开始-*/
	_disableElements: function(){
		this._$container.find("input.fjzx-prog-disabled:text,input.fjzx-prog-disabled:password,textarea.fjzx-prog-disabled").each(function(){
			$(this).readonly();
		});
		this._$container.find("input.fjzx-prog-disabled:radio,input.fjzx-prog-disabled:checkbox,select.fjzx-prog-disabled").each(function(){
			$(this).disable();
		});
	},
	_enableElements: function(){
		this._$container.find("input.fjzx-prog-input:text,input.fjzx-prog-input:password,textarea.fjzx-prog-input").each(function(){
			$(this).writable();
		});
		this._$container.find("input.fjzx-prog-input:radio,input.fjzx-prog-input:checkbox,select.fjzx-prog-input").each(function(){
			$(this).enable();
		});
	},
	_setFormData: function(data){
		$.setFormData(this._$container,data);
	},
	_clearForm: function(){
		$.clearFormData(this._$container);
	},
	_buildTabEmulator: function(){
		return;//by Jam 2016-08-18 暂时去掉，等扫描动作做完后再修改并加上
		
		var thisPage = this;
		
		var selectors = "";
		for(var selector in thisPage._actionMap){
			selectors = selectors + "," + selector;
		}
		var $allInputs = this._$container.find("input[fjzx_field_name]"+selectors);
		$allInputs.keydown(function(e){
			var index = $allInputs.index($(this));
			if(($(e.target).hasClass("fjzx-prog-ok") || $(e.target).hasClass("fjzx-prog-cancel")) && e.keyCode==13){
				return;
			}else if (e.keyCode==13 || e.keyCode==40){//enter、down
				index = index + 1;
				if(index>$allInputs.size()-1)
					index = 0;
				e.preventDefault();
				e.stopPropagation();
				$($allInputs.get(index)).focus();
			}else if(e.keyCode==38){//up
				index = index - 1;
				if(index<0)
					index = $allInputs.size() - 1;
				e.preventDefault();
				e.stopPropagation();
				$($allInputs.get(index)).focus();
			}else if(e.keyCode==37){//left
				if($(e.target).is(":button")){
					index = index - 1;
					if(index<0)
						index = $allInputs.size() - 1;
					e.preventDefault();
					e.stopPropagation();
					$($allInputs.get(index)).focus();
				}else if($(e.target).is(":radio")){
					e.preventDefault();
					e.stopPropagation();
				}
			}else if(e.keyCode==39){//right
				if($(e.target).is(":button")){
					index = index + 1;
					if(index>$allInputs.size()-1)
						index = 0;
					e.preventDefault();
					e.stopPropagation();
					$($allInputs.get(index)).focus();
				}else if($(e.target).is(":radio")){
					e.preventDefault();
					e.stopPropagation();
				}
			}
		});
	},
	_processAction: function(selector){
		var thisPage = this;
		if(!fjzx.ui.validateDataType(thisPage._$container)){
			return;
		}
		var formData = thisPage.getFormData();
		var actionCallback = thisPage._actionMap[selector];
		if(typeof(actionCallback)=="function")
			actionCallback(thisPage._inputFormData,JSON.stringify(formData),thisPage._$container);
	},
	/*私有方法 -结束-*/

	/*公有方法 -开始-*/
	getFormData: function(){
		return $.getFormData(this._$container);
	},
	open: function(inputFormData,openCallback){
		this._inputFormData = inputFormData;
		this._clearForm();
		if(inputFormData){
			this._setFormData(inputFormData);
		}
		this._enableElements();
		this._disableElements();
		fjzx.ui.inEditing = true;
		if(typeof(openCallback)=="function")
			openCallback(this._$container);
	},
	find: function(selector){
		var thisPage = this;
		fjzx.ui.checkSelectorUnique(selector,thisPage._$container);
		if(!thisPage._actionMap)
			thisPage._actionMap = {};
		return {
			setAction: function(actionCallback){
				var $selector = thisPage._$container.find(selector);
				$selector.click(function(e){
					e.preventDefault();
					thisPage._processAction(selector);
				});
				thisPage._actionMap[selector] = actionCallback;
			},
			setActionClose: function(){
				var $selector = thisPage._$container.find(selector);
				$selector.click(function(e){
					e.preventDefault();
					thisPage._closeByConfirm();
				});
			}
		};
	},
	reset: function(){
		$.resetFormData(this._$form);
	}
	/*公有方法 -结束-*/
};

/**
 * 不带分页的浏览器缓存通用列表，主要用于页面端编辑列表，并不直接提交数据
 */
fjzx.ui.CachedTableList = function(selector,onCreateCallback){
	fjzx.ui.checkSelectorUnique(selector);
	this._containerSelector = selector;
	this._$container = $(selector);
	this._$tableContainer = $("<div class='wrap-overflow'>\
		<table class='table' style='margin-bottom: 0px;'>\
			<thead><tr></tr></thead>\
			<tbody></tbody>\
		</table>\
	</div>");
	this._$table = this._$tableContainer.find("table"); 
	this._$container.append(this._$tableContainer);
	this._page = 1;
	this._$queryForm = null;

	this._itemList = [];

	if(typeof(onCreateCallback)=="function")
		onCreateCallback(this._$container);
};
fjzx.ui.CachedTableList.prototype = {
	setColumns: function(array){
		var totalWidth = 0;
		for(var i=0;i<array.length;i++){
			totalWidth = totalWidth + Number(array[i].width);
		}
		
		var $tableParent = this._$table.parents(".fjzx-prog-page-tabs-content:first");
		var tableParentWidth = $tableParent.width();
		if(totalWidth>0){
			var width = totalWidth;
			if(width<tableParentWidth)
				width = tableParentWidth;
			this._$table.width(width);
			this._$table.css("max-width",width);//ie8没这一句则指定宽度无效，因为bootstrap默认设置table的max-width为100%
		}else{
			this._$table.css("width","100%");
		}
		
		var $headTr = this._$table.find(">thead>tr");
		for(var i=0;i<array.length;i++){
			var $th = $("<th></th>");
			$th.html(array[i].caption);
			$th.width(Number(array[i].width));
			$headTr.append($th);
		}
		this._maxColspan = array.length;
		var colspan = {colspan: this._maxColspan};
		this._emptyTemplate = $.formatStr("<tr><td colspan={text:colspan}>\
			<div style='height: 30px;text-align: center;'>没有记录</div>\
		</td></tr>",colspan);
	},
	setItemView: function(itemView){
		this._itemView = itemView;
	},
	setOnLoadPageListener: function(loadDataCallback){
		this._loadDataCallback = loadDataCallback;
	},
	reload: function(activeId){
		this.load(this._page,activeId);
	},
	load: function(page,activeId){
		this._page = page;
		this._loadDataCallback(page,activeId);
	},
	setOnItemListener: function(append,beforeAppend){
		this._append = append;
		this._beforeAppend = beforeAppend;
	},
	_clearActive: function(){
			this._$table.find("tr.fjzx-active").removeClass("fjzx-active");
	},
	setActive: function($item){
		this._clearActive();
		$item.addClass("fjzx-active");
	},
	getActiveId: function(){
		var activeRecord = this.getActiveRecord();
		if(activeRecord.id)
			return activeRecord.id;
		else
			return "";
	},
	getActiveRecord: function(){
		var $trActive = this._$table.find("tr.fjzx-active");
		if($trActive.size()>0){
				return $trActive.data("record");
		}
		$trActive = this._$table.find("tbody tr:first");
		$trActive.addClass("fjzx-active");
		return $trActive.data("record");
	},
	_buildBody: function(list){
		this._itemList = [];
		var tbodySelector = "tbody";
		fjzx.ui.checkSelectorUnique(tbodySelector,this._containerSelector);
		var $tbody = this._$table.find(tbodySelector);
		$tbody.empty();
		if(list.length<=0){
			var $itemEmpty = $(this._emptyTemplate);
			fjzx.ui.validateElement($itemEmpty);
			$tbody.append($itemEmpty);
			$itemEmpty.find("span").hide().fadeIn(1000);
		}
		var size = 10;
		if(size<list.length)
			size = list.length;
		for(var i=0;i<size;i++){
			if(i<list.length){
				if(typeof(this._beforeAppend)=="function"){
					this._beforeAppend(list[i]);
				}
				var $item = $($.formatStr(this._itemView,list[i]));
				$item.data("record",list[i]);
				if(i%2 != 0)
					$item.addClass("tr-odd");
				fjzx.ui.validateElement($item);
				$item.hover(
					function(){
						$(this).addClass("fjzx-hover");
					},
					function(){
						$(this).removeClass("fjzx-hover");
					}
				);
				if(typeof(this._append)=="function"){
					if(this._append($item,list[i]))
						$tbody.append($item);
				}else
					$tbody.append($item);
				this._itemList.push({item:$item,record:$.cloneData(list[i])});
			}else{
				var $emptyLine = $($.formatStr("<tr><td colspan={text:colspan}><div style='width: 30px;height: 30px;'></div></td></tr>",{colspan:this._maxColspan}));
				if(i%2 != 0)
					$emptyLine.addClass("tr-odd");
				$tbody.append($emptyLine);
			}
		}
	},
	buildList: function(list){
		this._buildBody(list);
	},
	remove: function($item,doRemove){
		$item.addClass("error");
		fjzx.ui.showConfirm(
			"确实要删除吗？删除后将无法恢复",
			function(){
				if(typeof(doRemove)=="function"){
					doRemove(function(){
						$item.removeClass("error");
					});
				}
			},
			function(){
				$item.removeClass("error");
			}
		);
	},
	clearData: function(){
		var $tbody = this._$table.find("tbody");
		$tbody.empty();
		var $itemEmpty = $(this._emptyTemplate);
		$tbody.append($itemEmpty);
		$itemEmpty.find("span").hide().fadeIn(1000);
	},
	eachItem: function(eachItemCallback){
		for(var i=0;i<this._itemList.length;i++){
			var $item = this._itemList[i].item;
			var record = this._itemList[i].record;
			eachItemCallback($item,record);
		}
	}
};

/**
 * 浏览器端的数据源组件，与CachedTableList组件配合使用
 */
var DataSource = function(){
	this._array = [];
};
DataSource.prototype = {
	getList: function(){
		return this._array;
	},
	getRecord: function(id){
		for(var i=0;i<this._array.length;i++){
			var record = this._array[i];
			if(record.id===id)
				return record;
		};
		return null;
	},
	deleteRecord: function(id){
		var record = this.getRecord(id);
		if(record)
			this._array.remove(record);
	},
	updateRecord: function(id,updateRecord){
		updateRecord.id = id;
		for(var i=0;i<this._array.length;i++){
			var record = this._array[i];
			if(record.id===id){
				this._array[i] = updateRecord;
				return;
			}
		};
	},
	newRecord: function(newRecord){
		newRecord.id = $.getUUID();
		this._array.push(newRecord);
	},
	getListDataStr: function(){
		return JSON.stringify(this._array);
	},
	empty: function(){
		this._array = [];
	},
	setData: function(data){
		this._array = data;
	}
};

fjzx.ui.ComponentTreeSelect = function($componentTreeSelect){
	var thisComponent = this;
	
	this._$input = $componentTreeSelect.find("input.fjzx-prog-component-tree-select");
	this._selectType = this._$input.attr("fjzx_select_type");
	this._extraParams = this._$input.attr("fjzx_extra_params");

	//获取descendent component fjzx_select_field_name
	var ids = this._$input.attr("fjzx_select_field_name_descendent");
	if(ids){
		this._descendentIdList = ids.split(",");
	}else{
		this._descendentIdList = [];
	}
	
	this._options = {};
	var optionsStr = this._$input.attr("fjzx_options");
	if(optionsStr){
		this._options = JSON.parse(optionsStr.replace(/'/g,"\""));
	}
	
	this._$input.focus(function(){
		var checkedValuesStr = thisComponent._$input.attr("fjzx_select_tree_field_value");
		if(!checkedValuesStr)
			checkedValuesStr = "";
		
		fjzx.ui.showTreeSelectDialog(
			thisComponent._selectType,
			thisComponent._extraParams,
			thisComponent._options,
			checkedValuesStr,/*以英文逗号隔开的多值字符串*/
			function onConfirm(recordsChecked,recordsUnChecked){
				/*recordsChecked是选中的节点，nodesUnChecked未选中的节点，其格式如下：/*
				/*[{id:"xxx1",name:"yyy1",parentId:"zzz1"},{id:"xxx2",name:"yyy2",parentId:"zzz2"},{id:"xxx3",name:"yyy3",parentId:"zzz3"}]*/
				var oldValues = thisComponent._$input.attr("fjzx_select_tree_field_value");
				var checkedValues = [];
				var checkedNames = [];
				for(var i=0;i<recordsChecked.length;i++){
					if(thisComponent._options.nodeTypeFilter){
						if(recordsChecked[i].nodeType===thisComponent._options.nodeTypeFilter){
							if(!checkedValues.contains(recordsChecked[i].id)){
								checkedValues.push(recordsChecked[i].id);
								checkedNames.push(recordsChecked[i].name);
							}
						}
					}else{
						if(!checkedValues.contains(recordsChecked[i].id)){
							checkedValues.push(recordsChecked[i].id);
							checkedNames.push(recordsChecked[i].name);
						}
					}
				}
				thisComponent._$input.attr("fjzx_select_tree_field_value",checkedValues.join(","));
				var newValues = thisComponent._$input.attr("fjzx_select_tree_field_value");
				if(oldValues!=newValues){
					thisComponent._resetDescendentComponentSelect();
				}
				thisComponent._$input.val(checkedNames.join(","));
				return true;
			},
			function onCancell(){
			},
			function onFetchData(list){
				/*可以在此对数据进行加工
				for(var i=0;i<list.length;i++){
					list[i].icon = "ztree/css/zTreeStyle/img/diy/3.png";
				}
				*/
			}
		);
	});

	var id = this._$input.attr("fjzx_select_tree_field_name");
	fjzx.ui.componentTreeSelectList.push({name:id,instance:this});
};

fjzx.ui.ComponentTreeSelect.prototype= {
	_resetDescendentComponentSelect: function(){
		if(this._descendentIdList.length>0){
			for(var i=0;i<this._descendentIdList.length;i++){
				var descendentId = this._descendentIdList[i];
				var descendentComponentSelect = fjzx.ui.getComponentSelect(descendentId);
				descendentComponentSelect.setValue("","");
			}
		}
	},
	setValue: function(newValue,newName){
		this._$input.val(newName);
		this._$input.attr("fjzx_select_tree_field_value",newValue);
	},
	getValue: function(){
		return {
			value: this._$input.attr("fjzx_select_tree_field_value"),
			name: this._$input.val()
		};
	}
};

fjzx.ui.ComponentTreeExplorer = function($componentTreeExplorer){
	var thisComponent = this;
	
	this._$input = $componentTreeExplorer.find("input.fjzx-prog-component-tree-explorer");
	this._selectType = this._$input.attr("fjzx_select_type");
	this._extraParams = this._$input.attr("fjzx_extra_params");
	this._isMulSelect = this._$input.attr("fjzx_is_mul_select");

	//获取descendent component fjzx_select_field_name
	var ids = this._$input.attr("fjzx_select_field_name_descendent");
	if(ids){
		this._descendentIdList = ids.split(",");
	}else{
		this._descendentIdList = [];
	}
	
	this._options = {};
	var optionsStr = this._$input.attr("fjzx_options");
	if(optionsStr){
		this._options = JSON.parse(optionsStr.replace(/'/g,"\""));
	}
	this._$input.focus(function(){
		var dataArrayStrValue = thisComponent._$input.attr("fjzx_select_tree_field_value");
		var dataArrayStrVal = thisComponent._$input.val();
		var dataArrayStr = [];
		/*if(!dataArrayStr)
			dataArrayStr = "[]";*/
		if(dataArrayStrValue){ /* 已有的值赋值到弹出框*/
			var dataArrayStrValues = dataArrayStrValue.split(",");
			var dataArrayStrVals = dataArrayStrVal.split(",");
			for(var i=0;i<dataArrayStrValues.length;i++){
				dataArrayStr.push({id:dataArrayStrValues[i],name:dataArrayStrVals[i]});
			}
		}
		fjzx.ui.showTreeExplorerDialog(
			thisComponent._selectType,
			thisComponent._extraParams,
			thisComponent._isMulSelect,
			JSON.stringify(dataArrayStr),/*以英文逗号隔开的多值字符串*/
			function onConfirm(dataArray){
				//thisComponent._$input.attr("fjzx_select_tree_field_json_value",JSON.stringify(dataArray));
				
				var checkedValues = [];
				var checkedNames = [];
				recordsChecked = dataArray;
				for(var i=0;i<recordsChecked.length;i++){
					if(thisComponent._options.nodeTypeFilter){
						if(recordsChecked[i].nodeType===thisComponent._options.nodeTypeFilter){
							if(!checkedValues.contains(recordsChecked[i].id)){
								checkedValues.push(recordsChecked[i].id);
								checkedNames.push(recordsChecked[i].name);
							}
						}
					}else{
						if(!checkedValues.contains(recordsChecked[i].id)){
							checkedValues.push(recordsChecked[i].id);
							checkedNames.push(recordsChecked[i].name);
						}
					}
				}
				thisComponent._$input.attr("fjzx_select_tree_field_value",checkedValues.join(","));
				
				var selectedNames = [];
				for(var i=0;i<dataArray.length;i++){
					selectedNames.push(dataArray[i].name);
				}
				thisComponent._$input.val(selectedNames.join(","));
				return true;
			},
			function onCancell(){
			},
			function onFetchData(list){
			}
		);
	});

	var id = this._$input.attr("fjzx_select_tree_field_name");
	fjzx.ui.componentTreeSelectList.push({name:id,instance:this});
};
/*
 * 扫描文件列表组件 
 */
fjzx.ui.ImageList = function(selector,callback){
	fjzx.ui.checkSelectorUnique(selector);
	this._$container = $(selector);
	this._$imgContainer = this._$container.find("ul");
	this.imgIdArr = [];
	if(typeof(callback)==="function")
		callback(this._$container);
};
fjzx.ui.ImageList.prototype = {
	_buildImageList: function(list){
		
		for(var i =0; i<list.length; i++){
			var imageData = list[i];
			this._addImage(imageData);
		}
	},
	_addImage: function(originalImgUrl,imgUrl,imageData){
		var thisImageList = this;
		
		var itemTemplate = "<li>\
			<a href='{text:originalImgUrlStr}' title='' target='_blank'>\
				<img src=\"{text:imgUrlStr}\" title='' alt=''/>\
			</a>\
			<span class='fjzx-prog-btn-remove'>X</span>\
		</li>";
		var $item = $($.formatStr(itemTemplate,{originalImgUrlStr:originalImgUrl,imgUrlStr:imgUrl}));
		$item.find("span.fjzx-prog-btn-remove").click(function(){
			var $li = $(this).parent();
			
			fjzx.ui.showConfirm(
				"您确定要删除么？", 
				function(){
						$li.remove();
					},
				function(){}
			);
			if(typeof(thisImageList._removeListener)==="function"){
				thisImageList._removeListener($li);
			}
		});
		$item.data("record",imageData);
		this._$imgContainer.append($item);
		
	},
	setImageList: function(list){//[{id:"xZ13XDGeafEQfg03afaEad",name:"test.jpg",url:"images/xZ13XDGeafEQfg03afaEad.jpg"}]
		this._buildImageList(list);
	},
	setOnRemoveListener: function(removeListener){
		this._removeListener = removeListener;
	},
	addImage: function(originalImgUrl,imgUrl,imageData){
		this._addImage(originalImgUrl,imgUrl,imageData);
	},
	eachItem: function(eachItemCallback){
		if(typeof(eachItemCallback)==="function"){
			this._$imgContainer.find("li").each(function(){
				var $item = $(this);
				var record = $.cloneData($item.data("record"));
				eachItemCallback($item,record);
			});
		}
	}
};
/*
 * 普通WEB打印组件 
 */
fjzx.ui.PrintTools = function(){
	this._initPrint();
};
fjzx.ui.PrintTools.prototype = {
	_initPrint: function(){
		this._LODOP = getLodop();  
		this._LODOP.PRINT_INIT("打印控件初始化");
	},
	_createHtmlFormPage: function(options){
		this._LODOP.ADD_PRINT_HTM(options.top,options.left,options.width,options.height,options.htmlStr);
	},
	preview: function(options){
		this._createHtmlFormPage(options);
		this._LODOP.PREVIEW();
	},
	print: function(options){
		this._createHtmlFormPage(options);
		this._LODOP.PRINT();
	}
};
/*
 * 条码机打印机组件 
 */
fjzx.ui.BarcodePrintTools = function(){
	//if(isIE()){
		this._init();
	//}
};
fjzx.ui.BarcodePrintTools.prototype = {
	_init: function(){
		this._TSCObj = new ActiveXObject("TSCActiveX.TSCLIB");
		this._TSCObj.ActiveXopenport ("TSC");
	},
	_createEquipmentBarcode: function(options){//options = {department:'',codeId:'',operator:'',createDate:'',copies:''};

		this._TSCObj.ActiveXsetup ("90","25","5","10","0","2","0");
		this._TSCObj.ActiveXclearbuffer();
		this._TSCObj.ActiveXsendcommand ("SET TEAR ON");
		
		this._TSCObj.ActiveXwindowsfont (20, 15, 35, 0, 2, 0, "微软雅黑", options.department);
		this._TSCObj.ActiveXbarcode ("20", "48", "128", "150", "1", "0", "2", "2", options.codeId);
		this._TSCObj.ActiveXwindowsfont (20, 222, 35, 0, 2, 0, "微软雅黑", options.operator);
		this._TSCObj.ActiveXwindowsfont (300, 222, 35, 0, 2, 0, "微软雅黑", options.createDate);

		this._TSCObj.ActiveXwindowsfont (570, 15, 35, 0, 2, 0, "微软雅黑", options.department);
		this._TSCObj.ActiveXbarcode ("570", "48", "128", "150", "1", "0", "2", "2", options.codeId);
		this._TSCObj.ActiveXwindowsfont (570, 222, 35, 0, 2, 0, "微软雅黑", options.operator);
		this._TSCObj.ActiveXwindowsfont (870, 222, 35, 0, 2, 0, "微软雅黑", options.createDate);

		this._TSCObj.ActiveXprintlabel (options.copies,"1");
		this._TSCObj.ActiveXcloseport();
	},
	_createCaseRelateObjectBarcode: function(options){//options = {department:'',codeId:'',operator:'',createDate:'',copies:''};

		this._TSCObj.ActiveXsetup ("90","25","5","10","0","2","0");
		this._TSCObj.ActiveXclearbuffer();
		this._TSCObj.ActiveXsendcommand ("SET TEAR ON");
		
		this._TSCObj.ActiveXwindowsfont (20, 15, 35, 0, 2, 0, "微软雅黑", options.department);
		this._TSCObj.ActiveXwindowsfont (300, 16, 35, 0, 2, 0, "微软雅黑", options.createDate);
		this._TSCObj.ActiveXbarcode ("20", "55", "128", "100", "0", "0", "2", "2", options.caseObjectCode);
		this._TSCObj.ActiveXwindowsfont (20, 155, 35, 0, 2, 0, "微软雅黑", "财物名称："+options.caseObjectName);
		this._TSCObj.ActiveXwindowsfont (20, 185, 35, 0, 2, 0, "微软雅黑", "财物编号："+options.caseObjectCode);
		this._TSCObj.ActiveXwindowsfont (20, 215, 35, 0, 2, 0, "微软雅黑", "案件名称："+options.caseName);
		this._TSCObj.ActiveXwindowsfont (20, 245, 35, 0, 2, 0, "微软雅黑", "案件编号："+options.caseCode);
		

		this._TSCObj.ActiveXwindowsfont (570, 15, 35, 0, 2, 0, "微软雅黑", options.department);
		this._TSCObj.ActiveXwindowsfont (870, 16, 35, 0, 2, 0, "微软雅黑", options.createDate);
		this._TSCObj.ActiveXbarcode ("570", "55", "128", "100", "0", "0", "2", "2", options.caseObjectCode);
		this._TSCObj.ActiveXwindowsfont (570, 155, 35, 0, 2, 0, "微软雅黑", "财物名称："+options.caseObjectName);
		this._TSCObj.ActiveXwindowsfont (570, 185, 35, 0, 2, 0, "微软雅黑", "财物编号："+options.caseObjectCode);
		this._TSCObj.ActiveXwindowsfont (570, 215, 35, 0, 2, 0, "微软雅黑", "案件名称："+options.caseName);
		this._TSCObj.ActiveXwindowsfont (570, 245, 35, 0, 2, 0, "微软雅黑", "案件编号："+options.caseCode);

		this._TSCObj.ActiveXprintlabel (options.copies,"1");
		this._TSCObj.ActiveXcloseport();
	},
	printEquipmentBarcode: function(options){
		//if(isIE()){
		this._createEquipmentBarcode(options);
		//}
	},
	printCaseRelateObjectBarcode: function(options){
		//if(isIE()){
		this._createCaseRelateObjectBarcode(options);
		//}
	}
};

//日历
fjzx.ui.FullCalendar = function(selector, callback){
	fjzx.ui.checkSelectorUnique(selector);
	this.$selector = $(selector);
	_this = this;
	
	this.newRecord = [];
	this.eventArr = [];
	this.datas = [];
	this.flag = 0;
	this.allDays = {};
	this.businessHours = [];
	
	if(typeof(callback)==="function")
		callback(this._$selector);
};
fjzx.ui.FullCalendar.prototype = {
	optionObj: {
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,listMonth'
		},
		defaultDate: new Date(),
		navLinks: true,
		selectable: true,
		selectHelper: true,
		editable: false,
		eventLimit: true,
		//allDay: true,
		slotEventOverlap : false, //相同时间段的多个日程视觉上是否允许重叠，默认true允许
		eventClick: function (e) { //日程点击触发事件
			_this._eventCallback(e,_this.newRecord,_this);
        },
        eventResize: function(e){ //日程改变大小触发事件
        	//$.log(e);
        }
	},
	init: function() {
		_this.$selector.fullCalendar('destroy');
		_this.$selector.fullCalendar(this.optionObj);
	},
	getAllDataList: function(listObj){
		_this.eventArr=[];
		_this.allDays = listObj;
		_this.getWorkDayList(_this.allDays);
		_this.renderFixedRestDay(_this.allDays.fixedRestDay);
		_this.renderHoliday(_this.allDays.holiday);
		
		_this.optionObj.events = _this.eventArr;
		_this.optionObj.businessHours = _this.businessHours;
		_this.init();
	},
	setAllDataSource: function(allDataSourceCallback){
		allDataSourceCallback(this.getAllDataList);
	},
	getDataList: function(list){
		_this.datas = list;
		_this.eventArr=[];
		_this.optionObj.events = _this.getEventArr(_this.datas);
		_this.init();
	},
	getWorkDayList: function(allDays){
		var workDays = allDays.workDay;
		_this.getEventArr(workDays);	
	},
	setDataSource: function(dataSourceCallback) {
		dataSourceCallback(this.getDataList);
	},
	eventClick: function(eventCallback){
		this._eventCallback = eventCallback;
	},
	renderHoliday: function(dataArr){
		
		for(var i=0; i<dataArr.length; i++){
			var events = {};
			events.id = dataArr[i].groupCode;
			events.title = dataArr[i].caption;
			events.start = dataArr[i].startDate;
			events.end = dataArr[i].endDate;
			if(dataArr[i].type == 'false'){
				events.rendering = 'background';
				events.color = '#ddd';
				
				this.eventArr.push(events);
			}			
		}
		return this.eventArr;
	},
	renderFixedRestDay: function(dataArr){
		var dow = [];
		var businessObj = {};
		for(var i=0; i<dataArr.length; i++){
			if(dataArr[i].status == "WORKDAY"){
				
				if(dataArr[i].day == 7){
					dataArr[i].day = 0;
				}
				dow.push(dataArr[i].day);
			}	
		}
		businessObj = {
			start: '8:30',
			end: '12:00'
		};
		businessObj.dow = dow;
		this.businessHours.push(businessObj);
		return this.businessHours;
	},
	createHtmlItem: function(e,dataArr){
		var data = [];
		for(var i=0; i<dataArr.length; i++){
			if(e.id == dataArr[i].groupCode){
				data.push(dataArr[i]);
			}
		}
	
		return this.getShowData(data);
	},
	getShowData: function(list){
		
		var dataArr = list;
		//拼接显示数据
		_this.newRecord = dataArr[0];
		var dataCount = dataArr.length;

		//清空dialog时间组件
		_this.clearDataHtml();
		
		for(var i=0; i<dataCount;i++){
			var startDate = "startDate";
			var endDate = "endDate";
			var type = "type";
			if(i>=1){
				startDate = "startDate"+(i-1);
				endDate = "endDate"+(i-1);
				type = "type"+(i-1);

			}
			_this.newRecord[startDate] = dataArr[i].startDate;
			_this.newRecord[endDate] = dataArr[i].endDate;
			_this.newRecord[type] = dataArr[i].type;
			
			//动态的给dialog添加时间组件
			if(i<dataCount-1){
				_this.createDataHtml();
			}
		}
		return _this.newRecord;
	},
	setShowData: function(setShowDataCallback){
		setShowDataCallback(this.getShowData);
	},
	//字符串转日期格式，strDate要转为日期格式的字符串
	formatToDate : function(strDate){
		var data = null;
		if(strDate != "undefined"){
			date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
	         function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
		}
        return date;
	},
	refresh : function(list){
		_this.datas = list;
		_this.eventArr=[];
		_this.optionObj.events = _this.getEventArr(_this.datas);
		_this.$selector.fullCalendar('destroy');
		_this.$selector.fullCalendar(_this.optionObj);
	},
	setRefreshData: function(refreshDataCallback){
		refreshDataCallback(this.refresh);
	},
	getEventArr : function(dataArr){
		for(var i=0; i<dataArr.length; i++){
			var events = {};
			events.id = dataArr[i].groupCode;
			events.title = dataArr[i].caption;
			events.start = dataArr[i].startDate;
			events.end = dataArr[i].endDate;
			events.color = "#0077cc";
			if(dataArr[i].type == 'false'){
				events.color = "#ddd";
				events.textColor = "#0077cc";
			}
			
			this.eventArr.push(events);
		}

		return this.eventArr;
	},
	createDataHtml : function(){
		var dataHTML = 
			"<div class='control-group data-container'>\
				<label class='control-label'>放假时间</label>\
				<div class='controls'>\
					<div class='input-append'>\
					  <input class='fjzx-prog-date fjzx-prog-not-null' type='text' style='width:80px;' fjzx_field_name={text:startDate} fjzx_field_tip_name='开始时间' placeholder='开始'>\
					  <span class='add-on fa-calendar' onclick='javascript: $(this).prev().focus();' style='cursor: pointer;'></span>\
					</div>\
					<label>至</label>\
					<div class='input-append'>\
					  <input class='fjzx-prog-date fjzx-prog-not-null' type='text' style='width:80px;' fjzx_field_name={text:endDate} fjzx_field_tip_name='截止时间' placeholder='截止'>\
					  <span class='add-on fa-calendar' onclick='javascript: $(this).prev().focus();' style='cursor: pointer;'></span>\
					</div>\
					<label>类型</label>\
					<label>\
						<input class='fjzx-prog-string' fjzx_field_tip_name='类型' type='radio' value='true' name={text:type} fjzx_field_name={text:type} style='width: 20px;'>\
						工作日\
					</label>\
					<label>\
						<input class='fjzx-prog-string' fjzx_field_tip_name='类型' type='radio' value='false' name={text:type} fjzx_field_name={text:type} style='width: 20px;'>\
						节假日\
					</label>\
					<span class='btn-link-danger data-cancle' ><span class='fa-remove mr6' style='display:none'>删除</span></span>\
				</div>\
			</div>";
		var $item = $($.formatStr(dataHTML,{startDate:'startDate'+this.flag,endDate:'endDate'+this.flag,type:'type'+this.flag}));
		this.flag++;
		$('.btns').before($item);
		
		//初始化input data控件
		fjzx.ui.initAllComponentDate();
		//删除事件绑定
		this.removeDataEvent();
		
	},
	removeDataEvent: function(){
		$('.data-cancle span').css({
			'display':'none'
		});
		$('.data-cancle span').eq(this.flag-1).css({
			'display':'inline-block'
		});
		$('.data-cancle').unbind().bind('click','.data-cancle',function(){
		
			$(this).parents('.control-group').siblings('.data-container')
			.eq(_this.flag-2).children('.controls').children('.data-cancle').children().css({
				'display':'inline-block'
			});

			$(this).parents('.control-group').remove();
			_this.flag--;
			
		});
	},
	clearDataHtml : function(){
		$('.data-container').remove();
		this.flag = 0;
	}
		
};
//仪表盘
fjzx.ui.Gauge = function(selector){
	fjzx.ui.checkSelectorUnique(selector);
	this.selector = $(selector)[0];
	
	this.defaultColor = [['#cc0000','#0099ff','#cc0000'],['#cc0000','#0099ff','#cc0000'],['#cc0000','#0099ff','#cc0000']];
	_this = this;
	
};
fjzx.ui.Gauge.prototype = {
	init: function(callback){
		this.gauge = echarts.init(this.selector);
		
		if(typeof(callback)==="function")
			callback(this.gauge);
	},
	setColor: function(colorArr){
		this.defaultColor = colorArr;
	},
	setOption: function(option){
		this.gauge.setOption(option, true);
	},
	getNewOption: function(voltageObj){
		var defaultCenter = [['18%', '55%'],['50%', '55%'],['83%', '55%']];

		var defaultOption = {
			tooltip : {
		        formatter: "{a} <br/>{b} : {c}"
		    },
		    toolbox: {
		        feature: {
		            restore: {},
		            saveAsImage: {}
		        }
		    },
		    series : []	
		};
		
		for(var i =0; i<voltageObj.length; i++){
			var defaultSeries = {
					  name:'A相电压',
	                  type:'gauge',
	                  center : ['50%', '55%'], // 默认全局居中
	                  min:200,
	                  max:260,
	                  splitNumber:10, //仪表盘刻度的分割段数
	                  radius: '100%',
	                  endAngle:-45,
	                  axisLine: {            // 坐标轴线
	                      lineStyle: {       // 属性lineStyle控制线条样式
	                    	  color: [[0.17, '#cc0000'],[0.67, '#0099ff'],[1, '#cc0000']],
	                    	  width: 10
	                      }
	                  },
	                  splitLine: {           // 分隔线
	                      length :10,         // 属性length控制线长
	                      lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
	                          width:3
	                      }
	                  },
	                  title : {
	                      textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
	                          fontWeight: 'bolder',
	                          fontStyle: 'normal',
	                          color: '#000',
	                          shadowColor : '#fff', //默认透明
	                          shadowBlur: 10
	                      }
	                  },
	                  detail : {
	                      backgroundColor: 'rgba(30,144,255,0.8)',
	                      borderWidth: 1,
	                      borderColor: '#fff',
	                      shadowColor : '#fff', //默认透明
	                      shadowBlur: 5,
	                      width:80,
	                      height:30,
	                      offsetCenter: [0, '50%'],       // x, y，单位px
	                      textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
	                          fontWeight: 'bolder',
	                          color: '#fff',
	                          fontSize: 15
	                      }
	                  },
	                  data:[{value: 40, name: 'B相电压'}]
				};
			defaultSeries.name = voltageObj[i].name;
			defaultSeries.center = defaultCenter[i];
			defaultSeries.min = voltageObj[i].minValue;
			defaultSeries.max = voltageObj[i].maxValue;
			defaultSeries.splitNumber = voltageObj[i].splitNumber;
			var color = defaultSeries.axisLine.lineStyle.color;
			color[0][0] = (voltageObj[i].warnMinValue - voltageObj[i].minValue)/(voltageObj[i].maxValue - voltageObj[i].minValue);
			color[0][1] = this.defaultColor[i][0];
			color[1][0] = (voltageObj[i].warnMaxValue - voltageObj[i].minValue)/(voltageObj[i].maxValue - voltageObj[i].minValue);
			color[1][1] = this.defaultColor[i][1];
			color[2][1] = this.defaultColor[i][2];
			defaultSeries.data[0].value = voltageObj[i].value;
			defaultSeries.data[0].name = voltageObj[i].name;
			defaultOption.series.push(defaultSeries);
		};
		defaultOption.tooltip.formatter += voltageObj[0].unit;
		return defaultOption;
	}
};


(function(){
	fjzx.ui.validateElement($("body"));
	fjzx.ui.validateFjzxFormField();
	fjzx.ui.initAllComponentSelect();
	fjzx.ui.initAllComponentDate();
	fjzx.ui.initAllComponentTreeSelect();
	fjzx.ui.initAllComponentTreeExplorer();

	$(window).bind('beforeunload',function(){
	    if (fjzx.ui.inEditing) {
			return '当前页面处于编辑状态';
	    }
	});
})();
