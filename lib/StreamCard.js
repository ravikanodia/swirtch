window.Swirtch.StreamCard = function(streamResponse) {
  var that = {};

  function makeTwitchEmbed(channel) {
    return function(event) {
      if (that.player) {
        that.player.play();
        return false;
      }
      that.player = new Twitch.Player(
        "" + streamResponse.channel._id,
        {
          channel: streamResponse.channel.name,
          width: 300,
          height: 180,
          frameborder: 0,
          scrolling: 0,
          controls: false,
          allowfullscreen: false,
          muted: true
        });
      return false;
    };
  }

  function removeTwitchEmbed(event) {
    if (that.player) {
      that.player.pause();
    }
  }


  that.render = function() {
    var element = window.Swirtch.createElement(
      [
        'div', 
        {
          className: 'stream-container',
          onmouseenter: makeTwitchEmbed(streamResponse.channel.name),
          onmouseleave: removeTwitchEmbed
        },
        [
          ['div', 'stream-preview', [
            ['a',
              {
                href: streamResponse.channel.url,
                className: 'stream-image',
                style: {
                  backgroundImage: 'url(' + streamResponse.preview['medium'] + ')'
                },
              }
            ],
            ['div', { className: 'twitch-embed', id: streamResponse.channel._id}]
          ]],
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

    return element;
  }

  return that;
}
