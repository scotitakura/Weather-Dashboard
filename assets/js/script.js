var appid = "e9d2f749c8d866a3f1aa783791b18cdb";
var searchHeader = document.querySelector("#search-header");
var searchInput = document.querySelector("#search-input");
var searchButton = document.querySelector("#search-button");
var searchHistory = document.querySelector("#search-history");
var cityInfo = document.querySelector("#city-info");


var userInput = searchInput.value
function saveSearch(userInput) {
    var historyInput = JSON.parse(localStorage.getItem("userInput"));
    if (!historyInput) {
        historyInput = [];
    };
    
    historyInput.push(userInput.value);
    localStorage.setItem("userInput", JSON.stringify(historyInput));
}

var displayInfo = function(cityName, temp, humidity, windSpeed) {
    var cityHeader = document.createElement("h2");
    cityInfo.appendChild(cityHeader);
    cityHeader.innerHTML = cityName;

    var tempText = document.createElement("p");
    cityInfo.appendChild(tempText);
    tempText.innerHTML = "Temperature: " + temp.toFixed(1) + " °F";

    var humidityText = document.createElement("p");
    cityInfo.appendChild(humidityText);
    humidityText.innerHTML = "Humidity: " + humidity + "%";

    var tempText = document.createElement("p");
    cityInfo.appendChild(tempText);
    tempText.innerHTML = "Wind Speed: " + windSpeed + " MPH";
}

var displayUV = function(UVIndex) {
    var tempText = document.createElement("p");
    cityInfo.appendChild(tempText);
    tempText.innerHTML = "UV Index: " + UVIndex;
}

searchButton.addEventListener("click", function(){

    // Fetch weather api
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&appid=${appid}`)
    .then(function(response) {
        if (response.ok) {
            var historyButton = document.createElement("button");
            searchHistory.appendChild(historyButton);
            historyButton.innerHTML = searchInput.value;
    
            saveSearch(searchInput);
            
            return response.json();
            
            
        } else {
            alert("Please enter a valid city.");
        }
    })
    .then(function(response) {
        var cityName = response.name;
        var temp = 1.8*(response.main.temp-273) + 32;
        var humidity = response.main.humidity;
        var windSpeed = response.wind.speed;
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        displayInfo(cityName, temp, humidity, windSpeed);

        return fetch(`http://api.openweathermap.org/data/2.5/uvi?appid=${appid}&lat=${lat}&lon=${lon}`);
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        var UVIndex = response.value;
        displayUV(UVIndex);
    })


    
});