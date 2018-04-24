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
var myMakeMark = null;//创建标注点
var geoc = new fjzx.map.Geocoder(); 
var geoc = null; 
var clickPoint;//鼠标点击经纬度
var clickAddress="";//鼠标点击地址
var excludeSign = []; //不显示的标志物 id
var map;
var markerMap = new HashMap();
var makerDialogDivMap = new HashMap(); //用来保存显示框
var nowAnimationId=null;   //当前动画的id
var defaultLongitude;
var defaultLatitude;
var showImageId = null; // 保存显示的图片

//地图初始化
function initMap(opt_options){
	var options = opt_options || {};
    
  	var defaultLongitude = 117.01;
  	var defaultLatitude = 25.12;
    if((options.center instanceof Array) && isNaN(options.center[0]) && isNaN(options.center[1])){
    	defaultLongitude = options.center[0];
    	defaultLatitude = options.center[0];
    }            
    var center = [defaultLongitude,defaultLatitude];   
	var currentLayerGroup = fjzx.map.source.getGlobalVecLayerGroup();
	map = new fjzx.map.Map({
		center: center,
        zoom: 13,
		layers: options.layers ? options.layers : [currentLayerGroup],
		target: options.target ? options.target : 'allmap'
	});
	//map.enableScrollWheelZoom(); //启用滚轮放大缩小
	map.setCenterAndZoom(new fjzx.map.Point(defaultLongitude,defaultLatitude), 13); // 初始化地图,设置中心点坐标和地图级别。
	map.addEventListener("click",mapClickEvent);

    //地图缩放控件
  	var zoomSlider = new ol.control.ZoomSlider();
  	map.addControl(zoomSlider);
   
	//鹰眼
  	//var overView = new fjzx.map.CustomOverviewMap({map:map,selector:"div#mapTool"});
  	//var switcherLayer = new ol.control.SwitcherLayer({map:map,selector:"div#mapTool"});
  	//var measureTool = new ol.control.MeasureTool({map:map,selector:"div#mapTool"});
  	
  	//initWindowInfoTool({map:map,selector:"div#mapTool"});
  	//initMarkerTool({map:map,selector:"div#mapTool"});
    
    /* 图层切换 */
    $("#switcherLayer li").click(function(){
    	$(this).siblings().removeClass("active");
    	$(this).addClass("active");
    	var layerGroupName = $(this).attr("layer_group");
    	map.getLayers().forEach(function(layer,i){
    		if(layer instanceof ol.layer.Group){
    			layer.getLayers().forEach(function(sublayer,j){
    				map.removeLayer(sublayer);
   				});
    		}
    	});
    	var layerGroup = layerGroupMap.get(layerGroupName);
      	currentLayerGroup = layerGroup;
    	map.setLayerGroup(layerGroup);
      	
    	var $layerList = $("ul.layerList");
    	$layerList.empty();
    	layerGroup.getLayers().forEach(function(sublayer,index){
    		
    	});
    	
    });

	//初始化地图右键菜单
	/*map.addEventListener("rightclick", function(e){
		clickPoint = e.point;
		});
	var menu = new BMap.ContextMenu();
	var txtMenuItem = [
		{
			text:'设置默认位置',
			callback:function(){
				longitude = clickPoint.lon;
				latitude = clickPoint.lat;
				fjzx.ui.showConfirm(
						"确定设置默认位置？",function(){
							JointServiceBaseMap.getPoint(
									clickPoint.lon,
									clickPoint.lat,
								function(data){
								},
								function(){
								}
							);
						}
					);
			}
		},
		{
			text:'刷新地图',
			callback:function(){
				//map.centerAndZoom(new fjzx.map.Point(defaultLongitude,defaultLatitude), 15); // 初始化地图,设置中心点坐标和地图级别
				window.location.reload();
			}
		}
	];
	for(var i=0; i < txtMenuItem.length; i++){
		menu.addItem(new BMap.MenuItem(txtMenuItem[i].text,txtMenuItem[i].callback,100));
	}
	map.addContextMenu(menu);
	//初始化地图右键菜单结束
	*/

    return map;
}


//显示点击后附件事件
function mapClickEvent(e){
	var this_ = $(this);
	if($("#btn_mark_point").hasClass("active")){
		//创建标注点按钮选中
		if(myMakeMark != null)
			map.removeOverlay(myMakeMark);
		clickPoint = {lon: e.coordinate[0], lat: e.coordinate[1]};
		var iconMap = new fjzx.map.Icon("images/markers_04.png", new fjzx.map.Size(24,26));
		myMakeMark = new fjzx.map.Marker(e.point, {
			icon: iconMap 
	     });
		map.addOverlay(myMakeMark); // 将标注添加到地图中
		
		formDialogPlaceSigh.open(null,function($container){
	   		$container.find("input[fjzx_field_name=longitude]").val(clickPoint.lon);
			$container.find("input[fjzx_field_name=latitude]").val(clickPoint.lat);
			$container.find("input[fjzx_field_name=place]").val(clickAddress);
			$container.find("input[fjzx_field_name=version]").val(1);
			/*geoc.getLocation(clickPoint, function(rs){
				clickAddress = rs.address;
		   		$container.find("input[fjzx_field_name=place]").val(clickAddress);
			});*/
		});
	}
	$("#map-search-close2").click(); //点击其他地方关闭搜索内容
}



//定时方法 启动函数
//function startConsoleInterval(time) {
//	getMapDate();
//	setInterval(
//			function(){
//				getMapDate();
//			}
//			, time*1000);
//}

//定义一个临时变量 吧 服务器上面获取的数据 保存起来
var tempData=null;
//获取数据
function getMapDate() {
	JointServiceBaseMap.getConsoleData(
		"1",
		function(data){
			tempData = data;
			//绘制公司排口点
			 
			loadCompanyList(data.companyList);
			//绘制事件标注点
			//loadEventList(data.eventList);
			//
			//loadTaskList();
			//loadTaskList(data.taskList); //任务暂时没用
			//绘制上报标注点
			//loadReportList(data.reportList);
			
			//loadSignLocation(data.placeSignList,"");
			//绘制场所管理摄像头标注点
			//loadMonitorHlsList(data.monitorHlsList);
			//绘制在线人员标注点
			//loadOnlineUserList(data.onlineUserList);
			//绘制人员标注点
			//loadUserList(data.userList);
			
			//alert("标记物总数:"+bm.getOverlays().length);
		},
		function(){
			
		}
	);			
	function loadCompanyList(dataList) {
		for (var i = 0; i < dataList.length; i++) {
			var record =  dataList[i];
			showPoint("COMPANY_LIST", record.PK_id, record.companyName,record.longitude, record.latitude,record);
		}
	}
	/*
	JointServiceBaseRemote.getProblemProcessingTaskList(
			1,
			function(data){
				//绘制任务标注点
				loadEventList(data.list);
			},
			function(){

			}
	);

	JointServiceBaseRemote.getProblemProcessingCaseCommonlyList(
			1,
			function(data){
				//绘制问题受理标注点
				loadReportList(data.list);
			},
			function(){
			}
	);
	JointServiceBaseRemote.getProblemProcessingCaseList(
			1,
			function(data){
				//绘制信访案件标注点
				loadCaseList(data.list);
			},
			function(){
			}
	);*/
}

//显示人员在线
function loadOnlineUserList(dataList) {
	//在线人员总数
	$("#onlineUserNum").html(dataList.length);
	var allUserNum = parseInt( $("#allUserNum").val() );
	$("#outlineUserNum").html(allUserNum-dataList.length);
	
	//去除所有在线的标识
	$("li .user-li").each(function(){
		$(this).removeClass("user-online");
 	});
	
	$(".personnel-list-li .personnel-text .lnline_num").html("0");
	for (var i = 0; i < dataList.length; i++) {
		var record =  dataList[i];
		var departmentId = record.departmentId;
		//alert(departmentId);
		//修改用户在线
		$("#userUser"+record.userId).find(".hiddenUserLocation").val(JSON.stringify(record));
		$("#personnel-info"+record.userId).removeClass("outline-user");
		//这里需要改变 在线人员数量的信息
		
		//网格添加数量
		var departmentNum = parseInt( $("#"+departmentId).find(".lnline_num").html() );
		$("#"+departmentId).find(".lnline_num").html(departmentNum+1);
		var parentId =  $("#"+departmentId).attr("node-parent");
		if(parentId!= undefined && parentId!= "userDept" && parentId!= ""){
			parentId = parentId.replace("userDept","");
			var fatherNum = parseInt( $("#"+parentId).find(".lnline_num").html() );
			$("#"+parentId).find(".lnline_num").html(fatherNum+1);
		}
			
		
		showPoint("USER", record.userId, record.userName,record.longitude, record.latitude,record);
	}
	//然后在地图上面显示
}


//显示人员在线
function loadOnlineDepartmentUserList(dataList) {
	for (var i = 0; i < dataList.length; i++) {
		var record =  dataList[i];
		//alert(record.userId);
		//修改用户在线
		$("#userUser"+record.userId).find(".hiddenUserLocation").val(JSON.stringify(record));
		$("#personnel-info"+record.userId).removeClass("outline-user");
		//这里需要改变 在线人员数量的信息
		
		showPoint("USER", record.userId, record.userName,record.longitude, record.latitude,record);
	}
	//然后在地图上面显示
}


//显示人员
function loadUserList(dataList) {
	var center = null;
	if(departmentShow == undefined || departmentShow == ''){ 
		/*for (var i = 0; i < dataList.length; i++) {
			var record =  dataList[i];
			showPoint("USER", record.userId, record.userName,record.longitude, record.latitude,record);
		}*/
	}else if(departmentShow == 'ALL'){ 
		
		for (var i = 0; i < dataList.length; i++) {
			var record =  dataList[i];
			if(center==null){
				center = new fjzx.map.Point(record.longitude, record.latitude);
			}
			showPoint("USER", record.userId, record.userName,record.longitude, record.latitude,record);
		}
	}else { //只显示departmentShow 保存的网格人员
		for (var i = 0; i < dataList.length; i++) {
			var record =  dataList[i];
			if(departmentShow == record.departmentId){
				if(center==null){
					center = new fjzx.map.Point(record.longitude, record.latitude);
				}
				showPoint("USER", record.userId, record.userName,record.longitude, record.latitude,record);
			}
		}
		
	}
	return center;

	//然后在地图上面显示
}

function showClickUserLocation(recordId){
	if($("#userUser"+recordId).hasClass("user-online")){
		if(nowAnimationId!=null){
			var markerLast = markerMap.get(nowAnimationId);
//			markerLast.setAnimation(null);
		}
		var marker = markerMap.get(recordId);
		map.setCenter(marker.getPosition());
//		marker.setAnimation(BMAP_ANIMATION_BOUNCE);
		nowAnimationId = recordId;
	}else{
		if(nowAnimationId!=null){
			var markerLast = markerMap.get(nowAnimationId);
//			markerLast.setAnimation(null);
		}
	}
}

/*function loadTaskList(dataList) {
	JointServiceBaseConsole.getProblemProcessingTaskList(
			"",
			"1",
			function(data){
				var dataList  = data.list;
				//alert(JSON.stringify(dataList));
				$("#events-list").html("");
				for (var i = 0; i < dataList.length; i++) {
					var record =  dataList[i];
					var _ul = "<li class='map-list-li' onclick='showMakerLocation("+JSON.stringify(record)+")'>";
						_ul +='<div class="title">'+record.name+'</div>\
								<div class="info"><span class="icon fa-map-marker"></span> '+record.address+'</div>\
							</li>';
					$("#events-list").append(_ul);
					showPoint("TASK", record.id, record.name,record.longitude, record.latitude,record);
				}
			},
			function(){
				
			}
	);
	//然后在地图上面显示
}*/

//显示事件列表
function loadEventList(dataList) {
	$("#events-list").html("");
	for (var i = 0; i < dataList.length; i++) {
		var record =  dataList[i];
		var _ul = "<li class='map-list-li' onclick='showMakerLocation("+JSON.stringify(record)+")'>";
			_ul +='<div class="title">'+record.name+'</div>\
					<div class="info"><span class="icon fa-map-marker"></span> '+record.address+'</div>\
				</li>';
		$("#events-list").append(_ul);
		showPoint("EVENT", record.id, record.name,record.longitude, record.latitude,record);
	}
	//然后在地图上面显示
}

//显示问题受理列表
function loadReportList(dataList) {
	$("#reports-list").html("");
	for (var i = 0; i < dataList.length; i++) {
		var record =  dataList[i];
		//alert(JSON.stringify(record));
		var _ul =  "<li class='map-list-li' id='reports-list-"+record.id+"'>\
							<div class='title' onclick='showMakerLocation("+JSON.stringify(record)+")'>"+record.describe+"</div>\
							<div class='info'><span  style='padding-right: 4px' class='icon fa-map-marker'></span>"+record.address+"\
							<span style='color: red'>("+record.statusName+")</span>";
		if(record.process =="TO_CENTER"){
			_ul +=	"<span onclick='reportRelay("+JSON.stringify(record)+")'  style='padding-left: 10px;padding-right: 10px' class='icon fa-external-link'></span>";
		}
		
		_ul += "</div></li> ";
		$("#reports-list").append(_ul);
		showPoint("REPORT", record.id, record.describe,record.longitude, record.latitude,record);
	}
	//然后在地图上面显示
}

//显示信访案件列表
function loadCaseList(dataList) {
	$("#cases-list").html("");
	//alert(JSON.stringify(dataList));
	for (var i = 0; i < dataList.length; i++) {
		var record =  dataList[i];
		//alert(JSON.stringify(record));
		var _ul =  "<li class='map-list-li' id='reports-list-"+record.id+"'>\
							<div class='title' onclick='showMakerLocation("+JSON.stringify(record)+")'>"+record.describe+"</div>\
							<div class='info'><span  style='padding-right: 4px' class='icon fa-map-marker'></span>"+record.address+"\
							<span style='color: red'>("+record.statusName+")</span>";
		if(record.process =="TO_CENTER"){
			_ul +=	"<span onclick='reportRelay("+JSON.stringify(record)+")'  style='padding-left: 10px;padding-right: 10px' class='icon fa-external-link'></span>";
		}
		
		_ul += "</div></li> ";
		$("#cases-list").append(_ul);
		showPoint("CASE", record.id, record.describe,record.longitude, record.latitude,record);
	}
	//然后在地图上面显示
}

//显示任务列表
function loadTaskList(dataList) {
	$("#tasks-list").html("");
	for (var i = 0; i < dataList.length; i++) {
		var record =  dataList[i];
		var _ul = '<li class="map-list-li">\
					<div class="title">'+record.name+'</div>\
					<div class="info"><span class="icon fa-map-marker"></span>  '+record.userNames+'</div>\
				</li>';
		$("#tasks-list").append(_ul);
	}
}


//处理标注点显示 以及标注点树结构
function dealWithSignRecord(record,searchKey){
	var hasKeyIndex = record.name.indexOf(searchKey);
	
	/*if(hasKeyIndex>=0){
		var mapTreeCheck = $("#sign-check-"+record.type).attr("data-target").replace(".","");
		var _li = '<li class="personnel-list-li">\
			<div class="personnel-info">\
				<label class="form-checkbox">\
					<input class="mapTree-check '+mapTreeCheck+'" id="sign-check-'+record.id+'" name="" value="" type="checkbox"><span class="lbl"></span>\
				</label>';
			_li+="<div class='personnel-content' onclick='showMakerLocation("+JSON.stringify(record)+")'>";
			_li+='<div class="info">\
						<div class="name l">'+ record.name+ '</div>\
						<div class="r">\
							<div id="" class="function"><span class="icon fa-screenshot"></span></div>\
							<div id="" class="function"><span class="icon fa-folder-open" data-sign-folder = "sign-folder-'+record.id+'"></span></div>\
						</div>\
					</div>\
					<div class="address">\
						<span class="icon fa-map-marker"></span> '+ record.place+ '\
					</div>\
				</div>\
			</div>\
			</li>';
		$("#sign-type-"+record.type).append(_li);
		var liLength  = $("#sign-type-"+record.type+" li").length;
		$("#sign-num-"+record.type).html("("+liLength+")");
	}*/
	//然后在地图上面显示
	showPoint("SIGN", record.id, record.name,record.longitude, record.latitude,record);
}

//显示坐标位置
function loadSignLocation(dataList,searchKey) {
	var key = $("#sign-search-input").val();
	if(searchKey == '' && key!=''){ // 如果key 有值 就不改变这个树结构
		return;
	}
	$(".sign-type-data").each(function(){ //先把所有 标记物坐标的 ul 菜单变为空
		$(this).html("");
	});
	$(".sign-type-num").each(function(){ //先把所有 标记物坐标的 ul 菜单变为空
		$(this).html("(0)");
	});
 
	for (var i = 0; i < dataList.length; i++) {
		var record =  dataList[i];
		dealWithSignRecord(record,searchKey);
	}
	$("[data-sign-folder]").click(function(e){
		//e.stopPropagation();
		var signFolder= $(this).attr("data-sign-folder");
		setTimeout(function(){$("#"+signFolder).click();},100); 
	});
		
}

function reLoadSignLocation(signId,type) {
	var dataList = tempData.placeSignList;
	if(type !='' && type!=undefined){
		for (var i = 0; i < dataList.length; i++) {
			var record =  dataList[i];
			//然后在地图上面显示
			if(type==record.type){
				showPoint("SIGN", record.id, record.name,record.longitude, record.latitude,record);
			}
		}
	}else if(signId !='' && signId!=undefined){
		for (var i = 0; i < dataList.length; i++) {
			var record =  dataList[i];
			//然后在地图上面显示
			if(signId==record.id){
				showPoint("SIGN", record.id, record.name,record.longitude, record.latitude,record);
			}
		}
	}else{
		for (var i = 0; i < dataList.length; i++) {
			var record =  dataList[i];
			//然后在地图上面显示
			showPoint("SIGN", record.id, record.name,record.longitude, record.latitude,record);
		}
	}
	
}
//将type类型标志物清除
function clearSignLocation(type){
	var dataList = tempData.placeSignList;
	if(type !='' && type!=undefined){
		for (var i = 0; i < dataList.length; i++) {
			var record =  dataList[i];
			if(type==record.type){
				map.removeOverlay(markerMap.get(record.id));
				markerMap.remove(record.id);
			}
		}
	}
}
//页签跳转方法
function setTabFrame(id,caption,url){
	window.parent.setTabFrame(id,caption,url);
}

var recordId;
//点击标记物函数
function showMakerLocation(record) {
	if(nowAnimationId!=null){
		var markerLast = markerMap.get(nowAnimationId);
//		markerLast.setAnimation(null);
	}

	if( recordId != record.id){
		if(recordId!=null){
			if(markerMap.get(recordId)!=null){
			   markerMap.get(recordId).closeInfoWindow();
			   /*if(showImageId != null){ //移除标注的图片
					var marker = markerMap.get(showImageId);
					//markerMap.remove(showImageId);
					map.removeOverlay(marker);
					showImageId = null;
					nowAnimationId = null;
				}*/
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
	var recordIdClick = null;
	var marker = markerMap.get(recordId);
	if(marker!=null){
		map.setCenter(marker.getPosition());
//		marker.setAnimation(BMAP_ANIMATION_BOUNCE);
		nowAnimationId = recordId;
		var clickDiv = makerDialogDivMap.get(recordId);
		var infoWindow = new fjzx.map.InfoWindow({infoWindow: clickDiv});//创建信息窗口对象
		marker.openInfoWindow(infoWindow);//打开信息窗口  
	}else{
		var dataList = tempData.userList;
		for (var i = 0; i < dataList.length; i++) {
			var recordData =  dataList[i];
			if(record.id == recordData.id){
				center = new fjzx.map.Point(record.longitude, record.latitude);
				marker = showPoint("USER", recordData.userId, recordData.userName,recordData.longitude, recordData.latitude,recordData,showPointCallBack);
				recordIdClick = recordData.id;
			}
		}
		if(recordIdClick==null){
			fjzx.ui.showMessage("没有该位置信息！",function(){
				
			});
		}
    }
}

//点击用户 的返回方法
function showPointCallBack(marker){
	map.setCenter(marker.getPosition());
//	marker.setAnimation(BMAP_ANIMATION_BOUNCE);
	
	nowAnimationId = recordId;
	var clickDiv = makerDialogDivMap.get(recordId);
	var infoWindow = new fjzx.map.InfoWindow({infoWindow: clickDiv});//创建信息窗口对象
	marker.openInfoWindow(infoWindow);//打开信息窗口
}

//显示任务列表
function loadMonitorHlsList(dataList) {
	for (var i = 0; i < dataList.length; i++) {
		var record =  dataList[i];
		showPoint("MONITOR_HLS", record.id, record.name,record.longitude, record.latitude,record);
	}
}

//显示图片
function loadImageRecord(record) {
	if(record.fileType!=undefined){
		if(showImageId != null){ //移除原来的图片
			var marker = markerMap.get(showImageId);
			markerMap.remove(showImageId);
			map.removeOverlay(marker);
			showImageId = null;
			nowAnimationId = null;
		}
		showImageId = record.id; //保存显示的showImageId
		showPoint(record.fileType, record.id, record.originalFileName,record.longitude, record.latitude,record);
	}
}

//展示坐标
function showPoint(type, recordId, recordName, x, y,record,showPointCallBack) {
	record.mapType = type;
	if (type == "USER") {//用户
		showUserPoint(type, recordId, recordName, x, y,record,showPointCallBack);
	}else if (type == "SIGN") {//标记物
		showSignPoint(type, recordId, recordName, x, y,record,showPointCallBack);
	}else if (type == "MONITOR_HLS") {//场所摄像头
		showMonitorHlsPoint(type, recordId, recordName, x, y,record,showPointCallBack);
	}else if (type == "TASK") {//事件
		showTaskPoint(type, recordId, recordName, x, y,record,showPointCallBack);
	}else if (type == "REPORT") {//上报事件
		showReportPoint(type, recordId, recordName, x, y,record,showPointCallBack);
	}else if (type == "IMAGE" || type == "VIDEO") {//文件包括图片、视频
		showFilePoint(type, recordId, recordName, x, y,record,showPointCallBack);
	}else if (type == "COMPANY_LIST") {//文件包括图片、视频
		showCompanyList(type, recordId, recordName, x, y,record,showPointCallBack);
	}else{
		return ;
	}
}

//显示公司排口
var recordtime = null;
function showCompanyList(type, recordId, recordName, x, y,record,showPointCallBack){
	var imgPath = "images/marker_port_01.png";
	var clickDiv  = null;

	var leixing = '"PORT"';
	var content =" ";
	//var content = "<div>"+recordName+"<input type='hidden' name='maker_type' value='"+type+"' /><input type='hidden' name='maker_value' value='"+JSON.stringify(record)+"' /></div>";
	var title = record.companyName;
	var isonline = record.isOnline;//判断公司是否存在离线的排口
	var iconMap = null;
	if(isonline == "0"){
	     iconMap = new fjzx.map.Icon("images/marker_port_01.png",  new fjzx.map.Size(24,26));
	}else{
			if(record.isoverFlag >0){
		        iconMap = new fjzx.map.Icon("images/marker_port_03.png",  new fjzx.map.Size(24,26));
			}else{
				iconMap = new fjzx.map.Icon("images/marker_port_02.png",  new fjzx.map.Size(24,26));
			}
		}	
    recordtime = record.createTime;
	showMarker(type,recordId,recordName,x,y,iconMap,clickDiv,content,title);
}


//显示用户坐标
function showUserPoint(type, recordId, recordName, x, y,record,showPointCallBack){
	 
	var imgPath = "images/markers_user.png";
	var myPalce ;
	var geoc = new fjzx.map.Geocoder();   
	var pt = new fjzx.map.LngLat(x,y);
	geoc.getLocation(pt, function(rs){
		myPalce = rs.formatted_address;
		var clickDiv = '<div class="map-infoWindow">\
			<div class="event-attr">\
			<div class="event-con">\
			<div class="tit"><img class="header-img" style="width:48px;height:48px;" src="images/personal-head-man.png" alt="'+record.userName+'"/>	&nbsp;&nbsp;'+record.userName+'</div>\
			</div>\
			<div class="group">\
			<div class="property">网格：</div>\
				<div class="value typeName" >'+record.departmentIdName+'</div>\
			</div>\
			<div class="group">\
				<div class="property">地址：</div>\
				<div class="value place">'+myPalce+'</div>\
			</div>\
			<div class="group">\
			<div class="property">定位时间：</div>\
			<div class="value">'+record.locationTime+'</div>\
			</div>\
			<div class="position-button">';
		var leixing = '"USER"';
		clickDiv +="<div class='position-button'><div onclick='showFileDialog(event,"+leixing+","+JSON.stringify(record)+")' class='btn-show-file btn-position'><span class='icon fa-folder-open'></span> 文件列表</div></div></div>";
		var content = "<div><input type='hidden' name='maker_type' value='"+type+"' /><input type='hidden' name='maker_value' value='"+JSON.stringify(record)+"' /></div>";
		var title = record.userName;
		var iconMap = new fjzx.map.Icon("images/map_markers.png", new fjzx.map.Size(24,26));
        if(record.status =="online"){
			//iconMap.setImageOffset(new fjzx.map.Size(-48,-26)) ;
        	iconMap = new fjzx.map.Icon("images/map_markers_person1.png", new fjzx.map.Size(24,26));
        }else{
			//iconMap.setImageOffset(new fjzx.map.Size(-96,-26)) ;
        	iconMap = new fjzx.map.Icon("images/map_markers_person2.png", new fjzx.map.Size(24,26));
        }
		showMarker(type,recordId,recordName,x,y,iconMap,clickDiv,content,title,showPointCallBack);
	}); 
}
//显示标记物坐标
function showSignPoint(type, recordId, recordName, x, y,record,showPointCallBack){
	var imgPath = record.icon;
	var clickDiv ='<div class="map-infoWindow">\
		<div class="event-attr">\
		<div class="event-con">\
		<div class="tit">'+record.name+'</div>\
		<div class="sub">'+record.createByName+' | '+record.createTime+'</div>\
		<div class="text">'+record.describe+'</div>\
		</div>\
		<div class="group">\
			<div class="property">类型：</div>\
			<div class="value typeName" >'+record.typeName+'</div>\
		</div>\
		<div class="group">\
			<div class="property">地址：</div>\
			<div class="value place">'+record.place+'</div>\
		</div>\
		<div class="position-button">';
	var leixing = '"SIGN"';
	clickDiv +="<div onclick='showFileDialog(event,"+leixing+","+JSON.stringify(record)+")' id='sign-folder-"+record.id+"' class='btn-show-file btn-position'><span class='icon fa-folder-open'></span> 文件列表</div></div></div>";
	var content = "<div><input type='hidden' name='maker_type' value='"+type+"' /><input type='hidden' name='maker_value' value='"+JSON.stringify(record)+"' /></div>";
	var title = record.typeName;
	var iconMap = new fjzx.map.Icon(imgPath, new fjzx.map.Size(34,38));
	iconMap.setImageOffset(new fjzx.map.Size(-24,-26)) ;
	//var iconMap = "";
	
	//alert(recordId+","+recordName+","+x+","+y+","+iconMap+","+content+","+title);
	showMarker(type,recordId,recordName,x,y,iconMap,clickDiv,content,title,showPointCallBack);
}

//显示场所摄像头坐标
/*function showMonitorHlsPoint(type, recordId, recordName, x, y,record,showPointCallBack){
	var imgPath = "images/markers-video.png";
	var clickDiv = null;
	var content = "<div>"+recordName+"<input type='hidden' name='maker_type' value='"+type+"' /><input type='hidden' name='maker_value' value='"+JSON.stringify(record)+"' /></div>";
	var title = record.typeName;
	var iconMap = new fjzx.map.Icon("images/map_markers.png", new fjzx.map.Size(24,26));
	iconMap.setImageOffset(new fjzx.map.Size(-24,-52)) ;
	showMarker(type,recordId,recordName,x,y,iconMap,clickDiv,content,title,showPointCallBack);
}*/
function showMonitorHlsPoint(type, recordId, recordName, x, y,record,showPointCallBack){
	var imgPath = "images/markers-video.png";
	var clickDiv = null;
	var clickDiv ='<div class="map-infoWindow">\
		<div class="event-attr">\
		<div class="event-con">\
		<div class="tit"></div>\
		<div class="sub">'+record.createByName+' | '+record.createTime+'</div>\
		<div class="text">'+record.describe+'</div>\
		</div>\
		<div class="group">\
			<div class="property">类型：</div>\
			<div class="value spaceTypeName" >'+record.spaceTypeName+'</div>\
		</div>\
		<div class="group">\
			<div class="property">地址：</div>\
			<div class="value place">'+record.place+'</div>\
		</div>\
		<div class="position-button">';
		
	clickDiv +="<div onclick='openVidoDialog("+JSON.stringify(record)+")' id='queryVido' class='btn-show-file btn-position'><span class='icon fa-camera'></span> 监控查看</div></div></div>";
	var content = "<div><input type='hidden' name='maker_type' value='"+type+"' /><input type='hidden' name='maker_value' value='"+JSON.stringify(record)+"' /></div>";
	var title = record.typeName;
	var iconMap = new fjzx.map.Icon("images/map_markers.png", {size: new fjzx.map.Size(24,26)});
	iconMap.setImageOffset(new fjzx.map.Size(-24,-52)) ;
	showMarker(type,recordId,recordName,x,y,iconMap,clickDiv,content,title,showPointCallBack);
}

//显示任务坐标
function showTaskPoint(type, recordId, recordName, x, y,record,showPointCallBack){
	var imgPath = "images/markers-video.png";
	//alert(JSON.stringify(record));
	var clickDiv  = "<div class='map-infoWindow'>"+
		"<div class='event-attr'>"+
		"<div class='event-con'>"+
		"<div class='tit'>"+record.name+"</div>"+
		"<div class='sub'>"+record.createByName+" | "+record.createTime+"</div>"+
		"<div class='text'>"+record.describe+"</div>"+
		"</div>"+
		"<div class='group'>"+
			"<div class='property'>任务类型：</div>"+
			"<div class='value typeName' >"+record.typeName+"</div>"+
		"</div>"+
		"<div class='group'>"+
			"<div class='property'>负责人：</div>"+
			"<div class='value leaderIdName'>"+record.taskLeaderIdsName+"</div>"+
		"</div>"+
		"<div class='group'>"+
			"<div class='property'>小队成员：</div>"+
			"<div class='value userIdsName'>"+record.taskPositionIdsName+"</div>"+
		"</div>"+
		"<div class='group'>"+
			"<div class='property'>任务地址：</div>"+
			"<div class='value place'>"+record.address+"</div>"+
		"</div>";
	var leixing = '"TASK"';
	//clickDiv +="<div class='position-button'><div onclick='showFileDialog("+leixing+","+JSON.stringify(record)+")' class='btn-show-file btn-position'><span class='icon fa-folder-open'></span> 文件列表</div></div></div>";
	var id = '"jointServiceBaseProblemProcessingTaskManagement"';
	var caption = '"任务管理"';
	var url = '"jointServiceBaseProblemProcessingTaskController?management&taskId='+record.id+'"';
	clickDiv +="<div class='position-button'><div onclick='setTabFrame("+id+","+caption+","+url+")' class='btn-show-file btn-position'><span class='icon fa-folder-open'></span> 任务详情</div></div></div>";

	
	var content = "<div><input type='hidden' name='maker_type' value='"+type+"' /><input type='hidden' name='maker_value' value='"+JSON.stringify(record)+"' /></div>";
	var title = record.typeName;
	var iconMap = new fjzx.map.Icon("images/map_markers4.png", {size: new fjzx.map.Size(24,26)});
	//iconMap.setImageOffset(new fjzx.map.Size(-24,-78)) ;
	showMarker(type,recordId,recordName,x,y,iconMap,clickDiv,content,title,showPointCallBack);
}
//显示问题受理坐标
function showReportPoint(type, recordId, recordName, x, y,record,showPointCallBack){
	var imgPath = "images/markers-video.png";
	var clickDiv  = "<div class='map-infoWindow'>"+
		"<div class='event-attr'>"+
		"<div class='event-con'>"+
		"<div class='tit'>"+record.caseNumber+"</div>"+
		"<div class='sub'>"+record.createByName+" | "+record.reportTime+"</div>"+
		"<div class='text'>"+record.describe+"</div>"+
		"</div>"+
		"<div class='group'>"+
			"<div class='property'>类型：</div>"+
			"<div class='value typeName' >"+record.caseTypeName+"</div>"+
		"</div>"+
		"<div class='group'>"+
			"<div class='property'>举报人：</div>"+
			"<div class='value leaderIdName'>"+record.informantName+"</div>"+
		"</div>"+
		"<div class='group'>"+
			"<div class='property'>地址：</div>"+
			"<div class='value place'>"+record.address+"</div>"+
		"</div>";
	var leixing = '"REPORT"';
	var id = '"jointServiceBaseProblemProcessingCaseManagement"';
	var caption = '"问题受理管理"';
	var url = '"jointServiceBaseProblemProcessingCaseController?managementCommonly&caseId='+record.id+'"';
	clickDiv +="<div class='position-button'><div onclick='setTabFrame("+id+","+caption+","+url+")' class='btn-show-file btn-position'><span class='icon fa-folder-open'></span> 问题受理详情</div></div></div>";

	var content = "<div><input type='hidden' name='maker_type' value='"+type+"' /><input type='hidden' name='maker_value' value='"+JSON.stringify(record)+"' /></div>";
	var title = record.caseTypeName;
	var iconMap = new fjzx.map.Icon("images/map_markers_evnet.png", {size: new fjzx.map.Size(24,26)});
//	iconMap.setImageOffset(new fjzx.map.Size(0,-104)) ;
	showMarker(type,recordId,recordName,x,y,iconMap,clickDiv,content,title);
}

//显示信访案件坐标
function showCasePoint(type, recordId, recordName, x, y,record,showPointCallBack){
	var imgPath = "images/markers-video.png";
	var clickDiv  = "<div class='map-infoWindow'>"+
		"<div class='event-attr'>"+
		"<div class='event-con'>"+
		"<div class='tit'>"+record.caseNumber+"</div>"+
		"<div class='sub'>"+record.createByName+" | "+record.reportTime+"</div>"+
		"<div class='text'>"+record.describe+"</div>"+
		"</div>"+
		"<div class='group'>"+
			"<div class='property'>类型：</div>"+
			"<div class='value typeName' >"+record.caseTypeName+"</div>"+
		"</div>"+
		"<div class='group'>"+
			"<div class='property'>举报人：</div>"+
			"<div class='value leaderIdName'>"+record.informantName+"</div>"+
		"</div>"+
		"<div class='group'>"+
			"<div class='property'>地址：</div>"+
			"<div class='value place'>"+record.address+"</div>"+
		"</div>";
	var leixing = '"REPORT"';
	var id = '"jointServiceBaseProblemProcessingCaseManagement"';
	var caption = '"信访案件管理"';
	var url = '"jointServiceBaseProblemProcessingCaseController?management&caseId='+record.id+'"';
	clickDiv +="<div class='position-button'><div onclick='setTabFrame("+id+","+caption+","+url+")' class='btn-show-file btn-position'><span class='icon fa-folder-open'></span> 案件详情</div></div></div>";

	var content = "<div><input type='hidden' name='maker_type' value='"+type+"' /><input type='hidden' name='maker_value' value='"+JSON.stringify(record)+"' /></div>";
	var title = record.caseTypeName;
	var iconMap = new fjzx.map.Icon("images/map_markers_evnet.png", {size: new fjzx.map.Size(24,26)});
//	iconMap.setImageOffset(new fjzx.map.Size(0,-104)) ;
	showMarker(type,recordId,recordName,x,y,iconMap,clickDiv,content,title);
}

//显示文件坐标
function showFilePoint(type, recordId, recordName, x, y,record,showPointCallBack){
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

		var content = "<div><input type='hidden' name='maker_type' value='"+type+"' /><input type='hidden' name='maker_value' value='"+JSON.stringify(record)+"' /></div>";
		var title = record.originalFileName;
		var iconMap;
		if(type == "IMAGE")
		    iconMap = new fjzx.map.Icon("images/markers_image.png", {size: new fjzx.map.Size(24,26)});
		if(type == "VIDEO")
			iconMap = new fjzx.map.Icon("images/markers_video.png", {size: new fjzx.map.Size(24,26)});
		//iconMap.setImageOffset(new fjzx.map.Size(0,0)) ;
		showMarker(type,recordId,recordName,x,y,iconMap,clickDiv,content,title);

		//map.centerAndZoom(pt, 15); // 初始化地图,设置中心点坐标和地图级别。
		showMakerLocation(record);
	}); 
		
}
var clicktype ="0";
function showMarker(type,recordId,recordName,x,y,iconMap,clickDiv,content,title,showPointCallBack){
	var opts = {
		width : 250,//信息窗口宽度height:100,//信息窗口高度  
		title : "名称：" + recordName//信息窗口标题  
	};
  
    if(markerMap == undefined) return ;
    
	if (markerMap.get(recordId) != null) {
		map.removeOverlay(markerMap.get(recordId));//移除原来的坐标
	}
	var marker = null;
	
	var point = new fjzx.map.Point(x,y);
	marker = new fjzx.map.Marker(point, {
		icon: iconMap
	});
	map.addOverlay(marker);
	
	if(clickDiv != null){
		makerDialogDivMap.put(recordId, clickDiv);
		
	}
 
	marker.addClick(function(e){
	   	 clicktype =1 ;
		 createInfoWindow(recordId,recordName,recordtime,marker,point,"marker")
	 
			
	});
	var labelgps = new fjzx.map.Label({
		content: content,
		offset : new fjzx.map.Size(5, -25)
	});
	labelgps.setStyle({color: "red", backgroundColor: "0.000000000001",fontSize: "12px",border: "0px solid red"}); 
	marker.setLabel(labelgps); //添加GPS标注
	marker.setTitle(title);
	markerMap.put(recordId, marker);
	if(typeof(showPointCallBack)== "function"){
		showPointCallBack(marker);
	}
}


function createInfoWindow(recordId,recordName,recordTime,marker,point,typeSeachString){
	var clickDiv2 = "";
	var clickDiv3 = "";
	var tempClikDiv ="";
 
	JointServiceBaseMap.getConsoleDataList(
		recordId,
		function(data){
			tempData = data;
	        //点击标记物后展示公司排口点
			var dataList = tempData.portList;
			for (var i = 0; i < dataList.length; i++) {
				var record =  dataList[i];
		        var createName = record.createName;
				var onlineStatus = record.isOnline;
				var disportType  = record.disportType;
				var isoverFlag =record.isoverFlag;
 
				var clickTd ="" ;
				var clickTdUser ="";
		
				if(isoverFlag >0){
					clickTd ="<font  color=red>"+record.deviceName+"</font>" ;
					clickTdUser="<a    onclick='onDeviceOprator(event,$(this).parent().parent())' class='deviceOperator'><font class =my-span color=red>"+record.createName+"</font></a>" ;
				}else{
					clickTd ="<font class =my-span  color=black>"+record.deviceName+"</font>" ;
					clickTdUser="<font class =my-span   color=black>"+record.createName+"</font>" ;
				}
				if(onlineStatus == "1"){
					clickDiv3 = "<tr did='"+record.dischargePortId+"'  disportName='"+record.POINTNAME+"' id='"+record.deviceId+"'rname ="+recordName+" disportType ="+disportType+"  onclick='onClickAction(this)'><td><span class='fa-circle online'></span></td><td>"+clickTd+"</td><td>"+clickTdUser+"</td><td><a class='dataDetail' ><span class='icon fa-bar-chart'></span> 数据详情</a></td></tr>";
				}else{
					clickDiv3 = "<tr   did='"+record.dischargePortId+"'  disportName='"+record.POINTNAME+"' id='"+record.deviceId+"'rname ="+recordName+" disportType ="+disportType+"  onclick='onClickAction(this)'><td><span class='fa-circle offline'></span></td><td>"+clickTd+"</td><td>"+clickTdUser+"</td><td><a class='dataDetail'><span class='icon fa-bar-chart'></span> 数据详情</a></td></tr>";
				}
				clickDiv2 = clickDiv2+clickDiv3;
			}
		
 
		clickDiv  = "<div class='marker-info-container'>" 
	                +"<div class='base-info'>"
					+"<div class='name'>" +
					"<a href='javascript:void(0)' onclick =setTabFrame('enterpriseInfo','企业信息管理','pollutionEnterpriseController?gotoEpaPollutionEnterpriseInfo&companyName="+recordName+"')>"+recordName+"</a></div>"
                    +"<div class='other'><span class='time'>"+recordtime+"</span></div>"
			        +"</div>"
					+"<div class='data-info'>"
					+"<table id='detailDataTable' class='table-mini no-border no-background'><thead><tr><th>联网</th><th>设备名称</th><th>运维人员</th><th>操作</th></tr></thead>"
					+"<tbody>"
					+clickDiv2
					+"</tbody></table>"
					+"</div>";
			 var infoWindow  =  new fjzx.map.InfoWindow({infoWindow: clickDiv});
			 if(clicktype ==1){
				 marker.openInfoWindow(infoWindow);//打开信息窗口  
			 } else{
			 
	             marker.openInfoWindowWithPoint(infoWindow,point,[0,0]);//打开信息窗口  
			 }
         if(typeSeachString =="marker")
     	     $(".map-details-popup").hide();
         else{
        	 var firstRowData =$( $("#detailDataTable").find("tbody").find("tr")[0]) ;
	       	  
	       	  getMonitorDeviceForPollutant(firstRowData.attr("disportType"),firstRowData.attr("id"),firstRowData.attr("rname"));
	       	  $(".map-details-popup").show();
         }
			   
			
		},
		function(){
			
		}
	);	
	 function  gotoEnterpriseInfo(){
		 
	 }
}
 

//地图点击覆盖物事件
function markerCilckEvent(e,clickDiv,marker,type){

	if(clickDiv != null){		
		var infoWindow = new fjzx.map.InfoWindow({infoWindow: clickDiv});//创建信息窗口对象
		marker.openInfoWindow(infoWindow);//打开信息窗口  
		if (type == "TASK"){//如果点击的是任务的话
			$(".events-temp-list").removeClass("show");s
			var dataList =  tempData.eventList;
			var distance = 1000; //查询范围
			var currentLongidute = e.point.lon;
			var currentLatidute = e.point.lat;
			var centerPoint = new fjzx.map.Point(currentLongidute,currentLatidute);
			var envetDistance = 0;
			$("#events-temp-list").html("");
			var flag = false; //标记是否有事件
			for (var i = 0; i < dataList.length; i++) {
				var record =  dataList[i];
				var currentEventPoint = new fjzx.map.Point(record.longitude,record.latitude); 
				envetDistance = map.getDistance(currentEventPoint,centerPoint).toFixed(2);
				if(envetDistance<=distance){
					var _ul = "<li class='map-list-li' onclick='showMakerLocation("+JSON.stringify(record)+")'>";
						_ul +='<div class="title">'+record.name+'</div>\
								<div class="info"><span class="icon fa-map-marker"></span> '+record.place+'</div>\
							</li>';
					$("#events-temp-list").append(_ul);
					//showPoint("EVENT", record.id, record.name,record.longitude, record.latitude,record);
					flag = true;
				}
			}
			if(flag){
				$("[data-dropdown]").each(function(i,n){
					var obj = $(n);
					if(obj.hasClass("active")){
						obj.removeClass("active");
					}
				});
				//下拉收起
				$(".map-tool-box").each(function(i,n){
					var obj = $(n);
					if(obj.hasClass("show")){
						obj.removeClass("show");
					}
				});
				$(".events-temp-list").addClass("show");
			}
			//点击任务图标处理结束
		}
		//map.setCenter(e.opt.position);
	}
}
	
	
	
	