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
var geoc = new BMap.Geocoder(); 
var clickPoint;//鼠标点击经纬度
var clickAddress="";//鼠标点击地址
var excludeSign = []; //不显示的标志物 id
var bm;
var markerMap = new HashMap();
var makerDialogDivMap = new HashMap(); //用来保存显示框
var nowAnimationId=null;   //当前动画的id
var defaultLongitude;
var defaultLatitude;
var showImageId = null; // 保存显示的图片

//地图初始化
function initMap(longitude,latitude){
	bm = new BMap.Map("allmap");
	bm.enableScrollWheelZoom(); //启用滚轮放大缩小
	defaultLongitude = longitude;
	defaultLatitude = latitude;
	bm.centerAndZoom(new BMap.Point(defaultLongitude,defaultLatitude), 13); // 初始化地图,设置中心点坐标和地图级别。
	bm.addEventListener("click",showAreaEvent);
	//初始化地图右键菜单
	bm.addEventListener("rightclick", function(e){
		clickPoint = e.point;
		});
	var menu = new BMap.ContextMenu();
	var txtMenuItem = [
		{
			text:'设置默认位置',
			callback:function(){
				longitude = clickPoint.lng;
				latitude = clickPoint.lat;
				fjzx.ui.showConfirm(
						"确定设置默认位置？",function(){
							JointServiceBaseMap.getPoint(
									clickPoint.lng,
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
				//bm.centerAndZoom(new BMap.Point(defaultLongitude,defaultLatitude), 15); // 初始化地图,设置中心点坐标和地图级别
				window.location.reload();
			}
		}
	];
	for(var i=0; i < txtMenuItem.length; i++){
		menu.addItem(new BMap.MenuItem(txtMenuItem[i].text,txtMenuItem[i].callback,100));
	}
	bm.addContextMenu(menu);
	//初始化地图右键菜单结束
}


//显示点击后附件事件
function showAreaEvent(e){
	if($("#btn_mark_point").hasClass("active")){

		//创建标注点按钮选中
		if(myMakeMark != null)
			bm.removeOverlay(myMakeMark);
		clickPoint = e.point;
		//var marker = new BMap.Marker(e.point); // 创建标注
		//myMakeMark = marker;
		var iconMap = new BMap.Icon("images/markers_04.png", new BMap.Size(24,26));
		myMakeMark = new BMap.Marker(e.point, {
			//icon: new BMap.Icon(imgPath, new BMap.Size(23,26)) 
			icon: iconMap 
	     });
		bm.addOverlay(myMakeMark); // 将标注添加到地图中
		
		formDialogPlaceSigh.open(null,function($container){
		   		$container.find("input[fjzx_field_name=longitude]").val(clickPoint.lng);
				$container.find("input[fjzx_field_name=latitude]").val(clickPoint.lat);
				$container.find("input[fjzx_field_name=place]").val(clickAddress);
				$container.find("input[fjzx_field_name=version]").val(1);
				geoc.getLocation(clickPoint, function(rs){
					clickAddress = rs.address;
			   		$container.find("input[fjzx_field_name=place]").val(clickAddress);
				});  
		});
	}
	
	$("#map-search-close2").click(); //点击其他地方关闭搜索内容

	//bm.clearOverlays();
	
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
}

function loadCompanyList(dataList) {
	for (var i = 0; i < dataList.length; i++) {
		var record =  dataList[i];
		showPoint("COMPANY_LIST", record.PK_id, record.companyName,record.longitude, record.latitude,record);
	}
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
				center = new BMap.Point(record.longitude, record.latitude);
			}
			showPoint("USER", record.userId, record.userName,record.longitude, record.latitude,record);
		}
	}else { //只显示departmentShow 保存的网格人员
		for (var i = 0; i < dataList.length; i++) {
			var record =  dataList[i];
			if(departmentShow == record.departmentId){
				if(center==null){
					center = new BMap.Point(record.longitude, record.latitude);
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
			markerLast.setAnimation(null);
		}
		var marker = markerMap.get(recordId);
		bm.setCenter(marker.getPosition());
		marker.setAnimation(BMAP_ANIMATION_BOUNCE);
		nowAnimationId = recordId;
	}else{
		if(nowAnimationId!=null){
			var markerLast = markerMap.get(nowAnimationId);
			markerLast.setAnimation(null);
		}
	}
}

function loadTaskList(dataList) {
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
}

//显示事件列表
/*function loadEventList(dataList) {
			$("#events-list").html("");
			for (var i = 0; i < dataList.length; i++) {
				var record =  dataList[i];
				var _ul = "<li class='map-list-li' onclick='showMakerLocation("+JSON.stringify(record)+")'>";
					_ul +='<div class="title">'+record.name+'</div>\
							<div class="info"><span class="icon fa-map-marker"></span> '+record.place+'</div>\
						</li>';
				$("#events-list").append(_ul);
				showPoint("EVENT", record.id, record.name,record.longitude, record.latitude,record);
			}
			//然后在地图上面显示
}*/

//显示上报列表
function loadReportList(dataList) {
	$("#reports-list").html("");
	for (var i = 0; i < dataList.length; i++) {
		var record =  dataList[i];
		var _ul =  "<li class='map-list-li' id='reports-list-"+record.id+"'>\
							<div style='padding: 5px' class='title' onclick='showMakerLocation("+JSON.stringify(record)+")'>"+record.name+"</div>\
							<div class='info'>"+record.userName+"\
							<span style='color: red'>("+record.processName+")</span>";
		_ul +=	"<span  style='padding-top: 13px;padding-bottom: 13px;padding-left: 10px;padding-right: 10px' class='icon fa-map-marker'></span>";
		if(record.process =="TO_CENTER"){
			_ul +=	"<span onclick='reportRelay("+JSON.stringify(record)+")'  style='padding-top: 13px;padding-bottom: 13px;padding-left: 10px;padding-right: 10px' class='icon fa-external-link'></span>";
		}
		
		_ul += "</div></li> ";
		$("#reports-list").append(_ul);
		showPoint("REPORT", record.id, record.name,record.longitude, record.latitude,record);
	}
	//然后在地图上面显示
}

//显示任务列表
/*function loadTaskList(dataList) {
			$("#tasks-list").html("");
			for (var i = 0; i < dataList.length; i++) {
				var record =  dataList[i];
				var _ul = '<li class="map-list-li">\
							<div class="title">'+record.name+'</div>\
							<div class="info"><span class="icon fa-map-marker"></span>  '+record.userNames+'</div>\
						</li>';
				$("#tasks-list").append(_ul);
			}
}*/


//处理标注点显示 以及标注点树结构
function dealWithSignRecord(record,searchKey){
	var hasKeyIndex = record.name.indexOf(searchKey);
	
	if(hasKeyIndex>=0){
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
	}
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
				bm.removeOverlay(markerMap.get(record.id));
				markerMap.remove(record.id);
			}
		}
	}
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
			   if(showImageId != null){ //移除标注的图片
					var marker = markerMap.get(showImageId);
					markerMap.remove(showImageId);
					bm.removeOverlay(marker);
					showImageId = null;
					nowAnimationId = null;
				}
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
		bm.setCenter(marker.getPosition());
		marker.setAnimation(BMAP_ANIMATION_BOUNCE);
		nowAnimationId = recordId;
		var clickDiv = makerDialogDivMap.get(recordId);
		var infoWindow = new BMap.InfoWindow(clickDiv);//创建信息窗口对象
		marker.openInfoWindow(infoWindow);//打开信息窗口  
	}else{
		var recordIdClick = null;
		var dataList = tempData.userList;
		for (var i = 0; i < dataList.length; i++) {
			var recordData =  dataList[i];
			if(record.id == recordData.id){
				center = new BMap.Point(record.longitude, record.latitude);
				marker = showPoint("USER", recordData.userId, recordData.userName,recordData.longitude, recordData.latitude,recordData,showPointCallBack);
				recordIdClick = recordData.id;
				//alert(recordIdClick);
			}
		}
		if(recordIdClick==null){
			fjzx.ui.showMessage("没有该位置信息！",function(){
				
			});
		}
    }
}

//显示任务列表
function loadMonitorHlsList(dataList) {
	for (var i = 0; i < dataList.length; i++) {
		var record =  dataList[i];
		showPoint("MONITOR_HLS", record.id, record.name,record.longitude, record.latitude,record);
	}
}
//点击用户 的返回方法
function showPointCallBack(marker){
	//alert(recordIdClick);
	//var marker = markerMap.get(recordIdClick);
	bm.setCenter(marker.getPosition());
	marker.setAnimation(BMAP_ANIMATION_BOUNCE);
	nowAnimationId = recordId;
	var clickDiv = makerDialogDivMap.get(recordId);
	var infoWindow = new BMap.InfoWindow(clickDiv);//创建信息窗口对象
	marker.openInfoWindow(infoWindow);//打开信息窗口
}


//显示图片
function loadImageRecord(record) {
	if(record.fileType!=undefined){
		if(showImageId != null){ //移除原来的图片
			var marker = markerMap.get(showImageId);
			markerMap.remove(showImageId);
			bm.removeOverlay(marker);
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

//显示用户坐标
function showUserPoint(type, recordId, recordName, x, y,record,showPointCallBack){
	
	var imgPath = "images/markers_user.png";
	var myPalce ;
	var geoc = new BMap.Geocoder();   
	var pt = new BMap.Point(x,y);
	geoc.getLocation(pt, function(rs){
		myPalce = rs.address;
		var clickDiv = '<div class="map-infoWindow">\
			<div class="event-attr">\
			<div class="event-con">\
			<div class="tit"><img class="header-img" style="width:48px;height:48px;" src="images/personal-head-man.png" alt="'+record.name+'"/>	&nbsp;&nbsp;'+record.userName+'</div>\
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
		clickDiv +="<div class='position-button'><div onclick='showFileDialog("+leixing+","+JSON.stringify(record)+")' class='btn-show-file btn-position'><span class='icon fa-folder-open'></span> 文件列表</div></div></div>";
		var content = "<div>"+recordName+"<input type='hidden' name='maker_type' value='"+type+"' /><input type='hidden' name='maker_value' value='"+JSON.stringify(record)+"' /></div>";
		var title = record.name;
		var iconMap = new BMap.Icon("images/map_markers.png", new BMap.Size(24,26));
        if(record.status =="online"){
			//iconMap.setImageOffset(new BMap.Size(-48,-26)) ;
        	iconMap = new BMap.Icon("images/map_markers_person1.png", new BMap.Size(24,26));
        }else{
			//iconMap.setImageOffset(new BMap.Size(-96,-26)) ;
        	iconMap = new BMap.Icon("images/map_markers_person2.png", new BMap.Size(24,26));
        }
		showMaker(type,recordId,recordName,x,y,iconMap,clickDiv,content,title,showPointCallBack);
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
	clickDiv +="<div onclick='showFileDialog("+leixing+","+JSON.stringify(record)+")' id='sign-folder-"+record.id+"' class='btn-show-file btn-position'><span class='icon fa-folder-open'></span> 文件列表</div></div></div>";
	var content = "<div>"+recordName+"<input type='hidden' name='maker_type' value='"+type+"' /><input type='hidden' name='maker_value' value='"+JSON.stringify(record)+"' /></div>";
	var title = record.typeName;
	var iconMap = new BMap.Icon(imgPath, new BMap.Size(34,38));
	//iconMap.setImageOffset(new BMap.Size(-24,-26)) ;
	//var iconMap = "";
	
	//alert(recordId+","+recordName+","+x+","+y+","+iconMap+","+content+","+title);
	showMaker(type,recordId,recordName,x,y,iconMap,clickDiv,content,title,showPointCallBack);
}

//显示场所摄像头坐标
function showMonitorHlsPoint(type, recordId, recordName, x, y,record,showPointCallBack){
	var imgPath = "images/markers-video.png";
	var clickDiv = null;
	var content = "<div>"+recordName+"<input type='hidden' name='maker_type' value='"+type+"' /><input type='hidden' name='maker_value' value='"+JSON.stringify(record)+"' /></div>";
	var title = record.typeName;
	var iconMap = new BMap.Icon("images/map_markers.png", new BMap.Size(24,26));
	iconMap.setImageOffset(new BMap.Size(-24,-52)) ;
	showMaker(type,recordId,recordName,x,y,iconMap,clickDiv,content,title,showPointCallBack);
}
//显示任务坐标
function showTaskPoint(type, recordId, recordName, x, y,record,showPointCallBack){
	var imgPath = "images/markers-video.png";
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
	clickDiv +="<div class='position-button'><div class='btn-show-file btn-position'></div></div></div>";

	
	var content = "<div>"+recordName+"<input type='hidden' name='maker_type' value='"+type+"' /><input type='hidden' name='maker_value' value='"+JSON.stringify(record)+"' /></div>";
	var title = record.typeName;
	var iconMap = new BMap.Icon("images/map_markers_evnet.png", new BMap.Size(24,26));
	//iconMap.setImageOffset(new BMap.Size(-24,-78)) ;
	showMaker(type,recordId,recordName,x,y,iconMap,clickDiv,content,title,showPointCallBack);
}
//显示上报事件坐标
function showReportPoint(type, recordId, recordName, x, y,record,showPointCallBack){
	var imgPath = "images/markers-video.png";
	var clickDiv  = "<div class='map-infoWindow'>"+
		"<div class='event-attr'>"+
		"<div class='event-con'>"+
		"<div class='tit'>"+record.name+"</div>"+
		"<div class='sub'>"+record.createByName+" | "+record.createTime+"</div>"+
		"<div class='text'>"+record.describe+"</div>"+
		"</div>"+
		"<div class='group'>"+
			"<div class='property'>类型：</div>"+
			"<div class='value typeName' >"+record.typeName+"</div>"+
		"</div>"+
		"<div class='group'>"+
			"<div class='property'>上报人：</div>"+
			"<div class='value leaderIdName'>"+record.createByName+"</div>"+
		"</div>"+
		"<div class='group'>"+
			"<div class='property'>地址：</div>"+
			"<div class='value place'>"+record.place+"</div>"+
		"</div>";
	var leixing = '"REPORT"';
	clickDiv +="<div class='position-button'><div onclick='showFileDialog("+leixing+","+JSON.stringify(record)+")' class='btn-show-file btn-position'><span class='icon fa-folder-open'></span> 文件列表</div></div></div>";

	var content = "<div>"+recordName+"<input type='hidden' name='maker_type' value='"+type+"' /><input type='hidden' name='maker_value' value='"+JSON.stringify(record)+"' /></div>";
	var title = record.typeName;
	var iconMap = new BMap.Icon("images/map_markers_evnet.png", new BMap.Size(24,26));
//	iconMap.setImageOffset(new BMap.Size(0,-104)) ;
	showMaker(type,recordId,recordName,x,y,iconMap,clickDiv,content,title);
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
	var geoc = new BMap.Geocoder();   
	var pt = new BMap.Point(x,y);
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
		    iconMap = new BMap.Icon("images/markers_image.png", new BMap.Size(24,26));
		if(type == "VIDEO")
			iconMap = new BMap.Icon("images/markers_video.png", new BMap.Size(24,26));
		iconMap.setImageOffset(new BMap.Size(0,0)) ;
		showMaker(type,recordId,recordName,x,y,iconMap,clickDiv,content,title);
		//bm.centerAndZoom(pt, 15); // 初始化地图,设置中心点坐标和地图级别。
		showMakerLocation(record);
	}); 
		
}

//显示公司排口
function showCompanyList(type, recordId, recordName, x, y,record,showPointCallBack){
	var imgPath = "images/marker_port_01.png";
	var clickDiv  = null;
//	var clickDiv  = "<div class='map-infoWindow'>"+
//		"<div class='event-attr'>"+
//		"<div class='event-con'>"+
//		"<div class='tit'>"+record.companyName+"</div>"+
//		"<div class='sub'>"+record.address+"</div>"+
//		"<div class='text'>"+record.lastChangeTimeStamp+"</div>"+
//		"</div>"+
//		"<div class='group'>"+
//			"<div class='property'>公司：</div>"+
//			"<div class='value typeName' >"+record.companyName+"</div>"+
//		"</div>"+
//		"<div class='group'>"+
//			"<div class='property'>排口：</div>"+
//			"<div class='value leaderIdName'>"+record.lastChangeTimeStamp+"</div>"+
//		"</div>"+
//		"<div class='group'>"+
//			"<div class='property'>地址：</div>"+
//			"<div class='value place'>"+record.address+"</div>"+
//		"</div>";
	var leixing = '"PORT"';
	var content ="";
	//var content = "<div>"+recordName+"<input type='hidden' name='maker_type' value='"+type+"' /><input type='hidden' name='maker_value' value='"+JSON.stringify(record)+"' /></div>";
	var title = record.companyName;
	var isonline = record.isOnline;//判断公司是否存在离线的排口
	var iconMap = null;
	if(isonline == "0"){
		iconMap = new BMap.Icon("images/marker_port_01.png", new BMap.Size(24,26));
	}else{
		iconMap = new BMap.Icon("images/marker_port_02.png", new BMap.Size(24,26));
	}
	
//	iconMap.setImageOffset(new BMap.Size(0,-104)) ;
	showMaker(type,recordId,recordName,x,y,iconMap,clickDiv,content,title);
}

function showMaker(type,recordId,recordName,x,y,iconMap,clickDiv,content,title,showPointCallBack){
	var opts = {
			width : 250,//信息窗口宽度height:100,//信息窗口高度  
			title : "名称：" + recordName//信息窗口标题  
		};
		if (markerMap.get(recordId) != null) {
			bm.removeOverlay(markerMap.get(recordId));//移除原来的坐标
		}
	var marker = null;
	var gpsPoint = new BMap.Point(x, y);
	var infoWindow = new BMap.InfoWindow("", opts);
	//创建信息窗口对象icon: new BMap.Icon("images/markers-video.png", new BMap.Size(23,26)) 
	marker = new BMap.Marker(gpsPoint, {
		//icon: new BMap.Icon(imgPath, new BMap.Size(23,26)) 
		icon: iconMap 
     });
	bm.addOverlay(marker); //添加LABEL
	if(clickDiv != null){
		makerDialogDivMap.put(recordId, clickDiv);
	}
	marker.addEventListener("click", function(e){
		var clickDiv2 = "";
		var clickDiv3 = "";
		JointServiceBaseMap.getConsoleDataList(
			recordId,
			function(data){
				tempData = data;
				//点击标记物后展示公司排口点
				var dataList = tempData.portList;
				for (var i = 0; i < dataList.length; i++) {
					var record =  dataList[i];
					var onlineStatus = record.ONLINESTATUS;
					if(onlineStatus == "1"){
						clickDiv3 = "<tr><td sty><span class='fa-circle online'></span></td><td>"+record.POINTNAME+"</td><td>"+record.companyName+"</td><td>"+record.corpName+"</td></tr>";
					}else{
						clickDiv3 = "<tr><td sty><span class='fa-circle offline'></span></td><td>"+record.POINTNAME+"</td><td>"+record.companyName+"</td><td>"+record.corpName+"</td></tr>";
					}
					clickDiv2 = clickDiv2+clickDiv3;
				}
				
				clickDiv  = "<div class='map-detail-container map-table-list'>" 
									+"<div class='map-detail-tite'>"
									+"<b>"+record.companyName+"</b>"
									+"<span class='period'>统计周期："+record.LASTCHANGETIMESTAMP.substring(0,7)+"</span></div>"
									+"<div class='map-detail-body'>"
									+"<table class='table table-hover'><thead><tr><th style='width:30px;'>联网</th><th style='width:150px;'>排口名称</th><th style='width:200px;'>公司</th><th style='width:80px;'>运维人员</th></tr></thead>"
									+"<tbody>"
									+clickDiv2
									+"</tbody></table>"
									+"</div>";
				var infoWindow = new BMap.InfoWindow(clickDiv);
				marker.openInfoWindow(infoWindow);//打开信息窗口  
			},
			function(){
				
			}
		);	
	});
	var labelgps = new BMap.Label(content, {
			offset : new BMap.Size(20, -10)
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

//地图点击覆盖物事件
function markerCilckEvent(e,clickDiv,marker,type){
	if(clickDiv != null){
		var infoWindow = new BMap.InfoWindow(clickDiv);//创建信息窗口对象
		marker.openInfoWindow(infoWindow);//打开信息窗口  
		if (type == "TASK"){//如果点击的是任务的话
			$(".events-temp-list").removeClass("show");
			var dataList =  tempData.eventList;
			var distance = 1000; //查询范围
			var currentLongidute = e.point.lng;
			var currentLatidute = e.point.lat;
			var centerPoint = new BMap.Point(currentLongidute,currentLatidute);
			var envetDistance = 0;
			$("#events-temp-list").html("");
			var flag = false; //标记是否有事件
			for (var i = 0; i < dataList.length; i++) {
				var record =  dataList[i];
				var currentEventPoint = new BMap.Point(record.longitude,record.latitude); 
				envetDistance = bm.getDistance(currentEventPoint,centerPoint).toFixed(2);
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
	}
}
	
	
	
	