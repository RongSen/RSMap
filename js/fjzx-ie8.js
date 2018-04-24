/**
 * Created by 周瓛 on 2016/4/23.
 */
$(function(){
	$(".form-checkbox input:checkbox").click(function(){
		var $thisCheckbox = $(this);
		if($thisCheckbox.is(":checked")){
			$thisCheckbox.next().addClass("checked");	
		}else{
			$thisCheckbox.next().removeClass("checked");	
		}
	});
	
	$(".form-checkbox input:checkbox").focus(function(){
		var $thisCheckbox = $(this);
		$thisCheckbox.next().addClass("focus");	
	});
	
	$(".form-checkbox input:checkbox").blur(function(){
		var $thisCheckbox = $(this);
		$thisCheckbox.next().removeClass("focus");	
	});

	/*====================
	 得到焦点，失去焦点
	 ==========================*/
	/*
	$("input[placeholder]").each(function(){
		var placeholder = $(this).attr("placeholder");
		$(this).val(placeholder);
	});
	*/
});