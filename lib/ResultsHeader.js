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
    var header = document.createElement('div');
    header.classList.add('results-header');

    var resultCount = document.createElement('div');
    resultCount.classList.add('results-total');
    resultCount.innerHTML = 'Total results: ' + response._total;

    var pager = document.createElement('div');
    pager.classList.add('results-pager');

    pager.appendChild(that.renderPagingLink(true, response._links.prev));

    var pageCount = document.createElement('div');
    pageCount.classList.add('results-page-count');
    pageCount.innerHTML = that.getCurrentPage() + ' / ' + that.getPageCount();
    pager.appendChild(pageCount);

    pager.appendChild(that.renderPagingLink(false, response._links.next));

    header.appendChild(resultCount);
    header.appendChild(pager);

    return header;
  };

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
