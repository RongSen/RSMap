/**
 * Created by 周瓛 on 2016/1/8.
 */




/*=========================
    侧边菜单
 ========================*/
/*初始化侧边菜单*/
function initMenu(menuId){
    var target =$("[menuId="+menuId+"]");
    target.addClass("active");
    target.parents("ul.collapse").addClass("in");
    var targetHref=target.attr("href");
    var targetView=target.attr("target");
    window.parent.document.getElementsByName(targetView)[0].src=targetHref;

    var l=target.parents(".collapse").length;
    var parentsID;

    for(var i=0;i < l;i++){
        parentsID=target.parents("ul.collapse")[i].id;
        if(parentsID!=""){
            $("[href='#"+parentsID+"']").removeClass("collapsed");
        }

    }

}



/*=========================
        自适应size
 ========================*/
function autoSize(narbarShow){
    var windowWidth=window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth;
    var windowHeigth=window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;


    var narbarWidth=$(".navbar").width();
    var logoWidth=sumWidth(".navbar-header");
    var headLWidth=sumWidth(".headL");
    var narWidth=sumWidth("#navbar-collapse");
    if(narbarWidth-headLWidth-logoWidth<narWidth+1)
    {
        $(".navbar-toggle").css("display","block");
    }else{
        $(".navbar-toggle").css("display","none");
    }





}
function elementAutoSize(element,elementTop,elementRight,elementBottom,elementLeft){
    if (elementTop) {
        //alert($(elementTop).attr("class"));
        if ($(elementTop).css("display") == "none") {
            $(element).css("top", "0");
        } else {
            $(element).css("top", $(elementTop).outerHeight(true));
        }
    }
    if (elementRight) {
        if ($(elementRight).css("display") == "none") {
            $(element).css("right", "0");
        } else {
            $(element).css("right", $(elementRight).outerWidth(true));
        }
    }
    if (elementBottom) {
        if ($(elementBottom).css("display") == "none") {
            $(element).css("bottom", "0");
        } else {
            $(element).css("bottom", $(elementBottom).outerHeight(true));
        }
    }
    if (elementLeft) {
        if ($(elementLeft).css("display") == "none") {
            $(element).css("left", "0");
        } else {
            $(element).css("left", $(elementLeft).outerWidth(true));
        }
    }
}




/* 计算元素总宽度*/
function sumWidth(target){
    return $(target).width()+parseFloat($(target).css("margin-left"))+parseFloat($(target).css("margin-right"))+parseFloat($(target).css("padding-left"))+parseFloat($(target).css("padding-right"));
}
/* 计算元素总高度*/
function sumHeight(target){
    return $(target).height()+parseFloat($(target).css("margin-top"))+parseFloat($(target).css("margin-bottom"))+parseFloat($(target).css("padding-top"))+parseFloat($(target).css("padding-bottom"));
}

/*====================
 获取标准URL的参数
 ====================*/
function GetRequest() {
    var url = window.location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}


/*====================
 平滑滚动置顶
 ====================*/
function backTop(target){
    $(window).scroll(function(){
        if ($(window).scrollTop()>300){
            $(target).parent().fadeIn(500);
        } else {
            $(target).parent().fadeOut(500);
        }
    });
    $(target).click(function () {
        //alert(123);
        var href = $(this).attr("href");
        var pos = $(href).offset().top;
        $("html,body").animate({ scrollTop: pos}, 1000);
        return false;
    });
}

//得到焦点
function GetFocus(t,value){
    t.val(t.val() == value ? "" : t.val());
    t.parent().addClass("selected");
}
//失去焦点
function RemoveFocus(t,value){
    t.val(t.val() == "" ? value : t.val());
    t.parent().removeClass("selected");

}