//hashmap 用来存储 对象	
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
	}
};

HashMap.prototype.constructor = HashMap;


var map;
var luShuMap = new HashMap();
var defaultLongitude;
var defaultLatitude;
var trackHistory;
var lushuSpeed = 100;
//var entityName = 'a1';
var points = [];
var markerMap = new HashMap();
var makerDialogDivMap = new HashMap(); //用来保存显示框
var nowAnimationId=null;   //当前动画的id
var defaultLongitude;
var defaultLatitude;

//地图初始化
function initMap(opt_options){
	var options = opt_options || {};
	
	var currentLayerGroup = fjzx.map.source.getFjVecLayerGroup();
	map = new fjzx.map.Map({
		center: options.center ? options.center : [117.01, 25.12],
        zoom: 13,
		layers: options.layers ? options.layers : [currentLayerGroup],
		target: 'allmap'
	});
	defaultLongitude = options.center ? options.center[0] : 117.01;
	defaultLatitude = options.center ? options.center[0] : 25.12;;
	map.setCenterAndZoom(new fjzx.map.Point(defaultLongitude,defaultLatitude), 13); // 初始化地图,设置中心点坐标和地图级别。
	//map.addEventListener("click",mapClickEvent);

    //地图缩放控件
  	var zoomSlider = new ol.control.ZoomSlider()
  	map.addControl(zoomSlider);
}

$(document).ready(function () {
    try {
        init();
    } catch (e) {
        setTimeout(function () {
            init();
        }, 1000);
    }

});

//初始化参数（用于轨迹回放）
var trackHistory = {
		entity_name:"",
		total:0,
		size:0,
		distance:0,
		toll_distance:0,
		start_point:"",
		end_point:"",
		points:[]
};
var dateTimeArrayIndex = 0;
var myRes = [];
function init(){
	/*$("#userTree").on("click",".personnel-info","",function(){
		var userId = $(this).attr("data-userId");
		var loginId = $(this).attr("data-loginId");
		var userIdName = $(this).attr("data-userIdName");
		$("#loginId").val(loginId);
		$("#userId").val(userId);
		$("#userIdName").val(userIdName);
	});*/
	$("#cancelTrack").click(function(){
		var loginId = $("#loginId").val();
		var lushu = luShuMap.get(loginId);
		if(lushu!='' && lushu != null){
			lushu.freeResource();
		}
		$("#loginId").val("");
		$("#userId").val("");
		$("#userIdName").val("");
	});
	
	$("#getTrack").click(function(){
		map.clearOverlays();
		var startTime =str_to_time( $("input[fjzx_field_name=trackDateStart]").val());
		var endTime = str_to_time($("input[fjzx_field_name=trackDateEnd]").val());
		//var entityName = $("#loginId").val();
		var entityName = "0NF7snJ1F7v8Et_Ygi6lNj";
		if(entityName==""){
			fjzx.ui.showMessageError("请选择人员");
			return ;
		}
		
		var startDateTime = $("input[fjzx_field_name=trackDateStart]").val()+":00";
		var endDateTime = $("input[fjzx_field_name=trackDateEnd]").val()+":00";;
		var searchDateTimeArray = getDateTimeArray(startDateTime,endDateTime);

		//对全局参数进行初始化
		var points = [];
		myRes = [];
		trackHistory = {
				entity_name:entityName,
				total:0,
				size:0,
				distance:0,
				toll_distance:0,
				start_point:"",
				end_point:"",
				points:[]
		};
		dateTimeArrayIndex = 0;
		$("div.track-history-table").empty();
		$(".map-picture-container").removeClass("show");
		
		for(var i=0;i<searchDateTimeArray.length;i++){			
			var startDateTime = searchDateTimeArray[i].startDateTime;
			var endDateTime = searchDateTimeArray[i].endDateTime;		
			showTrackHistoryListBatch(i,entityName,startDateTime,endDateTime,function(res){
				if(dateTimeArrayIndex>=searchDateTimeArray.length){
					var tempLength = 0;
					for(var j = 0;j < myRes.length;j++){
						trackHistory.total += myRes[j].total;
						trackHistory.size +=  myRes[j].size;
						trackHistory.distance +=  myRes[j].distance;
						trackHistory.toll_distance += myRes[j].toll_distance;
						trackHistory.start_point = myRes[j].start_point;
						trackHistory.end_point = myRes[j].end_point;
						if(myRes[j].points!=null && myRes[j].points !="undefined"){
							trackHistory.points = trackHistory.points.concat(myRes[j].points);
							tempLength = tempLength + myRes[j].points.length;
						}
					}
					
					if(trackHistory.points.length==0){
						showTrackHistoryInfoList(trackHistory);
						//fjzx.ui.showMessageError("暂无轨迹点");
						return;
					}
					for(var i=0;i<trackHistory.points.length;i++){
						var obj = trackHistory.points[i].location;
						var localPoint =  new fjzx.map.Point(obj[0],obj[1]);
						points.push(localPoint);
					}
					showTrack(points,entityName);
					showTrackHistoryInfoList(trackHistory);
				}
			});
		}
	});
}

/**
 * 批量获取轨迹点（多天内的轨迹点）
 * @param	{String}	entityName
 * @param	{String}	startTime	开始时间（yyyy-MM-dd hh:mm:ss）
 * @param	{String}	endTime	结束时间（yyyy-MM-dd hh:mm:ss）
 * @param	{function} callback  回调函数
 */
function showTrackHistoryListBatch(index,entityName,startTime,endTime,callback){
	var cbks = {
		success : function(res) {
			myRes[index]=res;
			dateTimeArrayIndex++;
			if(typeof(callback)=="function"){
				callback(dateTimeArrayIndex,res);
			}
		},
		before : function() {

		},
		after : function() {

		},
		error: function(res){
			fjzx.ui.showMessage("加载流转任务的数据失败!");
		}
	};
	var trackPageSize = 5000;//分页大小
	var trackSortType = 1;//轨迹点排序,0降序，1为升序
	var params = {
			is_processed : 1,
			process_option:"need_denoise=0,need_vacuate=0,need_mapmatch=1",
			ak : ak,
			sort_type: trackSortType,
			page_size: trackPageSize,
			service_id : ServiceId,
			start_time : getUnixTimeFromDateTime(startTime),
			end_time : getUnixTimeFromDateTime(endTime),
			entity_name : entityName,
			active_time : getUnixTimeFromDateTime(startTime)
		};
	//jsonp('http://api.map.baidu.com/trace/v2/track/gethistory', params, cbks.success, cbks.before, cbks.fail, cbks.after);
	$.ajax({
		url:'http://api.map.baidu.com/trace/v2/track/gethistory',
        data: params,
        dataType: 'jsonp',
		async:false,
        success: cbks.success,
        error: cbks.error,
        complete: cbks.after
    });
}

/**
 * 根据传入的日期时间段，获取对应时间数组
 * @param	{String} startDateTime	"yyyy-MM-dd hh:mm:ss"
 * @param	{String} endDateTime	"yyyy-MM-dd hh:mm:ss"
 * @return {String}	时间段数组
 */
function getDateTimeArray(startDateTime,endDateTime){
	var result = [];
	

	if(str_to_time(startDateTime)>str_to_time(endDateTime)){
		fjzx.ui.showMessageError("开始时间不能大于截止时间！");
	}
	
	var startDateTimeArray = startDateTime.split(" ");
	var startDateStr = startDateTimeArray[0];
	var startTimeStr = startDateTimeArray[1];
	
	var endDateTimeArray = endDateTime.split(" ");
	var endDateStr = endDateTimeArray[0];
	var endTimeStr = endDateTimeArray[1];
	
	var dayOfStart = " 00:00:00";
	var dayOfEnd = " 23:59:59";
	
    var startDate = getDateFromString(startDateStr);  
    var endDate = getDateFromString(endDateStr);
    
    var startDateTemp = startDate;
    while((endDate.getTime()-startDateTemp.getTime())>=0){
        var data = {startDateTime:"",endDateTime:""};
    	data.startDateTime = startDateTemp.format("yyyy-MM-dd") + dayOfStart;
    	data.endDateTime = startDateTemp.format("yyyy-MM-dd") + dayOfEnd;
    	result.push(data);
    	//前移一天
        startDateTemp = getDateOffsetDays(startDateTemp,1);
     }
    //还原开始时间和结束时间
    if(result.length>0){
    	var temp = result[0].startDateTime.split(" ");
    	result[0].startDateTime = temp[0] + " " + startTimeStr;
    	var length = result.length;
    	temp = result[length-1].endDateTime.split(" ");
    	result[length-1].endDateTime = temp[0] + " " + endTimeStr;
    }
    return result;
}

/**
 * 获取offset天后的日期
 * @param	{Date} date	日期
 * @param	{int} offset		偏移量
 * @return	{Date}		返回日期
 */
function getDateOffsetDays(date,offset){
	var result = date;
	var tempDate = new Date(date.valueOf() + offset*24*60*60*1000);
    
    var year = tempDate.getFullYear();
    var month = tempDate.getMonth()+1;
    var day = tempDate.getDate();
    if(month <=9) month = "0"+month;
    if(day <= 9) day = "0"+day; 
    tempDate = year+"-"+month+"-"+day;
    result = getDateFromString(tempDate);

    return result;
}

/**
 * 将“yyyy-MM-dd”格式的字符串日期转换为Date类型
 */
function getDateFromString(datestr){  
    var temp = datestr.split("-");  
    var date = new Date(temp[0],temp[1]-1,temp[2]);  
    return date;  
}  

function showTrack(points,entityName){
	var lushuSpeedChange = $("#spinner").val();
	if(lushuSpeedChange != ""){
		lushuSpeed = lushuSpeedChange;
	}
	var icon2 = new fjzx.map.Icon('RSMap/img/markers_track_car.png', new fjzx.map.Size(24, 26), {anchor: new fjzx.map.Size(15, 15)});
	//var icon2 = new fjzx.map.Icon('http://developer.baidu.com/map/jsdemo/img/car.png', new fjzx.map.Size(52,26),{anchor : new fjzx.map.Size(27, 13)});
	
	var polyline = new fjzx.map.Polyline(points);//创建折线
	var pointsLength = points.length-1;
	
	/*var lushu = new fjzx.map.route.Route(map, points, {
	  landmarkPois:[],//显示的特殊点，似乎是必选参数，可以留空，据说要和距原线路10米内才会暂停，这里就用原线的点
	  //defaultContent: '继续前行',//覆盖物内容，这个填上面的特殊点文字才会显示
	  autoView:true,//是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
	  speed: lushuSpeed,//路书速度
	  enableRotation:true,//是否设置marker随着道路的走向进行旋转
	  icon: icon2 //覆盖物图标，默认是百度的红色地点标注
	});
	lushu.setMarkerStart(points[0],new fjzx.map.Icon('images/markers_start.png', new fjzx.map.Size(24,26)));
	lushu.setMarkerEnd(points[pointsLength],new fjzx.map.Icon('images/markers_end.png', new fjzx.map.Size(24,26)));
	lushu.setMarkerPolyline(polyline);*/
	
	var lushu = new MapLib.LuShu(map, points, {
	  landmarkPois:[],//显示的特殊点，似乎是必选参数，可以留空，据说要和距原线路10米内才会暂停，这里就用原线的点
	  //defaultContent: '继续前行',//覆盖物内容，这个填上面的特殊点文字才会显示
	  autoView:true,//是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
	  speed: lushuSpeed,//路书速度
	  enableRotation:true,//是否设置marker随着道路的走向进行旋转
	  icon: icon2 //覆盖物图标，默认是百度的红色地点标注
	});
	lushu.setMarkerStart(points[0],new fjzx.map.Icon('images/markers_start.png', new fjzx.map.Size(24,26)));
	lushu.setMarkerEnd(points[pointsLength],new fjzx.map.Icon('images/markers_end.png', new fjzx.map.Size(24,26)));
	lushu.setMarkerPolyline(points);

	map.setCenterAndZoom(points[5], 20);//设置中心坐标及默认缩放级别
	lushu.start();//启动路书函数
	luShuMap.put(entityName,lushu); //保存路书
}

function str_to_time(str_time) {
    var new_str = str_time.replace(/:/g, '-');
    new_str = new_str.replace(/ /g, '-');
    var arr = new_str.split("-");
    var strtotime = 0;
    var datum = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
    if (datum != null && typeof datum != 'undefined') {
        strtotime = datum.getTime() / 1000;
    }
    return strtotime;
}
	 
function get(url, params, success, before, fail, after){
	if (before) {
        before();
    }
    fail = fail || function () {};
    after = after || function () {};
    $.ajax({
        url: url,
        data: params,
        dataType: 'json',
        success: success,
        error: fail,
        complete: after
    });
	
}
function jsonp(url, params, success, before, fail, after) {
    if (before) {
        before();
    }
    fail = fail || function () {};
    after = after || function () {};
    $.ajax({
        url: url,
        data: params,
        dataType: 'jsonp',
        success: success,
        error: fail,
        complete: after
    });
}


// 获取用于轨迹回放信息显示的Track    
function showTrackHistoryInfoList(res){
	var trackHistoryArray = getTrackHistoryArray(res);	
	var mySwiper;
	if(res.size>0)
		mySwiper = this.initTrackHistoryInfoContainer(res.size);
	else
		mySwiper = this.initTrackHistoryInfoContainer(0);

	var $tbody = $("div.track-history-table");
	var template = "<div class='swiper-slide {text:index}'>\
		<div class='swiper-slide-td point'>{text:length}</div>\
		<div class='swiper-slide-td timePeriod'>{text:startTime}~{text:endTime}</div>\
		<div class='swiper-slide-td location'>{text:trackHistory.address}</div>\
		<div class='swiper-slide-td stayTime'>{text:stayTime}</div>\
		<div class='swiper-slide-td locateInterval'>{text:locateInterval}</div>\
		<div class='swiper-slide-td totalDistance'>{text:distance}</div>\
		<div class='swiper-slide-td spaceDistance'>{text:spaceDistance}</div>\
		<div class='swiper-slide-td averageSpeed'>{text:averageSpeed}</div>\
		<div class='swiper-slide-td longitude'>{text:longitude}</div>\
		<div class='swiper-slide-td latitude'>{text:latitude}</div>\
		<div class='swiper-slide-td datum'></div>\
	</div>";
	var emptyTemplate = "<div class='swiper-slide'><div style='width:100%;text-align:center;'>没有轨迹点数据</div></div>";
	
	$tbody.empty();
	var trackHistoryPointsEnd; //上一个组的结束点
	var allDistance=0;
	
	//没有轨迹点数据时显示
	if(trackHistoryArray.length<=0){
		var $itemEmpty = $(emptyTemplate);
		fjzx.ui.validateElement($itemEmpty);
		//$tbody.append($itemEmpty);		
		mySwiper.appendSlide(emptyTemplate);
		$itemEmpty.find("span").hide().fadeIn(1000);
	}
	for(var i=0;i<trackHistoryArray.length;i++){
		var trackHistory = trackHistoryArray[i];
		var points = trackHistory.points;
		var length = points.length;
    	var startTime = points[0].create_time;
    	var endTime = points[length-1].create_time;
    	var stayTime = Decimal.sub(getUnixTimeFromDateTime(endTime),getUnixTimeFromDateTime(startTime)).toNumber(2);
    	var tempStayTime = Decimal.div(stayTime,60).toNumber(2);
    	if(tempStayTime>=1)
    		stayTime = tempStayTime + "分钟";
    	else
    		stayTime = stayTime + "秒";
    	
    	var locateInterval = getLocateInterval(i,trackHistoryArray);//定位间隔
    	var tempLocateInterval = locateInterval = Decimal(locateInterval,60);
    	if(tempLocateInterval>=1){
    		locateInterval = tempLocateInterval + "分钟";
    	}else{
    		locateInterval = locateInterval + "秒";
    	}
    	var distance = getDistanceFromPoints(points);
    	
    	var averageSpeed = tempStayTime==0?"0米/秒":(getAverageSpeedFromPoints(distance,tempStayTime) + "米/秒");
    	var longitude = new Decimal(trackHistory.location[0]).toNumber(6);
    	var latitude= new Decimal(trackHistory.location[1]).toNumber(6);
    	var trackHistoryPointsStart  =  trackHistory.points[0].location; 
    	var spaceDistance=0 ;
		if (trackHistoryPointsEnd != undefined) {
			spaceDistance = new Decimal(this.map.getDistance(
						new fjzx.map.Point(trackHistoryPointsStart[0], trackHistoryPointsStart[1]),
						new fjzx.map.Point(trackHistoryPointsEnd[0],trackHistoryPointsEnd[1])
					)).toNumber(2);
		}
		allDistance = allDistance+spaceDistance+distance; //总里程数
    	if(trackHistory.points.length == 1){ //如果只有一个点，则起始点就是结束点
    		trackHistoryPointsEnd = trackHistoryPointsStart;
    	}else{
    		trackHistoryPointsEnd = trackHistory.points[trackHistory.points.length-1].location;
    	}
    	//var geoc = new fjzx.map.Geocoder();    
		//var poi = new fjzx.map.Point(point.location[0], point.location[1]); 
    	var data = {
    			index:"index_"+i,
    			trackHistory: trackHistoryArray[i],
    			points: trackHistory.points,
    			length: points.length,
    	    	startTime: points[0].create_time,
    	    	endTime: points[length-1].create_time,
    	    	stayTime: stayTime,
    	    	stayTime: stayTime,
    	    	locateInterval: locateInterval,
    	    	distance: distance,
    	    	spaceDistance : spaceDistance,
    	    	averageSpeed: averageSpeed,
    	    	longitude:longitude,
    	    	latitude:latitude
    	};
    	
		mySwiper.appendSlide($.formatStr(template,data));
		getAddress(i,points[0],res,function(index,point){
			$("div.index_" + index).find("div.location").text(point.address);
		});
	}
	$("div.track-info-distance").empty().append("<span>总里程："+new Decimal(allDistance).toNumber(2)+"</span>");

	//初始化查看资料按钮
	initShowDatumButton(trackHistoryArray,function(array){
		for(var i=0;i<array.length;i++){
			var trackHistory = array[i];
			var datumSize = trackHistory.datumSize;
			if(datumSize>0)
				$("div.index_" + i).find("div.datum").append("<a class='showDatum' href='javascript:void(0);'>查看资料</a>");
			
			//获取并显示图片和视频
			setShowDatumButtonOnClick(i,array,function(index,trackHistory){
				$("div.index_" + index).find("a.showDatum").on("click",function(){
					var track = trackHistory;
					var length = track.points.length;
					
					var entityName = track.entity_name;
					var startTime = track.points[0].create_time;
					var endTime = track.points[length-1].create_time;
					var startLocation = track.points[0].location;
					var endLocation = track.points[length-1].location;
					showTrackHistoryDatumList(entityName,startTime,endTime,startLocation,endLocation,function(recordList){
						
					});
					$(".map-picture-container").addClass("show");
				});
			});
		}
	});
}

/**
 * 初始化“查看资料”按钮，只有上传了图片/视频文件的轨迹点组才显示该按钮
 * @param trackHistoryArray
 * @param callback
 */
function initShowDatumButton(trackHistoryArray,callback){
	var formDataStr = JSON.stringify(trackHistoryArray);
	JointServiceBaseMap.getTrackHistoryDatumSize(
			formDataStr,
			function(data){
				if(typeof(callback)=="function")
					var array = JSON.parse(data.trackHistoryArray);
					callback(array);
			},
			function(){
				
			}
	);
}

/**
 * 用于给每个轨迹点组的“查看资料“按钮绑定点击事件
 * @param index
 * @param trackHistoryArray
 * @param callback
 */
function setShowDatumButtonOnClick(index,trackHistoryArray,callback){
	if(typeof(callback)=="function"){
		callback(index,trackHistoryArray[index]);
	}
}

var galleryPage = 1;
var galleryMaxPage = 0;
var currentType = "USER";
var currentUserId = null;
var loadingShow = false;
var dataImageList = [];
var isFirst = true;
var type = "USER";
var datumSwiper;
function showTrackHistoryDatumList(loginId,startTime,endTime,startLocation,endLocation,callback){
	if(typeof(datumSwiper)=="undefined"){
		datumSwiper = initTrackHistoryDatumContainer(loginId,startTime,endTime,startLocation,endLocation,callback);
	}else{
		datumSwiper.removeAllSlides();
	}	
	if(galleryPage == 1){//只有galleryPage为1时，才进行加载数据
		getFileListForTrackHistory(loginId,startTime,endTime,startLocation,endLocation,type,galleryPage,datumSwiper,callback);
		datumSwiper.slideTo(0, 0, false);//切换到第一个slide，速度为1秒
		isFirst = false;
	}
}

/**
 * 初始化轨迹点信息动画显示容器
 * @param recordSize
 * @returns {Swiper}
 */
function initTrackHistoryInfoContainer(recordSize){
	var result = Decimal.div(lushuSpeed,recordSize).toNumber(0);
	//轨迹点信息显示
	var mySwiper = new Swiper('.track-history-info',{
		direction : 'vertical',
		scrollbar:'.swiper-scrollbar-info',
		slidesPerView : 'auto',
		autoplay :result,
		autoplayStopOnLast : true,
		autoplayDisableOnInteraction : false, 
		onlyExternal : true,
		scrollbarHide : false,
		scrollbarDraggable : true ,
		keyboardControl : true,
	});
	return mySwiper;
}

/**
 * 初始化轨迹点文件显示容器
 * @param loginId
 * @param startTime
 * @param endTime
 * @param startLocation
 * @param endLocation
 * @returns {Swiper}
 */
function initTrackHistoryDatumContainer(loginId,startTime,endTime,startLocation,endLocation,callback){
	var swiper = new Swiper('.gallery-thumbs', {
		nextButton : '.swiper-button-next',
		prevButton : '.swiper-button-prev',
		scrollbar:'.swiper-scrollbar-datum',
		scrollbarHide : false,
		scrollbarDraggable : true ,
		slidesPerView : 'auto',
		slideToClickedSlide : true,
		centeredSlides : true,
		touchRatio : 0.2,
		slidesPerGroup : 1,
		spaceBetween : 10,
		observer:true,
		onlyExternal : true,
		onSlideChangeEnd : function(swiper) {
			//同上onTouchEnd							
			if (swiper.isEnd) {
				//完成一次loading才能开始下一次loading，防止重复多次
				if (!loadingShow) {
					//加载loading提示
					//swiper.appendSlide('<div class="swiper-slide">'+loadingStr+'</div>');
					if(galleryPage ==1 || galleryPage<galleryMaxPage){  //不超过总页数
						swiper.slideNext();
						loadingShow = true;
						getAjaxNews();
					}
					
				}

			}
		},
		onTap:function(swiper) {
			loadImageRecord(dataImageList[swiper.clickedIndex]); 			
		},
		onDoubleTap:function(swiper) {
		}
	});
	function getAjaxNews() {
		setTimeout(
			function() {
				loadingShow = false;
				galleryPage++;
				getFileListForTrackHistory(loginId,startTime,endTime,startLocation,endLocation,currentType,galleryPage,callback);
			}, 1000);
	}
	return swiper;
}
//显示图片
function loadImageRecord(record) {
	if(record != undefined && record != null &&  record.fileType!=undefined){
		showPoint(record.fileType, record.id, record.originalFileName,record.longitude, record.latitude,record);
	}
}

/**
 * 点击“查看资料”按钮时，在地图上显示所有资料的坐标点
 * @param recordList
 */
function showAllPoints(recordList) {
	for(var i=0;i<recordList.length;i++){
		var record = recordList[i];
		
		var type = record.fileType;
		var recordId = record.id;
		var recordName = record.originalFileName;
		var x = record.longitude;
		var y = record.latitude;
		var iconMap  = "";
		if(type == "IMAGE")
		    iconMap = new fjzx.map.Icon("images/markers_image.png", new fjzx.map.Size(24,26));
		if(type == "VIDEO")
			iconMap = new fjzx.map.Icon("images/markers_video.png", new fjzx.map.Size(24,26));
		
		if (markerMap.get(recordId) != null) {
			map.removeOverlay(markerMap.get(recordId));//移除原来的坐标
		}
		var marker = null;
		var gpsPoint = new fjzx.map.Point(x, y);
		//创建信息窗口对象icon: new fjzx.map.Icon("images/markers-video.png", new fjzx.map.Size(23,26)) 
		marker = new fjzx.map.Marker(gpsPoint, {
			icon: iconMap 
	     });
		map.addOverlay(marker); //添加LABEL
		marker.addEventListener("click", function(e) {
			if(clickDiv != null){
				var infoWindow = new fjzx.map.InfoWindow(clickDiv);//创建信息窗口对象
				marker.openInfoWindow(infoWindow);//打开信息窗口  
			}
		});
		var content = "<div>"+recordName+"<input type='hidden' name='maker_type' value='"+type+"' /><input type='hidden' name='maker_value' value='"+JSON.stringify(record)+"' /></div>";
		var labelgps = new fjzx.map.Label(content, {
				offset : new fjzx.map.Size(20, -10)
		});
		// backgroundColor: "0.000000000001"  通过这个方法，去掉背景色
		labelgps.setStyle({ color : "red", backgroundColor: "0.000000000001",fontSize : "12px",border:"0px solid red"});
		marker.setLabel(labelgps); //添加GPS标注
		marker.setTitle(recordName);
		markerMap.put(recordId, marker);
	}
}



/**
 * 根据轨迹点信息获取坐标对应地址信息
 * @param i
 * @param point
 * @param res
 * @param callback
 */
function getAddress(i,point,res,callback){
	var address = "";
	
	var geoc = new fjzx.map.Geocoder();    
	var poi = new fjzx.map.LngLat(point.location[0], point.location[1]); 
	geoc.getLocation(poi, function(rs){
		 if (typeof callback === "function"){
			 address = rs.getAddress();
			 point.address = address;
			 callback(i,point);
		 }
	});
}

/**
 * 对获取到的轨迹信息进行分组
 * @param res
 * @returns {Array}
 */
function getTrackHistoryArray(res){
	var trackHistoryArray = [];
	var INTERVAL = 600;		//定位间隔
	var SEG_DISTANCE = 1500;	//轨迹点间间距
	
	var entity_name = res.entity_name;
	var total = res.total;	//符合条件的track
	var size = res.size;		//条符合条件的轨迹点数量
	var distance = res.distance;		//符合条件的所有轨迹点的总里程
	var start_point = res.start_point;
	var end_point = res.end_point;
	var points = res.points;
	var lastPoint;
	var lastPointCreateTime = 0;
	var lastLocation;
	if(size > 0 ){
		lastPoint = points[0];
		lastLocation = points[0].location;
		lastPointCreateTime = points[0].create_time;
	}

	//对轨迹点根据距离和时间进行分组
	for(var i=0;i<size;i++){
		var trackHistory = {
			entity_name:entity_name,
			start_time:"",
			end_time:"",
			address:"",
			location:"",
			points:[]
		};
		var point = {
			create_time:points[i].create_time,
	    	speed:points[i].speed,
	    	location:points[i].location,
	    	address:""
		};

		var date1=new Date(lastPointCreateTime);
		var date2=new Date(point.create_time);
		var period=(date2.getTime()-date1.getTime())/1000;   //相差秒数
		var length = trackHistoryArray.length;
		
		//获取两点间距离
		var startPoint = new fjzx.map.Point(lastLocation[0],lastLocation[1]);  
		var endPoint = new fjzx.map.Point(point.location[0], point.location[1]);  
		var segDistance = this.map.getDistance(startPoint,endPoint);//当前点与上一点间距离
		
		//开始分组
		if(segDistance<=SEG_DISTANCE){		//两定位点间距离小于给定距离时属于同一轨迹
			if(Math.abs(period)>INTERVAL){			//两定位点间定位时间间隔大于给定时间时属于新的轨迹
				trackHistory.location=point.location;
				trackHistory.start_time=point.create_time;
				trackHistory.end_time = point.create_time;
				trackHistory.points.push(point);
				trackHistoryArray[length] = trackHistory;
			}else{//两定位点间定位时间间隔大于给定时间时属于同一轨迹
				if(trackHistoryArray.length > 0){
					trackHistoryArray[length-1].end_time = point.create_time;
					trackHistoryArray[length-1].points.push(point);
				}else{
					trackHistory.location=point.location;
					trackHistory.start_time=point.create_time;
					trackHistory.end_time = point.create_time;
					trackHistory.points.push(point);
					trackHistoryArray[0] = trackHistory;
				}
			}
		}else{		//两定位点间距离大于给定距离时属于新的轨迹
			trackHistory.location=point.location;
			trackHistory.start_time=point.create_time;
			trackHistory.end_time = point.create_time;
			trackHistory.points.push(point);
			trackHistoryArray[length] = trackHistory;
		}
		lastPointCreateTime = point.create_time;
		lastLocation = point.location;
    }
	return trackHistoryArray;
}

/**
 * 获取本次定位于上次定位点间隔时间
 * @param index
 * @param trackHistoryArray
 * @returns {Number}
 */
function getLocateInterval(index,trackHistoryArray){
	var result = 0;
	var length = trackHistoryArray.length;
	if(index>0){
		var startPoints = trackHistoryArray[index-1].points;
		var startTime = startPoints[0].create_time;
		var endPoints = trackHistoryArray[index].points;
		var endTime = endPoints[endPoints.length-1].create_time;
		
		result = getUnixTimeFromDateTime(endTime)-getUnixTimeFromDateTime(startTime);
	}
	return result;
}

/**
 * 计算平均速度
 * @param distance
 * @param time
 * @returns
 */
function getAverageSpeedFromPoints(distance,time){
	var result = 0;	
	time = Decimal.mul(time,60);
	result = Decimal.div(distance,time);
	return new Decimal(result).toNumber(2);
}

/**
 * 计算多个轨迹点连成的轨迹线的距离
 * @param points
 * @returns
 */
function getDistanceFromPoints(points){
	var result = 0;
	var length = points.length;
	var lastPoint;
	if(length>0)
		lastPoint = points[0];
	for(var i=0;i<length;i++){
		var startPoint = new fjzx.map.Point(lastPoint.location[0],lastPoint.location[1]);
		var endPoint = new fjzx.map.Point(points[i].location[0],points[i].location[1]);
		result = result + this.map.getDistance(startPoint,endPoint);	
		lastPoint = points[i];
	}
	return new Decimal(result).toNumber(2);
}

/**
 * 日期转时间戳
 * 
 * @Author: xuguanlong
 * @param {[type]}
 *            str_time [字符串日期 格式2014-08-29 00:00:00]
 * @return {[type]} [时间戳]
 */
function getUnixTimeFromDateTime(str_time) {
    var new_str = str_time.replace(/:/g, '-');
    new_str = new_str.replace(/ /g, '-');
    var arr = new_str.split("-");
    var strtotime = 0;
    var datum = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
    if (datum != null && typeof datum != 'undefined') {
        strtotime = datum.getTime() / 1000;
    }
    return strtotime;
}
/**
 * 时间戳转日期
 * 
 * @Author: xuguanlong
 * @param {[type]}
 *            unixtime [时间戳]
 * @return {[type]} [时间戳对应的日期]
 */
function getDateTimeFromUnixTime(unixtime) {
    var timestr = new Date(parseInt(unixtime) * 1000);
    var datetime = this.date_format(timestr, 'yyyy-MM-dd hh:mm:ss');
    return datetime;
}

function getFileListForTrackHistory(loginId,startTime,endTime,startLocation,endLocation,type,galleryPage,swiper,callback){
	var formData = {
			loginId:loginId,
			startTime:startTime,
			endTime:endTime,
			startLongitude:startLocation[0],
			startLatitude:startLocation[1],
			endLongitude:endLocation[0],
			endLatitude:endLocation[1],
			type:type,
			galleryPage:galleryPage
	};
	var formDataStr = JSON.stringify(formData);
	Map.getFileListForTrackHistory(
			formDataStr,
			function(data){
				galleryMaxPage = data.sizeInfo.maxPage;
				if(!$(".map-picture-container").hasClass("show")){//没有打开列表的话则打开
					$(".map-picture-container").addClass("show");
				}
				if(data.list.length==0&&galleryPage ==1){//没有数据并且是第一次拉取数据则显示暂无数据
				   swiper.appendSlide('<div class="swiper-slide"><img src="images/no_data.png" alt=""/></div>');
				}
				if(data.list.length == 0){  //没有数据不继续执行
					return ;
				}
				for(var i =0;i<data.list.length;i++){
					var po  = data.list[i];
					dataImageList.push(po);
					var path ="do.clientdownload?uploadDownloadControllerId=clientFileUpload&fileId="+po.id;
					if(po.fileType=="IMAGE"){
						//_div+='<div class="swiper-slide"><img src="'+path+'" alt=""/></div>';
						swiper.appendSlide('<div class="swiper-slide"><img src="'+path+'" alt=""/></div>');
					}else if(po.fileType=="VIDEO"){
						var _div="";
						var videoId ="'"+po.id+"'";
						var videoHeadImgId ="do.clientdownload?uploadDownloadControllerId=clientFileUpload&fileId="+po.headId;
						_div+='<div class="swiper-slide video">\
								<img   src="'+videoHeadImgId+'" alt=""/>\
						 </div>';
						 swiper.appendSlide(_div);
					}
				}
				dataImageList = data.list;
				
				
				//在地图上显示所有的图片标注点
				for (var i = 0; i < data.list.length; i++) {
					var record =  data.list[i];
					//showPoint(record.fileType, record.userId, record.userName,record.longitude, record.latitude,record);
				}
				if(typeof(callback)=="function")
					showAllPoints(dataImageList);
			},
			function(){
				if(typeof(eCallback)== "function")
					eCallback();
			}
	);
}

function toPlayVideo(videoId){
	var path='${basePath}';
	path+="mapController?toPlayVideo&videoId="+videoId;
	window.open(path);
}
function closeFileDialog(){
	$("#dialog-file").hide();
}
//转发
function reportRelay(record) {
	formDialogeventApprove.open(record,function($container){
		$container.find("input[fjzx_field_name=name]").readonly();
		$container.find("input[fjzx_select_field_name=Level]").addClass("fjzx-prog-disabled");
		$container.find("input[fjzx_field_name=place]").readonly();
		$container.find("input[fjzx_field_name=describe]").readonly();
	});
}


var recordId;
//点击标记物函数
function showMakerLocation(record) {
	
	if(nowAnimationId!=null){
		var markerLast = markerMap.get(nowAnimationId);
		markerLast.setAnimation(null);
	}
	
	if( recordId != record.id){
		if(recordId!=null){
			if(markerMap.get(recordId)!=null){
			   markerMap.get(recordId).closeInfoWindow();
			   //切换标志隐藏图片列表 
			   //隐藏图片列表
				if(record.fileType !=undefined){
					if($(".map-picture-container").hasClass("show") && record.fileType !='VIDEO' && record.fileType !='IMAGE' ){
						$(".map-picture-container").removeClass("show");
					}
				}else{
					if($(".map-picture-container").hasClass("show")){
						$(".map-picture-container").removeClass("show");
					}
				}
			}
		}
	}
	recordId = record.id;
	var marker = markerMap.get(recordId);
	if(marker!=null){
		map.setCenter(marker.getPosition());
		marker.setAnimation(BMAP_ANIMATION_BOUNCE);
		nowAnimationId = recordId;
		var clickDiv = makerDialogDivMap.get(recordId);
		var infoWindow = new fjzx.map.InfoWindow(clickDiv);//创建信息窗口对象
		marker.openInfoWindow(infoWindow);//打开信息窗口  
	}else{
		
  }
}
//点击用户 的返回方法
function showPointCallBack(marker){
	//alert(recordIdClick);
	//var marker = markerMap.get(recordIdClick);
	map.setCenter(marker.getPosition());
	marker.setAnimation(BMAP_ANIMATION_BOUNCE);
	nowAnimationId = recordId;
	var clickDiv = makerDialogDivMap.get(recordId);
	var infoWindow = new fjzx.map.InfoWindow(clickDiv);//创建信息窗口对象
	marker.openInfoWindow(infoWindow);//打开信息窗口
}

//展示坐标
function showPoint(type, recordId, recordName, x, y,record,showPointCallBack) {
	record.mapType = type;
	if (type == "IMAGE" || type == "VIDEO") {//图片或者视频
		var path= "";
		if(type == "IMAGE"){
			path ="do.clientdownload?uploadDownloadControllerId=clientFileUpload&fileId="+record.id;	
		}
		if(type == "VIDEO"){
			path ="do.clientdownload?uploadDownloadControllerId=clientFileUpload&fileId="+record.headId;	
		}
			//var path = "images/personal-head.png";
			var myPalce ;
			var geoc = new fjzx.map.Geocoder();   
			var pt = new fjzx.map.Point(x,y);
			geoc.getLocation(pt, function(rs){
				myPalce = rs.address;
				
				var clickDiv = '<div class="map-infoWindow">\
					<div class="event-attr">\
					<div class="event-con">\
					<div class="tit"><img class="header-img" style="width:48px;height:48px;" src="'+path+'" alt="'+record.originalFileName+'"/>	&nbsp;&nbsp;'+record.originalFileName+'</div>\
					</div>\
					<div class="group">\
					<div class="property">上传者：</div>\
						<div class="value typeName" >'+record.createByName+'</div>\
					</div>\
					<div class="group">\
					<div class="property">上传时间：</div>\
						<div class="value typeName" >'+record.createTime+'</div>\
					</div>\
					<div class="group">\
						<div class="property">上传地址：</div>\
						<div class="value place">'+myPalce+'</div>\
					</div>';
				//alert(myPalce);
				var palce = '"'+myPalce+'"';
				if(type == "IMAGE")
				clickDiv +="<div class='position-button'><div onclick='showImageDialog("+palce+","+JSON.stringify(record)+")' class='btn-show-file btn-position' id='play-"+record.id+"'><span class='icon fa-folder-open'></span> 查看大图</div></div></div>";
				if(type == "VIDEO")
					clickDiv +="<div class='position-button'><div onclick='showVideoDialog("+palce+","+JSON.stringify(record)+")' class='btn-show-file btn-position' id='play-"+record.id+"'><span class='icon fa-folder-open'></span> 播放视频</div></div></div>";

				var content = "<div>"+recordName+"<input type='hidden' name='maker_type' value='"+type+"' /><input type='hidden' name='maker_value' value='"+JSON.stringify(record)+"' /></div>";
				var title = record.originalFileName;
				var iconMap;
				if(type == "IMAGE")
				    iconMap = new fjzx.map.Icon("images/markers_image.png", new fjzx.map.Size(24,26));
				if(type == "VIDEO")
					iconMap = new fjzx.map.Icon("images/markers_video.png", new fjzx.map.Size(24,26));
				iconMap.setImageOffset(new fjzx.map.Size(0,0)) ;
				showMaker(type,recordId,recordName,x,y,iconMap,clickDiv,content,title);
				//map.centerAndZoom(pt, 15); // 初始化地图,设置中心点坐标和地图级别。
				showMakerLocation(record);
		}); 
			
		}else{
		return ;
	}

	

}
function showMaker(type,recordId,recordName,x,y,iconMap,clickDiv,content,title,showPointCallBack){
	var opts = {
			width : 250,//信息窗口宽度height:100,//信息窗口高度  
			title : "名称：" + recordName//信息窗口标题  
		};
		if (markerMap.get(recordId) != null) {
			map.removeOverlay(markerMap.get(recordId));//移除原来的坐标
		}
		var marker = null;
	var gpsPoint = new fjzx.map.Point(x, y);
	var infoWindow = new fjzx.map.InfoWindow("", opts);
	//创建信息窗口对象icon: new fjzx.map.Icon("images/markers-video.png", new fjzx.map.Size(23,26)) 
	marker = new fjzx.map.Marker(gpsPoint, {
		//icon: new fjzx.map.Icon(imgPath, new fjzx.map.Size(23,26)) 
		icon: iconMap 
     });
	map.addOverlay(marker); //添加LABEL
	if(clickDiv != null){
		makerDialogDivMap.put(recordId, clickDiv);
	}
	marker.addEventListener("click", function(e) {
		if(clickDiv != null){
			var infoWindow = new fjzx.map.InfoWindow(clickDiv);//创建信息窗口对象
			marker.openInfoWindow(infoWindow);//打开信息窗口  
		}
	});
	var labelgps = new fjzx.map.Label(content, {
			offset : new fjzx.map.Size(20, -10)
	});
	// backgroundColor: "0.000000000001"  通过这个方法，去掉背景色
	labelgps.setStyle({ color : "red", backgroundColor: "0.000000000001",fontSize : "12px",border:"0px solid red"}) 
	marker.setLabel(labelgps); //添加GPS标注
	marker.setTitle(title);
	markerMap.put(recordId, marker);
	if(typeof(showPointCallBack)== "function"){
		showPointCallBack(marker);
	}
}
