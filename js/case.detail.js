/**
 * Created by 周瓛 on 2017/6/29.
 * 需先引用 jQuery
 */




/*=========================
    自定义滚动条
 ========================*/
+function($){
    $(window).on('load', function () {
        if($(".wrap-scrollbar-wrapper").length){
            $(".wrap-scrollbar-wrapper").each(function(){
                $(this).scrollbar({
                    /*参数*/
                });

             });

        }
    });
    $.fn.scrollbar = function(i) {
        i = $.extend({
            parent: null,
            w: 75,
            R: 30,
            sW: 20,
            bgColor: "#ccc",
            color: ["#000", "#000"],
            perent: [100, 100],
            speed: 0,
            delay: 1000
        }, i);

        var sw=$(this);
        var isMouseTouch = false;
        var distance=0;
        var distanceInt=0;

        sw.set= function(){
            sw.drag = sw.container.find('.wrap-scrollbar-drag');
            if (sw.drag.length === 0) {
                sw.drag = $('<div class="wrap-scrollbar-drag"></div>');
                sw.dragDot = $('<div class="drag-dot"></div>');
                sw.drag.append(sw.dragDot);
                sw.container.append(sw.drag);
            }


        };
        sw.upSet= function(){
            sw.dragSize=sw.drag.outerHeight(true);
            sw.dragDotScale=sw.containerSize/sw.wrapperSize;
            sw.dragDotSize=sw.dragDotScale*sw.dragSize;
            sw.dragDot.css("height",sw.dragDotSize+"px");
            /*滑块初始位置*/
            sw.dragDot.css("top",sw.dragDotYR()+"px");


        };
        sw.scrollDragDot= function(distance){
            //console.log(distance);
            distance=distance-distanceInt;

            if( distance < ( sw.dragSize - sw.dragDotSize )){
                sw.dragDot.css("top",distance+"px");
                sw.updateWrapperY(distance);
            }else{
                isMouseTouch = false;
            }



        };

        sw.dragDotYR=function (){
            sw.wrapperY=sw.position().top;
            sw.dragDotY=sw.wrapperY*sw.dragDotScale*(-1);
            return sw.dragDotY;
        };
        sw.updateWrapperY=function (distance){
            sw.dragDotY=distance?distance:sw.dragDot.position().top;
            sw.wrapperY=sw.dragDotY/sw.dragDotScale*(-1);
            sw.css("top",sw.wrapperY+"px");

        };


        /*初始化*/
        sw.init=function(){
            sw.wrapAll('<div class="wrap-scrollbar-container" style="position:relative;"></div>');
            sw.css({"position":"relative","overflow":"visible","height":"auto"});
            sw.container=sw.parent();
            sw.containerSize=sw.container.outerHeight(true);
            sw.wrapperSize=sw.outerHeight(true);

            sw.set();
            sw.upSet();
            /*监听滚动滑块*/
            sw.container.on("mousedown",".wrap-scrollbar-drag",function(e){
                isMouseTouch = true;
                distanceInt=e.pageY-sw.drag.offset().top;
                console.log(distanceInt);
            });
            $(window).on("mousemove",function(e){
                e.preventDefault();
                e.stopPropagation();
                if(isMouseTouch == true){
                    distance=e.pageY-sw.drag.offset().top;
                    sw.scrollDragDot(distance);
                }

            });
            $(window).on("mouseup",function(e){
                isMouseTouch = false;

            });



            if(sw.outerHeight(true)>sw.container.outerHeight(true)){
                console.log(sw.container.outerHeight(true));
                console.log("显示滚动条");
            }

        };

        sw.init();





        /*$(window).on('mousewheel',".wrap-scrollbar-container",function(event,delta) {
            console.log("444");
            event.preventDefault()
            var dir = delta > 0 ? 'Up' : 'Down',
                vel = delta
            alert(vel+"4"+dir);
            //$("span").text(x+=1);
        });*/

    };
    function wheel(event) {
        var delta = 0;
        if (!event) /* For IE. */
            event = window.event;
        if (event.wheelDelta) { /* IE/Opera. */
            delta = event.wheelDelta / 120;
        } else if (event.detail) { /* Mozilla. */
            delta = -event.detail / 3;
        }
        if (delta) handle(delta);
        if (event.preventDefault)
            event.preventDefault();
        event.returnValue = false;
    }
    /*if (window.addEventListener) {
        /!** DOMMouseScroll is for mozilla. *!/
        window.addEventListener('DOMMouseScroll', wheel, false);
    }*/
    /** IE/Opera. */
    //window.onmousewheel = document.onmousewheel = wheel;

    function handle(delta) {
        if (delta < 0) {
            console.log("鼠标滑轮向下滚动：" + delta + "次！"); // 1
            return;
        } else {
            console.log("鼠标滑轮向上滚动：" + delta + "次！"); // -1
            return;
        }
    }
}(jQuery)