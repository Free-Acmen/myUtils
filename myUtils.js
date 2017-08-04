/**
 *常用方法封装
*/

var Utils = {
	/*
	 * 移动端方面
	 * 解决移动端弹出层,穿透滑动body问题
	 * css样式 .modal-open{position:fixed;width:100%;}
	*/
	modalOpen: (function(bodyCls){
		var scrollTop;
		return {
			afterOpen: function() {
				scrollTop = $(document).scrollTop();
				document.body.classList.add(bodyCls);
				document.body.style.top = -scrollTop + 'px';
			},
			beforeClose: function() {
				document.body.classList.remove(bodyCls);
				$(document).scrollTop(scrollTop);
			}
		};
		
	}("modal-open"))

}