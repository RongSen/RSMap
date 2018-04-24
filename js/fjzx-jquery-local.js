/*!
 * jQuery Download Framework By Jam 2016-08-19
 */
var BasePath = $("base").attr("href");

var LocalService = {
	service : function(url, data, sCallback, eCallback) {
		$.jsonp({
			url : "http://localhost:7070/" + url,
			data : data,
			timeout : 120 * 1000,
			callbackParameter : "fjzxCallback",
			success : function(json, textStatus, xOptions) {
				if (json.type == "Message") {
					if (typeof (sCallback) == "function")
						sCallback(JSON.parse(json.data));
				} else if(json.type == "InterruptedException"){
					//被中断的线程，不做任何处理
				}else{
					fjzx.ui.showMessageError(json.data);
					eCallback();
				}
			},
			error : function(xOptions, textStatus) {
				if (typeof (eCallback) == "function")
					eCallback();
			}
		});
	}
};

var Local = {};

Local.readEpc = function(successfulCallback, errorCallback) {
	var params = {};
	LocalService.service("Local.service?readEpc", params, successfulCallback, errorCallback);
};
Local.writeEpc = function(currentEpc, successfulCallback, errorCallback) {
	var params = {currentEpc:currentEpc};
	LocalService.service("Local.service?writeEpc", params, successfulCallback, errorCallback);
};