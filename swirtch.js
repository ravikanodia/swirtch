if (typeof window.Swirtch === 'undefined') {
  window.Swirtch = {};

  // It's not super powerful but at least let's make DOM element creation a
  // little less painful.
  window.Swirtch.createElement = function(spec) {
    var nodeType = spec[0];
    var options = spec[1];
    var content = spec[2];
    var element = document.createElement(nodeType);

    if (options) {
      // A plain string is assumed to be the className.
      if (typeof options === 'string') {
        options = { className: options };
      }

      for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
          element[opt] = options[opt];
        }
      }
    }

    if (typeof content === 'string') {
      element.innerHTML = content;
    } else if (content) {
      var contentArray = Array.isArray(content) ? content : [content];

      for (var i = 0; i < contentArray.length; i++) {
        if (Array.isArray(contentArray[i])) {
          element.appendChild(window.Swirtch.createElement(contentArray[i]));
        } else {
          element.appendChild(contentArray[i]);
        }
      }
    }

    return element;
  }
};
