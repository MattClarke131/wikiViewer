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

// I'm not sure how to put this variable inside searchWiki
var searchResults;
function searchWiki(searchTerm) {
  var xhr = createCORSRequest('GET', 'https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&format=json&search='+searchTerm+'&namespace=0&limit=10')

  if(!xhr) {
    throw new Error('CORS not supported');
  };
  xhr.onload = function() {
    searchResults = JSON.parse(xhr.responseText);
    updateHTML();
  };
  xhr.onerror = function() {
    console.log("Error in CORS Request!");
  }
  xhr.send();
}

function getFormContents() {
  formContents = document.getElementsByName('formContents')[0].value;
  return formContents;
}

function search(e) {
  e.preventDefault();
  var searchTerm = getFormContents();
  searchWiki(searchTerm);
}

function updateHTML() {
  hideAnchors();
  populateLinks();
  populateHeadings();
  populateDescriptions();
  revealAnchors();
};

function revealAnchors() {
  var numberRevealed = searchResults[1].length;
  var anchors = document.getElementsByClassName('searchResult');
  for(i=0;i<numberRevealed;i++) {
    anchors[i].removeAttribute('hidden');
  }
}

function hideAnchors() {
  var anchors = document.getElementsByClassName('searchResult');
  for(i=0;i<anchors.length;i++) {
    anchors[i].setAttribute('hidden', true);
  }
}

function populateLinks() {
  var links = searchResults[3];
  var anchors = document.getElementsByClassName('searchResult');
  for(i=0;i<links.length;i++) {
    anchors[i].href = links[i];
  };
};

function populateHeadings() {
  var titles = searchResults[1];
  var headings = document.getElementsByClassName('list-group-item-heading');
  for(i=0;i<titles.length;i++) {
    headings[i].innerHTML = titles[i];
  };
};

function populateDescriptions() {
  var descriptions = searchResults[2];
  var pTags = document.getElementsByClassName('list-group-item-text')
  for(i=0;i<descriptions.length;i++) {
    pTags[i].innerHTML = descriptions[i];
  }
};
