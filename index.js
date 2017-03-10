$(document).ready(function(){
	var lists=[], items=[];
	var starthnum = Math.ceil($(window).height()/206);
	var startvnum = Math.floor($(window).width()/206);
	var loadsize = 0;
	var siteurl = "//7xrst7.com1.z0.glb.clouddn.com/";

	function baseName(str) {
	    var base;
	    if(str.lastIndexOf(".") != -1)       
		base = str.substring(0, str.lastIndexOf("."));
	    return base;
	}
	//console.log(baseName('IMG_sdf.jpg'));

	var photoswipeParseHash = function() {
		var hash = window.location.hash.substring(1),
			params = {};
		if(hash.length < 5) { // pid=1
			return params;
		}
		var vars = hash.split('&');
		for (var i = 0; i < vars.length; i++) {
			if(!vars[i]) {
				continue;
			}
			var pair = vars[i].split('=');  
			if(pair.length < 2) {
				continue;
			}           
			params[pair[0]] = pair[1];
		}
		if(params.gid) {
			params.gid = parseInt(params.gid, 10);
		}
		return params;
	};

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
			//console.log('destroy: '+cur);
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
			//console.log("imageLoadComplete: "+index);
		});
		gallery.listen('gettingData', function(index, item) {
			// index - index of a slide that was loaded
			// item - slide object
			//console.log("gettingData: "+index);
		});
		gallery.listen('beforeChange', function() {
			var cur = gallery.getCurrentIndex();
			var len = $("#Reaky-Gallery").children().length;
			//console.log(cur+"/"+len);
			if(cur > len-2) {
				$("#loadmore").trigger("click");
			}
		});
		gallery.init();
	};

	$.refresh_gallery = function(start, end) {
		for (var i = start; i < end; i++) { 
			items.push({
				src: siteurl+lists[i][0], 
				w: lists[i][1],
				h: lists[i][2]
			});
			$('<a id='+i+' href='+siteurl+encodeURIComponent(lists[i][0])+'><img src='+siteurl+encodeURIComponent(lists[i][0].split(".")[0]+'_thumb.'+lists[i][0].split(".")[1])+' alt='+lists[i][0]+' /></a>').appendTo("#Reaky-Gallery").click(function(e){
				var cur = parseInt($(this).attr('id'));
				console.log(cur);
				openPhotoSwipe(items, cur);
				return false;
			});
		}
	};
	var dt = new Date();
	$.ajax({
		url: siteurl+'list.json?v='+dt.getTime(),
		dataType: "json",
		success: function (data) {
			//var d = new Date()
			lists = data;
			console.log("load list.json?v="+dt.getTime()+" finished: "+lists.length);
			loadsize = Math.min(lists.length, starthnum*startvnum);
			console.log("loadsize: " + loadsize);
			$("#Reaky-Gallery").empty();

			var hashData = photoswipeParseHash();
			if(hashData.pid && hashData.gid) {
				if(hashData.pid > loadsize) {
					loadsize = hashData.pid;
				}
				$.refresh_gallery(0, loadsize);
				openPhotoSwipe(items, hashData.pid);
			}
			else {
				$.refresh_gallery(0, loadsize);
				openPhotoSwipe(items, 0);
			}
		},
		error: function (err) {
			console.log("load list.json?v="+dt.getTime()+" failed");
			console.log(err);
		}
	});
	$("#loadmore").click(function(){
		var len = $("#Reaky-Gallery").children().length;
		if (len >= lists.length) {
			console.log("no more")
			return
		}
		loadsize = Math.min(lists.length, len+8)
		console.log("loadsize: " + loadsize);
		$.refresh_gallery(len, loadsize);
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
		dt = new Date();
		lists.reverse();
		items = [];
		console.log("list.json?v="+dt.getTime()+" reversed: "+lists.length);
		loadsize = Math.min(lists.length, starthnum*startvnum)
		console.log("loadsize: " + loadsize);
		$("#Reaky-Gallery").empty()
		$.refresh_gallery(0, loadsize);
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
	$('#upload').uploadifive({
		'auto' : true,
		'fileObjName': 'upload',
		'fileSizeLimit': '10MB',
		'removeCompleted': true,
		'queueID': 'queue',
		'buttonText': 'Upload',
		'uploadScript' : '/upload',
		//'onUploadComplete': function(file, data) { console.log('Feedback: '+data); }
		'onUploadComplete': function(file, data) {
			console.log("Upload successful!");
			setTimeout(function() {
				var dt = new Date();
				$.ajax({
					url: siteurl+'list.json?v='+dt.getTime(),
					dataType: "json",
					success: function (data) {
						lists = data;
						items = [];
						console.log("reload list.json?v="+dt.getTime()+" finished: "+lists.length);
						loadsize = Math.min(lists.length, starthnum*startvnum);
						console.log("loadsize: " + loadsize);
						$("#Reaky-Gallery").empty();
						$.refresh_gallery(0, loadsize);
					},
					error: function (err) {
						console.log("reload list.json failed");
						console.log(err);
					}
				});
			},1000*10);
		}
	});
});
