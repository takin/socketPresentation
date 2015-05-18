(function(r,io){

	var socket = io.connect("http://localhost:8000");
	
	var raw = document.getElementsByClassName('slides')[0].children;
	var slides = [];

	for (var i = raw.length - 1; i >= 0; i--) {
		slides[i] = raw[i].innerHTML;
	};

	function getNextSlide(){
		
		var slideData = {};

		if(slides.length > r.getIndices().h + 1){
			slideData.slide = (r.getIndices().f === -1) ? slides[r.getIndices().h] : slides[r.getIndices().h + 1];
			slideData.position = {
				h: r.getIndices().h,
				v: r.getIndices().v,
				f: r.getIndices().f || 0	
			}
		}

		return slideData;
	};

	function buildData(){
		return {
			slides: slides,
			position: {
				h: r.getIndices().h,
				v: r.getIndices().v,
				f: r.getIndices().f || 0
			}
		};
	};

	function listener(event){
		socket.emit('slidechanged', buildData());
	};

	r.initialize({
		transition:'default',
		touch:true,
		hideAddressBar: true,
		dependencies: [
			{ src: 'components/reveal.js/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } }
		]
	});

	r.addEventListener('ready', function(event){
		socket.emit('ready', buildData());
	});

	r.addEventListener('slidechanged', listener);
	r.addEventListener('fragmentshown', listener);
	r.addEventListener('fragmenthidden', listener);
})(Reveal,io);