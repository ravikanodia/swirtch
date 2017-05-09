window.Swirtch.Streams = function(response) {
  var that = {};

  // TODO: Something at a higher level should be responsible for attaching this
  // to the DOM.
  that.render = function() {
    var element = response.streams.length ?
      window.Swirtch.createElement([
        'div', null, [
          window.Swirtch.ResultsHeader(response).render(),
          that.renderResultsBody(response)
        ]]) :
      that.renderEmptyResults();
    document.getElementById('searchresults').innerHTML = '';
    document.getElementById('searchresults').appendChild(element);
  }

  that.renderEmptyResults = function() {
    return window.Swirtch.createElement([
      'div', 'results-streams', [
        ['div', 'streams-empty-message-container', [
          ['div', 'streams-empty-message', 'No streams found.']
        ]]
      ]]);
  }

  that.renderResultsBody = function(response) {
    return window.Swirtch.createElement([
      'div', 'results-streams',
      response.streams.map((stream) => { return that.renderStream(stream) })
    ]);
  };

  that.renderStream = function(streamResponse) {
    return window.Swirtch.createElement(
      ['div', 'stream-container', [
        ['a',
          {
            href: streamResponse.channel.url,
            className: 'stream-image',
            style: {
              backgroundImage: 'url(' + streamResponse.preview['medium'] + ')'
            }
          }
        ],
        // Use an outer div to reserve horizontal space by the link (which has
        // display: inline-block to stop the link from using the whole width).
        ['div', 'stream-description', [
          ['div', 'stream-display-name-container', [
            ['a',
              {
                href: streamResponse.channel.url,
                className: 'stream-display-name'
              },
              // TODO: Why does UTF-8 render correctly on github.io, but
              // incorrectly when loaded into a browser from the filesystem?
              streamResponse.channel.display_name
            ],
          ]],
          ['a',
            {
              href: '#',
              className: 'stream-game-name',
              onclick: function() {
                window.Swirtch.TwitchApi.searchStreams(streamResponse.game);
                return false;
              }},
            streamResponse.game],
          ['div', 'stream-viewer-count', '&nbsp;- ' + streamResponse.viewers + ' viewers'],
          ['div', 'stream-status', streamResponse.channel.status]
        ]]
      ]]);
  }

  return that;
}
