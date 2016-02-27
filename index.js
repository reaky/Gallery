var openPhotoSwipe = function(items, pid) {
	var pswpElement = document.querySelectorAll('.pswp')[0];

	items = arguments[0];
	pid = arguments[1] || 0;
	// define options (if needed)
	var options = {
		history: true,
		focus: true,
		showAnimationDuration: 0,
		hideAnimationDuration: 0,
		index: pid
	};
	var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
	gallery.init();
};

$(document).ready(function(){
	$.ajax({
		url: 'list.json',
		dataType: "json",
		success: function (items) {
			console.log("load meta.json finished");
			openPhotoSwipe(items, 0);
			$("#Reaky-Gallery").html($('<img src="photos/IMG_20160208_105111.JPG" width=100% height=100% />'));
			$('#Reaky-Gallery > img:last').click(function(){openPhotoSwipe(items,0)});
			//$.each(items, function(index, item){
			//	$("#Reaky-Gallery").append($('<img src='+item['src']+' alt='+item['src']+' />'));
			//	$('#Reaky-Gallery > img:last').click({value: index}, function(event){
			//			openPhotoSwipe(items, event.data.value);
			//		});
			//	console.log(index);
			//});
		},
		error: function (err) {
			console.log("load meta.json failed");
			console.log(err);
		}
	});
});
