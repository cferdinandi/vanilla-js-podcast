import mailchimp from './main-components/mailchimp.js';

// Mailchimp form
if (document.querySelector('#mailchimp-form')) {
	mailchimp(function (response) {
		if (response.code === 200) {
			window.location.href = '/newsletter-success';
		}
	});
}