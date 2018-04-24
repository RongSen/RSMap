	
	var eventIdLocal = '';
	var eventLongitude = '';
	var eventLatitude = '';
	var user = "";
	var optsEvent;
	var paramPeriod = 10;
	var userIdAnimation = "";//保存设置为弹跳的用户Id
	var monitoredPersons = ""; //监控人员
	var features = new ol.Collection();
	
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
	
	//地图初始化
	function initMap(opt_options){
		var options = opt_options || {};
		var currentLayerGroup = fjzx.map.source.getGlobalImageBaseLayer();
		var layerGroupMap = new HashMap();
		layerGroupMap.put("lyImageLayerGroup",fjzx.map.source.getLyImageLayerGroup());
		layerGroupMap.put("lyVecLayerGroup",fjzx.map.source.getLyVecLayerGroup());
		layerGroupMap.put("fjImageLayerGroup",fjzx.map.source.getFjImageLayerGroup());
		layerGroupMap.put("fjVecLayerGroup",fjzx.map.source.getFjVecLayerGroup());
		var center = options.center;
		if(!(center instanceof Array) || typeof(center)=='undefined' || isNaN(center[0]) || isNaN(center[1])){
			center = [117.01, 25.12];
			options.center = center;
		}
		
		map = new fjzx.map.Map({
	        center: options.center ? options.center : [117.01, 25.12],
	        zoom: 13,
			layers: options.layers ? options.layers : [currentLayerGroup],
			target: 'allmap'
		});
		//map.enableScrollWheelZoom(); //启用滚轮放大缩小
		defaultLongitude = options.center ? options.center[0] : 117.01;
		defaultLatitude = options.center ? options.center[0] : 25.12;
		map.setCenterAndZoom(new fjzx.map.Point(defaultLongitude,defaultLatitude), 13); // 初始化地图,设置中心点坐标和地图级别。
		map.addEventListener("click",mapClickEvent);
		map.render();
	    //地图缩放控件
	  	var zoomSlider = new ol.control.ZoomSlider()
	  	map.addControl(zoomSlider);
	  	addCircleOverLay();
	  	return map;
	}
	
	var stroke = new ol.style.Stroke({color : 'yellow', width : '3'});
	/**
	 *  设置圆半径
	 * @param feature
	 * @param radiusNum
	 */
	function setCircleRadiusNum(feature ,radiusNum){
	     feature.getGeometry().setRadius(radiusNum);
	}
	
  /**
   * 获取圆半径
   */
	function getCircleRadiusNum(feature){
	    return  feature.getGeometry().getRadius();
	}
	
/**
 *    getGeometry()   getCoordinates()
	  tempgeo =  feature.getStyle();    
	  tempgeo.getImage().getRadius()        
	  tempgeo.getImage().getStroke().getColor() 
	  tempgeo.getImage().getStroke().getWidth()
 */
	
	/**
	 * 创建圆形feature 
	 * @param lon
	 * @param lat
	 * @param radius
	 */
	function clearAll(){
	features.clear();
	  if(marker!=null){
		  map.removeOverlay(marker);
		  map.removeOverlay(labelgps);
	  }
	}
	function unMapClick(){
		
	}
	
	
	function  createFeatures (lon ,lat ,radius){
	 clearAll();
	  var point = fjzx.map.Point(lon,lat);
      var feature = new ol.Feature({
			geometry: new ol.geom.Circle(point,radius),
			name: 'circle'
			});
      var realRadius = radius/100/1000;
		  setCircleRadiusNum(feature,realRadius);
		  features.push(feature); 	 
			  
	}
	 /**
	 * 绘制圆形图层
	 */
	function addCircleOverLay (){
		var featureOverlay = new ol.layer.Vector({
			  source: new ol.source.Vector({features: features}),
			  projection: 'EPSG:4326',
			  style: new ol.style.Style({
			    fill: new ol.style.Fill({
			      color: 'rgba(255, 255, 255, 0.2)'
			    }),
			    stroke: new ol.style.Stroke({
			      color: '#ffcc33',
			      width: 2
			    }),
			    image: new ol.style.Circle({
			      radius: 0.01,
			      fill: new ol.style.Fill({
			        color: '#ffcc33'
			      }),
			      
			    })
			  })  
			});
			featureOverlay.setMap(map);
	}
	


	var lon ;
	var lat ;
	var radius;
	var draw; // global so we can remove it later
	function drawInteraction(lon ,lat ,radius) {
		
	  createFeatures(lon ,lat ,radius);
	  draw = new ol.interaction.Draw({
	    features: features,
	    type:('Circle')
	  })
      var modify = new ol.interaction.Modify({
	        features: features,
	        // the SHIFT key must be pressed to delete vertices, so
	        // that new vertices can be drawn at the same position
	        // of existing vertices
	        deleteCondition: function(event) {
	          return ol.events.condition.shiftKeyOnly(event) &&
	              ol.events.condition.singleClick(event);
	        }
	      });
	      map.addInteraction(modify);
	}
	
	function setDrawInteraction(){
		 draw = new ol.interaction.Draw({
			    features: features,
			    type:('Circle')
			  })
		 map.addInteraction(draw);
		 draw.on('drawstart',function(evt){
			 features.clear();
		 })
		draw.on('drawend',function(evt){
			 var feature = evt.feature;
			 length = 0;
			 var geometry =feature.getGeometry();
			 lon =geometry.getCenter().toLocaleString().split(",")[0];
			 lat =geometry.getCenter().toLocaleString().split(",")[1];
			 radius =geometry.getRadius();
			//alert(circleRadius(geometry.getFirstCoordinate(),geometry.getLastCoordinate()) ); 根据两点坐标算距离
	         setCenterRadius(lon ,lat , radius*100*1000);
		
	      })
	 
	}

	var wgs84Sphere = new ol.Sphere('6378137');
	var circleRadius = function(coor1 ,coor2) {
		var length;
		    length = 0;
			var sourceProj = map.getView().getProjection();
				var c1 = ol.proj.transform(coor1, sourceProj,
						'EPSG:4326');
				var c2 = ol.proj.transform(coor2, sourceProj,
						'EPSG:4326');
				length += wgs84Sphere.haversineDistance(c1, c2);
			
		var output;
		if (length > 100) {
			output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
		} else {
			output = (Math.round(length * 100) / 100) + ' ' + 'm';
		}
		return output;
	};
	
	//获取围栏列表
	var currentPage = 1;
	var maxPage;
	function getFenceList(operate){
		var page = 1;
		if(operate != undefined){
			page = currentPage+operate;
		}
		if(page<1){
			fjzx.ui.showMessageError("已经到首页");
			return ;
		}else if(page>maxPage){
			fjzx.ui.showMessageError("已经到尾页");
			return ;
		}
		currentPage = page;
		JointServiceBaseFenceMap.getFenceList(
			page,
			function(data){
				var fenceList = data.list;
				maxPage = data.sizeInfo.maxPage;
				var htmlStr = "";
				$.each(fenceList,function(key, value){
					htmlStr += "<li class='map-list-li' >"+
					"<div class='title' onclick='fenceLocation(this)' "+
						"data-val='"+value.id+"' data-name='"+value.name+"'  data-center='"+value.center+"'"+
						"data-radius='"+value.radius+"'>"+value.name+"</div> "+
						//"<div class='info'><span class='icon fa-map-marker' style='top:0;'></span>&nbsp;${event.place}</div>"+
					"</li>";
				});
				if(maxPage==0){
					htmlStr += "<li class='map-list-li' >\
									<div class='title'  >暂无数据</div> \
								</li>";
				}else if(page==1){
					htmlStr +="<div class='form-combox-pagination'>\
	                    <ul class='pagination pagination-sm'>\
	                        <li class='disabled'><a href='javascript:void(0);'><span class='icon fa-angle-left'></span></a></li><!--上一页-->\
	                        <li><input value='1/"+maxPage+"' type='text' readonly='readonly' style='cursor: default;'/></li><!--当前页数-->\
	                        <li onclick='getFenceList(1)' ><a href='javascript:void(0);' ><span class='icon fa-angle-right'></span></a></a></li><!--下一页-->\
	                    </ul>\
	                 </div>";
				}else if(page==maxPage){
					htmlStr +="<div class='form-combox-pagination'>\
	                    <ul class='pagination pagination-sm'>\
	                        <li onclick='getFenceList(-1)'><a href='javascript:void(0);'><span class='icon fa-angle-left'></span></a></li><!--上一页-->\
	                        <li><input value='"+page+"/"+maxPage+"' type='text' readonly='readonly' style='cursor: default;'/></li><!--当前页数-->\
	                        <li  class='disabled'><a href='javascript:void(0);'><span class='icon fa-angle-right'></span></a></a></li><!--下一页-->\
	                    </ul>\
	                 </div>";
				}else{
					htmlStr +="<div class='form-combox-pagination'>\
	                    <ul class='pagination pagination-sm'>\
	                        <li onclick='getFenceList(-1)'><a href='javascript:void(0);'><span class='icon fa-angle-left'></span></a></li><!--上一页-->\
	                        <li><input value='"+page+"/"+maxPage+"' type='text' readonly='readonly' style='cursor: default;'/></li><!--当前页数-->\
	                        <li onclick='getFenceList(1)' ><a href='javascript:void(0);' ><span class='icon fa-angle-right'></span></a></a></li><!--下一页-->\
	                    </ul>\
	                 </div>";
				}
				
					
				$("#fenceList").html(htmlStr);
			},
			function(){
				
			}
		)
	}
	
	function fenceLocation(obj){

		var fenceId = $(obj).attr("data-val");
		var fenceName = $(obj).attr("data-name");
		var center = $(obj).attr("data-center");
		var radius = $(obj).attr("data-radius");
		this.showFenceLocation(fenceId,fenceName,center,radius);
	}
	
	//重新绘制地图，地图中显示围栏
	function showFenceLocation(fenceId,fenceName,center,radius){
		this.getFenceInfo(fenceId);
		var center = center.split(',');
		var longitude = center[0];
		var latitude = center[1];
		drawInteraction(longitude ,latitude ,radius);
		//下拉收起
		$(".map-app-nav").each(function(i,n){
			var obj = $(n);
			if(!obj.hasClass("collapsed")){
				obj.removeClass("collapsed");
				obj.click();//弹出子元素标签
			}
		});
		
	}
	
	function getFenceInfo(fenceId){
		JointServiceBaseFenceMap.getFence(
			fenceId,
			function(data){
				var record = data.record;
				$('.tit').html(record.name);
				$('.sub').html(record.createByName+" | "+record.createTime);
				$('.text').html(record.desc);
				$('.monitoredPersons').html(record.monitoredUserIdsName);
				$('.observers').html(record.observerIdsName);
				$('.alarmCondition').html(record.alarmConditionName);
				$('.status').html(record.statusName);
				
				this.monitoredPersons = record.monitoredPersons;
				refreshOnTime();
			},
			function(){
				
			}
		)
	}
	
	function getUserLocation(monitoredPersons){
		var url = 'http://yingyan.baidu.com/api/v3/entity/list';
		var params = {
	            service_id:service_id,
	            ak:ak,
	            filter:'entity_names:'+monitoredPersons,
	        }
		$.ajax({
	        url: url,
	        data: params,
	        dataType: 'jsonp',
	        success: function(data){
	        	if(data.status == 0){
	        		$.each(data.entities,function(key,value){
	        			showPoint("USER",value);
	        		});
	        	}
	        },
	        error: function(data){
	        },
	        complete: function(data){
	        }
	    });
		
	}
	
	var marker = null;
	var labelgps = null ;
	//展示坐标
	function showPoint(type,record) {
		var entity_name = record.entity_name;
		var real_name = record.real_name;
		var latest_location = record.latest_location;
		var latitude = latest_location.latitude;
		var longitude = latest_location.longitude;
		var loc_time = latest_location.loc_time;
		
		if (markerMap.get(entity_name) != null) {
			map.removeOverlay(markerMap.get(entity_name));//移除原来的坐标
		}
	

		if (type == "USER") {
			var gpsPoint = 	 new fjzx.map.Point(longitude, latitude);
			//创建信息窗口对象icon: new BMap.Icon("images/markers-video.png", new BMap.Size(23,26)) 
			marker = new fjzx.map.Marker(gpsPoint, {
				icon: new fjzx.map.Icon("images/markers_user.png", new fjzx.map.Size(23,26)) 
             });
			map.addOverlay(marker); // 将标注添加到地图中
		
			if (real_name != '') {
				var content = "<div>"+real_name+"<input type='hidden' name='maker_type' value='"+type+"' /><input type='hidden' name='maker_value' value='"+JSON.stringify(record)+"' /></div>";
				 labelgps =new fjzx.map.Label(content, {
						offset :new fjzx.map.Size((20, -10))
				});
				marker.setLabel(labelgps); //添加LABEL

			}
			markerMap.put(entity_name, marker);
		}else{
			return ;
		}



	}
	
	function startIntervalEvent(paramsTime){
		setInterval(
				function(){
					refreshOnTime();
				}
				, paramsTime*1000);
	}

	//refreshOnTime();
	//showAllUser();
	//定时调用该方法方法
	function refreshOnTime(){
		if(monitoredPersons!=''){
			getUserLocation(this.monitoredPersons);
		}
	}
	
	
	