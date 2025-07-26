(function($) {

	var nav_btn = ".nav_btn";
	var sp_nav = ".gnavi";

	$(window).on("load",function(){
		$("body").addClass("loaded");
	});
		
	$(function() {

		var is_mobile =false;
		var is_smp =false;
		var is_retina =false;
		var is_ie =false;
		
		var ua = navigator.userAgent.toLowerCase();
		
		if ( ua.indexOf('iphone') > 0 || ua.indexOf('ipad') > 0 || ua.indexOf('ipod') > 0 || ua.indexOf('android') > 0) { 
			is_mobile =true;
			$("body").addClass("mobile");
		}
		if ( ua.indexOf('iphone') > 0 || ua.indexOf('android') > 0) { 
			is_smp =true;
			$("body").addClass("smp");
		}
		if ( window.devicePixelRatio >= 2) { 
			is_retina =true;
			$("body").addClass("retina");
		}
		if ( ua.indexOf('trident') > 0) { 
			is_ie =true;
			$("body").addClass("ie");
		}

		$("a").each(function(){
			var urlLink = location.href;
			if(urlLink.substr( urlLink.length-1) ==="/" ){
				urlLink = urlLink+"index.html";
			}
			var tgLink = $(this).prop("href");
			if ( tgLink === urlLink ) {
				$(this).addClass("cr");
			} else if (0 <= urlLink.search(tgLink)) {
				$(this).addClass("cr");
			} else if (0 <= urlLink.search("lineup")) {
				if ( 0 <= tgLink.search("list") && $(this).parents().hasClass("submenu") ) {
					$(this).addClass("cr");
				}
			}
		});

		//nav:

		$(document).on("click",nav_btn,function() {
			$(sp_nav).stop().slideToggle('normal');
			$("body").toggleClass("nav_open");
			
			/*▼ナビをプルダウンではない形にする場合は下記コメントアウトを削除＆CSSで装飾
				上記の$(sp_nav).stop()～をコメントアウト*/
			//$(".gnavi_wrap").toggleClass("nav_open");
		});

		$(window).on("resize",function(){
			$(sp_nav).attr("style", "");
			$("body").removeClass("nav_open");
			
			/*▼ナビをプルダウンではない形にする場合は下記コメントアウトを削除＆CSSで装飾
				上記の$(sp_nav).attr～をコメントアウト*/
			//$(".gnavi_wrap").removeClass("nav_open");
		});

		//ロールオーバー
				
		$(".fadeimg, .gnavi>li img").each(function() {
			$(this).wrap("<span class='fadeimg_wrap'></span>");
			var This = $(this);
			var Parent = $(this).parent("span.fadeimg_wrap");
			$(this).addClass("off");
			Parent.append(Parent.find("img.off").clone(true).removeClass("off").addClass("on"));
			var onsrc =  Parent.find("img.on").attr("src").replace(new RegExp('(_on)?(\.gif|\.jpg|\.webp|\.png)$'), "_on$2");
			Parent.find("img.on").attr("src", onsrc);
		});

		//スクロール処理
				
		$(window).on("scroll load", function(){
			var scr = $(this).scrollTop();
			$("*[data-scrollbreak]").each(function(){
				var scr_break = $(this).data("scrollbreak");
				if(String(scr_break).indexOf("%") != -1){
					scr_break = parseInt(scr_break) / 100 * $(window).height();
				}
				if(scr > scr_break){
					$(this).addClass("scrolled");
				}else{
					$(this).removeClass("scrolled");
				}
			});
		});

		//ページ内リンク 慣性スクロール
		var s_position = 120;

		$(window).on("load",function(){
			if ($("body").hasClass("mobile")){ 
				s_position = s_position / 2;
			}
		});

		$(window).on("load scroll",function(){
			var scr = $(window).scrollTop();
			/*	下記「65」の数値は適宜変更	*/
			if(scr >= 65 && !$("body").hasClass("scrolled") ){
				$("body").addClass("scrolled")
			} else if(scr < 65 && $("body").hasClass("scrolled") ){
				$("body").removeClass("scrolled")
			}

			$(".parallax:not(.p-show)").each(function(){
				if(($(this).offset().top)-($(window).height()-s_position) <= scr && !$(this).hasClass("p-show") ){
					var delay = 0;
					if($(this).data("p-delay")){
					   delay = $(this).data("p-delay");	   
					}
					$(this).delay(delay).queue(function(){
						$(this).addClass("p-view").dequeue();
					})
				}
			});

			$(".p-parent:not(.p-view)").each(function(){
				var Parent = this;
				if(($(Parent).offset().top)-($(window).height()-p_play) <= scr && !$(Parent).hasClass("p-view") ){
					$(Parent).addClass("p-view");
					var delay = 0;
					if($(Parent).data("p-delay")){
					   delay = $(Parent).data("p-delay");	   
					}
					$(Parent).find(".p-child:visible").each(function(i){
						var Child = this;
						$(Child).delay(delay*i).queue(function(){
							$(Child).addClass("p-view").dequeue();
						});
					});
				}
			});

		});
		
		var head_h = 0;
		
		$(window).on("load resize",function(){
			head_h = $("header").innerHeight();
			$(".wrap").css("padding-top",head_h);
		});
		
		$("a[href*='#']:not(.noscrolllink)").on("click",function(){
			head_h = $("header").innerHeight();
			var Hash = $(this.hash);
			var HashOffset = $(Hash).offset().top;
			$("html,body").stop().animate({scrollTop: HashOffset - head_h}, 500);
			return false;
		});
		
		//popup

		$(document).on("click","a.popup",function(){
			window.open(this.href,'null','scrollbars=yes,resizable=yes,width=750,height=800');
			return false;
		});
		$(document).on("click","a.popup_map",function(){
			window.open(this.href,'null','scrollbars=yes,resizable=yes,width=750,height=800');
			return false;
		});

		//rwdImageMaps
		$('img[usemap]').rwdImageMaps();


		if (is_mobile || is_retina) { 
			$("img.2x").each(function() {
				var originalSrc = $(this).attr("src");
				var originalExtensionMatch = originalSrc.match(/(\.gif|\.jpg|\.webp|\.png)$/);
				var originalExtension = originalExtensionMatch ? originalExtensionMatch[0] : '';
				var newSrcset = originalSrc.replace(new RegExp('(@2x)?(\.gif|\.jpg|\.webp|\.png)(\\?.*)?$'), "@2x$2$3") + " 2x";
				$(this).attr("srcset", newSrcset);
			});
		}
		
		function viewportSet() {
			var viewport = $("meta[name='viewport']").attr("content");
			var wsw = window.screen.width;
			if (wsw > 375) {
				var value = "width=device-width,initial-scale=1";
			}else{
				var value = "width=375";
			}
			if (viewport !== value) {
					$("meta[name='viewport']").attr("content", value);
			}
		}
		$(window).on("resize orientationchange", viewportSet);
		$(viewportSet);

	});

	$.fn.matchWidth = function(breakpoint) {
		if(breakpoint==null || window.matchMedia("(max-width:"+breakpoint+"px)").matches ){
			var array = [];
			var This = this;
			var mw_length = $(this).length;
			$(this).each(function(i){
				var img = new Image();
				img.src = $(this).attr('src');
				img.onload = function () {
					var width  = img.width ;
					array.push(width);
					 if (i+1 === mw_length) {
						var arr_max = Math.max.apply(null,array);
						if(arr_max != 0){
							$(This).each(function(j){
								var max = Math.round(array[j] / arr_max *10000)/100;
								$(this).css("max-width",max+"%");
							});
						}
					}				
				}
			});
		}
	}

})(jQuery);