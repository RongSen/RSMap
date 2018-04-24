/*!
 * jQuery Upload Framework By Jam 2016-04-14
 */
var BasePath = $("base").attr("href");

MACRO_PACKAGE_DEFINE("fjzx.upload");
//fjzx.upload具有的方法一览
fjzx.upload.functionList = {
	//创建上传组件的工厂函数
	createUploader: function(selector,uploadDownloadControllerId,getExtraParamsCallback,onOneFileUploadActionFinishedCallback,onAllFilesUploadActionsFinishedCallback,options){}
};
//fjzx.upload方法实现
fjzx.upload = {
	//创建上传组件的工厂函数
	createUploader: function(selector,uploadDownloadControllerId,getExtraParamsCallback,onOneFileUploadActionFinishedCallback,onAllFilesUploadActionsFinishedCallback,options){
		return new fjzx.upload.Uploader(selector,uploadDownloadControllerId,getExtraParamsCallback,onOneFileUploadActionFinishedCallback,onAllFilesUploadActionsFinishedCallback,options);
	}
};

/**
 * selector是jQuery选择器使用的字符串，如"div#fjzx-select-file"
 * uploadDownloadControllerId是UploadDownloadController中注解@UploadDownloadController所对应的uploadDownloadControllerId值，如@UploadDownloadController(id="report")
 * getExtraParamsCallback是提供给Uploader的回调函数，Upload使用该回调函数来为每一次上传的文件获取额外的参数，并将该参数随文件一起上传到服务器上，
 * 程序员可以通过IUploadHandler接口中的UploadRequest参数来获取这些参数，如下：
 * 网页端：
 * fjzx.upload.createUploader("div#fjzx-selectfile","report",function(){
 *     return {name:"Jam"};
 * });
 * 服务端：
 * @Override
 * public void onTempFileSaved(UploadRequest request, String fileName,
 * 		File tempFile) throws Exception {
 * 	String name = request.getParameter("name");
 * 	log.debug(String.format("fileName:%s,tempFile:%s,name:%s",
 * 			fileName, tempFile.getPath(), name));
 * }
 */
fjzx.upload.Uploader = function(selector,uploadDownloadControllerId,getExtraParamsCallback,onOneFileUploadActionFinishedCallback,onAllFilesUploadActionsFinishedCallback,options){
	this._$uploader = $(selector);
	var typeArr ='*.ppt;*.pptx;*.wps;*.jpg;*.png;*.doc;*.docx;*.pdf;*.zip;*.rar;*.txt;*.xlsm; *.xlsb;*.xlsx;*.xls*;.AVI;*.WAV;*.WMV;*.MPG;*.mp4;*.mp3;'
		;

	var originalScriptData = {uploadDownloadControllerId:uploadDownloadControllerId,cookie:document.cookie};
	this._optionsDefault = {
		expressInstall: BasePath+'uploadify/expressInstall.swf',
		uploader: BasePath+'uploadify/uploadify.swf?v='+$.getUUID(),//附加参数v=$.getUUID()使swf在MYIE及IE6中swf不会被缓存，这样刷新页面时能确保swf中的ExternalInterface能导出
		script: BasePath+'do.upload',
		cancelImg: BasePath+'uploadify/cancel.png',
		folder: 'uploads', 
		multi: true,
		queueSizeLimit: 999,
		removeCompleted: true,
		displayData: 'all',
		buttonImg: BasePath+'uploadify/fileUploadButton.gif',
		rollover: true,
		simUploadLimit: 1,
		fileExt: typeArr,
		fileDesc: '文件',
		sizeLimit: 50*1000*1000,
		auto: true,
		width: 84,
		height: 84,
		method: "GET",
		queueID: "uploadFileList",
		scriptData: originalScriptData,
		onSelect: function(event, ID, fileObj){
			return false;
		},
		onError: function(event, ID, fileObj, errorObj){
			fjzx.ui.showMessageError(errorObj.msg);
			return false;
		},
		onProgress: function(event, ID, fileObj, data){
			return false;
		},
		onComplete: function(event, ID, fileObj, response, data){
			var responseData = JSON.parse(response);
			if(responseData.code==="ok"){
				if(typeof(onOneFileUploadActionFinishedCallback)==="function")
					onOneFileUploadActionFinishedCallback(responseData.data);
			}else{
				fjzx.ui.showMessageError(responseData.msg);
			}
		},
		onSelectOnce: function($uploader,event, data){
			var result = {};
			for(elm in originalScriptData){
				result[elm] = originalScriptData[elm];
			}
			if(typeof(getExtraParamsCallback)==="function"){
				var params = getExtraParamsCallback();
				for(elm in params){
					result[elm] = params[elm];
				}
				$uploader.uploadifySettings("scriptData",result,false);
			}
		},
		onAllComplete: function(event, data){
			if(typeof(onAllFilesUploadActionsFinishedCallback)==="function")
				onAllFilesUploadActionsFinishedCallback();
		}
	};
	if(options){
		for(elm in options)
			this._optionsDefault[elm]=options[elm];
	}
	this._$uploader.uploadify(this._optionsDefault);
};