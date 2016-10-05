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
		console.log('destroy: '+cur);
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
		console.log("imageLoadComplete: "+index);
	});
	gallery.listen('gettingData', function(index, item) {
		// index - index of a slide that was loaded
		// item - slide object
		console.log("gettingData: "+index);
	});
	gallery.listen('beforeChange', function() {
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
			lists = data;
			console.log("load list.json finished: "+lists.length);
			loadsize = Math.min(lists.length, starthnum*startvnum)
			console.log("loadsize: " + loadsize);
			$("#Reaky-Gallery").empty()
			for (var i = 0; i < loadsize; i++) { 
				items.push({
					src: '//7xrst7.com1.z0.glb.clouddn.com/'+lists[i][0], 
					w: lists[i][1],
					h: lists[i][2]
				});
				$('<a id='+i+' href=//7xrst7.com1.z0.glb.clouddn.com/'+encodeURIComponent(lists[i][0])+'><img src=//7xrst7.com1.z0.glb.clouddn.com/'+encodeURIComponent(lists[i][0].split(".")[0]+'_thumb.'+lists[i][0].split(".")[1])+' alt='+lists[i][0]+' /></a>').appendTo("#Reaky-Gallery").click(function(e){
					var cur = parseInt($(this).attr('id'));
					openPhotoSwipe(items, cur);
					return false;
				});
			}
		},
		error: function (err) {
			console.log("load list.json failed");
			console.log(err);
		}
	});
	$("#loadmore").click(function(){
		var len = $("#Reaky-Gallery").children().length;
		if (len >= lists.length) {
			console.log("no more")
			return
		}
		loadsize = Math.min(lists.length, len+5)
		console.log("loadsize: " + loadsize);
		for (var i = len; i < loadsize; i++) { 
				items.push({
					src: '//7xrst7.com1.z0.glb.clouddn.com/'+lists[i][0], 
					w: lists[i][1],
					h: lists[i][2]
				});
				$('<a id='+i+' href=//7xrst7.com1.z0.glb.clouddn.com/'+encodeURIComponent(lists[i][0])+'><img src=//7xrst7.com1.z0.glb.clouddn.com/'+encodeURIComponent(lists[i][0].split(".")[0]+'_thumb.'+lists[i][0].split(".")[1])+' alt='+lists[i][0]+' /></a>').appendTo("#Reaky-Gallery").click(function(e){
					var cur = parseInt($(this).attr('id'));
					openPhotoSwipe(items, cur);
					return false;
				});
		}
	});
	$("#Header").dblclick(function(){
		var len = $("#Reaky-Gallery").children().length;
		items.reverse();
		for (var i = 0; i < loadsize; i++) { 
			$("#Reaky-Gallery > a:eq("+(loadsize-1-i)+")").appendTo("#Reaky-Gallery").unbind('click').click(function(e){
				var cur = parseInt($(this).attr('id'));
				console.log('clicked: '+cur)
				openPhotoSwipe(items, loadsize-1-cur);
				return false;
			});
		}
	});
	$("#Header").click(function(){
		lists.reverse();
		items = [];
		console.log("list.json reversed: "+lists.length);
		loadsize = Math.min(lists.length, starthnum*startvnum)
		console.log("loadsize: " + loadsize);
		$("#Reaky-Gallery").empty()
		for (var i = 0; i < loadsize; i++) { 
			items.push({
				src: '//7xrst7.com1.z0.glb.clouddn.com/'+lists[i][0], 
				w: lists[i][1],
				h: lists[i][2]
			});
			$('<a id='+i+' href=//7xrst7.com1.z0.glb.clouddn.com/'+encodeURIComponent(lists[i][0])+'><img src=//7xrst7.com1.z0.glb.clouddn.com/'+encodeURIComponent(lists[i][0].split(".")[0]+'_thumb.'+lists[i][0].split(".")[1])+' alt='+lists[i][0]+' /></a>').appendTo("#Reaky-Gallery").click(function(e){
				var cur = parseInt($(this).attr('id'));
				openPhotoSwipe(items, cur);
				return false;
			});
		}
	});
	$(window).scroll(function(){
		var len = $("#Reaky-Gallery").children().length;
		if(len < loadsize) {
			console.log("wait load finish");
			return
		}
		//alert($(window).scrollTop()+"/"+$(document).height()+"/"+$(window).height());
		if($(window).scrollTop()+1 >= $(document).height() - $(window).height()){
			console.log("scrolled to end!");
			$("#loadmore").trigger("click");
		}
	});
	$('#upload-form-old').submit(function(e){
		console.log('upload ajax submit');
		$.ajax({
			url: "/upload",
			type: "POST",
			//data: $('#upload-form').serialize(),
			//data: new FormData(this),
			data: new FormData($('#upload-form')[0]),
			success: function(data) {
				console.log("Upload successful!");
				alert("Upload successful!");
				setTimeout(function() {
					$.ajax({
						url: 'list.json',
						dataType: "json",
						success: function (data) {
							lists = data;
							items = [];
							console.log("reload list.json finished: "+lists.length);
							loadsize = Math.min(lists.length, starthnum*startvnum)
							console.log("loadsize: " + loadsize);
							$("#Reaky-Gallery").empty()
							for (var i = 0; i < loadsize; i++) { 
								items.push({
									src: '//7xrst7.com1.z0.glb.clouddn.com/'+lists[i][0], 
									w: lists[i][1],
									h: lists[i][2]
								});
								$('<a id='+i+' href=//7xrst7.com1.z0.glb.clouddn.com/'+encodeURIComponent(lists[i][0])+'><img src=//7xrst7.com1.z0.glb.clouddn.com/'+encodeURIComponent(lists[i][0].split(".")[0]+'_thumb.'+lists[i][0].split(".")[1])+' alt='+lists[i][0]+' /></a>').appendTo("#Reaky-Gallery").click(function(e){
									var cur = parseInt($(this).attr('id'));
									openPhotoSwipe(items, cur);
									return false;
								});
							}
						},
						error: function (err) {
							console.log("reload list.json failed");
							console.log(err);
						}
					});
				},1000*60);
			},
			error: function(request) {
				alert("something error happeded!");
			},
			cache: false,
			contentType: false,
			processData: false
		});
		e.preventDefault();
	});
	$('#upload').uploadifive({
		'auto' : true,
		'fileObjName': 'upload',
		'queueID': 'queue',
		'buttonText': 'Upload',
		'uploadScript' : '/upload',
		'onUploadComplete': function(file, data) { console.log('Feedback: '+data); }
	});
});
