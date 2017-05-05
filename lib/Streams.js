window.Swirtch.Streams = function(response) {
  var rawResponse = response;

  var that = {};

  // Twitch doesn't explicitly tell us what page we're on, or the page size,
  // but we can tease it out of the links.
  that.getPageSize = function() {
    // TODO: Does this match ever fail? Maybe use streams.length as a fallback.
    var limitMatch = /limit=(\d+)/.exec(rawResponse._links.self);
    return limitMatch[1];
  }

  that.getCurrentPage = function() {
    var offsetMatch = /offset=(\d+)/.exec(rawResponse._links.self);
    var offset = offsetMatch ? parseInt(offsetMatch[1]) : 0;

    return Math.ceil((offset + 1) / that.getPageSize());
  }

  that.getPageCount = function() {
    return Math.ceil(rawResponse._total / that.getPageSize());
  };

  // TODO: Something at a higher level should be responsible for attaching this
  // to the DOM.
  that.render = function() {
    var element = document.createElement('div');
    if (rawResponse) {
      element.appendChild(that.renderResultsHeader(rawResponse));
      element.appendChild(that.renderResultsBody(rawResponse));
    }
    document.getElementById("searchresults").innerHTML = '';
    document.getElementById("searchresults").appendChild(element);
  }

  that.renderResultsHeader = function(response) {
    var header = document.createElement('div');

    var resultCount = document.createElement('div');
    resultCount.innerHTML = "Total results: " + response._total;

    // TODO: Add paging links
    var pager = document.createElement('div');
    pager.classList.add('results-pager');

    pager.appendChild(that.renderPagingLink(true, rawResponse._links.prev));

    // TODO: Either determine the page size dynamically or move to a constant
    var pageCount = document.createElement('div');
    pageCount.classList.add('results-page-count');
    pageCount.innerHTML = that.getCurrentPage() + ' / ' + that.getPageCount();
    pager.appendChild(pageCount);

    pager.appendChild(that.renderPagingLink(false, rawResponse._links.next));

    header.appendChild(resultCount);
    header.appendChild(pager);

    return header;
  }

  that.renderPagingLink = function(previous, linkUrl) {
    var pagingLink = document.createElement(linkUrl ? 'a' : 'div');
    pagingLink.classList.add(
      'results-' + (previous ? 'previous' : 'next') + 'page');
    pagingLink.innerHTML = previous ? '&#9664;' : '&#9654;';
    if (linkUrl) {
      pagingLink.href = '#';
      pagingLink.onclick = function() {
        window.Swirtch.TwitchApi.getStreamLink(previous, linkUrl);
        return false;
      };
    }

    return pagingLink;
  }

  that.renderResultsBody = function(response) {
    var results = document.createElement('div');
    console.log("results count: " + rawResponse.streams.length);
    for (var i = 0; i < rawResponse.streams.length; i++) {
      results.appendChild(that.renderStream(rawResponse.streams[i]));
    }
    return results;
  }

  that.renderStream = function(streamResponse) {
    var stream = document.createElement('div');
    stream.classList.add('stream-container');

    var preview = document.createElement('div');
    preview.classList.add("stream-image");
    // TODO: Choose from sizes dynamically.
    preview.style.backgroundImage = 'url(' + streamResponse.preview["medium"] + ')';
    stream.appendChild(preview);

    var description = document.createElement('div');
    description.classList.add("stream-description");

    var displayName = document.createElement('div');
    displayName.classList.add("stream-display-name");
    // TODO: Handle UTF-8 correctly. decodeURIComponent(escape(string)) doesn't
    // work in all cases (malformed URI error).
    displayName.innerHTML = streamResponse.channel.display_name;
    description.appendChild(displayName);

    var gameName = document.createElement('div');
    gameName.classList.add("stream-game-name");
    gameName.innerHTML = streamResponse.game;
    description.appendChild(gameName);

    var viewerCount = document.createElement('div');
    viewerCount.classList.add("stream-viewer-count");
    viewerCount.innerHTML = "&nbsp;- " + streamResponse.viewers + " viewers";
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
