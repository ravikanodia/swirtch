
// Attach streams callback to window object (required for JSON-P)
// Is there a good reason to define a function and immediately execute it,
// or am I just doing this out of habit?
(function() {
  if (typeof window.twitchStreamsCallback === 'undefined') {
    window.twitchStreamsCallback = function(response) {
      document.getElementById('searchresults').innerHTML = '';
      document.getElementById('searchresults').appendChild(
        window.Swirtch.Streams(response).render());
    }
  }
})();


window.Swirtch.TwitchApi = (function() {
  var that = {};

  // Twitch client id is not secret. Fine to (e.g.) host on github.
  that.client_id = 'npy9i4q9jkhz8ilrh3xyn5yfn5k7vk';

  // Endpoint urls.
  // TODO: Get stream url via self-describing API call, rather than hardcoding.
  that.API_BASE_URL = 'https://api.twitch.tv/kraken';
  that.SEARCH_STREAMS_URL = that.API_BASE_URL + '/search/streams';

  that.makeJsonpRequest = function(url, params, callback) {
    params = params || {};
    params.client_id = that.client_id;
    params.callback = callback;

    var queryString = '';
    for (var i in params) {
      if (params.hasOwnProperty(i)) {
        // The URL might already have the ? that leads off query parameters;
        // for instance, when processing 'previous' or 'next' links.
        queryString +=
          ((queryString.length || url.indexOf('?') !== -1) ? '&' : '?') +
          i + '=' + params[i];

      }
    }

    var tag = document.createElement('script');
    tag.src = url + queryString;

    document.getElementsByTagName('head')[0].appendChild(tag);
  };

  // Pass in a user query to search
  that.searchStreams = function(query) {
    that.makeJsonpRequest(that.SEARCH_STREAMS_URL, { q: query }, 'twitchStreamsCallback');
  };

  // For the next/previous urls provided in response._links
  that.getStreamLink = function(linkUrl) {
    that.makeJsonpRequest(linkUrl, null, 'twitchStreamsCallback');
  };

  return that;
})();


