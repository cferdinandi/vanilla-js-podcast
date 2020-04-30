import '../../../../../gmt-theme/dist/js/_matches.polyfill.js';
import mailchimp from '../../../../../gmt-theme/dist/js/mailchimp.js';

// Mailchimp form
if (document.querySelector('#mailchimp-form')) {
	mailchimp(function (response) {
		if (response.code === 200) {
			window.location.href = '/newsletter-success';
		}
	});
}