/* © 2016 int3ractive.com
 * @author Thanh
 */
(function() {
	'use strict';

	const RENEW_DURATION = 1000 * 60 * 60; // fetch new image every hour
	let lastCheck = +localStorage.getItem('lastPhotoFetch');
	let now = Date.now();

	let body = $('body');
	let clock = $('#clock');

	const DEBUG = false;

	if (DEBUG || !lastCheck || now > lastCheck + RENEW_DURATION) {

		nau.fetchUnsplash().then(json => {
			console.log('fetch result', json);
			var imgUrl = json.urls.custom || json.urls.full;

			localStorage.setItem('lastPhotoFetch', now);
			localStorage.setItem('imgUrl', imgUrl);

			setBG(imgUrl);
		});
	} else {
		setBG(localStorage.getItem('imgUrl'));
	}

	// start clock
	nau.clock.start(updateClock);

	function setBG(url) {
		// make sure image is downloaded completely, avoid white background during fetching
		fetch(url)
			.then(function(response) {
				return response.blob();
			})
			.then(function(myBlob) {
				var objectURL = URL.createObjectURL(myBlob);
				body.style.backgroundImage = `url(${objectURL})`;
			});
	}

	function updateClock(clockHtml) {
		clock.innerHTML = clockHtml;
	}

	// update quote
	let quote = nau.quotes.getQuote();
	$('#quotes').textContent = quote[0];
	$('#quotes-author').textContent = quote[1];

	// greeting
	let today = new Date();
	let hour = today.getHours();
	let greeting = '';

	if (hour < 12) {
		// morning
		greeting = 'Good morning';
	} else if (hour < 18) {
		// afternoon
		greeting = 'Good afternoon';
	} else if (hour < 22) {
		// evening
		greeting = 'Good evening';
	} else {
		greeting = 'Please go to bed early';
	}

	$('#greeting-text').textContent = greeting;
}());
