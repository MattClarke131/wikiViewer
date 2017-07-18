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

function search() {
  searchTerm = getFormContents();
  searchWiki(searchTerm);
}
