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

	// name edit
	let nameComp = $('#greeting-name');
	let nameInput = nameComp.querySelector('.greeting__input');
	let nameText = nameComp.querySelector('.greeting__name');
	let currentName = localStorage.getItem('greetingName');

	if (!currentName) {
		localStorage.setItem('greetingName', 'set me');
	}
	// set name at startup
	nameText.textContent = currentName;

	nameComp._.events({
		click(event) {
			event.stopPropagation();
			nameComp.classList.add('greeting__name-comp--active');
			nameInput.focus();
			nameInput.setSelectionRange(0, nameInput.value.length);
			// bind click outside
			document.addEventListener('click', nameInputSubmit);
		},
	});

	nameInput._.events({
		blur() {
			nameInputSubmit();
		},
		keypress(event) {
			// enter
			if (event.charCode === 13) {
				nameInputSubmit();
			}
		}
	});

	function nameInputSubmit(event) {
		let newName = nameInput.value.trim();

		if (newName) {
			nameText.textContent = newName + '.';
			localStorage.setItem('greetingName', newName);
		} else {
			nameText.textContent = localStorage.getItem('greetingName');
		}

		nameComp.classList.remove('greeting__name-comp--active');
		document.removeEventListener('click', nameInputSubmit);
	}

}());
