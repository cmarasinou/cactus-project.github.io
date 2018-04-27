$('#fancy-text').keyup(
		function(){
			var value = $(this).val();
			$('.headline').text(value);
		}
	);

$('form').submit(function(e){
		e.preventDefault;
    return false;
});

// Split the text into lines for the canvas drawing
function text2lines(txt, ctx_canvas, font_size, font_family, max_width){
	words = txt.split(" ");
	current_txt = "";
	previous_txt = "";
	txt_in_lines = [];//An empty array
	n_words = words.length;
	for (var i = 0; i < n_words; i++) {
		current_txt += words[i] + " ";
		if (ctx_canvas.measureText(current_txt).width >= max_width) {
			txt_in_lines.push(previous_txt);//Add new line in array
			current_txt = words[i]+ " ";
			previous_txt = current_txt;
		}
		previous_txt = current_txt;
	}
	if (ctx_canvas.measureText(current_txt).width >= 0){
		txt_in_lines.push(current_txt); //Add the final line in array
	}
	return txt_in_lines;
}



var canvas_width = 2380;
var canvas_font_size = 150;
//Set img size
var img_height = 500;
$(document).ready(function(){
	//
	$('#fb_share').html(`<p style="font-size:1.3em;"'><i class="fa fa-facebook-square fa-lg"></i> SHARE ON FACEBOOK</p>`);
// All the color templates,
// For each background color foreground found using http://contrast-finder.tanaguru.com/
// For good contrast
	var colors_array = new Array();
	colors_array.push(["#ff1744", "#020403"]); // [bgcolor,txtColor]
	colors_array.push(["#f50057", "#040201"]);
	colors_array.push(["#d500f9", "#020304"]);
	colors_array.push(["#651fff", "#FFFFED"]);
	colors_array.push(["#3d5afe", "#fffff3"]);
	colors_array.push(["#2979ff", "#000300"]);
	colors_array.push(["#00b0ff", "#1A414F"]);
	colors_array.push(["#00e5ff", "#4F404C"]);
	colors_array.push(["#1de9b6", "#4F404C"]);
	colors_array.push(["#00e676", "#2A454F"]);
	colors_array.push(["#76ff03", "#000000"]);
	colors_array.push(["#c6ff00", "#555768"]);
	colors_array.push(["#ffea00", "#0500FE"]);
	colors_array.push(["#ffc400", "#31454F"]);
	colors_array.push(["#ffff00", "#000000"]);
//Show the colors
	table_html ='';
	// Choose the color which will be active Randomly
	n_active = Math.floor(Math.random() * (colors_array.length-1));
	for (var i = 0; i < colors_array.length; i++) {
		bgColor = colors_array[i][0];
		txtColor = colors_array[i][1];
		added_class = "";
		if (i ===  n_active){
			added_class = " active";
		}
		table_html +=`
		<li><a href="#">
			 <div style= "background-image: -webkit-linear-gradient(-45deg, ${bgColor} 70%, ${txtColor} 70%);" class="canvas-color${added_class}" data-txtColor="${txtColor}" data-bgColor="${bgColor}"></div>
		</a></li>
		`;
		// Paint the div with the active colors_array
		bgColor = colors_array[n_active][0];
		txtColor = colors_array[n_active][1];
		$(".story").css({"background-color": bgColor, "color": txtColor});
	}

	$('.color-row').html(table_html);

/////////////////////////////////////
// Create Image
////////////////////////////////////

	$('#fb_share').on('click', function(){
		var canvas = document.getElementById('canvas');

		// Draw the image on canvas
		// Set canvas size
		var lineheight = 1.15 * canvas_font_size;
		padding = 50;
		scale_factor = 5;
		canvas.width = canvas_width;
        if (canvas.getContext) {
					var ctx = canvas.getContext('2d');
					//Load text, split in lines, find height of it
					var txt= $('.headline').text();
					var max_width = canvas_width - 100; //e.g. "300px"
					var canvas_font_family = "Gaegu";
					ctx.font="600 " + canvas_font_size+"px "+canvas_font_family; //font weight 600, since canvas renders thicker fonts
					lines = text2lines(txt, ctx, canvas_font_size, canvas_font_family, max_width);
					txt_height = lineheight*lines.length;
					//Set canvas height
					canvas.height = txt_height +  img_height + 4*padding; //Where 100 is space between the two
					// Color the canvas
					ctx.fillStyle = $(".story").css("background-color");
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					// Draw the image
					var cactus_img = new Image();
          cactus_img.src = "./img/cactus-mini.png";
          	// Make sure the image is loaded first otherwise nothing will draw.
          cactus_img.onload = function(){
						x_img = (canvas.width-scale_factor*cactus_img.width)/2; //In center
						y_img = canvas.height-scale_factor*cactus_img.height - scale_factor*4; //At the bottom and elevate a bit
            ctx.drawImage(cactus_img, x_img, y_img, cactus_img.width*img_height/cactus_img.height,  img_height);
					}
					//Draw the text
					ctx.fillStyle = $(".story").css("color");
					ctx.font="600 " + canvas_font_size+"px "+canvas_font_family; //font weight 600, since canvas renders thicker fonts
					for (var i = 0; i<lines.length; i++){
						current_linewidth = ctx.measureText(lines[i]).width;
						x_txt =  (max_width - current_linewidth)/2 + padding; //for centering
						y_txt =  canvas_font_size + (i*lineheight) + padding;
 						ctx.fillText(lines[i], x_txt, y_txt);
					}
				}
			// Post image on facebook
			FB.login((response) => {
			  if (response.status === 'connected') {
			      console.log('We are connected.');
			      upload(response);
			    } else if (response.status === 'not_authorized') {
			      console.log('Not authorized.');
			    } else {
			      console.log("Didn't manage to login.");
			    }
			},{ scope: 'publish_actions,manage_pages, publish_pages'})
	});

	// Change the active-color button
	$('.canvas-color').click(function(){
		$('.canvas-color').removeClass("active");
		$(this).addClass("active");
	});

	// Change color theme of canvas
	$('.canvas-color').on('click', function(){
		divbgColor = this.dataset.bgcolor;
		divtxtColor = this.dataset.txtcolor;
		$(".story").css({"background-color": divbgColor, "color": divtxtColor});
	});
});

// initialize and setup facebook js sdk
window.fbAsyncInit = function() {
    FB.init({
      appId      : '1616038958474519',
      xfbml      : true,
      version    : 'v2.5'
    });
};
(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Convert image data to blob
const dataURItoBlob = (dataURI) => {
  let byteString = atob(dataURI.split(',')[1]);
  let ab = new ArrayBuffer(byteString.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], {
      type: 'image/jpeg'
  });
}

// Upload picture on facebook  group

const upload = async (response) => {
  let canvas = document.getElementById('canvas');
  let dataURL = canvas.toDataURL('image/jpeg', 1.0);
  let blob = dataURItoBlob(dataURL);
  let formData = new FormData();
  formData.append('access_token', response.authResponse.accessToken);
  formData.append('source', blob);
  pageid = 383691685367852; // Choose the facebook page id
  // Show to user that is uploading
  $('#fb_share').html('<i class="fa fa-circle-o-notch fa-spin"></i> Sharing');
  let responseFB = await fetch('https://graph.facebook.com/'+pageid+'/photos', {
      body: formData,
      method:'post'
  });
  responseFB = await responseFB.json();
	console.log(responseFB);
  if (responseFB.post_id){
		$('#fb_share').html('Shared!');
	} else {
		$('#fb_share').html("Error! Didn't share");
	}
};

flexFont = function () {
		div_width = Number($('.story').css("width").slice(0,-2));
    var relFontsize =div_width*canvas_font_size/canvas_width;
		var relImgsize =div_width*img_height/canvas_width;
    $(".headline").css("fontSize", relFontsize);
		$("#cactus_img").css("max-height", relImgsize);
};

window.onload = function(event) {
    flexFont();
};
window.onresize = function(event) {
    flexFont();
};

// Facebook logo
fb_logo_src =`data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIDAgNTE2LjMzOCA1MTYuMzM5IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTYuMzM4IDUxNi4zMzk7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNDk3LjQ0NiwwSDE4Ljg5M0M4LjQ1OCwwLDAuMDA2LDguNDU4LDAuMDA2LDE4Ljg5M3Y0NzguNTU0YzAsMTAuNDM1LDguNDU4LDE4Ljg5MywxOC44ODYsMTguODkzaDkzLjg2OVYzMTYuMTM1ICAgIGMwLTYuNzYzLTUuNDg0LTEyLjI0LTEyLjI0LTEyLjI0SDgxLjE2OWMtNi43NTYsMC0xMi4yNC01LjQ3Ny0xMi4yNC0xMi4yMzl2LTQ4Ljc0YzAtNi43NjIsNS40ODMtMTIuMjQsMTIuMjQtMTIuMjRoMTkuMzUyICAgIGM2Ljc1NiwwLDEyLjI0LTUuNDc4LDEyLjI0LTEyLjI0di0zMS44NDJjMC0zMS4yNzksNy4zODctNTQuOTU4LDIyLjE3Mi03MS4wMjhjMTQuNzgtMTYuMDc4LDM5LjEwMS0yNC4xMTMsNzIuOTYzLTI0LjExM2g0Ni4yNzkgICAgYzYuNzYyLDAsMTIuMjQsNS40NzgsMTIuMjQsMTIuMjR2NDguNzRjMCw2Ljc2My01LjQ3OCwxMi4yNC0xMi4yNCwxMi4yNGgtMjQuMzdjLTYuNzAyLDAtMTIuMDc1LDAuNTU3LTE2LjExNCwxLjY3NyAgICBjLTQuMDM5LDEuMTItNi45NjQsMy4xMzktOC43NjQsNi4wNTljLTEuODA1LDIuOTI1LTIuOTY4LDUuODg4LTMuNDgyLDguODkzYy0wLjUxNCwzLjAxMS0wLjc3MSw3LjI2NC0wLjc3MSwxMi43NjZ2MjQuMzcgICAgYzAsNi43NjMsNS40ODMsMTIuMjQsMTIuMjQsMTIuMjRoNDEuNzgxYzYuNzU2LDAsMTEuNjY1LDUuNDQ3LDEwLjk1NSwxMi4xNzNsLTUuMTY1LDQ4Ljg3NSAgICBjLTAuNzEsNi43Mi02Ljc2MywxMi4xNzItMTMuNTI1LDEyLjE3MmgtMzQuMDQ1Yy02Ljc1NywwLTEyLjI0LDUuNDc4LTEyLjI0LDEyLjI0djIwMC4yMDRoMjk2Ljc3MSAgICBjMTAuNDM1LDAsMTguODg3LTguNDU4LDE4Ljg4Ny0xOC44OTNWMTguODkzQzUxNi4zMzMsOC40NTgsNTA3Ljg4LDAsNDk3LjQ0NiwweiIgZmlsbD0iIzkxREM1QSIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=`;
