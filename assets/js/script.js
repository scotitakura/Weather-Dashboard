var appid = "e9d2f749c8d866a3f1aa783791b18cdb";
var searchHeader = document.querySelector("#search-header");
var searchInput = document.querySelector("#search-input");
var searchButton = document.querySelector("#search-button");
var searchHistory = document.querySelector("#search-history");
var cityInfo = document.querySelector("#city-info");
var forecastArticle = document.querySelector("#forecast");

// var kToF = function(kelvin) {
//     1.8*(kelvin-273) + 32;
//     return kelvin;
// }

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

    var windText = document.createElement("p");
    cityInfo.appendChild(windText);
    windText.innerHTML = "Wind Speed: " + windSpeed + " MPH";
}

var displayUV = function(UVIndex) {
    var tempText = document.createElement("p");
    cityInfo.appendChild(tempText);
    tempText.innerHTML = "UV Index: " + UVIndex;
}

var displayCard = function(forecastDate, iconURL, forecastTemp, forecastHumidity) {
    var cardDate = document.createElement("h3");
    forecastArticle.appendChild(cardDate);
    cardDate.innerHTML = forecastDate;

    var cardIcon = document.createElement("img");
    cardIcon.setAttribute('src', iconURL)
    forecastArticle.appendChild(cardIcon);

    var cardTemp = document.createElement("p");
    forecastArticle.appendChild(cardTemp);
    cardTemp.innerHTML = "Temperature: " + forecastTemp.toFixed(1) + " °F";

    var cardHumidity = document.createElement("p");
    forecastArticle.appendChild(cardHumidity);
    cardHumidity.innerHTML = "Humidity: " + forecastHumidity + " %";
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

    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${searchInput.value}&appid=${appid}`)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(response) {
        for (var i = 2; i < 39; i += 8) {
            var forecastDate = response.list[i].dt_txt;
            var weatherIcon = response.list[i].weather[0].icon;
            var iconURL = "http://openweathermap.org/img/w/" + weatherIcon + ".png"
            var forecastTemp = 1.8*(response.list[i].main.temp-273) + 32;
            var forecastHumidity = response.list[i].main.humidity;

            displayCard(forecastDate, iconURL, forecastTemp, forecastHumidity);
            
            console.log(response)
            console.log(response.list[i])
            console.log(response.list[i].dt_txt)
            console.log(response.list[i].weather[0].icon)
            console.log(response.list[i].main.temp);
            console.log(response.list[i].main.humidity);
        }
    })
    });