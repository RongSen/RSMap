var BasePath = $("base").attr("href");

var WebService = {
	interactionStartTime: 0,//第一个操作的开始时间
	delayTime: 1000,//所有操作1秒内未完成则要显示“正在交互数据，请稍候...”
	interactionUrl: {},
	interactionCount: 0,
	interactionFlag: {},
	init: function(){
		this.interactionCount = 0;
		var display = "<div style='position: fixed;left:0px;right:0px;bottom:0px;padding: 2px 4px 2px 4px;background-color: #ffffe1;z-index: 999999;border-top: 1px #e7e7e7 solid;border-bottom: 1px #e7e7e7 solid;border-left: 1px #e7e7e7 solid;border-right: 1px #e7e7e7 solid;text-align:center;'>\
			<img src='"+BasePath+"images/interacting.gif' style='display: inline-block;' align='absmiddle' />\
			<label style='display: inline-block;margin:5px 0;'>正在交互数据，请稍候...</label>\
		</div>";
		this.interactionFlag = $(display);
		$("body").append(this.interactionFlag);
		this.interactionFlag.hide();
	},
	service: function(url,data,sCallback,eCallback){
		var innerWebService = this;
		
		if(!this.interactionUrl[url]){//检查是否有前一个rpc还没执行完，后一个同名rpc又启动的情况，主要防止重复提交
			if(this.interactionStartTime==0){
				var startTime = new Date();
				this.interactionStartTime = startTime.getTime();
				setTimeout(
					function(){
						if(innerWebService.interactionStartTime>0)
							innerWebService.interactionFlag.show();
					},
					innerWebService.delayTime
				);
			}
			this.interactionUrl[url] = true;
			this.interactionCount++;
		}else{
			fjzx.ui.showMessageWarning("正在执行操作，请稍候...");
			return;
		}
		
		var options = {
			url: BasePath+url,
			type: "post",
			data: data,
			dataType: "text",
			timeout: 120*1000,
			global: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success: function(responseText,xhrCode){
				innerWebService.interactionUrl[url] = undefined;
				innerWebService.interactionCount--;
				if(innerWebService.interactionCount<=0){
					innerWebService.interactionStartTime = 0;
					innerWebService.interactionFlag.hide();
				}

				var thisOptions = this;
				var response = JSON.parse(responseText);
				if(response.type=="RequireLoginException"){
					/*fjzx.ui.showLoginDialog(
					function(){
						innerWebService.service(url,thisOptions.data,sCallback,eCallback);
					}
				);*/
			    //未权限登入直接跳转SSO登入页面
				//吴木辉 2018-3-1 17:19 创建
			    parent.reloadWindow();	
				}else if(response.type=="AccessException"){
					fjzx.ui.showMessageError(response.data);
					if(typeof(eCallback)=="function")
						eCallback();
				}else if(response.type=="RealtimeException"){
					fjzx.ui.showMessageError(response.data);
					if(typeof(eCallback)=="function")
						eCallback();
				}else if(response.type=="BusinessException"){
					fjzx.ui.showMessageError(response.data);
					if(typeof(eCallback)=="function")
						eCallback();
				}else if(response.type=="Exception"){
					fjzx.ui.showMessageError(response.data);
					if(typeof(eCallback)=="function")
						eCallback();
				}else if(response.type=="Message"){
					if(typeof(sCallback)=="function"){
						var data = JSON.parse(response.data);
						sCallback(data);
					}
				}
			},
			error: function(xhr,xhrCode,xhrException){
				innerWebService.interactionStartTime = 0;
				innerWebService.interactionUrl = {};
				innerWebService.interactionCount = 0;
				innerWebService.interactionFlag.hide();
				fjzx.ui.showMessageError("操作没有响应，可能是网络不通，请检查网络是否正常");
				if(typeof(eCallback)=="function")
					eCallback();
			},
			complete: function(xhr,xhrCode){
			},
			beforeSend: function(xhr){
			},
			async: true,
			processData: true,
			ifModified: false
		};
		$.ajax(options);
	}
};
WebService.init();

var WebServiceRealtime = {
	service: function(url,data,sCallback,eCallback){
		var innerWebServiceRealtime = this;
		var options = {
			fjzx_data: data,
			url: BasePath+url,
			type: "post",
			data: data,
			dataType: "text",
			timeout: 60*1000,
			global: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			success: function(responseText,xhrCode){

				var thisOptions = this;
				var response = JSON.parse(responseText);
				if(response.type=="RequireLoginException"){
					if(typeof(eCallback)=="function")
						eCallback();
					thisOptions.retryService();
				}else if(response.type=="AccessException"){
					if(typeof(eCallback)=="function")
						eCallback();
					thisOptions.retryService();
				}else if(response.type=="RealtimeException"){
					if(typeof(eCallback)=="function")
						eCallback();
					thisOptions.retryServiceAtOnce();
				}else if(response.type=="BusinessException"){
					if(typeof(eCallback)=="function")
						eCallback();
					thisOptions.retryService();
				}else if(response.type=="Exception"){
					if(typeof(eCallback)=="function")
						eCallback();
					thisOptions.retryService();
				}else if(response.type=="Message"){
					if(typeof(sCallback)=="function"){
						var data = JSON.parse(response.data);
						if(data.timeOut){//返回数据中必须有timeOut值
							thisOptions.retryServiceAtOnce();
						}else{
							sCallback(data);
							var params = $.cloneData(thisOptions.fjzx_data);
							params.version = data.version;//返回数据中必须有version
							innerWebServiceRealtime.service(url,params,sCallback,eCallback);
						}
					}
				}
			},
			error: function(xhr,xhrCode,xhrException){
				if(typeof(eCallback)=="function")
					eCallback();
				var thisOptions = this;
				thisOptions.retryService();
			},
			retryServiceAtOnce: function(){
				var thisOptions = this;
				innerWebServiceRealtime.service(url,thisOptions.fjzx_data,sCallback,eCallback);
			},
			retryService: function(){
				var thisOptions = this;
				setTimeout(function(){
					innerWebServiceRealtime.service(url,thisOptions.fjzx_data,sCallback,eCallback);
				},10*1000);
			},
			complete: function(xhr,xhrCode){
			},
			beforeSend: function(xhr){
			},
			async: true,
			processData: true,
			ifModified: false
		};
		$.ajax(options);
	}
};