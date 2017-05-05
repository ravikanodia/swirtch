
// Attach streams callback to window object (required for JSON-P)
// Is there a good reason to define a function and immediately execute it,
// or am I just doing this out of habit?
(function() {
  if (typeof window.twitchStreamsCallback === "undefined") {
    window.twitchStreamsCallback = function(response) {
      console.log("[swirtch] twitchStreamsCallback firing");
      for (var i in response) {
        if (response.hasOwnProperty(i)) {
          console.log("[swirtch] response[" + i + "]: " + response[i]);
        }
      }
      var streams = window.Swirtch.Streams(response);
      streams.render();
    }
  }
})();


window.Swirtch.TwitchApi = (function() {
  var that = {};

  // Twitch client id is not secret. Fine to (e.g.) host on github.
  that.client_id = "npy9i4q9jkhz8ilrh3xyn5yfn5k7vk";

  // Endpoint urls.
  // TODO: Get stream url via self-describing API call, rather than hardcoding.
  that.API_BASE_URL = "https://api.twitch.tv/kraken";
  that.SEARCH_STREAMS_URL = that.API_BASE_URL + "/search/streams";

  that.makeJsonpRequest = function(url, params, callback) {
    params.client_id = that.client_id;
    params.callback = callback;

    var queryString = "";
    for (var i in params) {
      if (params.hasOwnProperty(i)) {
        queryString += (queryString.length ? "&" : "?") + i + "=" + params[i];
      }
    }

    var tag = document.createElement("script");
    tag.src = url + queryString;

    document.getElementsByTagName("head")[0].appendChild(tag);
  };

  that.searchStreams = function(query) {
    that.makeJsonpRequest(that.SEARCH_STREAMS_URL, { q: query }, "twitchStreamsCallback");
  };
 
  return that;
})();


