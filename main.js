// Main.js

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // Check if XMLHttpRequest object has "withCredentials" property.
    // Chrome, Firefox, Opera, and Safari use XMLHTTPRequest
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // IE uses XDomainRequest
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS is not supported by the browser
    xhr = null;
  };
  return xhr;
};

function searchWiki(searchTerm) {
  searchTerm = sanitizeSearchTerm(searchTerm);
  if (searchTerm == '') {
    return;
  }
  var xhr = createCORSRequest('GET', 'https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&format=json&search='+searchTerm+'&namespace=0&limit=10')

  if(!xhr) {
    throw new Error('CORS not supported');
  };
  xhr.onload = function() {
    var searchResults= JSON.parse(xhr.responseText);
    var numResults = searchResults[1].length;
    updateHTML(numResults, searchResults)
  };
  xhr.onerror = function() {
    console.log("Error in CORS Request!");
  }
  xhr.send();
};

function sanitizeSearchTerm(searchTerm) {
  return searchTerm.replace(/\W/g, '')
};

function search(e) {
  e.preventDefault();
  var searchTerm = document.getElementsByName('searchField')[0].value;
  searchWiki(searchTerm);
};

function updateHTML(amountOfResults, searchResults) {
  clearResults();
  populateAnchors(amountOfResults);
  populateLinks(searchResults);
  populateHeadings(searchResults);
  populateDescriptions(searchResults);
};

function clearResults() {
  document.getElementById("results").innerHTML = "";
};

function createNewAnchor() {
  var newAnchor = document.getElementById("searchResultTemplate").cloneNode("true");
  newAnchor.removeAttribute("hidden");
  newAnchor.removeAttribute("id");
  newAnchor.classList.add("searchResult");
  return newAnchor;
};

function populateAnchors(amount) {
  for(i=0;i<amount;i++) {
    document.getElementById("results").appendChild(createNewAnchor());
  }
};

function populateLinks(searchResults) {
  var links = searchResults[3];
  var anchors = document.getElementById("results").getElementsByClassName('searchResult');
  for(i=0;i<links.length;i++) {
    anchors[i].href = links[i];
  };
};

function populateHeadings(searchResults) {
  var titles = searchResults[1];
  var headings = document.getElementById("results").getElementsByClassName('list-group-item-heading');
  for(i=0;i<titles.length;i++) {
    headings[i].innerHTML = titles[i];
  };
};

function populateDescriptions(searchResults) {
  var descriptions = searchResults[2];
  var pTags = document.getElementById("results").getElementsByClassName('list-group-item-text')
  for(i=0;i<descriptions.length;i++) {
    pTags[i].innerHTML = descriptions[i];
  }
};
