var stats = browser.storage.local.get(null);
stats.then((result) => {
	if (Object.keys(result).length == 0) {
		browser.storage.local.set({ ["played"]: 0, ["records"]: [] });
	}
});

if( document.readyState !== 'loading' ) {
    myInitCode();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        myInitCode();
    });
}

var extension = {
  playedListener: function(evt) {
    var stats = browser.storage.local.get(null);
		stats.then((result) => {
			result["played"] = Number(result["played"]) + Number(evt.target.getAttribute("duration"));

			result["records"].push({
				date: new Date(),

				name: evt.target.getAttribute("name"),
				author: evt.target.getAttribute("author"),

				duration: evt.target.getAttribute("duration")
			})

			browser.storage.local.set(result);
		});
  	}
}

document.addEventListener("playedEvent", function(e) { extension.playedListener(e); }, false, true);

function myInitCode() {
    function script() {
	    var def = window.getAudioPlayer()._impl.opts.onEnd;

		window.getAudioPlayer()._impl.opts.onEnd = function(arg) {
			var element = document.createElement("MyExtensionDataElement");
				element.setAttribute("name", window.getAudioPlayer()._currentAudio[3]);
				element.setAttribute("author", window.getAudioPlayer()._currentAudio[4]);
				element.setAttribute("duration", window.getAudioPlayer()._currentAudio[5]);
			document.documentElement.appendChild(element);

			var evt = document.createEvent("Events");
			evt.initEvent("playedEvent", true, false);
			element.dispatchEvent(evt);

			return def(arg)
		}
	  }

  function inject(fn) {
    const script = document.createElement('script')
    script.text = `(${fn.toString()})();`
    document.documentElement.appendChild(script)
  }

  inject(script)
}