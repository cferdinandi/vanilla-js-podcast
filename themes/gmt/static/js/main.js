/*! vanillajs v2.0.0 | (c) 2021 Chris Ferdinandi | MIT License | http://github.com/cferdinandi/vanilla-js-podcast */
(function () {
	'use strict';

	/**
	 * Element.matches() polyfill (simple version)
	 * https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
	 */
	if (!Element.prototype.matches) {
		Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
	}

	/**
	 *
	 * @param {Function} callback
	 */
	function mailchimp (callback) {

		//
		// Variables
		//

		// Fields
		let form = document.querySelector('#mailchimp-form');
		if (!form) return;
		let email = form.querySelector('#mailchimp-email');
		if (!email) return;
		let status = form.querySelector('#mc-status');
		let btn = form.querySelector('[data-processing]');

		// Messages
		let messages = {
			empty: 'Please provide an email address.',
			notEmail: 'Please use a valid email address.',
			success: 'Success! Thanks for inviting me to your inbox.',
			failed: 'Something went wrong. Please try again.'
		};

		// Endpoint
		let endpoint = 'https://gomakethings.com/checkout/wp-json/gmt-mailchimp/v1/subscribe';


		//
		// Methods
		//

		/**
		 * Serialize form data into a query string
		 * @param  {Form}   form The form
		 * @return {String}      The query string
		 */
		function serializeForm (form) {
			let data = new FormData(form);
			return new URLSearchParams(data).toString();
		}

		/**
		 * Show a status message
		 * @param  {String}  msg     The message to show
		 * @param  {Boolean} success If true, the status was successful
		 */
		function showStatus (msg, success) {

			// Bail if there's no status container
			if (!status) return;

			// Update the status message
			status.textContent = msg;

			// Set status classes
			status.className = success ? 'success-message' : 'error-message';
			email.className = success ? '' : 'error';

		}

		/**
		 * Send data to the API
		 * @param  {String} params The form parameters
		 */
		function sendData (params) {
			fetch(endpoint, {
				method: 'POST',
				body: params,
				headers: {
					'Content-type': 'application/x-www-form-urlencoded'
				}
			}).then(function (response) {
				return response.json();
			}).then(function (data) {

				// Show status
				let success = data.code >= 200 && data.code < 300 ? true : false;
				showStatus(success ? messages.success : data.message, success);

				// If there's a callback, run it
				if (callback && typeof callback === 'function') {
					callback(data);
				}

			}).catch(function (error) {
				showStatus(messages.failed);
			}).finally(function () {
				form.removeAttribute('data-submitting');
			});
		}

		/**
		 * Submit the form to the API
		 */
		function submitForm () {

			// Add submitting state
			form.setAttribute('data-submitting', true);

			// Send the data to the MailChimp API
			sendData(serializeForm(form));

		}

		/**
		 * Validate the email address
		 * @return {Boolean} If true, email is valid
		 */
		function isEmail () {
			return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/.test(email.value);
		}

		/**
		 * Validate the form fields
		 * @return {Boolean} If true, form is valid
		 */
		function validate () {

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

		}

		/**
		 * Handle submit events
		 * @param  {Event} event The event object
		 */
		function submitHandler (event) {

			// Stop form from submitting
			event.preventDefault();

			// Don't run again if form currrent submitting
			if (form.hasAttribute('data-submitting')) return;

			// Show submitting status
			showStatus(btn.getAttribute('data-processing'), true);

			// Validate email
			let valid = validate();

			if (valid) {
				submitForm();
			}

		}


		//
		// Event Listeners & Inits
		//

		form.addEventListener('submit', submitHandler);

	}

	// Mailchimp form
	if (document.querySelector('#mailchimp-form')) {
		mailchimp(function (response) {
			if (response.code === 200) {
				window.location.href = '/newsletter-success';
			}
		});
	}

}());
