window.Swirtch.ResultsHeader = function(response) {
  var that = {};

  // Twitch doesn't explicitly tell us what page we're on, or the page size,
  // but we can tease it out of the links.
  that.getPageSize = function() {
    // TODO: Does this match ever fail? Maybe use streams.length as a fallback.
    var limitMatch = /limit=(\d+)/.exec(response._links.self);
    return limitMatch[1];
  }

  that.getCurrentPage = function() {
    var offsetMatch = /offset=(\d+)/.exec(response._links.self);
    var offset = offsetMatch ? parseInt(offsetMatch[1]) : 0;

    return Math.ceil((offset + 1) / that.getPageSize());
  }

  that.getPageCount = function() {
    return Math.ceil(response._total / that.getPageSize());
  };

  that.render = function() {
    return window.Swirtch.createElement(
      ['div', 'results-header', [
        ['div', 'results-total', 'Total results: ' + response._total],
        ['div', 'results-pager', [
          that.renderPagingLink(true, response._links.prev),
          ['div', 'results-page-count', that.getCurrentPage() + ' / ' + that.getPageCount()],
          that.renderPagingLink(false, response._links.next)
        ]]
      ]]);
  }

  that.renderPagingLink = function(previous, linkUrl) {
    // Twitch returns a 'next' link even if we're at the end of the results. 
    var hasValidLink = !!linkUrl &&
      (previous || that.getCurrentPage() < that.getPageCount());

    var pagingLink;
    if (hasValidLink) {
      pagingLink = document.createElement('a');
      pagingLink.href = '#';
      pagingLink.onclick = function() {
        window.Swirtch.TwitchApi.getStreamLink(linkUrl);
        return false;
      };
    } else {
      pagingLink = document.createElement('div');
    }
    pagingLink.classList.add('results-paging-link');
    pagingLink.innerHTML = previous ? '&#9664;' : '&#9654';
    return pagingLink;
  };

  return that;
}
