/**
 * Script initializations
 */

// Mailchimp form
if (document.querySelector('#mailchimp-form')) {
	mailchimp(function (data) {
		if (data.result !== 'error') {
			window.location.href = '/newsletter-success';
		}
	});
}

// Latest Episodes
var episodes = document.querySelector('#latest-episodes');
if (episodes) {
	latestEpisodes(episodes);
}