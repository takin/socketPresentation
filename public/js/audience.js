(function(r,io){
	var socket = io.connect("http://192.168.43.211:8000");
	var slideContainer = document.getElementsByClassName('slides')[0];
	slideContainer.appendChild(document.createElement('section'));
	
	r.initialize({
		transition:'default',
		keyboard: false,
		controls: false,
		progress: false,
		history: true,
		dependencies: [{ 
			src: 'components/reveal.js/plugin/highlight/highlight.js', async: true, function(){ hljs.initHighlightingOnLoad(); }
		}]
	});

	socket.on('first', function(data){
		if(data.slides.length > 0){
			for (var i = 0; i < data.slides.length; i++) {
				var element = document.createElement('section');
				element.innerHTML = data.slides[i];
				if(i === 0){
					slideContainer.replaceChild(element,slideContainer.children[0]);
				} else {
					slideContainer.appendChild(element);
				}
			};

			var pre = document.getElementsByTagName('pre');

			if(pre.length > 0){
				for (var i = 0; i < pre.length; i++) {
					hljs.highlightBlock(pre[i]);
				};
			}
			
			r.slide(data.position.h, data.position.v, data.position.f);
		}
	});

	socket.on('slidechanged', function(slide){
		r.slide(slide.h, slide.v, slide.f);
	});
})(Reveal,io);