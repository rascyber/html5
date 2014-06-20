// JavaScript Document
function initializeVideoCaptioning() {
	/* Hide all of the caption and descriptor elements to start */
	$('.captions li, .descriptors li').hide();
	
	$('video, audio').each(function(indexVideo, video) {
		var $_video=$(video);
		var videoId=$_video.attr('id');
		
		
		/* Drop out if there's no id as we can't match captions to the video */
		if (videoId=="") return;
		
		/* Build the caption/descriptor controls */
		var insertHTML=[];
		
		insertHTML.push('<div class="captionControls">');
		insertHTML.push('<input type="radio" value="hide" id="'+videoId+'HideCaptions" name="'+videoId+'Captions" class="captionsHide" checked><label for="'+videoId+'HideCaptions">Hide Captions</label>');
		insertHTML.push('<input type="radio" value="show" id="'+videoId+'ShowCaptions" name="'+videoId+'Captions" class="captionsShow"><label for="'+videoId+'ShowCaptions">Show Captions</label>');
		insertHTML.push('<input type="radio" value="showAll" id="'+videoId+'ShowAllCaptions" name="'+videoId+'Captions" class="captionsShowAll"><label for="'+videoId+'ShowAllCaptions">Show All Captions</label>');
		insertHTML.push('</div>');
		
		insertHTML.push('<div class="descriptorControls">');
		insertHTML.push('<input type="radio" value="hide" id="'+videoId+'HideDescriptors" name="'+videoId+'Descriptors" class="descriptorsHide" checked><label for="'+videoId+'HideDescriptors">Hide Descriptors</label>');
		insertHTML.push('<input type="radio" value="show" id="'+videoId+'ShowDescriptors" name="'+videoId+'Descriptors" class="descriptorsShow"><label for="'+videoId+'ShowDescriptors">Show Descriptors</label>');
		insertHTML.push('<input type="radio" value="showAll" id="'+videoId+'ShowAllDescriptors" name="'+videoId+'Descriptors" class="descriptorsShowAll"><label for="'+videoId+'ShowAllDescriptors">Show All Descriptors</label>');
		insertHTML.push('</div>');
		
		$_video.after(insertHTML.join("\n"));
		
		/* Find any captions for this specific video */
		var $_captions=$('.captions[rel='+$_video.attr('id')+'] li');
		
		/* Parse the timestamps out in to an array so we can check them faster, later */
		var captionTimestamps=[];
		$_captions.each(function(indexTimestamp, timestamp) {
			try {
				captionTimestamps[indexTimestamp]=parseFloat($(timestamp).attr('time'), 10);
			} catch(e) {
				alert("Unable to parse caption timestamp "+indexTimestamp);
			}
		});
		
		/* Find any descriptors for this specific video */
		var $_descriptors=$('.descriptors[rel='+$_video.attr('id')+'] li');
		
		/* Parse the timestamps out in to an array so we can check them faster, later */
		var descriptorTimestamps=[];
		$_descriptors.each(function(indexTimestamp, timestamp) {
			try {
				descriptorTimestamps[indexTimestamp]=parseFloat($(timestamp).attr('time'), 10);
			} catch(e) {
				alert("Unable to parse descriptor timestamp "+indexTimestamp);
			}
		});
		
		/* Bind the radio buttons */
		$('#'+videoId+'HideCaptions').change(function() {
			if ($(this).attr('checked')) {
				$_captions.hide();
			}
		});
		$('#'+videoId+'ShowCaptions').change(function() {
			if ($(this).attr('checked')) {
				$_captions.hide();
				currentCaption=-1;
			}
		});
		$('#'+videoId+'ShowAllCaptions').change(function() {
			if ($(this).attr('checked')) {
				$_captions.show();
			}
		});
		
		$('#'+videoId+'HideDescriptors').change(function() {
			if ($(this).attr('checked')) {
				$_descriptors.hide();
			}
		});
		$('#'+videoId+'ShowDescriptors').change(function() {
			if ($(this).attr('checked')) {
				$_descriptors.hide();
				currentDescriptor=-1;
			}
		});
		$('#'+videoId+'ShowAllDescriptors').change(function() {
			if ($(this).attr('checked')) {
				$_descriptors.show();
			}
		});
		
		/* Store the currently displayed caption */
		var currentCaption=-1;
		
		/* Store the currently displayed descriptor */
		var currentDescriptor=-1;
		
		/* Bind the timeupdate event */
		$_video.bind('timeupdate', function() {
			var _video=this;
			
			/* Check for a change of caption */
			var newCaption=-1;			
			$_captions.each(function(index, el) {
				if (_video.currentTime>=captionTimestamps[index]) {
					newCaption=index;
				}
			});
			
			/* If there was a new caption, and it should be displayed, display it */
			if (newCaption!=currentCaption) {
				currentCaption=newCaption;
				if ($('#'+videoId+'ShowCaptions').attr('checked')) {
					$_captions.hide();
					$($_captions.get(currentCaption)).show();
				}
			}
			
			/* Check for a change of descriptor */
			var newDescriptor=-1;			
			$_descriptors.each(function(index, el) {
				if (_video.currentTime>=descriptorTimestamps[index]) {
					newDescriptor=index;
				}
			});
			
			/* If there was a new descriptor, and it should be displayed, display it */
			if (newDescriptor!=currentDescriptor) {
				currentDescriptor=newDescriptor;
				if ($('#'+videoId+'ShowDescriptors').attr('checked')) {
					$_descriptors.hide();
					$($_descriptors.get(currentDescriptor)).show();
				}
			}
		});
	});
}

$(document).ready(function() {
	initializeVideoCaptioning();
});