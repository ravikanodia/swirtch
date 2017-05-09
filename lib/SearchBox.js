window.Swirtch.SearchBox = function() {
  var that = {};

  that.render = function() {
    var container = window.Swirtch.createElement(
      ['form',
        {
          className: 'search-container',
          onsubmit: function() {
            window.Swirtch.TwitchApi.searchStreams(
              document.getElementsByClassName('search-input')[0].value);
            return false; // prevent redirect
          }
        },
        [
          ['input',
            {
              type: 'text',
              className: 'search-input',
              placeholder: 'Search Twitch'
            }
          ],
          ['button', 'search-button', 'Search']
        ]
      ]);

    document.getElementById('searcharea').innerHTML = "";
    document.getElementById('searcharea').appendChild(container);
  }

  return that;
};
