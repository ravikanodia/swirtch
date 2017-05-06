window.Swirtch.Streams = function(response) {
  var rawResponse = response;

  var that = {};

  // TODO: Something at a higher level should be responsible for attaching this
  // to the DOM.
  that.render = function() {
    var element = document.createElement('div');
    if (rawResponse && rawResponse.streams.length !== 0) {
//      element.appendChild(that.renderResultsHeader(rawResponse));
      element.appendChild(window.Swirtch.ResultsHeader(rawResponse).render());
      element.appendChild(that.renderResultsBody(rawResponse));
    } else {
      element.appendChild(that.renderEmptyResults());
    }
    document.getElementById('searchresults').innerHTML = '';
    document.getElementById('searchresults').appendChild(element);
  }

  that.renderEmptyResults = function() {
    var element = document.createElement('div');
    element.classList.add('results-streams');

    var container = document.createElement('div');
    container.classList.add('streams-empty-message-container');
    var message = document.createElement('div');
    message.classList.add('streams-empty-message');
    message.innerHTML = 'No streams found.'

    container.appendChild(message);
    element.appendChild(container);
    return element;
  }

  that.renderResultsBody = function(response) {
    var results = document.createElement('div');
    results.classList.add('results-streams');
    console.log('results count: ' + rawResponse.streams.length);
    for (var i = 0; i < rawResponse.streams.length; i++) {
      results.appendChild(that.renderStream(rawResponse.streams[i]));
    }
    return results;
  };

  that.renderStream = function(streamResponse) {
    var stream = document.createElement('div');
    stream.classList.add('stream-container');

    var preview = document.createElement('a');
    preview.href = streamResponse.channel.url;
    preview.classList.add('stream-image');
    // TODO: Choose from sizes dynamically.
    preview.style.backgroundImage = 'url(' + streamResponse.preview['medium'] + ')';
    stream.appendChild(preview);

    var description = document.createElement('div');
    description.classList.add('stream-description');

    // Use an outer div to reserve horizontal space next to the link (which
    // has display: inline-block to stop the link from using the whole width).
    var displayNameContainer = document.createElement('div');
    var displayName = document.createElement('a');
    displayName.href = streamResponse.channel.url;
    displayName.classList.add('stream-display-name');
    // TODO: Handle UTF-8 correctly. decodeURIComponent(escape(string)) doesn't
    // work in all cases (malformed URI error).
    displayName.innerHTML = streamResponse.channel.display_name;
    displayNameContainer.appendChild(displayName);
    description.appendChild(displayNameContainer);

    var gameName = document.createElement('a');
    gameName.classList.add('stream-game-name');
    gameName.href = '#';
    gameName.onclick = function() {
      window.Swirtch.TwitchApi.searchStreams(streamResponse.game);
      return false;
    };
    gameName.innerHTML = streamResponse.game;
    description.appendChild(gameName);

    var viewerCount = document.createElement('div');
    viewerCount.classList.add('stream-viewer-count');
    viewerCount.innerHTML = '&nbsp;- ' + streamResponse.viewers + ' viewers';
    description.appendChild(viewerCount);

    var status = document.createElement('div');
    status.classList.add('status');
    status.innerHTML = streamResponse.channel.status;
    description.appendChild(status);

    stream.appendChild(description);
    return stream;
  }

  return that;
}
