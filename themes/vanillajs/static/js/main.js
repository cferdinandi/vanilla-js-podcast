/*!
 * vanillajs v1.3.0: The theme for vanillajspodcast.com
 * (c) 2018 Chris Ferdinandi
 * MIT License
 * http://github.com/cferdinandi/vanilla-js-podcast
 * Open Source Credits: https://github.com/filamentgroup/loadJS/, https://github.com/filamentgroup/loadCSS, https://github.com/bramstein/fontfaceobserver
 */

/**
 * Array.prototype.forEach() polyfill
 * @author Chris Ferdinandi
 * @license MIT
 */
if (window.Array && !Array.prototype.forEach) {
	Array.prototype.forEach = function (callback, thisArg) {
		thisArg = thisArg || window;
		for (var i = 0; i < this.length; i++) {
			callback.call(thisArg, this[i], i, this);
		}
	};
}
var latestEpisodes = function (app) {

	'use strict';

	// Make sure there's a container for the content
	if (!app) return;

	var user = '422835952';
	var clientId = 'HDNfsDscL9cEWTl8lfqFKfLPTErC4Qio';
	var urls = {
		itunes: 'https://itunes.apple.com/us/podcast/the-vanilla-js-podcast/id1364574460',
		soundcloud: 'https://soundcloud.com/vanillajspodcast/'
	};

	/**
	 * Adding a leading zero to single digit times
	 * @param  {Integer} num The time
	 * @return {String}      The time with leading zero
	 */
	var padStart = function (num) {
		num = num.toString();
		return num.length < 2 ? '0' + num : num;
	};

	var getDuration = function (duration) {
		return {
			minutes: Math.floor(duration / 1000 / 60),
			seconds: padStart(Math.floor((duration / 1000) % 60))
		};
	};

	var renderEpisodes = function (data) {
		var episodes = '';
		data.forEach((function (episode) {
			var title = episode.title.split(' - ');
			var time = getDuration(episode.duration);
			episodes +=
				'<li class="margin-bottom-small">' +
					'<strong class="margin-right">' + title[0] + '</strong>' +
					'<a class="link-no-underline" href="' + urls.soundcloud + episode.permalink + '">' + title[1] + '</a> ' +
					'<span class="text-small text-muted">(' + time.minutes + ':' + time.seconds  + ')</span>' +
				'</li>';
		}));
		return episodes;
	};

	var render = function (data) {
		var template = '<h2 class="h3">Latest Episodes</h2>';
		template += renderEpisodes(data);
		app.innerHTML =
			'<ul class="list-unstyled margin-bottom-medium">' + template + '</ul>' +
			'<p><em>Listen to full series on <a href="' + urls.itunes + '">iTunes</a> or <a href="' + urls.soundcloud + '">SoundCloud</a>.</em></p>';
	};

	var getEpisodes = function () {

		// Set up our HTTP request
		var xhr = new XMLHttpRequest();

		// Setup our listener to process compeleted requests
		xhr.onreadystatechange = function () {

			// Only run if the request is complete
			if (xhr.readyState !== 4) return;

			// Make sure request is successful
			if (xhr.status !== 200) return;

			// Render content
			render(JSON.parse(xhr.response));

		};

		// Create and send a GET request
		// The first argument is the post type (GET, POST, PUT, DELETE, etc.)
		// The second argument is the endpoint URL
		xhr.open('GET', 'https://api.soundcloud.com/users/' + user + '/tracks?client_id=' + clientId);
		xhr.send();

	};

	getEpisodes();

};
var mailchimp = function (callback) {

	'use strict';


	//
	// Variables
	//

	// Fields
	var form = document.querySelector('#mailchimp-form');
	if (!form) return;
	var email = form.querySelector('#mailchimp-email');
	if (!email) return;
	var status = form.querySelector('#mc-status');

	// Messages
	var messages = {
		empty: 'Please provide an email address.',
		notEmail: 'Please use a valid email address.',
		success: 'Success! You\'ll get an email each time a new podcast episode is available.'
	};

	// Endpoint
	var endpoint = 'https://gomakethings.com/checkout/wp-json/gmt-mailchimp/v1/subscribe';


	//
	// Methods
	//

	/**
	 * Serialize the form data into a query string
	 * https://stackoverflow.com/a/30153391/1293256
	 * @param  {Node}   form The form to serialize
	 * @return {String}      The serialized form data
	 */
	var serialize = function (form) {

		// Setup our serialized data
		var serialized = [];

		// Loop through each field in the form
		for (var i = 0; i < form.elements.length; i++) {

			var field = form.elements[i];

			// Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
			if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;

			// Convert field data to a query string
			if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
				serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
			}
		}

		return serialized.join('&');

	};

	var clearStatus = function () {

		// Bail if there's no status container
		if (!status) return;

		// Wipe classes and HTML from the status
		status.textContent = '';
		status.className = '';

		// Wipe classes and aria labels from the email field
		email.className = '';
		email.removeAttribute('aria-describedby');

	};

	var showStatus = function (msg, success) {

		// Bail if there's no status container
		if (!status) return;

		// Update the status message
		status.textContent = msg;

		// Set status class
		if (success) {
			status.className = 'success-message';
			status.setAttribute('tabindex', '-1');
			status.focus();
		} else {
			status.className = 'error-message';
			email.className = 'error';
			email.setAttribute('aria-describedby', 'mc-status');
			email.focus();
		}

	};

	var disableButton = function () {
		var btn = form.querySelector('[data-processing]');
		if (!btn) return;
		btn.setAttribute('data-original', btn.innerHTML);
		btn.setAttribute('disabled', 'disabled');
		btn.innerHTML = btn.getAttribute('data-processing');
	};

	var enableButton = function () {
		var btn = form.querySelector('[data-processing]');
		if (!btn) return;
		btn.removeAttribute('disabled');
		btn.innerHTML = btn.getAttribute('data-original');
	};

	var sendData = function (params) {

		// Set up our HTTP request
		var xhr = new XMLHttpRequest();

		// Setup our listener to process compeleted requests
		xhr.onreadystatechange = function () {

			// Only run if the request is complete
			if ( xhr.readyState !== 4 ) return;

			// Show status message
			var success = xhr.status === 200 ? true : false;
			var response = JSON.parse(xhr.responseText);
			if (success) {
				showStatus(messages.success, success);
			} else {
				showStatus(response.message, success);
			}

			// Reenable button
			enableButton();

			// If there's a callback, run it
			if (callback && typeof callback === 'function') {
				callback(response);
			}

		};

		// Create and send a GET request
		// The first argument is the post type (GET, POST, PUT, DELETE, etc.)
		// The second argument is the endpoint URL
		xhr.open('POST', endpoint + '?' + params);
		xhr.send();

	};

	// Submit the form
	var submitForm = function () {

		// Disable the submit button
		disableButton();

		// Send the data to the MailChimp API
		sendData(serialize(form));

	};

	var isEmail = function () {
		return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/.test(email.value);
	};

	var validate = function () {

		// If no email is provided
		if (email.value.length < 1) {
			showStatus(messages.empty);
			return false;
		}

		// If email is not valid
		if (!isEmail()) {
			showStatus(messages.notEmail);
			return false;
		}

		return true;

	};

	var submitHandler = function (event) {

		// Stop form from submitting
		event.preventDefault();

		// Clear the status
		clearStatus();

		// Validate email
		var valid = validate();

		if (valid) {
			submitForm();
		}

	};


	//
	// Event Listeners & Inits
	//

	form.addEventListener('submit', submitHandler, false);

};
/**
 * Script initializations
 */

// Mailchimp form
if (document.querySelector('#mailchimp-form')) {
	mailchimp();
}

// Latest Episodes
var episodes = document.querySelector('#latest-episodes');
if (episodes) {
	latestEpisodes(episodes);
}