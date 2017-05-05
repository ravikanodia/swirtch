window.Swirtch.SearchBox = function() {
  var that = {};

  that.render = function() {
    var container = document.createElement('form');
    container.classList.add('search-container');
    container.onsubmit = function() {
      window.Swirtch.TwitchApi.searchStreams(
        document.getElementsByClassName('search-input')[0].value
      );
      return false; // prevent redirect
    };
 
    var input = document.createElement('input');
    input.type = 'text';
    input.classList.add('search-input');
    container.appendChild(input);

    var button = document.createElement('button');
    button.classList.add('search-button');
    button.innerHTML ="Search";
 //   button.addEventListener('click', () => {
 //     window.Swirtch.TwitchApi.searchStreams(
 //       document.getElementsByClassName('search-input')[0].value
 //     );
 //   });
    container.appendChild(button);

    document.getElementById("searcharea").innerHTML = "";
    document.getElementById("searcharea").appendChild(container);
  }

  return that;
};
