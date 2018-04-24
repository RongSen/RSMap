var FjzxMapSelect = window.FjzxMapSelect = FjzxMapSelect || {};

(function() {
    /**
     * BMAP_ZOOM_IN 拉框后执行放大操作
     * @type {int}
     */
    var BMAP_ZOOM_IN  = 0;
    
    var resultRect;
    /** 
     * @exports SelectInRectangle as FjzxMapSelect.SelectInRectangle 
     */
    var SelectInRectangle =

        FjzxMapSelect.SelectInRectangle = function(map, selectWords ,opts){
            if (!map) {
                return;
            }

            /**
             * map对象
             * @private
             * @type {Map}
             */
            this._map = map;
            
            /**
             * 要搜索的类型 用 逗号隔开 比如 USER , SIGN 等 
             * @private
             * @type {String}
             */
            this._selectWords = selectWords ;
            /**
             * 各种状态的默认参数
             * @private
             * @param {Json Object} 
             */
            this._opts = {
                //搜索结果显示设置
                map: map,                
                // 开启拉框搜索状态后，鼠标跟随的文字
                followText : "",
                // 遮盖层外框的线宽
                strokeWeight : 2,
                // 遮盖层外框的颜色
                strokeColor : "#111",
                // 遮盖层外框的样式
                style : "solid",
                // 遮盖层的填充色
                fillColor : "#ccc",
                // 遮盖层的透明度
                opacity : 0.4,
                // 鼠标样式
                cursor : "crosshair",
                // 是否在每次操作后，自动关闭拉框搜索状态, 私有属性
                autoClose : true,                
                //是否自动调整视野
                autoViewport : false,
                //是否一直显示拉框后的覆盖物
                alwaysShowOverlay: true,
                //显示面板
                panel:"",
                //是否显示第一个搜索结果
                selectFirstResult: "false",
                // 拉框后放大
                _zoomType : BMAP_ZOOM_IN
            };
            
            // 通过使用者输入的opts，修改这些默认参数
            this._setOptions(opts);

            // 验证参数正确性
            this._opts.strokeWeight = 
                this._opts.strokeWeight <= 0 ? 
                    1 : 
                    this._opts.strokeWeight;

            this._opts.opacity = 
                this._opts.opacity < 0 ? 
                    0 : 
                    this._opts.opacity > 1 ? 
                        1 : 
                        this._opts.opacity;

            /**
             * 当前是否开启拉框搜索状态；默认为false，表示没有开启
             * @private
             * @type {Boolean} 
             */
            this._isOpen = false;

            /**
             * 拉框时显示的矩形遮盖层
             * @private
             * @type {HTMLElement}
             */
            this._fDiv = null;
            
            /**
             * 鼠标跟随的文字提示框
             * @private
             * @type {BMap.Label}
             */
            this._followTitle = null;
            //当前overlay对象
            this._overlay = null;        
        }

    /**
     * 根据用户输入的opts，修改默认参数_opts
     * @param {Json Object} opts 用户输入的修改参数
     * @return 无返回值
     */
    SelectInRectangle.prototype._setOptions = function(opts) {
        if (!opts) {
            return;
        }
        if(opts.renderOptions){          
            for (var p in opts.renderOptions) {                  
                if (typeof(opts.renderOptions[p]) != "undefined") {
                    this._opts[p] = opts.renderOptions[p];                   
                }
            }
        }
        if(opts.onSelectComplete){          
            this._opts["onSelectComplete"] = opts.onSelectComplete;
        }
    };


    /**
     * 设置线颜色
     * @param {String} color 设置的遮盖层外框线色
     * @return 无返回值
     *
     * @example <b>参考示例：</b><br />
     * searchInRect.setStrokeColor("#fff");
     */
    SelectInRectangle.prototype.setStrokeColor = function(color) {
        if (typeof color == "string") {
            this._opts.strokeColor = color;
            this._updateStyle();
        }
    };

    /**
     * 设置线粗细
     * @param {Number} width 设置的遮盖层外框线宽
     * @return 无返回值
     *
     * @example <b>参考示例：</b><br />
     * searchInRect.setLineStroke(3);
     */
    SelectInRectangle.prototype.setLineStroke = function(width) {
        if (typeof width == "number" && Math.round(width) > 0) {
            this._opts.strokeWeight = Math.round(width);
            this._updateStyle();
        }
    };

    /**
     * 设置线样式
     * @param {String} style 设置的遮盖层外框样式
     * @return 无返回值
     *
     * @example <b>参考示例：</b><br />
     * searchInRect.setLineStyle("dashed");
     */
    SelectInRectangle.prototype.setLineStyle = function(style) {
        if (style == "solid" || style == "dashed") {
            this._opts.style = style;
            this._updateStyle();
        }
    };

    /**
     * 设置透明度
     * @param {Number} opacity 设置的遮盖层透明度
     * @return 无返回值
     *
     * @example <b>参考示例：</b><br />
     * searchInRect.setOpacity(0.5);
     */
    SelectInRectangle.prototype.setOpacity = function(opacity) {
        if (typeof opacity == "number" && 
            opacity >= 0 && 
            opacity <= 1) {
                this._opts.opacity = opacity;
                this._updateStyle();
        }
    };

    /**
     * 设置填充色
     * @param {String} color 设置的遮盖层填充色
     * @return 无返回值
     *
     * @example <b>参考示例：</b><br />
     * searchInRect.setFillColor("#F0F");
     */
    SelectInRectangle.prototype.setFillColor = function(color) {
        this._opts.fillColor = color;
        this._updateStyle();
    };

    /**
     * 设置鼠标样式
     * @param {String} cursor 设置的鼠标样式
     * @return 无返回值
     *
     * @example <b>参考示例：</b><br />
     * searchInRect.setCursor("crosshair");
     */
    SelectInRectangle.prototype.setCursor = function(cursor) {
        this._opts.cursor = cursor;
        // 设置鼠标样式
        OperationMask.setCursor(this._opts.cursor);
    };

    /**
     * 根据配置信息更新样式
     * @return 无返回值
     */
    SelectInRectangle.prototype._updateStyle = function() {
        if (this._fDiv){
            this._fDiv.style.border = 
                [this._opts.strokeWeight, 
                "px ", 
                this._opts.style, 
                " ", 
                this._opts.color].join("");

            // 设置不同环境下的透明度
            var st = this._fDiv.style,
                  op = this._opts.opacity;
            st.opacity = op; 
            st.MozOpacity = op;
            st.KhtmlOpacity = op;
            st.filter = "alpha(opacity=" + (op * 100) + ")";
        }
    };

    /**
     * 获取鼠标样式
     * @return 鼠标样式
     *
     * @example <b>参考示例：</b><br />
     * searchInRect.getCursor();
     */
    SelectInRectangle.prototype.getCursor = function() {
        return this._opts.cursor;
    };

    /**
     * 控件项的事件绑定
     * @return 无返回值
     */
    SelectInRectangle.prototype._bind = function(){
        // 设置鼠标样式
        this.setCursor(this._opts.cursor);
        var me = this;
        // 在装载地图的页面元素上，绑定鼠标移动事件
        addEvent(this._map.getContainer(), "mousemove", function(e){
            if (!me._isOpen) {
                return;
            }
            if (!me._followTitle) {
                return;
            }
            e = window.event || e;
            var t = e.target || e.srcElement;
            // 如果触发该事件的页面元素不是遮盖效果层，则返回，无操作
            if (t != OperationMask.getDom(me._map)) {
                me._followTitle.hide();
                return;
            }
            if (!me._mapMoving) {
                me._followTitle.show();
            }
            // 设置鼠标移动过程中，跟随的文字提示框的位置
            var pt = OperationMask.getDrawPoint(e, true);
            me._followTitle.setPosition(pt);
        });
        // 创建鼠标跟随的文字提示框
        if (this._opts.followText) {
            var t = this._followTitle = new BMap.Label(this._opts.followText, {offset : new BMap.Size(14, 16),enableMassClear: false});
            this._followTitle.setStyles({color : "#333", borderColor : "#ff0103"});
        }
    };

    /**
     * 开启拉框搜索状态。
     * 在拉框效果结束的时候，会调用Animation库(见源文件，闭包，不对外开放)
     * 来实现一些小动画
     * @return 成功开启拉框搜索状态时，返回true；否则无返回值
     *
     * @example <b>参考示例：</b><br />
     * SelectInRect.open();
     */
    SelectInRectangle.prototype.open = function() {
        // 判断拉框搜索状态是否已经开启
        if (this._isOpen == true) {
            return true;
        }
        // 已有其他地图上的鼠标操作工具开启
        if (!!FjzxMapSelect._toolInUse) {
            return;
        }     
        FjzxMapSelect._toolInUse = true;

        this._isOpen = true;

        // 增加鼠标在地图区域移动的事件
        // 通过binded参数，避免多次绑定
        if (!this.binded) {
            this._bind();
            this.binded = true;
        }

        // 将文字提示框作为BMap.Label元素，提交给Map Api进行管理
        if (this._followTitle) {
            this._map.addOverlay(this._followTitle);
            this._followTitle.hide();
        }

        var me = this;
        var map = this._map;
        // 返回IE版本号
        var ieVersion = 0;
        if (/msie (\d+\.\d)/i.test(navigator.userAgent)) {
            ieVersion = document.documentMode || + RegExp['\x241']
        }
        
        var moveDistance = 0 ;//移动距离，如果是0，说明进行的是点击操作
        // 开启拉框搜索状态后，鼠标在地图上按下时的操作
        var beginDrawRect = function(e) {        
            // 由于在IE和非IE浏览器下，e对象对鼠标按下键的返回值不一样
            // 所以需要分两种情况判断，当不是鼠标左键时，返回无操作
            e = window.event || e;
            if (e.button != 0 && 
                !ieVersion ||
                ieVersion && 
                e.button != 1) {
                    return;
            }

            // 增加IE浏览器下对事件的捕获
            if (!!ieVersion && OperationMask.getDom(map).setCapture) {
                OperationMask.getDom(map).setCapture();
            }
                
            if (!me._isOpen) {
                return;
            }
            moveDistance = 0 ; 
            me._bind.isZooming = true;
            
            // 添加拖拽鼠标画框时，鼠标移动事件，和鼠标弹起事件
            addEvent(document, "mousemove", drawingRect);
            addEvent(document, "mouseup", endDrawRect);

            // 记录此时鼠标相关位置
            me._bind.mx = e.layerX || e.offsetX || 0;
            me._bind.my = e.layerY || e.offsetY || 0;
            me._bind.ix = e.pageX || e.clientX || 0;
            me._bind.iy = e.pageY || e.clientY || 0;

            // 创建矩形半透明效果框
            insertHTML(OperationMask.getDom(map), "beforeBegin", me._generateHTML());
            me._fDiv = OperationMask.getDom(map).previousSibling;

            me._fDiv.style.width = "0";
            me._fDiv.style.height = "0";
            me._fDiv.style.left = me._bind.mx + "px";
            me._fDiv.style.top = me._bind.my + "px";

            // 停止事件冒泡传播和默认事件
            stopBubble(e);
            return preventDefault(e);
        };

        // 开启拉框搜索状态后，鼠标在地图上按下、并拖拽时的操作        
        var drawingRect = function(e) {  
            if (me._isOpen == true && me._bind.isZooming == true) {

                //再次拉框的时候，如果地图上还有其他框存在，则先清除掉
                if(me._overlay){ me._map.removeOverlay(me._overlay); }
                // 通过鼠标当前所在位置，计算矩形半透明效果框的高宽
                var e = window.event || e;
                var curX = e.pageX || e.clientX || 0;
                var curY = e.pageY || e.clientY || 0;

                var dx = me._bind.dx = curX - me._bind.ix;
                var dy = me._bind.dy = curY - me._bind.iy;
                var tw = Math.abs(dx) - me._opts.strokeWeight;
                var th = Math.abs(dy) - me._opts.strokeWeight;
                me._fDiv.style.width = (tw < 0 ? 0 : tw) + "px";
                me._fDiv.style.height = (th < 0 ? 0 : th) + "px";
                moveDistance = tw;
                // 计算矩形半透明效果框所在位置
                var mapSize = [map.getSize().width, map.getSize().height];
                // 当dx小于0的时候，也就是绘制中的点位置，在水平方向上，比起始点更靠左
                // 说明，此时用户在从右往左绘制矩形框
                // 需要对矩形的右边距进行计算，与普通状况下的计算左边距，有所不同
                if (dx >= 0) {
                    me._fDiv.style.right = "auto";
                    me._fDiv.style.left = me._bind.mx + "px";
                    if (me._bind.mx + dx >= mapSize[0] - 2 * me._opts.strokeWeight) {
                        me._fDiv.style.width = mapSize[0] - me._bind.mx - 2 * me._opts.strokeWeight + "px";
                        me._followTitle && me._followTitle.hide();
                    }
                } else {
                    me._fDiv.style.left = "auto";
                    me._fDiv.style.right = mapSize[0] - me._bind.mx + "px";
                    if (me._bind.mx + dx <= 2 * me._opts.strokeWeight) {
                        me._fDiv.style.width = me._bind.mx - 2 * me._opts.strokeWeight + "px";
                        me._followTitle && me._followTitle.hide();
                    }
                }
                // 当dy小于0的时候，也就是绘制中的点位置，在垂直方向上，比起始点更靠上
                // 说明，此时用户在从下往上绘制矩形框
                // 需要对矩形的下边距进行计算，与普通状况下的计算上边距，有所不同
                if (dy >= 0) {
                    me._fDiv.style.bottom = "auto";
                    me._fDiv.style.top = me._bind.my + "px";
                    if (me._bind.my + dy >= mapSize[1] - 2 * me._opts.strokeWeight) {
                        me._fDiv.style.height = mapSize[1] - me._bind.my - 2 * me._opts.strokeWeight + "px";
                        me._followTitle && me._followTitle.hide();
                    }
                } else {
                    me._fDiv.style.top = "auto";
                    me._fDiv.style.bottom = mapSize[1] - me._bind.my + "px";
                    if (me._bind.my + dy <= 2 * me._opts.strokeWeight) {
                        me._fDiv.style.height = me._bind.my - 2 * me._opts.strokeWeight + "px";
                        me._followTitle && me._followTitle.hide();
                    }
                }

                // 停止事件冒泡传播和默认事件
                stopBubble(e);
                return preventDefault(e);
            }
        };

        // 开启拉框搜索状态后，鼠标在地图上拖拽时、弹起的操作
        var endDrawRect = function(e) { 
            if(!moveDistance) me._fDiv.parentNode.removeChild(me._fDiv);
            if (me._isOpen == true) { 
                // 删除拖拽鼠标画框时，鼠标移动事件，和鼠标弹起事件
                removeEvent(document, "mousemove", drawingRect);
                removeEvent(document, "mouseup", endDrawRect);
                if(!moveDistance){ return;}
                
                // 释放IE浏览器下对事件的捕获
                if (!!ieVersion && OperationMask.getDom(map).releaseCapture){
                    OperationMask.getDom(map).releaseCapture();
                }

                // 计算当前矩形半透明效果框的中心点
                var centerX = parseInt(me._fDiv.style.left) + parseInt(me._fDiv.style.width) / 2;
                var centerY = parseInt(me._fDiv.style.top) + parseInt(me._fDiv.style.height) / 2;
                var mapSize = [map.getSize().width, map.getSize().height];
                if (isNaN(centerX)) {
                    centerX = mapSize[0] - parseInt(me._fDiv.style.right) - parseInt(me._fDiv.style.width) / 2;
                }
                if (isNaN(centerY)) {
                    centerY = mapSize[1] - parseInt(me._fDiv.style.bottom) - parseInt(me._fDiv.style.height) / 2;
                }

                // 通过对比矩形和地图区域的高宽，计算需要的缩放比例
                var ratio = Math.min(mapSize[0] / Math.abs(me._bind.dx), mapSize[1] / Math.abs(me._bind.dy));
                ratio = Math.floor(ratio);

                // 通过屏幕上的像素坐标的转化，计算矩形半透明效果框的Bound区域
                var px1 = new BMap.Pixel(centerX - parseInt(me._fDiv.style.width) / 2, centerY + parseInt(me._fDiv.style.height) / 2);
                var px2 = new BMap.Pixel(centerX + parseInt(me._fDiv.style.width) / 2, centerY - parseInt(me._fDiv.style.height) / 2);
               
                var pt1 = map.pixelToPoint(px1);
                var pt2 = map.pixelToPoint(px2);
                var bds = new BMap.Bounds(pt1, pt2);

                delete me._bind.dx;
                delete me._bind.dy;
                delete me._bind.ix;
                delete me._bind.iy;

                // 计算缩放后应该所在的地图层级
                // 当矩形效果框和地图区域的高宽比有清晰结果时(即ratio有计算结果)，通过高宽比来计算
                // 由于每层级地图间的缩放比1:2，所以使用下面的计算公式
                // 当ratio无计算结果时，只进行普通的1个级别的缩放改变
                if (!isNaN(ratio)) {
                    //当用户设置启用自动视野调整
                    if (me._opts._zoomType == BMAP_ZOOM_IN){                  
                        // 拉框放大的情况
                        targetZoomLv = Math.round(map.getZoom() + (Math.log(ratio) / Math.log(2)));
                        if (targetZoomLv < map.getZoom()){
                            targetZoomLv = map.getZoom();
                        }
                    }
                } else{
                    targetZoomLv = map.getZoom() + (me._opts._zoomType == BMAP_ZOOM_IN ? 1 : -1);
                }
                
                // 进行层级缩放，并定位新中心点
                var targetCenterPt = map.pixelToPoint({x : centerX, y : centerY}, map.getZoom());
                //如果启用自动调整视野
                if(me._opts.autoViewport){
                    map.centerAndZoom(targetCenterPt, targetZoomLv);
                }

                // 设置鼠标移动过程中，跟随的文字提示框的位置
                var pt = OperationMask.getDrawPoint(e);
                if (me._followTitle) {
                    me._followTitle.setPosition(pt);
                    me._followTitle.show();
                }
                me._bind.isZooming = false;
                
                // 缩放操作结束，删除矩形半透明框
                me._fDiv.parentNode.removeChild(me._fDiv);
                me._fDiv = null;
            }

		     var bds = new BMap.Bounds(pt1, pt2); //测试Bounds对象
		         
		     // 创建矩形覆盖物，用以缩放结束后的动画效果
	            // 如果不需要动画效果，从此处到new Animation()的过程、以及Animation的声明，均可删除
	            var southWestPoint = bds.getSouthWest(),
	                  northEastPoint = bds.getNorthEast(),
	                  southEastPoint = new BMap.Point(northEastPoint.lng, southWestPoint.lat),
	                  northWestPoint = new BMap.Point(southWestPoint.lng, northEastPoint.lat),
	                  rect = new BMap.Polygon([
	                        southWestPoint,
	                        northWestPoint,
	                        northEastPoint,
	                        southEastPoint
	                  ]); 
	            rect.setStrokeWeight(me._opts.strokeWeight);
	            rect.setStrokeOpacity(me._opts.opacity);
	            rect.setFillOpacity(me._opts.opacity);
	            rect.setStrokeColor(me._opts.strokeColor);
	            rect.setStrokeStyle(me._opts.style);
	            rect.setFillColor(me._opts.fillColor);
	            
	            me._overlay = rect;
	            bm.addOverlay(rect);
	                       


	            // 停止事件冒泡传播和默认事件

			     //演示：将点与矩形添加到地图上
			     if(resultRect!=null)
			    	 bm.removeOverlay(resultRect); 
			     var pts = [];
			     var leftTop = new BMap.Point(pt1.lng, pt2.lat);
			     var rightTop = new BMap.Point(pt2.lng, pt2.lat);
			     var leftBottom = new BMap.Point(pt1.lng, pt1.lat);
			     var rightBottom = new BMap.Point(pt2.lng, pt1.lat);
			     pts.push(leftTop);
			     pts.push(rightTop);
			     pts.push(rightBottom);
			     pts.push(leftBottom);
			     resultRect = new BMap.Polygon(pts,{
			    	 weight:1
			     });
			     resultRect.setStrokeWeight(1);
			//     bm.addOverlay(resultRect);//添加测试矩形    
			     var selectObj = new Array();
			     var allOverlay = bm.getOverlays();
		         for (var i = 0; i < allOverlay.length; i++)
		         {     
		        	 if (allOverlay[i].toString() == "[object Marker]") {
		        		 try { 
			        	     var result = BMapLib.GeoUtils.isPointInRect(allOverlay[i].getPosition(), bds);
			    		     if(result == true){
			    		    	 if(allOverlay[i].getLabel()!=null){
			    		    		var content  = allOverlay[i].getLabel().getContent();
			    		    		var maker_type =  $(content).find("input[name=maker_type]").val();
			    		    		var bool = me._selectWords.indexOf( maker_type );
				    		    	if(bool>=0){
				    		    			var strRecord =  $(content).find("input[name=maker_value]").val();
				    		    			var jsonRecord = JSON.parse(strRecord);
				    		    			jsonRecord.makerType = maker_type; 
				    		    			selectObj.push(jsonRecord);
				    		    	}
			    		    	 }
			    		    	
			    		     }
		        		 } catch (e){ } 
		        	 }
		         }
		         if(selectObj.length>0){
		        	  if(me._opts["onSelectComplete"]){        
		        		  me._opts["onSelectComplete"](selectObj);
		              }
		         }
     

            // 渐隐藏动画效果
            if(!me._opts.alwaysShowOverlay){              
                new Animation({
                        duration : 240, 
                        fps : 20,
                        delay : 500, 
                        render : function(t) {
                            var opacity = 0.3 * (1 - t);
                            rect.setStrokeOpacity(opacity);
                        },
                        finish : function() {
                            map.removeOverlay(me._overlay);
                            me._overlay = null;
                        }
                });
            }
            // 设置为自动关闭缩放状态时，修改相关状态值
            if (me._opts.autoClose) {
                setTimeout(function() {
                    if (me._isOpen == true) {
                        me.close();
                    }
                }, 70);
            }      
            // 停止事件冒泡传播和默认事件
            stopBubble(e);
            return preventDefault(e);
        };
               
        OperationMask.show(this._map);
        this.setCursor(this._opts.cursor);

        // 增加鼠标按下时，开始绘制矩形框的事件
        // 通过判断只绑定一次，并不再删除
        if (!this._isBeginDrawBinded) {
            addEvent(OperationMask.getDom(this._map), "mousedown", beginDrawRect);
            this._isBeginDrawBinded = true;
        }

        return true;
    };

    /**
     * 结束拉框搜索状态
     * @return 无返回值
     *
     * @example <b>参考示例：</b><br />
     * SelectInRect.close();
     */
    SelectInRectangle.prototype.close = function() {
        if (!this._isOpen) {
            return;
        }
        this._isOpen = false;
        FjzxMapSelect._toolInUse = false;
        this._followTitle && this._followTitle.hide();
        OperationMask.hide();
        bm.removeOverlay(resultRect); 
    };
     /**
     * 重新设置搜索字符串
     * @param {String} keyword 要搜索的地方，例如“餐馆”
     * @return 无返回值
     *
     * @example <b>参考示例：</b><br />
     * SelectInRect.Select("餐馆");
     */
    SelectInRectangle.prototype.setKeyword = function(keyword){       
        this._selectWords = keyword;
    }
    /**
     * 生成透明效果层
     * @return 透明层的html字符串
     */
    SelectInRectangle.prototype._generateHTML = function() {
        return ["<div style='position:absolute;z-index:300;border:",
                    this._opts.strokeWeight,
                    "px ",
                    this._opts.style,
                    " ",
                    this._opts.strokeColor,
                    "; opacity:",
                    this._opts.opacity,
                    "; background: ",
                    this._opts.fillColor,
                    "; filter:alpha(opacity=",
                    Math.round(this._opts.opacity * 100),
                    "); width:0; height:0; font-size:0'></div>"].join("");
    };
 
    
    /**
     * 在目标元素的指定位置插入HTML代码，
     * 闭包，对外不暴露
     *
     * @param {HTMLElement|string} element 目标元素或目标元素的id
     * @param {String} position 插入html的位置信息
     *     取值为beforeBegin、afterBegin、beforeEnd或afterEnd，大小写不敏感
     * @param {String} html 要插入的html    
     * @return {HTMLElement} 目标元素
     */
    function insertHTML(element, position, html) {
        var range,begin;
        if (element.insertAdjacentHTML) {
            element.insertAdjacentHTML(position, html);
        } else {
            range = element.ownerDocument.createRange();
            // FF下range的位置设置错误可能导致创建出来的fragment在插入dom树之后html结构乱掉
            // 改用range.insertNode来插入html
            position = position.toUpperCase();
            if (position == 'AFTERBEGIN' || position == 'BEFOREEND') {
                range.selectNodeContents(element);
                range.collapse(position == 'AFTERBEGIN');
            } else {
                begin = position == 'BEFOREBEGIN';
                range[begin ? 'setStartBefore' : 'setEndAfter'](element);
                range.collapse(begin);
            }
            range.insertNode(range.createContextualFragment(html));
        }
        return element;
    }

    /**
     * 插入到Dom元素内，最后面一段HTML;并返回Dom对象，
     * 闭包，对外不暴露
     *
     * @param {Object} parent 父容器
     * @param {Object} chlidHTML	插入的HTML
     * @return Dom元素
     */
    function beforeEndHTML(parent, chlidHTML) {
        insertHTML(parent, "beforeEnd", chlidHTML);
        return parent.lastChild;
    }

    /**
     * 停止事件冒泡传播，
     * 闭包，对外不暴露
     *
     * @type {Event} e e对象
     */
    function stopBubble(e){
        var e = window.event || e;
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    }

    /**
     * 阻止默认事件处理，
     * 闭包，对外不暴露
     *
     * @type {Event} e e对象
     */
    function preventDefault(e) {
        var e = window.event || e;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        return false;
    }

    /**
     * 给某页面元素添加事件，
     * 闭包，对外不暴露
     *
     * @type {Dom} element 需要添加事件的dom对象
     * @type {String} type 需要添加的事件名
     * @type {Function} listener 需要触发的操作
     */
    function addEvent(element, type, listener) {
        if (!element) {
            return;
        }
        type = type.replace(/^on/i, '').toLowerCase();
        if (element.addEventListener) {
            element.addEventListener(type, listener, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, listener);
        }
    };

    /**
     * 给某页面元素删除事件，
     * 闭包，对外不暴露
     *
     * @type {Dom} element 需要删除事件的dom对象
     * @type {String} type 需要删除的事件名
     * @type {Function} listener 需要触发的操作
     */
    function removeEvent(element, type, listener) {
        if (!element) {
            return;
        }
        type = type.replace(/^on/i, '').toLowerCase();
        if (element.removeEventListener) {
            element.removeEventListener(type, listener, false);
        } else if (element.detachEvent) {
            element.detachEvent('on' + type, listener);
        }
    };


    /**
     * OperationMask，透明覆盖层，在地图上进行鼠标绘制操作时使用，
     * 闭包，对外不暴露
     */
    var OperationMask = {
        /**
         * map对象
         * @type {Map}
         */
        _map : null,

        /**
         * HTML字符串
         * @type {String}
         */
        _html : "<div style='background:transparent url(http://api.map.baidu.com/images/blank.gif);position:absolute;left:0;top:0;width:100%;height:100%;z-index:1000' unselectable='on'></div>",

        /**
         * html元素
         * @type {HTMLElement}
         */
        _maskElement : null,

        /**
         * 鼠标指针
         * @type {String}
         */
        _cursor: 'default',

        /**
         * 操作层是否在使用中
         * @type {Boolean}
         */
        _inUse: false,

        /**
         * 透明覆盖层的显示
         *
         * @param {Map} map map对象
         * @return 无返回值
         */
        show : function(map) {
            if (!this._map) {
                this._map = map;
            }
            this._inUse = true;
            if (!this._maskElement) {
                this._createMask(map);
            }
            this._maskElement.style.display = 'block';
        },

        /**
         * 创建覆盖层
         *
         * @param {Map} map map对象
         * @return 无返回值
         */
        _createMask : function(map) {
            this._map = map;
            if (!this._map) {
                return;
            }
            var elem = this._maskElement = beforeEndHTML(this._map.getContainer(), this._html);

            var stopAndPrevent = function(e) {
                stopBubble(e);
                return preventDefault(e);
            }
            addEvent(elem, 'mouseup', function(e) {
                if (e.button == 2) {
                    stopAndPrevent(e);
                }
            });
            addEvent(elem, 'contextmenu', stopAndPrevent);
            elem.style.display = 'none';
        },

        /**
         * 获取当前绘制点的地理坐标
         *
         * @param {Event} e e对象
         * @param {Boolean} n 是否向上查到相对于地图container元素的坐标位置
         * @return Point对象的位置信息
         */
        getDrawPoint : function(e, n) {
            e = window.event || e;
            var x = e.layerX || e.offsetX || 0;
            var y = e.layerY || e.offsetY || 0;
            var t = e.target || e.srcElement;
            if (t != OperationMask.getDom(this._map) && n == true) {
                while (t && t != this._map.getContainer()) {
                    if (!(t.clientWidth == 0 && 
                         t.clientHeight == 0 && 
                         t.offsetParent && 
                         t.offsetParent.nodeName.toLowerCase() == 'td')) {
                            x += t.offsetLeft;
                            y += t.offsetTop;
                    }
                    t = t.offsetParent;
                }
            }

            if (t != OperationMask.getDom(this._map) && 
                t != this._map.getContainer()) {
                    return;
            }
            if (typeof x === 'undefined' || 
                typeof y === 'undefined') {
                    return;
            }
            if (isNaN(x) || isNaN(y)) {
                return;
            }
            return this._map.pixelToPoint(new BMap.Pixel(x, y));
        },

        /**
         * 透明覆盖层的隐藏
         *
         * @return 无返回值
         */
        hide : function() {
            if (!this._map) {
                return;
            }
            this._inUse = false;
            if (this._maskElement) {
                this._maskElement.style.display = 'none';
            }
        },

        /**
         * 获取HTML容器
         *
         * @param {Map} map map对象
         * @return HTML容器元素
         */
        getDom : function(map) {
            if (!this._maskElement) {
                this._createMask(map);
            }
            return this._maskElement;
        },

        /**
         * 设置鼠标样式
         *
         * @type {String} cursor 鼠标样式
         * @return 无返回值
         */
        setCursor : function(cursor) {
            this._cursor = cursor || 'default';
            if (this._maskElement) {
                this._maskElement.style.cursor = this._cursor;
            }
        }
    };


    /**
     * Animation，动画效果类，
     * 通过该类，可以实现一些延时、规律的动画效果，
     * 闭包在文件内，对外不暴露
     * 
     * @constructor
     * @param {Json Object} opts 可选的输入参数，非必填项。可输入选项包括：
     * {"duration" : {Number} 动画时长, 单位毫秒,
     *  "fps" : {Number} 每秒帧数,
     *  "delay" : {Number} 延迟执行时间，单位毫秒,
     *  "transition" : {Object} 变换效果的曲线,
     *  "finish" : {Function} 动画结束的回调函数,
     *  "render" : {Function} 每一帧执行的回调函数}
     */
    function Animation(opts) {
        var defaultOptions = {
            // 动画时长, 单位毫秒
            duration: 1000,
            // 每秒帧数
            fps: 30,
            // 延迟执行时间，单位毫秒
            delay: 0,
            // 变换效果的曲线
            transition: Transitions.linear,
            // 调用stop停止时的回调函数
            onStop: function(){} 
        };

       // 修改默认参数
        if (opts) {
            for (var i in opts) {
                defaultOptions[i] = opts[i];
            }
        }
        this._opts = defaultOptions;

        if (defaultOptions.delay) {
            var me = this;
            setTimeout(function() {
                me._beginTime = new Date().getTime();
                me._endTime = me._beginTime + me._opts.duration;
                me._launch();
            }, defaultOptions.delay);
        } else {
            this._beginTime = new Date().getTime();
            this._endTime = this._beginTime + this._opts.duration;
            this._launch();
        }
    }

    /**
     * 动画执行过程中的操作
     * @return 无返回值
     */
    Animation.prototype._launch = function() {
        var me = this;
        var now = new Date().getTime();

        if (now >= me._endTime) {
            if (typeof me._opts.render == 'function') {
                me._opts.render(me._opts.transition(1));
            }
            // finish()接口，时间线结束时对应的操作
            if (typeof me._opts.finish == 'function') {
                me._opts.finish();
            }
            return;
        }
        me.schedule = me._opts.transition((now - me._beginTime) / me._opts.duration);

        // render()接口，用来实现每个脉冲所要实现的效果
        // schedule 时间线的进度
        if (typeof me._opts.render == 'function') {
            me._opts.render(me.schedule);
        }
        // 执行下一个动作
        if (!me.terminative) {
            me._timer = setTimeout(function() {
                me._launch()
            }, 1000 / me._opts.fps);
        }
    };  

    /**
     * 变换效果函数库
     */
    var Transitions = {
        linear : function(t) {
            return t;
        },
        reverse : function(t) {
            return 1 - t;
        },
        easeInQuad : function(t) {
            return t * t;
        },
        easeInCubic : function(t) {
            return Math.pow(t, 3);
        },
        easeOutQuad : function(t) {
            return - (t * (t - 2));
        },
        easeOutCubic : function(t) {
            return Math.pow((t - 1), 3) + 1;
        },
        easeInOutQuad : function(t) {
            if (t < 0.5) {
                return t * t * 2;
            } else {
                return - 2 * (t - 2) * t - 1;
            }
            return;
        },
        easeInOutCubic : function(t) {
            if (t < 0.5) {
                return Math.pow(t, 3) * 4;
            } else {
                return Math.pow(t - 1, 3) * 4 + 1;
            }
        },
        easeInOutSine : function(t) {
            return (1 - Math.cos(Math.PI * t)) / 2;
        }
    };
})();