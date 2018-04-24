/**
 * Created by 周瓛 on 2016/3/4.
 */

/*==========================
    表单
===========================*/
function customForm() {
    /*点击监控事件*/
    $("body").on("click", ".form-radio input[type='radio']", function () {
        var name= $(this).attr("name");
        $("input[type='radio'][name="+name+"]").removeAttr("checked");
        $(this).attr("checked","checked");

    });
    $("body").on("click", ".form-checkbox input[type='checkbox']", function () {
        if($(this).attr("checked")){
            $(this).removeAttr("checked");
        }else{
            var name= $(this).attr("name");
            $(this).attr("checked",'true');
        }
    });
    $("body").on("click", ".form-switch input[type='checkbox']", function () {
        if($(this).is("[checked='checked']")){
            $(this).removeAttr("checked");
        }else{
            var name= $(this).attr("name");
            $(this).attr("checked","checked");
        }
    });


}

/*多选列表*/
function checkControl(container,params) {
    var defaults = {
        checkCountClass:".check-control-count",  //已选个数ClassName
        checkAllClass:".check-control-CheckAll",  //全选ClassName
        checkInvertClass:".check-control-CheckInvert",  //反选ClassName
        checkClearClass:".check-control-CheckClear",  //清空ClassName
        textBoxClass:".check-control-text",  //输出文本ClassName
        checkGroupClass:".check-control-group",  //多选列表ClassName
        checkboxClass:".form-checkbox",  //多选框ClassName
        showRows:8,// 多选列表显示行
        rowHeight:23,// 行高
        overflow:"auto"//visible不裁剪，auto自动裁剪   同CSS

    }
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

    var c = this;
    //容器$(".check-control")
    c.container=$(container);
    if (c.container.length === 0) return;
    if (c.container.length > 1) {
        c.container.each(function () {
            new checkControl(this,params);
        });
        return;
    }
    c.params = params;// 参数

    c.checkCount=c.container.find(c.params.checkCountClass);//已选个数
    c.textBox=c.container.find(c.params.textBoxClass);//输出文本
    c.checkGroup = c.container.children(c.params.checkGroupClass);// 多选列表
    c.checkbox=c.checkGroup.find(c.params.checkboxClass);//多选框
    c.checkControlName=c.textBox.attr("name");//多选列表控件的统一name

    c.checkGroupHeight=c.params.rowHeight*c.params.showRows;



    /*--------------方法--------------*/
    c.checkValue=function () {//获取选中的值
        var str="";
        var count=0;
        c.checkGroup.find("[name='"+c.checkControlName+"']").each(function(){
            if($(this).context.checked==true){
                str+=$(this).val()+",";
                count++;
            }
            //alert($(this).val());
        });
        c.checkedCount=count;
        return str;
        //return str.substr(0,str.length-1);
    };
    c.updateTextBox=function () {//更新输出文本内的值
        var val=c.checkValue();
        if(val.substr(val.length-1)==","){
            val=val.substr(0,val.length-1);
        }
        c.textBox.text(val);

    };
    c.updateCheckCount=function () {//更新已选个数
        c.checkCount.text(c.checkedCount);

    };
    c.checkAll=function(){//全选
        c.checkGroup.find("[name='"+c.checkControlName+"']").each(function(){
            $(this).context.checked=true;
        });
        c.updateTextBox();
        c.updateCheckCount();
    }
    c.checkInvert=function(){//反选
        c.checkGroup.find("[name='"+c.checkControlName+"']").each(function(){
            if($(this).context.checked==true){
                $(this).context.checked=false;
            }else{
                $(this).context.checked=true;
            }

        });
        c.updateTextBox();
        c.updateCheckCount();
    }
    c.checkClear=function(){//清空

        c.checkGroup.find("[name='"+c.checkControlName+"']").each(function(){
            $(this).context.checked=false;
        });
        c.updateTextBox();
        c.updateCheckCount();
    }

    /*点击事件*/
    c.container.on("click", "input[type='checkbox'][name='"+c.checkControlName+"']", function () {
        c.updateTextBox();
        c.updateCheckCount();
    });
    //全选
    c.container.on("click",c.params.checkAllClass, function () {
        c.checkAll();
    });
    //反选
    c.container.on("click",c.params.checkInvertClass, function () {
        c.checkInvert();
    });
    //清空
    c.container.on("click",c.params.checkClearClass, function () {
        c.checkClear();//alert(c.checkbox.height());
    });


    /*============
     初始化
     =============*/
    c.init = function () {
        c.updateTextBox();
        c.updateCheckCount();

        c.checkGroup.height(c.checkGroupHeight);
    }
    c.init();

}
/*=====================
*       下拉
*======================*/
+function($){
    $(window).on('load', function () {
        if($(".filterbar-combox").is(".dropdown")){
            var myComboxControl=new comboxControl(".filterbar-combox.dropdown",{});


        }
    });
    function comboxControl(container,params){
        var defaults = {
            //comboxContainerClass:".filterbar-combox",  //容器ClassName
            comboxBtnClass:".form-combox-btn",  //主体ClassName
            comboxGroupClass:".form-combox-group",  //下拉组ClassName
            comboxListClass:".form-combox-list",  //下拉列表ClassName
            comboxSearchClass:".form-combox-search",  //搜索ClassName
            comboxPaginationClass:".form-combox-pagination"  //分页ClassName
            //,comboxPagePrevClass:".form-combox-prev",  //上一页ClassName
            //comboxPageNextClass:".form-combox-next"  //下一页ClassName
        }
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

        var c = this;
        //容器
        c.container=$(container);
        if (c.container.length === 0) return;
        if (c.container.length > 1) {
            c.container.each(function () {
                new comboxControl(this,params);
            });
            return;
        }
        c.params = params;// 参数
        c.comboxBtn=c.container.find(c.params.comboxBtnClass);//主体
        c.comboxGroup=c.container.find(c.params.comboxGroupClass);//下拉组
        c.comboxList=c.container.find(c.params.comboxListClass);//下拉列表
        c.comboxSearch=c.container.find(c.params.comboxSearchClass);//搜索
        c.comboxPagination=c.container.find(c.params.comboxPaginationClass);//分页
        c.comboxListLi=c.comboxList.children("li");//下拉列表
        c.comboxCount=parseInt(c.comboxBtn.attr("combox-count")?c.comboxBtn.attr("combox-count"):0);//总数
        c.comboxNum=parseInt(c.comboxBtn.attr("combox-num")?c.comboxBtn.attr("combox-num"):10);//每页个数

        c.add=function () {
            c.comboxList.before('<div class="form-combox-search"><input type="text" class="form-control" placeholder="搜索" value=""/></div>');
            c.comboxList.after('<div class="form-combox-pagination input-group input-group-sm"><span class="input-group-btn"><button class="btn btn-default" type="button"><</button></span><input type="text" class="form-control" value="1"/><span class="input-group-btn"><button class="btn btn-default" type="button">></button></span></div>');
        };

        c.initClass=function () {
            if(c.comboxGroup.length){
                //获取comboxListLi高度
                if(c.comboxGroup.is(":hidden")){
                    c.comboxGroup.addClass("v-hide show");
                    c.comboxListLiHeight=c.comboxListLi.outerHeight(true);
                    c.comboxGroup.removeClass("v-hide show");
                }else{
                    c.comboxListLiHeight=c.comboxListLi.outerHeight(true);
                }
                //设置comboxList高度
                if(c.comboxListLi.length>c.comboxNum){
                    c.comboxList.height(c.comboxNum*c.comboxListLiHeight);
                }

                var o=c.container.offset();
                var bodyHeight=$("body").height();
                var comboxGroupHeight=c.comboxGroup.outerHeight(true);
                var objHeight=o.top+comboxGroupHeight+c.container.outerHeight(true);
                //下拉显示不全改 上拉
                if(objHeight>bodyHeight){
                    c.comboxGroup.addClass("alignBottom");
                }
                // 每页个数 > 总数 ,隐藏搜索、分页
                if(c.comboxNum>c.comboxCount){
                    c.comboxSearch.addClass("hide");
                    c.comboxPagination.addClass("hide");
                }
            }
        };

        /*============
         初始化
         =============*/
        c.init = function () {
            c.initClass();
            c.container.on("click",c.params.comboxListClass+" li", function () {
                var selectedValue=$(this).text();
                var selectedId=$(this).attr("form-combox-value");
                c.comboxBtn.text(selectedValue);
                c.comboxBtn.attr("selectedId",selectedId);

            });

        };
        c.init();





    }

}(jQuery)





