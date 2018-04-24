
//首页+产品列表页进度条
(function($) {
	$.fn.svgCircle = function(i) {
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
		return this.each(function() {
			var e = i.parent;
			if (!e) return false;
			var w = i.w;
			var r = Raphael(e, w, w),
				R = i.R,
				init = true,
				param = {
					stroke: "#f2dab1"
				},
				hash = document.location.hash,
				marksAttr = {
					fill: hash || "#444",
					stroke: "none"
				};
			r.customAttributes.arc = function(b, c, R) {
				var d = 360 / c * b,
					a = (90 - d) * Math.PI / 180,
					x = w / 2 + R * Math.cos(a),
					y = w / 2 - R * Math.sin(a),
					color = i.color,
					path;
				if (c == b) {
					path = [
						["M", w / 2, w / 2 - R],
						["A", R, R, 0, 1, 1, w / 2 - 0.01, w / 2 - R]
					]
				} else {
					path = [
						["M", w / 2, w / 2 - R],
						["A", R, R, 0, +(d > 180), 1, x, y]
					]
				}
				return {
					path: path
				}
			};
			//bg
			var f = r.path().attr({
				stroke: i.bgColor,
				"stroke-width": i.sW
			}).attr({
				arc: [100, 100, R]
			});
			var g = r.path().attr({
				stroke: "#f36767",
				"stroke-width": i.sW
			}).attr(param).attr({
				arc: [0.01, i.speed, R]
			});
			var h;
			if (i.perent[1] > 0) {
				setTimeout(function() {
					g.animate({
						stroke: i.color[1],
						arc: [i.perent[1], 100, R]
					}, 900, ">")
				}, i.delay)
			} else {
				g.hide()
			}
			//text
			var textBox=function(){

			};

		})
	}
})(jQuery);
$(function() {
	var c = $('.processingbar');
	animateEle();
	/*$(window).scroll(function() {
		animateEle()
	});*/

	function animateEle() {
		var b = {
			top: $(window).scrollTop(),
			bottom: $(window).scrollTop() + $(window).height()
		};
		c.each(function() {
			//if (b.top <= $(this).offset().top && b.bottom >= $(this).offset().top && !$(this).data('bPlay')) {
			if (true) {
				var $t=$(this);
				$t.data('bPlay', true);
				var a = $t.children('font').attr("bar-data").replace(/\%/, '')
					,bg=$t.attr("bar-bgColor")?$t.attr("bar-bgColor"):"#ffe9ad"
					,c=$t.attr("bar-color")?$t.attr("bar-color"):"#f8b600"
					,sw=parseInt($t.attr("bar-stroke-width")?$t.attr("bar-stroke-width"):5)
					,w=$t.width();
				if ($t.find("font").text() !== "0%" && a != "0") {
					$t.svgCircle({
						parent: $t[0],
						w: w,
						R: w/2-sw/2-2,
						sW: sw,
						bgColor: bg,
						color: [c, c, c],
						perent: [100, a],
						speed: 150,
						delay: 400
					})
				}
				if($(this).attr("bar-font")=="auto"){
					var mt="-"+$(this).children('font').height()/2+"px";
					//console.log(mt);
					$(this).find("font").css({"color": c, "top":"50%","margin-top":mt});
				}
				if (a == "0") {
					$t.find("font").css("color", "#a9a9a9");
					$t.svgCircle({
						parent: $t[0],
						w: w,
						R: w/2-sw/2-2,
						sW: sw,
						bgColor: bg,
						color: ["#d1d1d1", "#d1d1d1", "#d1d1d1"],
						perent: [100, a],
						speed: 150,
						delay: 400
					})
				}
			}
		})
	}
});
var pie = {
	run: function(a) {
		if (!a.id) throw new Error("must be canvas id.");
		var b = document.getElementById(a.id),
			ctx;
		if (b && (ctx = b.getContext("2d"))) {
			b.width = b.height = "200";
			var c = function() {};
			var d = a.onBefore || c;
			var e = a.onAfter || c;
			d(ctx);
			ctx.fillStyle = a.color || '#f1dab0';
			var f = a.step || 1;
			var g = a.delay || 10;
			var i = 0,
				rage = 360 * (a.percent || 0);
			var h = -Math.PI * 0.5;
			var j = function() {
					i = i + f;
					if (i <= rage) {
						ctx.beginPath();
						ctx.moveTo(100, 100);
						ctx.arc(100, 100, 100, h, Math.PI * 2 * (i / 360) + h);
						ctx.fill();
						setTimeout(j, g)
					} else {
						e(ctx)
					}
				};
			j()
		}
	}
};