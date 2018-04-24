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
};

MACRO_PACKAGE_DEFINE("fjzx.map");

var format = "image/png";
var bounds = [ 73.4510046356223, 18.1632471876417, 134.976797646506, 53.5319431522236 ];
var projection = ol.proj.get('EPSG:4326');
var projectionExtent = projection.getExtent();
var size = ol.extent.getWidth(projectionExtent) / 256;
var resolutions = new Array(14);
var matrixIds = new Array(14);
for ( var z = 0; z <= 14; ++z) {
	// resolutions[z] = size / Math.pow(2, z);
	// matrixIds[z] = z;
	resolutions = [ 0.01098632812500001860777113270858666,
			0.005493164062500009303885566354293329,
			0.002746582031250001658728184138270372,
			0.001373291015625000829364092069135186,
			0.0006866455078124989180747465151294470,
			0.0003433227539062494590373732575647235,
			0.0001716613769531250288401465326699910,
			0.00008583068847656251442007326633499548,
			0.00004291534423828140687076658511131235,
			0.00002145767211914064357109131177813033,
			0.00001072883605957030681947266069468370,
			0.000005364418029785168375809325541723313,
			0.000002682209014892578201475464693109072,
			0.000001341104507446289100737732346554536 ];
	matrixIds = [ '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20' ];
};

function createWMTSLayer(options) {
	var style = options.style;
	var matrixSet = options.matrixSet;
	if (!style)
		style = 'default';
	if (!matrixSet)
		matrixSet = 'c';
	var source = new ol.source.WMTS({
		url : options.url,
		layer : options.layerName,
		format : options.format,
		tileGrid : new ol.tilegrid.WMTS({
			origin : ol.extent.getTopLeft(projectionExtent),
			resolutions : resolutions,
			matrixIds : matrixIds
		}),
		matrixSet : matrixSet,
		style : style,
        wrapX: true
	});

	var layer = new ol.layer.Tile({
		name : options.caption,
		source : source
	})
	return layer;
};

function createZoomSlider() {
	var zoomSlider = new ol.control.ZoomSlider();

	return zoomSlider;
};

function createCustomOverviewMap(layerGroup) {
	var overviewMapControl = new ol.control.OverviewMap({
		className : 'ol-overviewmap ol-custom-overviewmap',
		layers : [ layerGroup ],
		collapseLabel : '\u00BB',
		label : '\u00AB',
		collapsed : false
	});
	return overviewMapControl;
};

/**
 * 测量工具（测距、测面积）
 * 
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object} opt_options Control options, extends olx.control.ControlOptions
 *            adding: **`tipLabel`** `String` - the button tooltip.
 * @param {Function} startDrawCallback	开始测量回调函数
 * @param {Function} endDrawCallback	结束测量回调函数
 */
fjzx.map.MeasureTool = function(opt_options,startDrawCallback,endDrawCallback) {
	var options = opt_options || {};

	//将绘画开始和结束时调用的回调函数保存为全局变量
	this.startDrawCallback = startDrawCallback;
	this.endDrawCallback = endDrawCallback;
	//用于保存已画线条和提示以便删除时使用
	this.measureMap = new fjzx.map.HashMap();	
	this.measureTooltipMap = new fjzx.map.HashMap();

	this.map = options.map;
	this.sphereradius = options.sphereradius ? options.sphereradius : 6378137;
	var measureType = options.measureType === "line" ? length : area;	//测量类型：area为测量面积(area)、line为距离(length)
	
	//测量时显示线条用的图层
	this.source = new ol.source.Vector();
	this.vector = new ol.layer.Vector({
		source : this.source,
		style : new ol.style.Style({
			fill : new ol.style.Fill({
				color : 'rgba(255, 255, 255, 0.2)'
			}),
			stroke : new ol.style.Stroke({
				color : '#ffcc33',
				width : 2
			}),
			image : new ol.style.Circle({
				radius : 7,
				fill : new ol.style.Fill({
					color : '#ffcc33'
				})
			})
		})
	});
	
	this.typeSelect = {
		value: measureType,
		check: true
	};
};

ol.inherits(fjzx.map.MeasureTool, ol.control.Control);

fjzx.map.MeasureTool.prototype.open = function(){
	this.mapmeasure(this.typeSelect);
};

fjzx.map.MeasureTool.prototype.close = function(){
	this.mapmeasure(this.typeSelect);
};

fjzx.map.MeasureTool.prototype.mapmeasure = function(typeSelect) {
	var source = this.source;
	var vector = this.vector;
	var map = this.map;
	var measureMap = this.measureMap;
	var measureTooltipMap = this.measureTooltipMap;
	var wgs84Sphere = new ol.Sphere(this.sphereradius);
    var featuresMap = new fjzx.map.HashMap();
	var sketch;
	var helpTooltipElement;
	var measureTooltipElement;
	var measureTooltip;
	var this_ = this;
	

	map.addLayer(vector);

	map.getViewport().addEventListener('mouseout', function() {
		helpTooltipElement.classList.add('hidden');
	});

	var draw;

	var formatLength = function(line) {
		var length;
		if (typeSelect.check) {
			var coordinates = line.getCoordinates();
			length = 0;
			var sourceProj = map.getView().getProjection();
			for ( var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
				var c1 = ol.proj.transform(coordinates[i], sourceProj,
						'EPSG:4326');
				var c2 = ol.proj.transform(coordinates[i + 1], sourceProj,
						'EPSG:4326');
				length += wgs84Sphere.haversineDistance(c1, c2);
			}
		} else {
			var sourceProj = map.getView().getProjection();
			var geom = /** @type {ol.geom.Polygon} */
			(line.clone().transform(sourceProj, 'EPSG:3857'));
			length = Math.round(geom.getLength() * 100) / 100;
			// length = Math.round(line.getLength() * 100) / 100;
		}
		var output;
		if (length > 100) {
			output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
		} else {
			output = (Math.round(length * 100) / 100) + ' ' + 'm';
		}
		return output;
	};

	var formatArea = function(polygon) {
		if (typeSelect.check) {
			var sourceProj = map.getView().getProjection();
			var geom = /** @type {ol.geom.Polygon} */
			(polygon.clone().transform(sourceProj, 'EPSG:4326'));
			var coordinates = geom.getLinearRing(0).getCoordinates();
			area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
		} else {
			var sourceProj = map.getView().getProjection();
			var geom = /** @type {ol.geom.Polygon} */
			(polygon.clone().transform(sourceProj, 'EPSG:3857'));
			area = geom.getArea();
			// area = polygon.getArea();
		}
		var output;
		if (area > 10000) {
			output = (Math.round(area / 1000000 * 100) / 100) + ' '
					+ 'km<sup>2</sup>';
		} else {
			output = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup>';
		}
		return output;
	};

	var popupcloser = document.createElement('a');
	var measureId = fjzx.map.utils.getUUID();
	popupcloser.id= measureId
	popupcloser.href = 'javascript:void(0);';
	popupcloser.classList.add('RSMap-infoWindow-closer');

	
	function addInteraction() {
		var type = (typeSelect.value == 'area' ? 'Polygon' : 'LineString');
		draw = new ol.interaction.Draw({
			source : source,
			type : /** @type {ol.geom.GeometryType} */
			(type),
			style : new ol.style.Style({
				fill : new ol.style.Fill({
					color : 'rgba(255, 255, 255, 0.2)'
				}),
				stroke : new ol.style.Stroke({
					color : 'rgba(0, 0, 0, 0.5)',
					lineDash : [ 10, 10 ],
					width : 2
				}),
				image : new ol.style.Circle({
					radius : 5,
					stroke : new ol.style.Stroke({
						color : 'rgba(0, 0, 0, 0.7)'
					}),
					fill : new ol.style.Fill({
						color : 'rgba(255, 255, 255, 0.2)'
					})
				})
			})
		});
		map.addInteraction(draw);

		createMeasureTooltip(measureId);
		createHelpTooltip(measureId);
		measureMap.put(measureId,draw);
		
		var listener;
		draw.on('drawstart', function(evt) {
			// set sketch
			sketch = evt.feature;

			/** @type {ol.Coordinate|undefined} */
			var tooltipCoord = evt.coordinate;

			listener = sketch.getGeometry().on(
				'change',
				function(evt) {
					try {
						var geom = evt.target;
						var output;
						if (geom instanceof ol.geom.Polygon) {
							output = formatArea(geom);
							tooltipCoord = geom.getInteriorPoint()
									.getCoordinates();
						} else if (geom instanceof ol.geom.LineString) {
							output = formatLength(geom);
							tooltipCoord = geom.getLastCoordinate();
						}
						measureTooltipElement.innerHTML = output;
						measureTooltip.setPosition(tooltipCoord);
					} catch (e) {
						map.removeInteraction(draw);
					} finally {
					}

				});
			if(typeof(this_.startDrawCallback)==="function")
				this_.startDrawCallback();
		}, this);

		draw.on('drawend', function() {
			measureTooltipElement.appendChild(popupcloser);
			measureTooltipElement.className = 'tooltip tooltip-static';
			measureTooltip.setOffset([ 0, -7 ]);
			// unset sketch
			featuresMap.put(measureId, sketch);
			sketch = null;
			// unset tooltip so that a new one can be created
			measureTooltipElement = null;
			createMeasureTooltip(measureId);
			ol.Observable.unByKey(listener);
			// end
			map.removeInteraction(draw);
			// map.getInteractions().item(1).setActive(false);
			if(typeof(this_.endDrawCallback)==="function")
				this_.endDrawCallback();
		}, this);
	}

	function createHelpTooltip(measureId) {
		if (helpTooltipElement) {
			helpTooltipElement.parentNode.removeChild(helpTooltipElement);
		}
		helpTooltipElement = document.createElement('div');
		helpTooltipElement.setAttribute("measure-id",measureId);
		helpTooltipElement.className = 'tooltip hidden';
	}
	function createMeasureTooltip(measureId) {
		if (measureTooltipElement) {
			measureTooltipElement.parentNode.removeChild(measureTooltipElement);
		}
		measureTooltipElement = document.createElement('div');
		measureTooltipElement.setAttribute("measure-id",measureId);
		measureTooltipElement.className = 'tooltip tooltip-measure';
		measureTooltip = new ol.Overlay({
			element : measureTooltipElement,
			offset : [ 0, -15 ],
			positioning : 'bottom-center'
		});
		map.addOverlay(measureTooltip);
		measureTooltipMap.put(measureId,measureTooltip);
	}
	
	function removeMeasureTooltip(measureId) {
		var measureTooltip = measureTooltipMap.get(measureId);
		map.removeLayer(measureTooltip);
		$("div[measure-id="+measureId+"]").parent().remove();
	}

	//清楚地图上的测量数据
	popupcloser.onclick = function(e) {
	 	var measureInteraction = measureMap.get(measureId);
		var measureTooltipLayer = measureTooltipMap.get(measureId);
		var measureTooltipElement = document.getElementById(measureId);
		var paremtElement = measureTooltipElement.parentNode;
		var feature = featuresMap.get(measureId);
		vector.getSource().removeFeature(feature)
		map.removeLayer(measureTooltipLayer);
		paremtElement.removeChild(measureTooltipElement);
	 
		map.removeInteraction(measureInteraction);
	  

		
	
		// vector.getSource().clear();
		/*map.removeLayer(vector); */
		removeMeasureTooltip(measureId);
	};

	addInteraction();
};

/**
 * Show the MeasureTool.
 */
fjzx.map.MeasureTool.prototype.showPanel = function() {
	if (this.element.className != this.shownClassName) {
		this.element.className = this.shownClassName;
	}
};

/**
 * Hide the MeasureTool.
 */
fjzx.map.MeasureTool.prototype.hidePanel = function() {
	if (this.element.className != this.hiddenClassName) {
		this.element.className = this.hiddenClassName;
	}
};

/**
 * 设置该测量工具所对应的Map.
 * 
 * @param {ol.Map}  map The map instance.
 */
fjzx.map.MeasureTool.prototype.setMap = function(map) {
	// 清理与前一个地图Map相关联的监听器
	for ( var i = 0, key; i < this.mapListeners.length; i++) {
		this.getMap().unByKey(this.mapListeners[i]);
	}
	this.mapListeners.length = 0;
	// 连接监听器等，且保存对新地图的引用
	ol.control.Control.prototype.setMap.call(this, map);
	if (map) {
		var this_ = this;
		this.mapListeners.push(map.on('pointerdown', function() {
			this_.hidePanel();
		}));
	}
};

/**
 * 生成UUID
 * 
 * @returns {String} UUID
 */
fjzx.map.MeasureTool.uuid = function() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
};

/**
 * @private 私有变量
 * @desc 是使溢出的内容在元素内滚动的解决方案 
 */
fjzx.map.MeasureTool.enableTouchScroll_ = function(elm) {
	if (fjzx.map.MeasureTool.isTouchDevice_()) {
		var scrollStartPos = 0;
		elm.addEventListener("touchstart", function(event) {
			scrollStartPos = this.scrollTop + event.touches[0].pageY;
		}, false);
		elm.addEventListener("touchmove", function(event) {
			this.scrollTop = scrollStartPos - event.touches[0].pageY;
		}, false);
	}
};

/**
 * @private
 * @desc Determine if the current browser supports touch events.
 */
fjzx.map.MeasureTool.isTouchDevice_ = function() {
	try {
		document.createEvent("TouchEvent");
		return true;
	} catch (e) {
		return false;
	}
};


//==============================================================================


/**
 * 创建地图实例
 * @param {JSON} opt_options (controls,pixelRatio,interactions,keyboardEventTarget,layers,loadTilesWhileAnimating,loadTilesWhileInteracting,logo,moveTolerance,overlays,renderer,target,view)
 * @param {Funciton} callback
 * @returns {ol.Map}
 */
fjzx.map.Map = function(opt_options,callback){
	var options = opt_options || {};
	
	var center = options.center ? options.center : [117.01, 25.12];
	var projection = options.projection ? options.projection : ol.proj.get('EPSG:4326');
	var zoom = options.zoom ? options.zoom : 3;
	var maxZoom = options.maxZoom ? options.maxZoom : 18;
	var minZoom = options.minZoom ? options.minZoom : 2;
	
	this.opt = {
		view: new ol.View({
			center: center,
			projection: projection,	//projection=EPSG:4326,坐标系设为经纬度坐标系（EPSG:4326），默认为xy坐标（EPSG:3857）
			zoom: zoom,
			maxZoom: maxZoom,
			minZoom: minZoom
		}),
		layers: options.layers,
		target: options.target,
		
		controls: options.controls ? options.controls : undefined,
		pixelRatio: options.pixelRatio ? options.pixelRatio : undefined,
		interactions: options.interactions ? options.interactions : undefined,
		keyboardEventTarget: options.keyboardEventTarget ? options.keyboardEventTarget : undefined,
		loadTilesWhileAnimating: options.loadTilesWhileAnimating ? options.loadTilesWhileAnimating : undefined,
		loadTilesWhileInteracting: options.loadTilesWhileInteracting ? options.loadTilesWhileInteracting : undefined,
		logo: options.logo ? options.logo : false,
		moveTolerance: options.moveTolerance ? options.moveTolerance : undefined,
		overlays: options.overlays ? options.overlays : undefined,
		renderer: options.renderer ? options.renderer : undefined
	};
	
	ol.Map.call(this,this.opt);
};

ol.inherits(fjzx.map.Map, ol.Map);

fjzx.map.Map.prototype.setCenterAndZoom = function(point,zoom){
	var center = new fjzx.map.Point(point[0],point[1]);
	
	this.setCenter(center);
	this.setZoom(zoom);
};

/**
 * 设置地图中心点坐标
 * @param {fjzx.map.Point}point	中心点坐标
 * @param {boolean}isAnimate	是否动画显示（默认为动画显示）
 */
fjzx.map.Map.prototype.setCenter = function(point,isAnimate){
	var view = this.getView();
	
	if(isAnimate || typeof(isAnimate)=='undefined'){
		view.animate({
			center: point,
			duration: 1000
		});
		return;
	}
	view.setCenter(point);
};

/**
 * 设置地图显示级别
 * @param {integer}zoom 地图级别，0～28
 */
fjzx.map.Map.prototype.setZoom = function(zoom){
	var view = this.getView();
	
	if(zoom<0 || zoom > 28)
		return false;

	view.setZoom(zoom);
};

/**
 * 设置地图最小缩放级别
 * @param {integer}zoom 地图级别，0～28
 */
fjzx.map.Map.prototype.setMinZoom = function(minZoom){
	var view = this.getView();
	
	if(minZoom<0 || minZoom > 28)
		return false;
	
	view.setMinZoom = minZoom;
};

/**
 * 设置地图最大缩放级别
 * @param {integer}zoom 地图级别，0～28
 */
fjzx.map.Map.prototype.setMaxZoom = function(maxZoom){
	var view = this.getView();
	
	if(maxZoom<0 || maxZoom > 28)
		return false;
	
	view.setMaxZoom = maxZoom;
};

fjzx.map.Map.prototype.setAnimation = function(animation){
	
};

fjzx.map.Map.prototype.setMapType = function(mapType){
	var layerGroup = fjzx.map.source.getLayerGroupByMapType(mapType);
	map.setLayerGroup(layerGroup);
};

/**
 * 清空地图覆盖物
 * @returns {Boolean}
 */
fjzx.map.Map.prototype.clearOverlays = function(){
	var overlays = this.getOverlays().getArray();
	var overlayArray = [];
	//需要先把地图上的覆盖物对象保存在数组中，然后再遍历该数组进行移除操作
	for(var i=0;i<overlays.length;i++){
		overlayArray.push(overlays[i]);
	}
	for(var i=0;i<overlayArray.length;i++){
		var result = this.removeOverlay(overlayArray[i]);
	}

	return true;
};

fjzx.map.Map.prototype.getDistance = function(startPoint, endPoint){
	var result = 0;
	var sourceProj = map.getView().getProjection();
	
	var c1 = ol.proj.transform(startPoint, sourceProj, 'EPSG:4326');
	var c2 = ol.proj.transform(endPoint, sourceProj, 'EPSG:4326');

	var wgs84Sphere = new ol.Sphere(this.sphereradius);
	result = wgs84Sphere.haversineDistance(c1, c2);
	
	return result;
};

fjzx.map.Map.prototype.pointToPixel = function(point){
	var planePoint = ol.proj.fromLonLat(point);
	var view = this.getView();
	var zoom = view.getZoom();
	
	var pixel_X = planePoint[0] * Math.pow(2, zoom-18);
	var pixel_Y = planePoint[1] * Math.pow(2, zoom-18)
	var pixelPoint = {x: pixel_X, y: pixel_Y};
	return pixelPoint;
};

fjzx.map.Map.prototype.getProjection = function(){
	var view = this.getView();
	var proj = view.getProjection();
	var options = {
		code: proj.getCode() ? proj.getCode() : 'EPSG:4326',
		units: proj.getUnits() ? proj.getUnits() : undefined,
		extent: proj.getExtent() ? proj.getExtent() : undefined,
		axisOrientation: undefined,
		global: proj.isGlobal() ? proj.isGlobal() : undefined,
		metersPerUnit:	proj.getMetersPerUnit() ? proj.getMetersPerUnit() : undefined,
		worldExtent: proj.getWorldExtent() ? proj.getWorldExtent() : undefined
	};
	
	var projection = new fjzx.map.Projection(options);
	
	return projection;
};

/**
 * 获取地图边界值
 * @returns {fjzx.map.Bounds}
 */
fjzx.map.Map.prototype.getBounds = function(){
	var bounds = new fjzx.map.Bounds(this);
	
	return bounds;
};

/**
 * 获取地图中心坐标点（经纬度）
 * @returns {fjzx.map.Bounds}
 */
fjzx.map.Map.prototype.getCenter = function(){
	var view = this.getView();
	
	return view.getCenter();
};

/**
 * 地图边界类
 * @param {fjzx.map.Map} map
 * @returns {fjzx.map.Bounds}
 */
fjzx.map.Bounds = function(map){
	this.map = map;
	var size = this.map.getSize();
	var id = this.map.getTarget();
	var element = document.getElementById(id);
	
	//左上角的XY轴坐标值
	var element_X = element.offsetLeft;
	var element_Y = element.offsetTop;
	//右下角的XY轴坐标值
	var element_max_X = element_X + size[0];
	var element_max_Y = element_Y + size[1];
	
	this.leftTopPoint = [element.offsetLeft, element.offsetTop];
	this.rightButtonPoint = [element_max_X, element_max_Y];
}

fjzx.map.Bounds.prototype.getSize = function(){
	return this.map.getSize();
}

fjzx.map.Bounds.prototype.getLeftTopPoint = function(){
	return this.leftTopPoint;
}

fjzx.map.Bounds.prototype.getRightButtonPoint = function(){
	return this.rightButtonPoint;
}

fjzx.map.Bounds.prototype.containsPoint = function(point){
	//根据经纬度坐标获取对应的屏幕坐标
	var pixelPoint = this.map.getPixelFromCoordinate(point);
	var pixel_X = pixelPoint[0];
	var pixel_Y = pixelPoint[1];
	if(pixel_X > this.leftTopPoint[0] && pixel_X < this.rightButtonPoint[0]){
		if(pixel_Y > this.leftTopPoint[1] && pixel_Y < this.rightButtonPoint[1]){
			return true;
		}
	}
	return false;
}

fjzx.map.Bounds.prototype.containsPixelPoint = function(pixelPoint){
	//根据经纬度坐标获取对应的屏幕坐标
	var pixel_X = pixelPoint[0];
	var pixel_Y = pixelPoint[1];
	if(pixel_X > this.leftTopPoint[0] && pixel_X < this.rightButtonPoint[0]){
		if(pixel_Y > this.leftTopPoint[1] && pixel_Y < this.rightButtonPoint[1]){
			return true;
		}
	}
	return false;
}

/**
 * 标注点构造函数
 * @param {fjzx.map.Point} point
 * @param {Object} opt_options
 * @param {Function} callback
 * @returns {fjzx.map.Marker}
 */
fjzx.map.Marker = function(point,opt_options,callback){
	var options = opt_options || {};
	
	var title = options.title ? options.title : "Marker";
	var icon = options.icon ? options.icon : new fjzx.map.Icon("./RSMap/img/map_markers3.png", new fjzx.map.Size(24,26));
	
	this.markerId = fjzx.map.utils.getUUID();
	this.container = document.createElement("div");
	this.container.className = "RSMap-marker-container";
	
	this.element = document.createElement("div");
	this.element.id = this.markerId;
	this.element.title = title;
	this.element.className = "RSMap-marker";
	
	var img = document.createElement("img");
	img.src = icon.getSrc();
	this.element.appendChild(img);
	
	this.container.appendChild(this.element);
	
	this.opt = {
		element: this.container,
		position: point,
		offset: [-10,-8],
		stopEvent: false,
		autoPan: false,
		autoPanAnimation: undefined
	};
	
	ol.Overlay.call(this, this.opt);
}

ol.inherits(fjzx.map.Marker, ol.Overlay);

/**
 * 设置标注点
 * @param {fjzx.map.Label} label
 */
fjzx.map.Marker.prototype.setLabel = function(label){
	var map = this.getMap();
	label.setPosition(this.opt.position);
	map.addOverlay(label);
};

fjzx.map.Marker.prototype.setTitle = function(title){
	this.element.title = title;
};

fjzx.map.Marker.prototype.setIcon = function(icon){
	$(this.element).find("img").attr("src",icon.getSrc());
};

fjzx.map.Marker.prototype.setAnimation = function(animation){
	console.log("animation");
};

fjzx.map.Marker.prototype.setRotation = function(rotation){
	console.log("rotation");
};

/**
 * 监听标注点点击事件
 * @param callback
 */
fjzx.map.Marker.prototype.addClick = function(callback){
	var this_ = this;
	
	$("div#"+this.markerId).click(function(){
		callback(this_);
	});
};

/**
 * 弹出标注点信息框
 * @param {fjzx.map.InfoWindow} infoWindow
 */
fjzx.map.Marker.prototype.openInfoWindow = function(infoWindow){
	var map = this.getMap();
	this.infoWindow = infoWindow;
	this.infoWindow.setPosition(this.opt.position);
	map.addOverlay(this.infoWindow);
	
	/**
	 * 显示的信息框被遮挡时自动重新设置地图中心点（通过计算出偏移量来实现）
	 */
	//标记点屏幕像素坐标
	var positionPixel = map.getPixelFromCoordinate(this.opt.position);
	var bounds = map.getBounds();
	var mapLeftTopPoint = bounds.getLeftTopPoint();
	var mapRightButtonPoint = bounds.getRightButtonPoint();
	
	//信息框宽高
	var element = this.infoWindow.getElement();
	var width = element.clientWidth;
	var height = element.clientHeight;
	
	//地图中心点经纬度坐标和屏幕像素坐标
	var center = map.getCenter();
	var centerPixel = map.getPixelFromCoordinate(center);
	
	//上边被挡住时
	if(height>(positionPixel[1] - mapLeftTopPoint[1])){
		//由于地图显示区上方可能有工具栏，所以偏移量多100px
		var offset = height - Math.abs(mapLeftTopPoint[1] - positionPixel[1]) + 100;
		centerPixel = [centerPixel[0], centerPixel[1]-offset];
		center = map.getCoordinateFromPixel(centerPixel);
	}
	//下边被挡住时，由于统一显示在标注点上方，所以此种情况一般不会出现
	if((positionPixel[1])>mapRightButtonPoint[1]){
		var offset = positionPixel[1] - mapRightButtonPoint[1];
		centerPixel = [centerPixel[0]+offset, centerPixel[1]];
		center = map.getCoordinateFromPixel(centerPixel);
	}
	//左边被挡住时
	if(width/5>(positionPixel[0] - mapLeftTopPoint[0])){
		//由于信息框统一显示在标注点上方偏右位置，所以正常情况下只有信息框部分被遮挡
		var offset = width/5 - Math.abs(positionPixel[0] - mapLeftTopPoint[0]);
		centerPixel = [centerPixel[0]-offset, centerPixel[1]];
		center = map.getCoordinateFromPixel(centerPixel);
	}
	//右边被挡住时
	if(width>(mapRightButtonPoint[0]-positionPixel[0])){
		var offset = width - Math.abs(mapRightButtonPoint[0]-positionPixel[0]); 
		centerPixel = [centerPixel[0]+offset, centerPixel[1]];
		center = map.getCoordinateFromPixel(centerPixel);
	}
	map.setCenter(center);
};

/**
 * 弹出中心标注点信息框
 * @param {fjzx.map.InfoWindow} infoWindow
 */
fjzx.map.Marker.prototype.openInfoWindowWithPoint = function(infoWindow,point,offset){
	var map = this.getMap();
	this.infoWindow = infoWindow;
	this.infoWindow.setPosition(point);

	var centerPixel = map.getPixelFromCoordinate(point);
	centerPixel = [centerPixel[0]+offset[0],centerPixel[1]+offset[1]];
	center = map.getCoordinateFromPixel(centerPixel);
	map.addOverlay(this.infoWindow);

	map.setCenter(center,false);
};

/**
 * 关闭标注点信息显示框
 */
fjzx.map.Marker.prototype.closeInfoWindow = function(){
	var map = this.getMap();
	
	//this.infoWindow.setPosition(undefined);
	map.removeOverlay(this.infoWindow);
};

/**
 * 文字标注
 */
fjzx.map.Label = function(opt_options){
	var options = opt_options || {};
	
	var labelId = options.labelId ? options.labelId : fjzx.map.utils.getUUID();
	var content = options.content ? options.content : "文字标注";
	
	this.element = document.createElement("div");
	this.element.className = "RSMap-marker-label";
	this.element.setAttribute("markerId", labelId);
	this.element.innerHTML=content;
	
	this.opt = {
		element: this.element,
		position: options.position,
		offset: options.offset ? options.offset : [0,0],
		stopEvent: false
	};
	ol.Overlay.call(this, this.opt);
}

ol.inherits(fjzx.map.Label, ol.Overlay);

//设置标注文字
fjzx.map.Label.prototype.setContent = function(content){
	this.element.innerText = content;
}

//设置文字标注相对于标注点的偏移量
fjzx.map.Label.prototype.setOffset = function(offset){
	this.opt.offset = offset;
}

//设置文字标注点样式
fjzx.map.Label.prototype.setStyle = function(opt_options){
	var options = opt_options || {};
	var style = "";
	$.each(options,function(key,value){
		style += key + ": " + value + ";";
	});
	this.element.setAttribute("style",style);
};

/**
 * 地图信息框
 * @param opt_options
 * @returns {fjzx.map.InfoWindow}
 */
fjzx.map.InfoWindow = function(opt_options){
	var options = opt_options || {};
	
	this.container = document.getElementById('infoWindow');
	this.content = document.getElementById('infoWindow-content');
	this.closer = document.getElementById('infoWindow-closer');

	if(this.container==null){
		this.container = document.createElement("div");
		this.container.id="infoWindow";
		this.container.className = "RSMap-infoWindow";
		
		this.content = document.createElement("div");
		this.content.innerHTML = options.infoWindow;
		this.content.id="infoWindow-content";
		
		this.closer = document.createElement("a");
		this.closer.setAttribute("href", "javascript:void(0)");
		this.closer.id="infoWindow-closer";
		this.closer.className="RSMap-infoWindow-closer";
		
		this.container.appendChild(this.closer);
		this.container.appendChild(this.content);
	}else{
		this.content.innerHTML = options.infoWindow;
	}
	
	var this_ = this;
	$(this.container).find("a#infoWindow-closer").click(function(){
		this_.setPosition(undefined);
		$(this_.closer).blur();
		return false;
	});
	
	ol.Overlay.call(this,{
		element: this.container,
		autoPan: true,
		autoPanAnimation: {
			duration: 250
		}
	});
};

ol.inherits(fjzx.map.InfoWindow, ol.Overlay);

/**
 * 设置地图信息弹出框内容
 * @param {String} content 可以为纯文字字符串，也可以是带HTML元素的字符串 
 */
fjzx.map.InfoWindow.prototype.setContent = function(content){
	$(this.content).html(content);
};


fjzx.map.Draw = function(opt_options){
	var options = opt_options || {};
	this.map = options.map;
	this.isModify = options.interactionModify ? options.interactionModify : true;
	this._startCallback = options.startCallback ? options.startCallback : '';
	this._endCallback = options.endCallback ? options.endCallback : '';
	this.currentDrawType = '';
	
	//设置绘制所需的图层
	this.features = null;
    this.featureOverlay = null;
    this.initFeatureLayer();
	
	this.opt = {
		//clickTolerance: options.clickTolerance ? options.clickTolerance : undefined,	//鼠标单击时误差,默认为6px
		features: this.features,
		//source: options.source ? options.source : undefined,
		snapTolerance: options.snapTolerance ? options.snapTolerance : undefined,
		type: options.type ? options.type : 'Point',		//Point、LineString、Polygon、Circle/** @type {ol.geom.GeometryType} */ 
		maxPoints: options.maxPoints ? options.maxPoints : undefined,
		minPoints: options.minPoints ? options.minPoints : undefined,
		finishCondition: options.finishCondition ? options.finishCondition : undefined,	//用于绘制结束时的判断，返回false不结束绘制，返回true结束绘制
		//style: options.style ? options.style : '',
		geometryFunction: options.geometryFunction ? options.geometryFunction : undefined,	//当几何上的点有更新（修改）时调用的函数
		geometryName: options.geometryName ? options.geometryName : undefined,
		condition: options.condition ? options.condition : undefined,
		freehand: options.freehand ? options.freehand : undefined,
		freehandCondition: options.freehandCondition ? options.freehandCondition : undefined,
		wrapX: options.wrapX ? options.wrapX : undefined
	};
	//全局变量,使得后面能够移除
    this.draw;

	//鼠标经过所绘制的线条或点时会在其上出现相应的原点,此时按照鼠标左键便可更改所绘制的图像
    this.modify;
}

/**
 * 设置所绘制图像是否可更改
 */
fjzx.map.Draw.prototype.setInteractonModify = function(){
	var map = this.map;
	this.modify = new ol.interaction.Modify({
      features: this.features,
      //按住SHIF键+鼠标左键:取消更改绘制的图像
      deleteCondition: function(event) {
        return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
      }
    });
	
    this.map.addInteraction(this.modify);
}

/**
 * 开始绘图
 */
fjzx.map.Draw.prototype.startDraw = function(type){
	var type = type ? type : 'Point';
	type = fjzx.map.utils.formatDrawType(type); //转换为标准画图类型（首字母大写）
	
	//当再次点击相同的绘图类型时相当于取消绘图操作
	if(this.currentDrawType === type){
		this.stopDraw();
		this.currentDrawType = '';
		return;
	}
	this.clearDraw();
	this.currentDrawType = type;
	
	if(this.isModify)
		this.setInteractonModify();
	
	this.opt.type = type;
	this.draw = new ol.interaction.Draw(this.opt);
	
	this.map.addLayer(this.featureOverlay);
    this.map.addInteraction(this.draw);

    this.onStartDraw(this._startCallback);
    this.onEndDraw(this._endCallback);
}

/**
 * 停止绘图
 */
fjzx.map.Draw.prototype.stopDraw = function(callback){
    this.map.removeInteraction(this.draw);

    var this_ = this;
    this.draw.on('drawend',function(evt){
    	if(typeof(callback)=='function'){
    		callback(evt);
    	}else if(typeof(this_._endCallback)=='function'){
    		this_._endCallback(evt);
    	}
    });
}

/**
 * 绑定开始绘制事件
 */
fjzx.map.Draw.prototype.onStartDraw = function(callback){
	this.draw.un('drawstart');
	var this_ = this;
	this.draw.on('drawstart',function(evt){
    	if(typeof(this_._startCallback)=='function'){
    		this_._startCallback(evt);
    	}
    });
}

/**
 * 绑定结束绘制事件
 */
fjzx.map.Draw.prototype.onEndDraw = function(callback){
	var type = this.currentDrawType;	//POINT、LINESTRING、POLYGON、CIRCLE
	this._endCallback = callback;
	
	this.draw.un('drawend');
	var this_ = this;
	this.draw.on('drawend',function(evt){
    	var feature = evt.feature;
    	var geometry = feature.getGeometry();
    	var geometryName = feature.getGeometryName();
    	
    	var obj = {
			"type": "Feature",
			"geometry": geometry
    	};
    	var feature = new fjzx.map.Feature({
    		geometry: geometry
    	});
    	if(typeof(this_._endCallback)=='function'){
    		this_._endCallback(feature);
    	}
    });
}

/**
 * 清空绘图
 */
fjzx.map.Draw.prototype.clearDraw = function(callback){
    this.map.removeLayer(this.featureOverlay);
    this.map.removeInteraction(this.modify);
    this.map.removeInteraction(this.draw);
    this.initFeatureLayer();
    
    if(typeof(callback)=='function'){
    	callback(this);
    }
}

/**
 * 取消当前绘制（重新绘制）
 */
fjzx.map.Draw.prototype.cancelDraw = function(){
    this.map.removeLayer(this.featureOverlay);
    this.map.removeInteraction(this.modify);
	if(this.isModify)
		this.setInteractonModify();
	
    this.initFeatureLayer();
}

/**
 * 初始化绘制用图层
 */
fjzx.map.Draw.prototype.initFeatureLayer = function(){
	this.features = new ol.Collection();
    this.featureOverlay = new ol.layer.Vector({
      source: new ol.source.Vector({features: this.features}),
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: '#ffcc33',
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: '#ffcc33'
          })
        })
      })
    });
}

fjzx.map.Feature = function(opt_options){
	var options = opt_options || {};
	
	this.opt = {
		"type": "Feature",
		"id": options.id ? options.id : '',
		"name": options.name ? options.name : '',
		"geometry": options.geometry ? options.geometry : {},
		"labelPoint": options.labelPoint ? options.labelPoint : new fjzx.map.Point(),
		"properties": options.properties ? options.properties : {}
	};

	console.log(this.opt);
	ol.Feature.call(this,this.opt);
}

ol.inherits(fjzx.map.Feature, ol.Feature);


/**
 * 根据GeoJSON格式数据在地图上绘制图形（地图网格化）
 * @param opt_options
 * @returns {fjzx.map.DrawGeoJSON}
 */
fjzx.map.DrawGeoJSON = function(opt_options) {
	var options = opt_options || {};
	
	this.translateInteraction = null;
	this.selectInteraction = null;
	this.modifyInteraction = null;
	
	this.map = options.map;
	this.geoJSON = options.geoJSON ? options.geoJSON : {};
	this.selectType = options.selectType ? options.selectType : 'click';
	this.selectCallback = options.selectCallback;
	
	//图块交互
	this.setSelectType(this.selectType);
};

fjzx.map.DrawGeoJSON.prototype.setGeoJSON = function(geoJSON){
	this.geoJSON = geoJSON;
};

fjzx.map.DrawGeoJSON.prototype.getGeoJSON = function(){
	return this.geoJSON;
};

fjzx.map.DrawGeoJSON.prototype.clearGeoJSON = function(){
	var map = this.map;
	var selectLayer = this.selectLayer;
	var selectInteraction = this.selectInteraction;
	
	map.removeInteraction(selectInteraction);
	map.removeLayer(selectLayer);
};

/**
 * 设置图块选中时的回调函数
 * @param {function} callback
 */
fjzx.map.DrawGeoJSON.prototype.setSelectAction = function(callback){
	var map = this.map;
	var selectLayer = this.selectLayer;
	var selectInteraction = this.selectInteraction;
	
	if(selectInteraction)
		selectInteraction.un('select');
	selectInteraction.on('select',function(e){
		if(typeof(callback)=='function'){
			callback(e);
		}
	});
		
};

/**
 * 设置图块鼠标单击监听事件
 * @param {function} callback
 */
fjzx.map.DrawGeoJSON.prototype.addFeatureClick = function(callback){
	var map = this.map;
	var selectLayer = this.selectLayer;
	var selectInteraction = this.selectInteraction;
	
	selectInteraction.un('click');
	selectInteraction.on('click',function(e){
		if(typeof(callback)=='function'){
			callback(e);
		}
	});
};

/**
 * 设置地图图块选择方式(鼠标单击选中、鼠标经过选中等)
 * @param {String} selectType
 */
fjzx.map.DrawGeoJSON.prototype.setSelectType = function(selectType){
	var map = this.map;
	
	map.removeInteraction(this.selectInteraction);
	switch (selectType.toUpperCase()) {
	case 'CLICK':	// 普通单击（双击时选中图块且放大地图）
		this.selectInteraction = new ol.interaction.Select({
			condition: ol.events.condition.click
		   });
		break;
	case 'SINGLECLICK':	// 单击选中（双击时只放大地图而不选中图块）
		this.selectInteraction = new ol.interaction.Select();
		break;	
	case 'HOVER':	//鼠标经过选中
		this.selectInteraction = new ol.interaction.Select({
			condition: ol.events.condition.pointerMove
		});
		break;
	case 'ALTCLICK':	//Alt+鼠标单击选中
		this.selectInteraction = new ol.interaction.Select({
			condition: function(mapBrowserEvent) {
				return ol.events.condition.click(mapBrowserEvent) &&
				ol.events.condition.altKeyOnly(mapBrowserEvent);
			}
		});
		break;
	default:
		this.selectInteraction = new ol.interaction.Select({
			condition: ol.events.condition.click
		});
		break;
	}
	
	this.selectType = selectType;
	map.addInteraction(this.selectInteraction);
}

/**
 * 根据传入的GeoJSON参数重新加载图层
 * @param geoJSON
 */
fjzx.map.DrawGeoJSON.prototype.load = function(list){
	var map = this.map;
	var selectLayer = this.selectLayer;

	map.removeLayer(selectLayer);

	var geoJSON = {
		type: 'FeatureCollection',
		features:[]
	};
	list.forEach(function(value, index, array){
		var name = value.name;
		var id = value.id;
		var feature = JSON.parse(value.feature);
		
		feature.id = id;
		feature.name = name;
		
		geoJSON.features[index] = feature;
	});
	
	this.geoJSON = geoJSON;
	this.selectLayer = new ol.layer.Vector({
		source: new ol.source.Vector({
			features: (new ol.format.GeoJSON()).readFeatures(geoJSON),
			overlaps: true
		}),
		zIndex: 100
	});
	
	this.map.addLayer(this.selectLayer);
};

/**
 * 重新加载图层
 */
fjzx.map.DrawGeoJSON.prototype.reload = function(){
	var map = this.map;
	var selectLayer = this.selectLayer;
	var geoJSON = this.geoJSON;

	map.removeLayer(selectLayer);
	this.selectLayer = new ol.layer.Vector({
		source: new ol.source.Vector({
			features: (new ol.format.GeoJSON()).readFeatures(geoJSON)
			//format: new ol.format.GeoJSON(),
			//wrapX: false
		}),
		zIndex: 100
	});
	this.map.addLayer(this.selectLayer);
}

/**
 * 打开修改地图网格功能
 */
fjzx.map.DrawGeoJSON.prototype.openModifyFeature = function(opt_options){
	var options = opt_options || {};
	
	var map = this.map;
	var modifyStartCallback = options.modifyStartCallback;
	var modifyEndCallback = options.modifyEndCallback;
	
	this.setSelectType('click');//必须在重新实例化ol.interaction.Modify前调用
	this.modifyInteraction = new ol.interaction.Modify({
		features: this.selectInteraction.getFeatures(),
		condition: undefined,
		deleteCondition: undefined,
		deleteCondition: undefined,
		insertVertexCondition: undefined,
		pixelTolerance: undefined,
		style: undefined,
		wrapX: false
    });
	
	this.modifyInteraction.on('modifystart',function(evt){
		if(typeof(modifyStartCallback)=='function')
			modifyStartCallback(evt);
	});
	this.modifyInteraction.on('modifyend',function(evt){
		if(typeof(modifyEndCallback)=='function'){
			modifyEndCallback(evt);
		}
	});
	
	map.removeInteraction(this.modifyInteraction);
	map.addInteraction(this.modifyInteraction);
}

/**
 * 关闭修改地图网格功能
 */
fjzx.map.DrawGeoJSON.prototype.closeModifyFeature = function(){
	var map = this.map;
	var modifyInteraction = this.modifyInteraction
	
	map.removeInteraction(modifyInteraction);
	return modifyInteraction;
}

/**
 * 打开图块移动功能
 */
fjzx.map.DrawGeoJSON.prototype.openTranslateFeature = function(opt_options){
	var options = opt_options ||{};
	
	var map = this.map;
	var translateStartCallback = options.translateStartCallback;
	var translateEndCallback = options.translateEndCallback;
	var translatingCallback = options.translatingCallback;
	
	//重新实例化一个对象
	this.translateInteraction = new ol.interaction.Translate({
        features: this.selectInteraction.getFeatures()
    });
	
	//添加监听事件
	//开始
	this.translateInteraction.on('translatestart',function(evt){
		if(typeof(translateStartCallback)=='function'){
			translateStartCallback(evt);
		}
	});
	//结束
	this.translateInteraction.on('translateend',function(evt){
		if(typeof(translateEndCallback)=='function'){
			translateEndCallback(evt);
		}
	});
	//进行中
	this.translateInteraction.on('translating',function(evt){
		if(typeof(translatingCallback)=='function'){
			translatingCallback(evt);
		}
	});

	map.removeInteraction(this.translateInteraction);
	map.addInteraction(this.translateInteraction);
}

/**
 * 关闭图块移动功能
 */
fjzx.map.DrawGeoJSON.prototype.closeTranslateFeature = function(){
	var map = this.map;
	var translateInteraction = this.translateInteraction
	
	map.removeInteraction(translateInteraction);
	return translateInteraction;
}


/**
 * 投影
 * @param opt_options
 * @param callback
 * @returns {fjzx.map.Map}
 */
fjzx.map.Projection = function(opt_options){
	var options = opt_options || {};
	
	this.opt = {
		code: options.code ? options.code : 'EPSG:4326',
		units: options.units ? options.units : undefined,
		extent: options.extent ? options.extent : undefined,
		axisOrientation: options.axisOrientation ? options.axisOrientation : undefined,
		global: options.global ? options.global : undefined,
		metersPerUnit:	options.metersPerUnit ? options.metersPerUnit : undefined,
		worldExtent: options.worldExtent ? options.worldExtent : undefined,
		getPointResolution: options.getPointResolution ? options.getPointResolution : undefined
	};
	
	ol.proj.Projection.call(this,this.opt);
};

ol.inherits(fjzx.map.Projection, ol.proj.Projection);

fjzx.map.Projection.prototype.lngLatToPoint = function(coordinate){
	var coor = ol.proj.fromLonLat(coordinate);
	
	return {x: coor[0], y: coor[1]};
}

fjzx.map.Projection.prototype.pointToLngLat = function(coordinate){
	var lonLat = ol.proj.toLonLat(coordinate);
	
	return lonLat;
}

/**
 * 地图坐标点构造函数
 */
fjzx.map.Point = function(longitude,latitude){
	this.lng = parseFloat(longitude);
	this.lat = parseFloat(latitude);
	//将经纬度数组转换为ol.Coordinate对象
	var coordinate = ol.coordinate.add([this.lng,this.lat], [0,0]);
	//将坐标系转换为EPSG:3857
	var position = ol.proj.fromLonLat(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'));
	
	return position;
}

/**
 * 像素坐标
 */
fjzx.map.Pixel = function(x,y){
	
	return {x: x, y: y};
}

/**
 * 经纬度构造函数（用于根据经纬度从天地图获取地址信息）
 * @param longitude
 * @param latitude
 * @returns {fjzx.map.LngLat}
 */
fjzx.map.LngLat = function(longitude,latitude){
	this.lng = longitude;
	this.lat = latitude;
	//将经纬度数组转换为ol.Coordinate对象
	var coordinate = ol.coordinate.add([longitude,latitude], [0,0]);
	//将坐标系转换为EPSG:3857
	this.position = ol.proj.fromLonLat(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'));
}

fjzx.map.LngLat.prototype = {
	getLng: function(){
		return this.lng;
	},
	getLat: function(){
		return this.lat;
	},
	getMercatorLng: function(){	//获取WEB墨卡托坐标点的经度
		
	},
	getMercatorLat: function(){	//获取WEB墨卡托坐标点的纬度
		
	},
	equals: function(point){	//判断当前地理坐标点与给定坐标点是否为同一点
		var result = false;
		
		return result;
	},
	distanceFrom: function(point,radius){	//计算当前地理坐标点与给定坐标点之间的距离,point:经纬度坐标,radius:也可以传递可选的 radius参数计算不同于地球半径的球体的TLngLat坐标之间的距离
		
	}
};

/**
 * Icon构造函数
 * @param {String} src	图片资源地址
 * @param {Object} opt_options	参数设置
 * 
 */
fjzx.map.Icon = function(src,opt_options){
	var options = opt_options || {};
	
	this.opt = {
		anchor: options.anchor,
		anchorOrigin: options.anchorOrigin,//bottom-left, bottom-right, top-left or top-right. Default is top-left
		anchorXUnits: options.anchorXUnits,
		anchorYUnits: options.anchorYUnits,
		color: options.color,
		crossOrigin: options.crossOrigin,
		offset: options.offset ? options.offset : [0, 0],
		offsetOrigin: options.offsetOrigin ? options.offsetOrigin : "top-left",	//bottom-left, bottom-right, top-left or top-right
		opacity: options.opacity ? options.opacity : 1,
		scale: options.scale ? options.scale : 1,
		snapToPixel: true,
		rotateWithView: false,
		rotation: options.rotation ? options.rotation : 0,
		size: options.size,	//ol.Size
		src: src,
		img: options.img,
		imgSize: options.imgSize //ol.Size
	};
	
	ol.style.Icon.call(this,this.opt);
}

ol.inherits(fjzx.map.Icon, ol.style.Icon);

/**
 * 设置图片偏移量
 * @param {Array} offset,如[0,0]、[10,20]等
 * 
 */
fjzx.map.Icon.prototype.setImageOffset = function(offset){
	this.opt.offset = offset;
}

/**
 * 设置图片偏移量
 * @param {Array} offset,如[0,0]、[10,20]等
 * 
 */
fjzx.map.Icon.prototype.setSize = function(size){
	this.opt.size = size;
}

/**
 * 地图尺寸构造函数
 * @param {number} width 
 * @param {number} height 
 */
fjzx.map.Size = function(width,height){
	return [width,height];
}

fjzx.map.Polyline = function(points){
	var polylineObj = new ol.format.Polyline({ factor: 1e6});
	var routeGeometry = polylineObj.readGeometry(points,{
		  dataProjection: 'EPSG:4326',
		  featureProjection: 'EPSG:3857'
	});
	
	return routeGeometry;
}

/**
 * 地图覆盖物
 * 
 */
fjzx.map.Overlay = function(opt_options){
	var options = opt_options || {};
	
	ol.Overlay.call(options);
}

ol.inherits(fjzx.map.Overlay, ol.Overlay);

/**
 * 逆地理编码构造函数
 * @constructor
 * @desc 继承于天地图的Geocoder对象，用于根据天地图获取地址信息
 * 
 */
fjzx.map.Geocoder = function(){
	TGeocoder.call(this);
}

ol.inherits(fjzx.map.Geocoder, TGeocoder);

/**
 * 地图框选功能
 * @param opt_options
 * @returns {fjzx.map.Selection}
 */
fjzx.map.Selection = function(opt_options){
	var options = opt_options || {};
	this.map = options.map;
    //当前是否开启拉框搜索状态；默认为false，表示没有开启
    this._isOpen = false;
	/*
	//要搜索的类型 用 逗号隔开 比如 USER , SIGN 等 
    //this._selectWords = selectWords ;
    //各种状态的默认参数
    this._opts = {
        map: map,      //搜索结果显示设置          
        followText : "",	// 开启拉框搜索状态后，鼠标跟随的文字
        strokeWeight : 2,	// 遮盖层外框的线宽
        strokeColor : "#111",	// 遮盖层外框的颜色
        style : "solid",	// 遮盖层外框的样式
        fillColor : "#ccc",	// 遮盖层的填充色
        opacity : 0.4,	// 遮盖层的透明度
        cursor : "crosshair",	// 鼠标样式
        autoClose : true,	// 是否在每次操作后，自动关闭拉框搜索状态, 私有属性
        autoViewport : false,	//是否自动调整视野
        alwaysShowOverlay: true,	//是否一直显示拉框后的覆盖物
        panel:"",	 //显示面板
        selectFirstResult: "false",	//是否显示第一个搜索结果
        _zoomType : 12	// 拉框后放大
    };
    // 通过使用者输入的opts，修改这些默认参数
    this._setOptions(opts);
    // 验证参数正确性
    this._opts.strokeWeight = this._opts.strokeWeight <= 0 ? 1 : this._opts.strokeWeight;
    this._opts.opacity = this._opts.opacity < 0 ? 0 : (this._opts.opacity > 1 ? 1 : this._opts.opacity);
    //拉框时显示的矩形遮盖层
    this._fDiv = null;
    //鼠标跟随的文字提示框
    this._followTitle = null;
    //当前overlay对象
    this._overlay = null;
	*/
	this.opt = {
		fillColor: options.fillColor ? options.fillColor : 'rgba(255, 255, 255, 0.2)',
		strokeColor: options.strokeColor ? options.strokeColor : '#ffcc33',
		strokeWidth: options.strokeWidth ? options.strokeWidth : 2,
		beforeCallback: options.beforeCallback,
		afterCallback: options.afterCallback
	};

	var this_ = this;
	this.vectorSource = new ol.source.Vector();
	this.vector = new ol.layer.Vector({
		source : this.vectorSource,
		style : new ol.style.Style({
			fill : new ol.style.Fill({
				color : this_.opt.fillColor
			}),
			stroke : new ol.style.Stroke({
				color : this_.opt.strokeColor,
				width : this_.opt.strokeWidth
			}),
			image : new ol.style.Circle({
				radius : 7,
				fill : new ol.style.Fill({
					color : '#ffcc33'
				})
			})
		})
	});
};

fjzx.map.Selection.prototype.open = function(){
	if(this._isOpen)
		return true;

	var beforeCallback = this.opt.beforeCallback;
	var afterCallback = this.opt.afterCallback;
	this._isOpen = true;
	this.map.addLayer(this.vector);
	
	//创建拉选框实例
	this.dragBox = new ol.interaction.DragBox({
		condition: ol.events.condition.platformModifierkeyOnly
	});
	this.map.addInteraction(this.dragBox);
	
	//监听开始拉选框事件
	this.dragBox.on('boxstart', function(){
		var extent = this.getGeometry().getExtent();
		var obj = {
			startPoint: fjzx.map.Point(extent[0], extent[1]),
			endPoint: fjzx.map.Point(extent[2], extent[3]),
		};
		if(typeof(beforeCallback)==="function") beforeCallback(obj);
	});
	
	//监听结束拉选框事件
	var this_ = this;
	this.dragBox.on('boxend', function(){
		var extent = this.getGeometry().getExtent();
		var obj = {
			startPoint: fjzx.map.Point(extent[0], extent[1]),
			endPoint: fjzx.map.Point(extent[2], extent[3]),
		};
		//拉选框事件结束后立刻把对应的图层和拉选框实例移除，避免能够重复框选
		this_.map.removeLayer(this_.vector);
		this_.map.removeInteraction(this_.dragBox);
		this_._isOpen = false;
		if(typeof(afterCallback)==="function") afterCallback(obj);
	});
};

fjzx.map.Selection.prototype.close = function(){
	this.map.removeLayer(this.vector);
	this.map.removeInteraction(this.dragBox);
	this._isOpen = false;
};

/**
 * 工具类
 */
fjzx.map.utils = {
	getUUID: function() {
		var s = [];
		var hexDigits = "0123456789ABCDEF";
		for (var i = 0; i < 32; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[12] = "4";
		s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);
		var uuid = s.join("");
		return uuid;
	},
	formatDrawType: function(type){
		var result = type.toLowerCase();
		var reg = /\b(\w)|\s(\w)/g; //  \b判断边界\s判断空格
		return result.replace(reg,function(m){ 
			return m.toUpperCase()
		});
	},
	transformFromMapEvent: function(mapEvent){
		var options = mapEvent || {};
		
		var result = {
			point: {lon: options.coordinate[0], lat: options.coordinate[1]},
			dragging: options.dragging,
			frameState: options.frameState,
			map: options.map,
			originalEvent: options.originalEvent,
			pixel: options.pixel,
			target: options.target,
			type: options.type
		};
		result.prototype = options.prototype;
		
		return result;
	},
	inherits: function(subObj,superObj){
		function beget(obj){
			var f = function(){};
			f.prototype = obj;
			return new f();
		}
		var proto = beget(superObj.prototype);
		proto.constructor = subObj;
		subObj.prototype = proto;
	}
};

/**
 * 动态加载JS
 * @function
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

/**
 * 构造HashMap类型数据
 * @returns {fjzx.map.HashMap}
 */
fjzx.map.HashMap= function() {
	this.map = {};
}

fjzx.map.HashMap.prototype = {
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
