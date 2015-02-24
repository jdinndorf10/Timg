/**
 * First gets inputted URL
 * Then querys servlet with it, gets json response
 * Displays tags & confidence level on screen.
 */
$(document).ready(function() {
	$("#submit").click(function() {
		console.log(getURL());
		clearRequest();
		sendRequest();
	});
	
	function getURL() {
		return $("#URLInput").val();
	}
	
	function clearRequest() {
		//remove previous request
		while ($('#tags li').length) {
			$('#tags li:last-child').remove();
		}
		$("#image").hide();
		$('#tags').hide();
		//hides loading
		hideLoading();
	}
	
	var interval;
	var Image = true;
	function sendRequest() {
		//ajax request
		
		interval = setInterval(function () {displayLoading()}, 500);
		var debug = $.post("http://localhost:8080/TimgWebProto/Servlet", getURL(), function(data) {
			displayResults(data);
		});
		
		debug.fail(function(e) {
			$("#loading").html("ERROR: Invalid URL!!");
		});
		
		debug.always(function() {
			window.clearInterval(interval);
			if (Image) {
				hideLoading();
				
			}else {
				Image = true;
			}
		});
	}
	
	function displayLoading() {
		$("#loading").show();
		temp = $("#loading").html();
		$("#loading").html(temp + ".");
	}
	
	function hideLoading() {
		$("#loading").hide();
		$("#loading").html("Loading.");
	}
	
	function displayResults(data) {
		data = JSON.parse(data);
		console.log(data);
		try {
			imageURL = data.results[0].image;
			tags = data.results[0].tags;
			displayPic(imageURL);
			displayTags(tags);
			
		}catch(err) {
			$("#loading").html("ERROR: Not a picture!!");
			$("#loading").show();
			Image = false;
		}
	}
	
	function displayPic(imageURL) {
		$("#image").attr("src",imageURL);
		$("#image").show();
	}
	
	//Display all tags and conf in list or paragraph in html, innerhtml()
	function displayTags(tags) {
		for (i = 0; i < 5; i++) {
			tag = toTitleCase(tags[i].tag);
			confi = tags[i].confidence;
			confi = Math.round(confi * 100) / 100;
			$('#tags').append(
				    $('<li>').append("<strong>" + tag + "</strong> (" + confi+ "%)"));
		}
		$('#tags').show();
	}
	
	function toTitleCase(str)
	{
	    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
	
	//highlight all text first click
	$('input').on('focus', function (e) {
	    $(this)
	        .one('mouseup', function () {
	            $(this).select();
	            return false;
	        })
	        .select();
	});
	
	document.onkeydown = function(e) {
		if (e.which == 13) {
			$("#submit").click();
		}
	}
	
	
});