MACRO_PACKAGE_DEFINE("fjzx.map.source");

fjzx.map.source = {
	//基础矢量图层
	getVecBaseLayer: function(){ 
		return createWMTSLayer({
			caption: "vecBaseLayer",
			url: "http://t{0-6}.tianditu.com/vec_c/wmts",
			layerName: "vec",
			format: "tiles"	
		});
	},
	getVecMarkerLayer: function(){  
		return createWMTSLayer({
			caption: "vecMarkerLayer",
			url: "http://t{0-6}.tianditu.com/cva_c/wmts",
			layerName: "cva",
			format: "tiles" 
		});
	},
	//基础影响图层
	getImgBaseLayer: function(){  
		return createWMTSLayer({
			caption: "imgBaseLayer",
			url: "http://t{0-6}.tianditu.com/img_c/wmts",
			layerName: "img",
			format: "tiles"	
		});
	},
	getImgMarkerLayer: function(){  
		return createWMTSLayer({
			caption: "imgMarkerLayer",
			url: "http://t{0-6}.tianditu.com/cia_c/wmts",
			layerName: "cia",
			format: "tiles" 
		});
	},
	
	//龙岩矢量图层
	getLyVecBaseLayer: function(){  
		return createWMTSLayer({
			caption: "lyVecBaseLayer",
			url: "http://service.lymap.gov.cn/WMTS/kvp/services/LYVEC/MapServer/WMTSServer",
			layerName: "LYVEC",
			format: "image/png"	
		});
	},
	getLyVecMarkerLayer: function(){  
		return createWMTSLayer({
			caption: "lyVecMarkerLayer",
			url: "http://service.lymap.gov.cn/WMTS/kvp/services/LYCVA/MapServer/WMTSServer",
			layerName: "SMCVA2015",
			format: "image/png"	
		});
	},
	//龙岩影像图层
	getLyImgBaseLayer: function(){  
		return createWMTSLayer({
			caption: "lyImgBaseLayer",
			url: "http://service.lymap.gov.cn/WMTS/kvp/services/LYIMG/MapServer/WMTSServer",
			layerName: "LYIMG",
			format: "image/jpg"
		});
	},
	getLyImgMarkerLayer: function(){  
		return createWMTSLayer({
			caption: "lyImgMarkerLayer",
			url: "http://service.lymap.gov.cn/WMTS/kvp/services/LYCIA/MapServer/WMTSServer",
			layerName: "SMCIA2015",
			format: "image/png"
		});
	},

	
	/**
	 *	福建矢量图层资源：http://service.fjmap.net/vec_fj/wmts
	 *	福建矢量标注资源：//service.fjmap.net/cva_fj/wmts
	 *	福建影像图层资源：//service.fjmap.net/img_fj/wmts
	 *	福建影像标注资源：//service.fjmap.net/cia_fj/wmts
	 */
	
	//福建省矢量图层
	getFjVecBaseLayer: function(){  
		return createWMTSLayer({
			caption: "fjImgMarkerLayer",
			url: "http://service.fjmap.net/vec_fj/wmts",
			layerName: "vec_fj",
			format: "image/tile",
			style: "vec_fj",
			matrixSet: 'Matrix_0'
		});
	},
	getFjVecMarkerLayer: function(){  
		return createWMTSLayer({
			caption: "fjImageBaseLayer",
			url: "http://service.fjmap.net/cva_fj/wmts",
			layerName: "cva_fj",
			format: "image/tile",
			style: "cva_fj",
			matrixSet: 'Matrix_0'
		});
	},
	//福建省影响图层
	getFjImgBaseLayer: function(){  
		return createWMTSLayer({
			caption: "fjImgBaseLayer",
			url: "http://service.fjmap.net/img_fj/wmts",
			layerName: "img_fj",
			format: "image/tile",
			style: "img_fj",
			matrixSet: 'Matrix_0'
		});
	},
	getFjImgMarkerLayer: function(){  
		return createWMTSLayer({
		caption: "fjImgMarkerLayer",
			url: "http://service.fjmap.net/cia_fj/wmts",
			layerName: "cia_fj",
			format: "image/tile",
			style: "cia_fj",
			matrixSet: 'Matrix_0'
		});
	},
	//全国矢量地图
	getGlobalVecBaseLayer: function(){  
		return createWMTSLayer({
			caption: "vecBaseLayer",
			url: "http://t{0-6}.tianditu.com/vec_c/wmts",
			layerName: "vec",
			format: "tiles"	
		});
	},
	getGlobalVecMarkerLayer: function(){  
		return createWMTSLayer({
		caption: "fjMarkerLayer",
			url: "http://t{0-6}.tianditu.com/cva_c/wmts",
			layerName: "cva",
			format: "tiles"
		});
	},
	//全国影像地图
	getGlobalImageBaseLayer: function(){  
		return createWMTSLayer({
			caption: "vecBaseLayer",
			url: "http://t{0-6}.tianditu.com/img_c/wmts",
			layerName: "img",
			format: "tiles"	
		});
	},
	getGlobalImageMarkerLayer: function(){  
		return createWMTSLayer({
		caption: "fjMarkerLayer",
			url: "http://t{0-6}.tianditu.com/cia_c/wmts",
			layerName: "cia",
			format: "tiles"
		});
	},
	
	getLyImageLayerGroup: function(){
		return new ol.layer.Group({
			layers: [this.getImgBaseLayer(), this.getLyImgBaseLayer(), this.getLyImgMarkerLayer()]
		});
	},
	getLyVecLayerGroup: function(){
		return new ol.layer.Group({
			layers: [this.getVecBaseLayer(), this.getLyVecBaseLayer(), this.getLyVecMarkerLayer()]
		});
	},
	getFjImageLayerGroup: function(){ 
		return new ol.layer.Group({
			layers: [this.getImgBaseLayer(), this.getFjImgBaseLayer(), this.getFjImgMarkerLayer()]
		});
	},
	getFjVecLayerGroup: function(){ 
		return new ol.layer.Group({
			layers: [this.getVecBaseLayer(), this.getFjVecBaseLayer(), this.getFjVecMarkerLayer()]
		});
	},
	getGlobalVecLayerGroup: function(){ 
		return new ol.layer.Group({
			layers: [this.getVecBaseLayer(), this.getGlobalVecBaseLayer(), this.getGlobalVecMarkerLayer()]
		});
	},
	getGlobalImageLayerGroup: function(){ 
		return new ol.layer.Group({
			layers: [this.getVecBaseLayer(), this.getGlobalImageBaseLayer(), this.getGlobalImageMarkerLayer()]
		});
	},
	getLayerGroupByMapType: function(mapType){
		var result = "";
		switch (mapType) {
		case "FJ_VEC_MAP":
			result = this.getFjVecLayerGroup();
			break;
		case "FJ_IMG_MAP":
			result = this.getFjImageLayerGroup();
			break;
		case "LY_VEC_MAP":
			result = this.getLyVecLayerGroup();
			break;
		case "LY_IMG_MAP":
			result = this.getLyImageLayerGroup();
			break;
		case "GLOBAL_VEC_MAP":
			result = this.getGlobalVecLayerGroup();
			break;
		case "GLOBAL_IMG_MAP":
			result = this.getGlobalImageLayerGroup();
			break;
		default:
			result = this.getGlobalVecLayerGroup();
			break;
		}
		return result;
	}
}