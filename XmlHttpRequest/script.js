// script.js
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const tableHeaders = searchResults.getElementsByTagName("th");
let allDataResponse = [];

// Show all data on page load
const allDataUrl = "http://localhost:5000/api/users";
const xhrAllData = new XMLHttpRequest();

xhrAllData.onreadystatechange = function () {
  if (xhrAllData.readyState === XMLHttpRequest.DONE) {
    if (xhrAllData.status === 200) {
      allDataResponse = JSON.parse(xhrAllData.responseText);
      displayResults(allDataResponse);
    } else {
      console.error("Error occurred while fetching all data.");
    }
  }
};

xhrAllData.open("GET", allDataUrl, true);
xhrAllData.send();

searchInput.addEventListener("input", function () {
  const query = this.value;
  if (query.trim().length === 0) {
    filteredData = allDataResponse; 
    displayResults(allDataResponse); // Display all data when the search input is empty
    return;
  }

  const searchResultsByAuthor = filterResultsByField(allDataResponse, "author", query);
  const searchResultsByTitle = filterResultsByField(allDataResponse, "title", query);
  const searchResultsByCategory = filterResultsByField(allDataResponse, "category", query);

  // Merge and remove duplicates from search results
  const combinedResults = [...searchResultsByAuthor, ...searchResultsByTitle, ...searchResultsByCategory];
  const uniqueResults = Array.from(new Set(combinedResults.map(article => article._id)))
    .map(_id => combinedResults.find(article => article._id === _id));

  displayResults(uniqueResults);
});

function filterResultsByField(results, field, query) {
  const lowerCaseQuery = query.trim().toLowerCase();
  return results.filter(article => {
    const fieldValue = article[field].toLowerCase();
    return fieldValue.includes(lowerCaseQuery);
  });
}

function displayResults(results) {
  let html = '';
  if (results.length === 0) {
      html = '<tr><td colspan="5">No results found.</td></tr>';
  } else {
      results.forEach(article => {
          html += `
              <tr>
                  <td>${article.title}</td>
                  <td>${article.author}</td>
                  <td>${article.publish_date}</td>
                  <td>${article.article_body}</td>
                  <td>${article.category}</td>
              </tr>
          `;
      });
  }

  searchResults.innerHTML = '<thead><tr>' + tableHeaders[0].outerHTML + tableHeaders[1].outerHTML + tableHeaders[2].outerHTML + tableHeaders[3].outerHTML + tableHeaders[4].outerHTML + '</tr></thead><tbody>' + html + '</tbody>';
}
