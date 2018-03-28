var latestEpisodes = function (app) {

	'use strict';

	// Make sure there's a container for the content
	if (!app) return;

	var user = '422835952';
	var clientId = 'HDNfsDscL9cEWTl8lfqFKfLPTErC4Qio';
	var urls = {
		itunes: '#',
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
		data.forEach(function (episode) {
			var title = episode.title.split(' - ');
			var time = getDuration(episode.duration);
			episodes +=
				'<li class="margin-bottom-small">' +
					'<strong class="margin-right">' + title[0] + '</strong>' +
					'<a class="link-no-underline" href="' + urls.soundcloud + episode.permalink + '">' + title[1] + '</a> ' +
					'<span class="text-small text-muted">(' + time.minutes + ':' + time.seconds  + ')</span>' +
				'</li>';
		});
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