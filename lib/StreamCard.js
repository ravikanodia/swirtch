window.Swirtch.StreamCard = function(streamResponse) {
  var that = {};

  function makeTwitchEmbed(channel) {
    return function(event) {
      console.log("makeTwitchEmbed firing on: " + event.currentTarget + " with channel: " + channel);
      var imageElement = event.currentTarget.getElementsByClassName('stream-image')[0];
      console.log("imageELement: " + imageElement);

      var twitchIframe = document.createElement('iframe');
      twitchIframe.src = "http://player.twitch.tv/?channel=" + channel + "&muted=true&controls=false";
      twitchIframe.width = 300;
      twitchIframe.height = 180;
      twitchIframe.frameborder = 0;
      twitchIframe.scrolling = 0;
      twitchIframe.allowfullscreen = false;
      twitchIframe.className = 'twitch-embed'

      event.currentTarget.replaceChild(twitchIframe, imageElement);
      return false;
    }
  }

  function removeTwitchEmbed(event) {
    var streamContainer = event.currentTarget;
    var twitchIframe = streamContainer.getElementsByClassName('twitch-embed')[0];

    var imageElement = window.Swirtch.createElement([
      'a',
      {
        href: streamResponse.channel.url,
        className: 'stream-image',
        style: {
          backgroundImage: 'url(' + streamResponse.preview['medium'] + ')'
        },
      }
    ]);

    streamContainer.replaceChild(imageElement, twitchIframe);

    return false;
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
          ['a',
            {
              href: streamResponse.channel.url,
              className: 'stream-image',
              style: {
                backgroundImage: 'url(' + streamResponse.preview['medium'] + ')'
              },
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

    return element;
  }

  return that;
}
