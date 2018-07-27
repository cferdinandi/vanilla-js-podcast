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

// API for CTAs
api();