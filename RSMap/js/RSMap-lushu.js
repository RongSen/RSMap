var MapLib = window.MapLib = MapLib || {};
(function() {
	var b, a = b = a || {
		version : "1.5.0"
	};
	a.guid = "$BAIDU$";
	(function() {
		window[a.guid] = window[a.guid] || {};
		a.dom = a.dom || {};
		a.dom.getElementById = function(elementId) {
			if ("string" == typeof(elementId) || elementId instanceof(String)) {
				return document.getElementById(elementId)
			} else {
				if (elementId && elementId.nodeName && (elementId.nodeType == 1 || elementId.nodeType == 9)) {
					return elementId
				}
			}
			return null
		};
		a.g = a.G = a.dom.getElementById;
		a.lang = a.lang || {};
		a.lang.isString = function(e) {
			return "[object String]" == Object.prototype.toString.call(e)
		};
		a.isString = a.lang.isString;
		a.dom._getElementById = function(elementId) {
			if (a.lang.isString(elementId)) {
				return document.getElementById(elementId)
			}
			return elementId
		};
		a._g = a.dom._getElementById;
		//根据elementId获取Document对象
		a.dom.getDocument = function(elementId) {
			var element = a.dom.getElementById(elementId);
			return element.nodeType == 9 ? element : (element.ownerDocument || element.document);
		};
		a.browser = a.browser || {};
		a.browser.ie = a.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || +RegExp["\x241"]) : undefined;
		//根据elementId和CSS样式名称获取相应CSS样式值
		a.dom.getComputedStyle = function(elementId, styleName) {
			var element = a.dom._getElementById(elementId);
			var document = a.dom.getDocument(elementId);
			var styleList;
			//判断是否在浏览器中有关联document的window对象，且存在CSS样式
			if (document.defaultView && document.defaultView.getComputedStyle) {
				styleList = document.defaultView.getComputedStyle(element, null);
				if (styleList) {
					return styleList[styleName] || styleList.getPropertyValue(styleName)
				}
			}
			return ""
		};
		a.dom._styleFixer = a.dom._styleFixer || {};
		a.dom._styleFilter = a.dom._styleFilter || [];
		a.dom._styleFilter.filter = function(f, j, k) {
			for ( var e = 0, h = a.dom._styleFilter, g; g = h[e]; e++) {
				if (g = g[k]) {
					j = g(f, j)
				}
			}
			return j;
		};
		a.string = a.string || {};
		//转换为驼峰式命名
		a.string.toCamelCase = function(string) {
			if (string.indexOf("-") < 0 && string.indexOf("_") < 0) {
				return string
			}
			return string.replace(/[-_][^-_]/g, function(f) {
				return f.charAt(1).toUpperCase()
			})
		};
		//根据给定Dom元素和属性获取属性值
		a.dom.getStyle = function(element, attr) {
			var dom = a.dom;
			element = dom.element(element);
			attr = a.string.toCamelCase(attr);
			var attrValue = element.style[attr] || (element.celementrrentStyle ? element.currentStyle[attr] : "") || dom.getComputedStyle(element, attr);
			//如果对应属性没有值，则给其赋值
			if (!attrValue) {
				var e = dom._styleFixer[attr];
				if (e) {
					attrValue = e.get ? e.get(element) : a.dom.getStyle(element, e)
				}
			}
			if (e = dom._styleFilter) {
				attrValue = e.filter(attr, attrValue, "get")
			}
			//返回属性值
			return attrValue;
		};
		a.getStyle = a.dom.getStyle;
		a.dom._NAME_ATTRS = (function() {
			var e = {
				cellpadding : "cellPadding",
				cellspacing : "cellSpacing",
				colspan : "colSpan",
				rowspan : "rowSpan",
				valign : "vAlign",
				usemap : "useMap",
				frameborder : "frameBorder"
			};
			if (a.browser.ie < 8) {
				e["for"] = "htmlFor";
				e["class"] = "className"
			} else {
				e.htmlFor = "for";
				e.className = "class"
			}
			return e
		})();
		//根据elementId和属性设置对应元素的属性值
		a.dom.setAttr = function(elementId, attr, attrValue) {
			var element = a.dom.getElementById(elementId);
			if ("style" == attr) {
				element.style.cssText = attrValue;
			} else {
				attr = a.dom._NAME_ATTRS[attr] || attr;
				element.setAttribute(attr, attrValue);
			}
			return element;
		};
		a.setAttr = a.dom.setAttr;
		//根据elementId和属性数组设置对应元素的属性值
		a.dom.setAttrs = function(elementId, attrObj) {
			var element = a.dom.getElementById(elementId);
			for ( var attr in attrObj) {
				a.dom.setAttr(element, attr, attrObj[attr]);
			}
			return element;
		};
		a.setAttrs = a.dom.setAttrs;
		a.dom.create = function(tagName, attr_attrObj) {
			var element = document.createElement(tagName);
			var attrObj = attr_attrObj || {};
			return a.dom.setAttrs(element, attrObj);
		};
		a.object = a.object || {};
		a.extend = a.object.extend = function(g, properties) {
			for ( var property in properties) {
				if (properties.hasOwnProperty(property)) {	//hasOwnProperty判断一个对象自身（不包括原型链）是否具有指定名称的属性
					g[property] = properties[property];
				}
			}
			return g;
		}
	})();
	
	//路书对象
	var lushu = MapLib.LuShu = function(map, points, options) {
		if (!points || points.length < 1) {
			return
		}
		this._map = map;
		this._path = points;	//坐标点数组
		this.i = 0;	//坐标点数组下标
		this._setTimeoutQuene = [];	//延时执行对象队列
		this._projection = this._map.getProjection();	//地图采用的坐标系
		this._opts = {
			icon : null,
			speed : 4000,
			defaultContent : ""
		};
		this._setOptions(options);
		this._rotation = 0;	//旋转角度
		//设置移动标志物图标，若不是fjzx.map.Icon类型，则夫一个默认图标
		if (!this._opts.icon instanceof fjzx.map.Icon) {
			this._opts.icon = defaultIcon
		}
	};
	lushu.prototype._setOptions = function(options) {
		if (!options) {
			return
		}
		for ( var option in options) {
			if (options.hasOwnProperty(option)) {
				this._opts[option] = options[option]
			}
		}
	};
	//路书启动
	lushu.prototype.start = function() {
		var this_ = this; 
		var pointsLength = this_._path.length;
		
		if (this_.i && this_.i < pointsLength - 1) {	//还没有到达终点，则继续运行
			//判断是否在暂停状态
			if (!this_._fromPause) {	//未暂停，直接返回
				return
			} else {	//处于暂停状态，则继续运行
				if (!this_._fromStop) {		//判断是否处于停止状态
					this_._moveNext(++this_.i)	//从暂停处启动
				}
			}
		} else {	//已到达终点，延时400毫秒到达终点
			this_._addMarker();
			this_._timeoutFlag = setTimeout(function() {
				//this_._addInfoWin();
				//若弹出框内容为空，则不显示信息框
				if (this_._opts.defaultContent == "") {
					//this_.hideInfoWindow()
				}
				this_._moveNext(this_.i)
			}, 400);
		}
		this._fromPause = false;
		this._fromStop = false
	};
	//停止轨迹回放
	lushu.prototype.stop = function() {
		this.i = 0;
		this._fromStop = true;
		//清除定时器
		clearInterval(this._intervalFlag);
		this._clearTimeout();
		for ( var index = 0, landmarkPoints = this._opts.landmarkPois, length = landmarkPoints.length; index < length; index++) {
			landmarkPoints[index].bShow = false
		}
	};
	//暂停轨迹回放
	lushu.prototype.pause = function() {
		clearInterval(this._intervalFlag);
		this._fromPause = true;
		this._clearTimeout()
	};
	//设置轨迹起点
	lushu.prototype.setMarkerStart = function(point,icon) {
		this._markerStart = new fjzx.map.Marker(point, {icon: icon});
		this._map.addOverlay(this._markerStart);
	};
	//设置轨迹终点
	lushu.prototype.setMarkerEnd = function(point,icon) {
		this._markEnd = new fjzx.map.Marker(point, {icon: icon});
		this._map.addOverlay(this._markEnd);
	};
	//设置轨迹路线
	lushu.prototype.setMarkerPolyline = function(points) {
		var lineStringGeometry = new ol.geom.LineString(points);
		var routeFeature = new ol.Feature({
		  type: 'route',
		  geometry: lineStringGeometry
		});
		this._markerPoly = new ol.layer.Vector({
		  source: new ol.source.Vector({
		    features: [routeFeature]
		  }),
		  style: new ol.style.Style({
			  stroke: new ol.style.Stroke({
				  width: 6, color: [237, 212, 0, 0.8]
			  })
		  })
		});
		this._map.addLayer(this._markerPoly);
	};
	
	/**
     * 清除所有轨迹
     * @return 无返回值.
     */
    lushu.prototype.freeResource = function() {
        if (this._marker)
            this._map.removeOverlay(this._marker);
        if (this._markerPoly)
            this._map.removeLayer(this._markerPoly);
        if (this._markerStart)
            this._map.removeOverlay(this._markerStart);
        if (this._markerEnd)
            this._map.removeOverlay(this._markerEnd);
    };
	//隐藏信息框
	lushu.prototype.hideInfoWindow = function() {
		//this._overlay._div.style.visibility = "hidden"
	};
	//显示信息框
	lushu.prototype.showInfoWindow = function() {
		this._overlay._div.style.visibility = "visible"
	};
	a.object.extend(lushu.prototype, {
		_addMarker : function(f) {
			if (this._marker) {
				this.stop();
				this._map.removeOverlay(this._marker);
				clearTimeout(this._timeoutFlag)
			}
			this._overlay && this._map.removeOverlay(this._overlay);
			var marker = new fjzx.map.Marker(this._path[0]);
			this._opts.icon && marker.setIcon(this._opts.icon);
			this._map.addOverlay(marker);
			marker.setAnimation(BMAP_ANIMATION_DROP);
			this._marker = marker
		},
		_addInfoWin : function() {
			var this_ = this;
			var infoWindow = new InfoWindow(this_._marker.getPosition(), this_._opts.defaultContent);
			infoWindow.setRelatedClass(this);
			this._overlay = infoWindow;
			this._map.addOverlay(infoWindow)
		},
		//获取墨卡托坐标系坐标
		_getMercator : function(e) {
			return this._map.getMapType().getProjection().lngLatToPoint(e);
		},
		/**
		 * 获取平面坐标点间的平面距离（单位为像素）
		 * point、nextPoint都是平面坐标
		 */
		_getDistance : function(point, nextPoint) {
			//Math.sqrt():求double型的正平方根,Math.pow(x,y):求x的y次幂的值 ,
			return Math.sqrt(Math.pow(point.x - nextPoint.x, 2) + Math.pow(point.y - nextPoint.y, 2));
		},
		_move : function(startLngLat, endLngLat, m) {
			var this_ = this;
			var	h = 0; 
			var	intervalTime = 10;
			var	speed = this._opts.speed / (1000 / intervalTime); 
			var	point = this._projection.lngLatToPoint(startLngLat); 	//将当前经纬度转换为平面坐标点
			var	nextPoint = this._projection.lngLatToPoint(endLngLat);	//将下一个经纬度坐标转换为平面坐标点
			var	averageSpeed = Math.round(this_._getDistance(point, nextPoint) / speed);	//计算两个平面坐标点间的平均速度
			
			if (averageSpeed < 1) {
				this_._moveNext(++this_.i);
				return
			};
			this_._intervalFlag = setInterval(function(){
				if (h >= averageSpeed) {
					clearInterval(this_._intervalFlag);
					if (this_.i > this_._path.length) {
						return
					}
					this_._moveNext(++this_.i)
				} else {
					h++;
					var pixel_X = m(point.x, nextPoint.x, h, averageSpeed);//下一个平面坐标x轴（经度）像素点
					var pixel_Y = m(point.y, nextPoint.y, h, averageSpeed);//下一个平面坐标y轴（纬度）像素点
					var nextLngLat = this_._projection.pointToLngLat([pixel_X,pixel_Y]);	//获取下一个坐标经纬度
					if (h == 1) {
						var p = null;
						if (this_.i - 1 >= 0) {
							p = this_._path[this_.i - 1]
						}
						if (this_._opts.enableRotation == true) {
							this_.setRotation(p, startLngLat, endLngLat)
						}
						if (this_._opts.autoView) {
							if (!this_._map.getBounds().containsPoint(nextLngLat)) {
								this_._map.setCenter(nextLngLat)
							}
						}
					}
					this_._marker.setPosition(nextLngLat);
					this_._setInfoWin(nextLngLat)
				}
			}, intervalTime);
		},
		//设置旋转
		setRotation : function(l, startLngLat, endLngLat) {
			var this_ = this;
			var rotation = 0;
			var startPixelPoint = this_._map.pointToPixel(startLngLat);
			var endPixelPoint = this_._map.pointToPixel(endLngLat);
			
			if (endPixelPoint.x != startPixelPoint.x) {
				//求斜率
				var k = (endPixelPoint.y - startPixelPoint.y) / (endPixelPoint.x - startPixelPoint.x); 
				var	g = Math.atan(k);
				rotation = g * 360 / (2 * Math.PI);
				if(endPixelPoint.x < startPixelPoint.x) {
					rotation = -rotation + 90 + 90
				} else {
					rotation = -rotation
				}
				this_._marker.setRotation(-rotation)
			} else {
				var pixel_Y = endPixelPoint.y - startPixelPoint.y;
				var i = 0;
				if (pixel_Y > 0) {
					i = -1
				} else {
					i = 1
				}
				this_._marker.setRotation(-i * 90)
			}
			return
		},
		linePixellength : function(f, e) {
			return Math.sqrt(Math.abs(f.x - e.x) * Math.abs(f.x - e.x) + Math.abs(f.y - e.y) * Math.abs(f.y - e.y))
		},
		pointToPoint : function(f, e) {
			return Math.abs(f.x - e.x) * Math.abs(f.x - e.x) + Math.abs(f.y - e.y) * Math.abs(f.y - e.y);
		},
		//移动到下一个坐标点
		_moveNext : function(pointIndex) {
			var this_ = this;
			if (pointIndex < this._path.length - 1) {
				this_._move(this_._path[pointIndex], this_._path[pointIndex + 1], this_._tween.linear)
			}
		},
		//设置信息框
		_setInfoWin : function(point) {
			var this_ = this;
			if (!this_._overlay) {
				return
			}
			this_._overlay.setPosition(point, this_._marker.getIcon().size);
			//轨迹线穿过的特殊点
			var landmarkPoisIndex = this_._troughPointIndex(point);
			if (landmarkPoisIndex != -1) {
				clearInterval(this_._intervalFlag);
				this_._overlay.setHtml(this_._opts.landmarkPois[landmarkPoisIndex].html);
				this_._overlay.setPosition(point, this_._marker.getIcon().size);
				this_._pauseForView(landmarkPoisIndex);
			} else {
				this_._overlay.setHtml(this_._opts.defaultContent)
			}
		},
		_pauseForView : function(index) {
			var this_ = this;
			var time = this_._opts.landmarkPois[index].pauseTime * 1000;
			var timeOut = setTimeout(function() {
				this_._moveNext(++this_.i)
			},time);
			this_._setTimeoutQuene.push(timeOut)
		},
		_clearTimeout : function() {
			for ( var timeOut in this._setTimeoutQuene) {
				clearTimeout(this._setTimeoutQuene[timeOut])
			}
			this._setTimeoutQuene.length = 0
		},
		_tween : {
			//current：当前坐标点的经度或纬度，next：下一个坐标点的经度或纬度，h： ，averageSpeed：
			linear : function(current, next, h, averageSpeed) {
				var e = current;
				var l = next - current;
				var g = h;
				var k = averageSpeed;
				
				return l * g / k + e;
			}
		},
		//轨迹线穿过的特殊点
		_troughPointIndex : function(point) {
			var landmarkPois = this._opts.landmarkPois;
			var distance;
			for ( var index = 0; index < landmarkPois.length ; index++) {
				if (!landmarkPois[index].bShow){
					distance = this._map.getDistance(new fjzx.map.Point(landmarkPois[g].lng, landmarkPois[g].lat), point);
					if (distance < 10) {
						landmarkPois[index].bShow = true;
						return index
					}
				}
			}
			return -1
		}
	});
	function InfoWindow(point, html) {
		this._point = point;
		this._html = html;
	}
	//InfoWindow.prototype = new fjzx.map.Overlay();
	InfoWindow.prototype.initialize = function(e) {
		var containerElement = this._div = a.dom.create("div", {
			style : "border:solid 1px #ccc;width:auto;min-width:50px;text-align:center;position:absolute;background:#fff;color:#000;font-size:12px;border-radius: 10px;padding:5px;white-space: nowrap;"
		});
		containerElement.innerHTML = this._html;
		e.getPanes().floatPane.appendChild(containerElement);
		this._map = e;
		return containerElement
	};
	InfoWindow.prototype.draw = function() {
		this.setPosition(this.lushuMain._marker.getPosition(), this.lushuMain._marker.getIcon().size)
	};
	a.object.extend(InfoWindow.prototype, {
		setPosition : function(point, iconSize) {
			var pixelPoint = this._map.getPixelFromCoordinate(point);
			var	width = a.dom.getStyle(this._div, "width"); 
			var	height = a.dom.getStyle(this._div, "height");
			overlayWidth = parseInt(this._div.clientWidth || width, 10),
			overlayHeight = parseInt(this._div.clientHeight || height, 10);
			this._div.style.left = pixelPoint[0] - overlayWidth / 2 + "px";
			this._div.style.bottom = -(pixelPoint[1] - iconSize[1]) + "px"
		},
		setHtml : function(content) {
			this._div.innerHTML = content;
		},
		setRelatedClass : function(e) {
			this.lushuMain = e;
		}
	})
})();