var appid = "e9d2f749c8d866a3f1aa783791b18cdb";
var searchHeader = document.querySelector("#search-header");
var searchInput = document.querySelector("#search-input");
var searchButton = document.querySelector("#search-button");
var searchHistory = document.querySelector("#search-history");
var cityInfo = document.querySelector("#city-info");
var forecastArticle = document.querySelector("#forecast");

var mainSelector = function(property) {
    return document.querySelector(`.${property}`);
};

var cardSelector = function(n, property) {
    return document.querySelector(`#card-${n} .${property}`);
};

//
var historyInput = JSON.parse(localStorage.getItem("userInput"));
if (!historyInput) {
    historyInput = [];
};

var appendCityButton = function(cityButton) {
    var historyButton = document.createElement("button");
    searchHistory.appendChild(historyButton);
    historyButton.innerHTML = cityButton;
    // WHY does this function work when it's already a function
    historyButton.addEventListener("click", function() {
        getCityWeather(cityButton, false);
    });
};

for (var i = 0; i < historyInput.length; i++) {
    appendCityButton(historyInput[i]);
};

function saveSearch(userInput) {
    historyInput.push(userInput.value);
    localStorage.setItem("userInput", JSON.stringify(historyInput));
};

//
var displayInfo = function(cityName, cityDate, cityIconURL, temp, humidity, windSpeed) {
    var mainDate = mainSelector("main-date");
    mainDate.innerHTML = `${cityName} ${cityDate}`;

    var mainIcon = mainSelector("main-icon");
    mainIcon.setAttribute('src', cityIconURL);

    var mainTemp = mainSelector("main-temp");
    mainTemp.innerHTML = `Temperature: ${temp.toFixed(1)} °F`;

    var mainHumidity = mainSelector("main-humidity");
    mainHumidity.innerHTML = `Humidity: ${humidity}%`;

    var mainWindSpeed = mainSelector("main-humidity");
    mainWindSpeed.innerHTML = `Wind Speed: ${windSpeed} MPH`;
};

var displayUV = function(UVIndex) {
    var mainUVIndex = mainSelector("main-uv-index");
    mainUVIndex.innerHTML = `UV Index: ${UVIndex}`;
};

var displayCard = function(n, forecastDate, iconURL, forecastTemp, forecastHumidity) {
    var cardDate = cardSelector(n, "date");
    cardDate.innerHTML = forecastDate;

    var cardIcon = cardSelector(n, "icon");
    cardIcon.setAttribute('src', iconURL);

    var cardTemp = cardSelector(n, "temp");
    cardTemp.innerHTML = `Temperature: ${forecastTemp.toFixed(1)} °F`;

    var cardHumidity = cardSelector(n, "humidity");
    cardHumidity.innerHTML = `Humidity: ${forecastHumidity}%`;
};

var getCityWeather = function(city, shouldAppendButton){
    // Fetch weather api
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appid}`)
    .then(function(response) {

        if (response.ok) {
            saveSearch(searchInput);
            if (shouldAppendButton) {
                appendCityButton(searchInput.value);
            };
            return response.json();
        } else {
            alert("Please enter a valid city.");
        }
    })
    .then(function(response) {
        var cityName = response.name;
        var cityDt = response.dt;
        var cityDate = new Date(cityDt*1000).toLocaleDateString();
        var cityIcon = response.weather[0].icon;
        var temp = 1.8*(response.main.temp-273) + 32;
        var humidity = response.main.humidity;
        var windSpeed = response.wind.speed;
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        var cityIconURL = `http://openweathermap.org/img/w/${cityIcon}.png`

        displayInfo(cityName, cityDate, cityIconURL, temp, humidity, windSpeed);

        return fetch(`http://api.openweathermap.org/data/2.5/uvi?appid=${appid}&lat=${lat}&lon=${lon}`);
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        var UVIndex = response.value;
        displayUV(UVIndex);
    })

    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${appid}`)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(response) {
        var n = 1;
        for (var i = 2; i < 39; i += 8) {
            var forecastDt = response.list[i].dt;
            var forecastDate = new Date(forecastDt*1000).toLocaleDateString();
            var weatherIcon = response.list[i].weather[0].icon;
            var iconURL = `http://openweathermap.org/img/w/${weatherIcon}.png`
            var forecastTemp = 1.8*(response.list[i].main.temp-273) + 32;
            var forecastHumidity = response.list[i].main.humidity;
            
            displayCard(n, forecastDate, iconURL, forecastTemp, forecastHumidity);
            
            n++;
        }
    })
};

searchButton.addEventListener("click", function() {
    getCityWeather(searchInput.value, true);
});