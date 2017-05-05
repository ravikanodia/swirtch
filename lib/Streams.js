window.Swirtch.Streams = function(response) {
  var rawResponse = response;

  var that = {};
  that.render = function() {
    var element = document.createElement('div');
    //element.innerHTML = "Total results: " + rawResponse.streams.length;
    element.appendChild(that.renderResultsHeader(rawResponse));
    document.getElementById("searchresults").innerHTML = '';
    document.getElementById("searchresults").appendChild(element);

  }

  that.renderResultsHeader = function(response) {
    var header = document.createElement('div');

    var resultCount = document.createElement('div');
    resultCount.innerHTML = "Total results: " + response._total;

    // TODO: Add paging links
    var pager = document.createElement('div');
    // TODO: Either determine the page size dynamically or move to a constant
    pager.innerHTML = "Pages: " + Math.ceil(response._total / 25);


    header.appendChild(resultCount);
    header.appendChild(pager);

    return header;
  }

  return that;
}
