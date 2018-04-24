
MACRO_PACKAGE_DEFINE("fjzx.map.route");

var animating = false;
var speed;
var now;
var currentThis = null;
var currentLayer = null;

fjzx.map.route.Route = function(map,points,opt_options){
	var options = opt_options || {};

	this._map = map;
	speed = options.speed;

	currentThis = this;
	this._routeLayer = null;
	this._markerStart = null;
	this._markerEnd = null;
	var polylineGeometry = new ol.geom.LineString(points);
	this._routeCoords = polylineGeometry.getCoordinates();
	this._routeLength = this._routeCoords.length;

	if(this._marker){
		map.removeOverlay(this._marker);
	}
	this._marker = new fjzx.map.Marker(this._routeCoords[0], {
		icon: options.icon 
     });
	map.addOverlay(this._marker);
	
	var routeFeature = new ol.Feature({
	  type: 'route',
	  geometry: polylineGeometry
	});
	this._routeLayer = new ol.layer.Vector({
	  source: new ol.source.Vector({
	    features: [routeFeature]
	  }),
	  style: new ol.style.Style({
		  stroke: new ol.style.Stroke({
			  width: 6, color: [237, 212, 0, 0.8]
		  })
	  })
	});
	this._map.addLayer(this._routeLayer);
}

fjzx.map.route.Route.prototype.setMarkerStart = function(point,icon){
	var map = this._map;
	if(this._markerStart){
		map.removeOverlay(this._markerStart); 
	}
	this._markerStart = new fjzx.map.Marker(point, {
		icon: icon 
     });
	
	map.addOverlay(this._markerStart); 
}

fjzx.map.route.Route.prototype.setMarkerEnd = function(point,icon){
	var map = this._map;
	if(this._markerEnd){
		map.removeOverlay(this._markerEnd); 
	}
	this._markerEnd = new fjzx.map.Marker(point, {
		icon: icon 
     });
	
	map.addOverlay(this._markerEnd); // 将标注添加到地图中
}

fjzx.map.route.Route.prototype.setMarkerPolyline = function(polyline){
	var map = this._map;
	var lineStringGeometry = new ol.geom.LineString(polyline);
	var routeFeature = new ol.Feature({
	  type: 'route',
	  geometry: lineStringGeometry
	});
	this._routeLayer = new ol.layer.Vector({
	  source: new ol.source.Vector({
	    features: [routeFeature]
	  }),
	  style: new ol.style.Style({
		  stroke: new ol.style.Stroke({
			  width: 6, color: [237, 212, 0, 0.8]
		  })
	  })
	});
	
	if(this._routeLayer){
		this._map.removeLayer(this._routeLayer);
	}
	
	this._map.addLayer(this._routeLayer);
}

fjzx.map.route.Route.prototype.stopAnimation = function(ended){
	var map = this._map;
	animating = false;

    // if animation cancelled set the marker at the beginning
    var coord = ended ? this._routeCoords[this._routeLength - 1] : this._routeCoords[0];
    this._marker.setPosition(coord);
    //remove listener
    var this_ = this;
    map.un('postcompose', fjzx.map.route.Route.prototype.moveFeature);
}

fjzx.map.route.Route.prototype.freeResource = function() {
    if (this._marker)
        this._map.removeOverlay(this._marker);
    if (this._routeLayer)
        this._map.removeLayer(this._routeLayer);
    if (this._markerStart)
        this._map.removeOverlay(this._markerStart);
    if (this._markerEnd)
        this._map.removeOverlay(this._markerEnd);
};

fjzx.map.route.Route.prototype.moveFeature = function(event) {
	var map = event.target;
	var vectorContext = event.vectorContext;
	var frameState = event.frameState;
	if (animating) {
		var elapsedTime = frameState.time - now;
		// here the trick to increase speed is to jump some indexes
		// on lineString coordinates
		var index = Math.round(speed * elapsedTime / 1000);

		if (index >= currentThis._routeLength) {
			currentThis.stopAnimation(true);
			return;
		}

		var currentPoint = new ol.geom.Point(currentThis._routeCoords[index]);
		console.log(frameState);
		console.log(index);
		console.log(currentThis._routeCoords[index]);
		currentThis._marker.setPosition(currentThis._routeCoords[index]);
	}
	// tell OpenLayers to continue the postcompose animation
	map.render();
};


fjzx.map.route.Route.prototype.start=function() {
	var map = this._map;
	if (animating) {
		this.stopAnimation(false);
		this.freeResource();
	} else {
		animating = true;
		now = new Date().getTime();
		var this_ = this;
		map.on('postcompose', fjzx.map.route.Route.prototype.moveFeature);
		map.render();
	}
}


/**
 * @param {boolean} ended end of animation.
 */
fjzx.map.route.Route.prototype.stop=function(ended) {
	var map = this._map;
	var routeCoords = this._routeCoords;
	var routeLength = this._routeLength;
	
	// if animation cancelled set the marker at the beginning
	var coord = ended ? routeCoords[routeLength - 1] : routeCoords[0];
	/** @type {ol.geom.Point} */ 
    this._marker.setPosition(coord);
	//remove listener
    var this_ = this;
	map.un('postcompose', fjzx.map.route.Route.prototype.moveFeature);
}
