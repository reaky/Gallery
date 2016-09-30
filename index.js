var lists=[], items=[];
var starthnum = Math.ceil($(window).height()/206);
var startvnum = Math.floor($(window).width()/206);
var loadsize = 0;
console.log(startvnum+'/'+starthnum);

function baseName(str) {
    var base;
    if(str.lastIndexOf(".") != -1)       
        base = str.substring(0, str.lastIndexOf("."));
    return base;
}
//console.log(baseName('IMG_sdf.jpg'));

var openPhotoSwipe = function(items, pid) {
	var pswpElement = document.querySelectorAll('.pswp')[0];

	items = arguments[0];
	pid = arguments[1] || 0;
	// define options (if needed)
	var options = {
		index: pid,
		history: true,
		loop: false,
		focus: true,
		bgOpacity: 0.85,
		mainClass: 'pswp--minimal--dark',
		barsSize: {top:0,bottom:0},
		tapToClose: true,
		tapToToggleControls: false,
		captionEl: false,
		fullscreenEl: true,
		shareEl: false
	};
	var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
	gallery.listen('destroy', function() {
		var cur = gallery.getCurrentIndex();
		console.log(cur);
		//$.scrollTo('#'+gallery.getCurrentIndex());
		//$.scrollTo('#'+cur,500);
		$('#'+cur+' > img').animate({opacity: 0}, speed="normal");
		$('#'+cur+' > img').animate({opacity: 1}, speed="fast");
		$('#'+cur+' > img').animate({opacity: 0}, speed="normal");
		$('#'+cur+' > img').animate({opacity: 1}, speed="fast");
		$('#'+cur+' > img').animate({opacity: 0}, speed="normal");
		$('#'+cur+' > img').animate({opacity: 1}, speed="fast");
	});
	gallery.listen('imageLoadComplete', function(index, item) { 
		// index - index of a slide that was loaded
		// item - slide object
		console.log("imageLoadComplete"+index);
	});
	gallery.listen('gettingData', function(index, item) {
		// index - index of a slide that was loaded
		// item - slide object
		console.log("gettingData"+index);
	});
	gallery.listen('beforeChange', function() {
		console.log("beforeChange");
		var cur = gallery.getCurrentIndex();
		var len = $("#Reaky-Gallery").children().length;
		console.log(cur+"/"+len);
		if(cur > len-2) {
			$("#loadmore").trigger("click");
		}
	});
	gallery.init();
};

$(document).ready(function(){
	$.ajax({
		url: 'list.json',
		dataType: "json",
		success: function (data) {
			console.log("load list.json finished");
			lists = data;
			loadsize = Math.min(lists.length, starthnum*startvnum)
			console.log("loadsize: " + loadsize);
			for (var i = 0; i < loadsize; i++) { 
				items.push({
					//src: 'photos/'+lists[i], 
					src: '//7xrst7.com1.z0.glb.clouddn.com/'+lists[i], 
					w: 800,
					h: 600
				});
				//$('<a id='+i+' href='+encodeURIComponent('photos/'+lists[i])+'><img src='+encodeURIComponent('photos/thumb/'+lists[i].split(".")[0]+'_thumb.'+lists[i].split(".")[1])+' alt='+lists[i]+' /></a>').appendTo("#Reaky-Gallery").click(function(e){
				$('<a id='+i+' href=//7xrst7.com1.z0.glb.clouddn.com/'+encodeURIComponent(lists[i])+'><img src=//7xrst7.com1.z0.glb.clouddn.com/'+encodeURIComponent(lists[i].split(".")[0]+'_thumb.'+lists[i].split(".")[1])+' alt='+lists[i]+' /></a>').appendTo("#Reaky-Gallery").click(function(e){
					var cur = parseInt($(this).attr('id'));
					openPhotoSwipe(items, cur);
					return false;
				//	openPhotoSwipe(items, $(e.target).parent().attr('id'));
				//	console.log($(e.target).parent().attr('id'));
				//	return false;
				});
				console.log('insert finished'+i);
				console.log($('#Reaky-Gallery > #'+i+' > img')[0]);
				//console.log($('#Reaky-Gallery > a:first> img:last')[0]);
				EXIF.getData($('#Reaky-Gallery > #'+i+' > img')[0], function(){
					console.log("in EXIF.getData");
					console.log(this);
					console.log($(this).parent().attr('id'));
					//console.log(EXIF.pretty(this));
					console.log(EXIF.getTag(this, "PixelXDimension"));
					console.log(EXIF.getTag(this, "PixelYDimension"));
					items[$(this).parent().attr('id')].w = EXIF.getTag(this, "PixelXDimension");
					items[$(this).parent().attr('id')].h = EXIF.getTag(this, "PixelYDimension") 
				});
			}
			//$('#Reaky-Gallery > a').each(function() {
			//	$(this).click(function(e){
			//		var cur = parseInt($(this).attr('id'));
			//		openPhotoSwipe(items, cur);
			//		return false;
			//	});
			//});
		},
		error: function (err) {
			console.log("load list.json failed");
			console.log(err);
		}
	});
	$("#loadmore").click(function(){
		var len = $("#Reaky-Gallery").children().length;
		if (len+5 > lists.length) {
			console.log("no more")
			return
		}
		for (var i = len; i < len+5; i++) { 
				items.push({
					//src: 'photos/'+lists[i], 
					src: '//7xrst7.com1.z0.glb.clouddn.com/'+lists[i], 
					w: 800,
					h: 600 
				});
				//$('<a id='+i+' href='+encodeURIComponent('photos/'+lists[i])+'><img src='+encodeURIComponent('photos/thumb/'+lists[i].split(".")[0]+'_thumb.'+lists[i].split(".")[1])+' alt='+lists[i]+' /></a>').appendTo("#Reaky-Gallery").click(function(e){
				$('<a id='+i+' href=//7xrst7.com1.z0.glb.clouddn.com/'+encodeURIComponent(lists[i])+'><img src=//7xrst7.com1.z0.glb.clouddn.com/'+encodeURIComponent(lists[i].split(".")[0]+'_thumb.'+lists[i].split(".")[1])+' alt='+lists[i]+' /></a>').appendTo("#Reaky-Gallery").click(function(e){
					//console.log($(e.target).parent().attr('id'));
					//console.log($(this).attr('id'));
					var cur = parseInt($(this).attr('id'));
					openPhotoSwipe(items, cur);
					return false;
				});
				console.log('insert finished'+i);
				console.log($('#Reaky-Gallery > #'+i+' > img')[0]);
				EXIF.getData($('#Reaky-Gallery > #'+i+' > img')[0], function(){
					var index = $(this).parent().attr('id');
					console.log(this);
					console.log(index);
					//console.log(EXIF.pretty(this));
					console.log(EXIF.getTag(this, "PixelXDimension"));
					console.log(EXIF.getTag(this, "PixelYDimension"));
					items[index].w = EXIF.getTag(this, "PixelXDimension");
					items[index].h = EXIF.getTag(this, "PixelYDimension") 
				});
		}
	});
	$(window).scroll(function(){
		var len = $("#Reaky-Gallery").children().length;
		if(len < loadsize-1) {
			console.log("wait load finish");
			return
		}
		//alert($(window).scrollTop()+"/"+$(document).height()+"/"+$(window).height());
		if($(window).scrollTop() >= $(document).height() - $(window).height()){
			console.log("scrolled to end!");
			$("#loadmore").trigger("click");
		}
	});

});
