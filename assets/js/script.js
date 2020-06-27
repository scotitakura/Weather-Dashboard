var searchHeader = document.querySelector("#search-header");
var searchInput = document.querySelector("#search-input");
var searchButton = document.querySelector("#search-button");
var searchHistory = document.querySelector("#search-history");

var userInput = searchInput.value
function saveSearch(userInput) {
    var historyInput = JSON.parse(localStorage.getItem("userInput"));
    if (!historyInput) {
        historyInput = [];
    };
    historyInput.push(userInput.value);
    localStorage.setItem("userInput", JSON.stringify(historyInput));
}

searchButton.addEventListener("click", function(){
    var historyButton = document.createElement("button");
    historyButton.innerHTML = searchInput;
    saveSearch(searchInput);
})