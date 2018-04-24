
//生成进度条方法
(function($) {
	$.fn.progressBar = function(i) {

	}
})(jQuery);
$(function() {
	var c = $('[data-type="progressbar"]');
	animateEle();
	/*$(window).scroll(function() {
		animateEle()
	});*/

	function animateEle() {
		/*var b = {
			top: $(window).scrollTop(),
			bottom: $(window).scrollTop() + $(window).height()
		};*/
		c.each(function() {
			//if (b.top <= $(this).offset().top && b.bottom >= $(this).offset().top && !$(this).data('bPlay')) {
			if (true) {
				var $t=$(this);
				$t.data('bPlay', true);
				var a = parseFloat($t.attr("aria-valuenow")?$t.attr("aria-valuenow"):0)
					,bg=$t.attr("bar-bgColor")?$t.attr("bar-bgColor"):"#ffe9ad"
					,c=$t.attr("bar-color")?$t.attr("bar-color"):"#f8b600"
					,bw=parseInt($t.attr("bar-border")?$t.attr("bar-border"):0)
					,sw=parseInt($t.attr("bar-stroke-width")?$t.attr("bar-stroke-width"):12)
					,s=parseFloat($t.attr("aria-valuemax")?$t.attr("aria-valuemax"):100)
					,p=(a/s*100)
					,w=$t.width();
					p=p<100?p:100;

				if (a||a===0) {
					$t.parent().css({"background":bg ,"height":sw+"px"});
					$t.css({"background-color":c ,"height":sw+"px","width":p+"%"});
				}
				if(bw>0){
					$t.parent().css({"border":bw+"px solid "+c});
				}

			}
		})
	}
});
