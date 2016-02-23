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
			//document.getElementById('btn').onclick = function(){openPhotoSwipe(items,0)};
			$.each(items, function(index, item){
				$("#Reaky-Gallery").append($('<img src='+item['src']+' itemprop="thumbnail" alt="Image description" />'));
				$('#Reaky-Gallery > img:last').click({value: index}, function(event){
						openPhotoSwipe(items, event.data.value);
					});
				console.log(index);
			});
		},
		error: function (err) {
			console.log("load meta.json failed");
			console.log(err);
		}
	});
});
