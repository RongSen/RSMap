/**
 * Created by Administrator on 2016/11/3.
 */

function MapTree (container, params) {
    if (!(this instanceof MapTree)) return new MapTree(container, params);
    // 默认参数
    var defaults = {
        checkbox:false,//是否显示checkbox
        initCollapsed:true,//默认是否折叠
        initChecked:false,//默认是否选中
        mapTreePackageClass:"mapTree-package",
        mapTreeCheckClass:"mapTree-check",//所有的 input[type="checkbox"]
        mapTreePackageCheckClass:"mapTree-check-package",//有子级的 input[type="checkbox"]
        mapTreeCheckModelClass:"mapTree-check-model",
        mapTreeCheckboxClass:"form-checkbox",
        mapTreeCollapsedClass:"collapsed",
        isItemTextClickCollapsed:true//默认可以点击ITEM 文字折叠
    };
    params = params || {};
    for (var def in defaults) {
        if (typeof params[def] === 'undefined') {
            params[def] = defaults[def];
        }
        else if (typeof params[def] === 'object') {
            for (var deepDef in defaults[def]) {
                if (typeof params[def][deepDef] === 'undefined') {
                    params[def][deepDef] = defaults[def][deepDef];
                }
            }
        }
    }


    /*MapTree*/
    var mt = this;
    // 参数
    mt.params = params;
    mt.container=$(container).eq(0);
    mt.package=mt.container.find("."+mt.params.mapTreePackageClass);
    if (mt.container.length === 0) return;
     if (mt.container.length > 1) {
         mt.container.each(function () {
            new MapTree(this, params);
         });
         return;
     }
     
     /*=========================
     Events/Callbacks/Plugins Emitter
     ===========================*/
   function normalizeEventName (eventName) {
       if (eventName.indexOf('on') !== 0) {
           if (eventName[0] !== eventName[0].toUpperCase()) {
               eventName = 'on' + eventName[0].toUpperCase() + eventName.substring(1);
           }
           else {
               eventName = 'on' + eventName;
           }
       }
       return eventName;
   }
   mt.emitterEventListeners = {
   
   };
   mt.emit = function (eventName) {
       // Trigger callbacks
       if (mt.params[eventName]) {
    	   mt.params[eventName](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
       }
       var i;
       // Trigger events
       if (mt.emitterEventListeners[eventName]) {
           for (i = 0; i < s.emitterEventListeners[eventName].length; i++) {
        	   mt.emitterEventListeners[eventName][i](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
           }
       }
       // Trigger plugins
       if (mt.callPlugins) mt.callPlugins(eventName, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
   };
   mt.on = function (eventName, handler) {
       eventName = normalizeEventName(eventName);
       if (!mt.emitterEventListeners[eventName]) s.emitterEventListeners[eventName] = [];
       mt.emitterEventListeners[eventName].push(handler);
       return mt;
   };
   mt.off = function (eventName, handler) {
       var i;
       eventName = normalizeEventName(eventName);
       if (typeof handler === 'undefined') {
           // Remove all handlers for such event
    	   mt.emitterEventListeners[eventName] = [];
           return mt;
       }
       if (!mt.emitterEventListeners[eventName] || mt.emitterEventListeners[eventName].length === 0) return;
       for (i = 0; i < mt.emitterEventListeners[eventName].length; i++) {
           if(mt.emitterEventListeners[eventName][i] === handler) mt.emitterEventListeners[eventName].splice(i, 1);
       }
       return mt;
   };
   mt.once = function (eventName, handler) {
       eventName = normalizeEventName(eventName);
       var _handler = function () {
           handler(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
           mt.off(eventName, _handler);
       };
       mt.on(eventName, _handler);
       return s;
   };
     

    /*=========================
        方法
     ===========================*/
    //折叠展开
    mt.collapseToggle=function($obj){
        var $target=mt.container.find($obj.attr("data-target"));
        if($target.hasClass("collapsed")){
            mt.expand($obj,$target);
        }else{
            mt.collapse($obj,$target);
        }
    };
    //折叠
    mt.collapse=function($obj,$target){
        $target=$target||mt.container.find($obj.attr("data-target"));
        $target.slideUp();
        $target.addClass("collapsed");
        $obj.addClass("collapsed");
    };
    //展开
    mt.expand=function($obj,$target){
        $target=$target||mt.container.find($obj.attr("data-target"));
        $target.slideDown();
        $target.removeClass("collapsed");
        $obj.removeClass("collapsed");
    	mt.emit('onClick',$obj)
    };
    //全部折叠
    mt.allCollapse=function(){
        mt.package.each(function(){
            var $t=$(this);
            mt.collapse($t);

        });
    };
    //全部展开
    mt.allExpand=function(){
        mt.package.each(function(){
            var $t=$(this);
            mt.expand($t);

        });
    };
    //批量选中
    mt.allCheckedToggle=function($obj,$target){
        $target=$target||mt.container.find($obj.attr("data-target"));
        if($obj.is(":checked")){
            $target.prop("checked",true);
        }else{
            $target.prop("checked",false);
        }
    };
    //全部选中allCheckToggle
    mt.allChecked=function(checked){
        var $target=mt.container.find("."+mt.params.mapTreeCheckClass);
        if(checked){
            $target.prop("checked",true);           
            
        }else{
            $target.prop("checked",false);
        }
    };
    //显示全部checkbox
    mt.allCheckboxShow=function(){
    	mt.container.addClass(mt.params.mapTreeCheckModelClass);
    };
    //隐藏全部checkbox
    mt.allCheckboxHide=function(){
    	mt.container.removeClass(mt.params.mapTreeCheckModelClass);
    };
    //显示全部checkboxToggle
    mt.allCheckboxToggle=function(checkbox){
    	if(checkbox){
            mt.container.addClass(mt.params.mapTreeCheckModelClass);
        }else{
            mt.container.removeClass(mt.params.mapTreeCheckModelClass);
        }
    };



    //添加checkbox相关className
    mt.package.each(function(index,element){
        var childrenCheck=mt.params.mapTreeCheckClass+"-"+index;
        var $packageCheck=$(element).find("."+mt.params.mapTreeCheckClass).eq(0);
        $packageCheck.addClass(mt.params.mapTreePackageCheckClass)
            .attr("data-target","."+childrenCheck);

        var $target=$($(element).attr("data-target")).find("."+mt.params.mapTreeCheckClass);
        $target.addClass(childrenCheck);

        mt.allCheckedToggle($packageCheck,$target);
    });
    /*============
     初始化
     =============*/
    mt.init = function () {
    	mt.allChecked(false);
        if(mt.params.initCollapsed){
            mt.allCollapse();
        }else{
            mt.allExpand();
        }
        if(mt.params.checkbox){
            mt.container.addClass(mt.params.mapTreeCheckModelClass);
        }else{
            mt.container.removeClass(mt.params.mapTreeCheckModelClass);
        }
        if(mt.params.isItemTextClickCollapsed){//点击文字收缩
        	 mt.package.children().not("."+mt.params.mapTreeCheckboxClass).on("click.maptree",function(){
             	var $t=$(this).parent();
             	mt.collapseToggle($t);
             });
        }else{//只能点击前面的三角标志
        	 mt.container.on("click.maptree","."+mt.params.mapTreePackageClass+" .personnel-switch",function(){
                 var $t=$(this).parent();
                 mt.collapseToggle($t);
             });
        }
       

        
        mt.container.on("change.maptree","."+mt.params.mapTreePackageCheckClass,function(){
            var $t=$(this);
            mt.allCheckedToggle($t);
        });
        mt.allChecked(mt.params.initChecked);
    };
    mt.init();
    






}




















