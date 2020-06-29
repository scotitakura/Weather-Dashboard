var appid = "e9d2f749c8d866a3f1aa783791b18cdb";
var searchHeader = document.querySelector("#search-header");
var searchInput = document.querySelector("#search-input");
var searchButton = document.querySelector("#search-button");
var searchHistory = document.querySelector("#search-history");
var cityInfo = document.querySelector("#city-info");
var forecastArticle = document.querySelector("#forecast");

// Making selectors into a function to call them easier later
var mainSelector = function(property) {
    return document.querySelector(`.${property}`);
};

// This selector enables each class property to be selected and it's easier to iterate over
var cardSelector = function(n, property) {
    return document.querySelector(`#card-${n} .${property}`);
};

// Creates localStorage array if one doesn't exist
var historyInput = JSON.parse(localStorage.getItem("userInput"));
if (!historyInput) {
    historyInput = [];
};

// Appends a button to search history and adds an event listener that doesn't append another button when clicked because false parameter
var appendCityButton = function(cityButton) {
    var historyButton = document.createElement("button");
    searchHistory.appendChild(historyButton);
    historyButton.innerHTML = cityButton;
    historyButton.setAttribute("class", "flex w-full h-12 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-4 my-1 border border-gray-400 rounded shadow capitalize")

    historyButton.addEventListener("click", function() {
        getCityWeather(cityButton, false);
    });
};

// Brings back every city button when page is reloaded
for (var i = 0; i < historyInput.length; i++) {
    appendCityButton(historyInput[i]);
};

// LocalStorage push function
function saveSearch(userInput) {
    historyInput.push(userInput.value);
    localStorage.setItem("userInput", JSON.stringify(historyInput));
};

// Function displays info for the todays weather stats
var displayInfo = function(cityName, cityDate, cityIconURL, temp, humidity, windSpeed) {
    var mainDate = mainSelector("main-date");
    mainDate.innerHTML = `${cityName} ${cityDate} `;

    var mainIcon = mainSelector("main-icon");
    mainIcon.setAttribute('src', cityIconURL);

    var mainTemp = mainSelector("main-temp");
    mainTemp.innerHTML = `Temperature: ${temp.toFixed(1)} °F`;

    var mainHumidity = mainSelector("main-humidity");
    mainHumidity.innerHTML = `Humidity: ${humidity}%`;

    var mainWindSpeed = mainSelector("main-wind-speed");
    mainWindSpeed.innerHTML = `Wind Speed: ${windSpeed} MPH`;
};

// Function displays UV Index
var displayUV = function(UVIndex) {
    var mainUVIndex = mainSelector("main-uv-index");
    mainUVIndex.innerHTML = `UV Index:&nbsp;<span id="uv-color">${UVIndex}</span>`;

    var UVColor = document.querySelector("#uv-color");
    if (UVIndex >= 8) {
        UVColor.setAttribute("class", "bg-red-600 rounded px-2");
    } else if (UVIndex <= 5) {
        UVColor.setAttribute("class", "bg-green-500 rounded px-2");
    } else {
        UVColor.setAttribute("class", "bg-orange-500 rounded px-2");
    };
};

// Function displays 5-day forecast stats for each day by havin an n parameter to be called over
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

// Bring up city weather button (can be used for submit or search history with shouldAppendButton parameter) because we only want the search button to append a button
var getCityWeather = function(city, shouldAppendButton){
    // Fetch today's weather api
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appid}`)
    .then(function(response) {
        if (response.ok) {
            if (shouldAppendButton) {
                saveSearch(searchInput);
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

        var cityIconURL = `https://openweathermap.org/img/w/${cityIcon}.png`

        displayInfo(cityName, cityDate, cityIconURL, temp, humidity, windSpeed);

        // Fetch today's UV Index
        return fetch(`https://api.openweathermap.org/data/2.5/uvi?appid=${appid}&lat=${lat}&lon=${lon}`);
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        var UVIndex = response.value;
        displayUV(UVIndex);
    })

    // Fetch 5 day forecast data
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${appid}`)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(response) {
        // n interate for each day, and find the weather info for each day at 12pm
        var n = 1;

        let list = response.list; 
        for (var i = 0; i < list.length; i++) {
            var forecastDt_text = response.list[i].dt_txt;
            var forecastDt = response.list[i].dt;

            if(forecastDt_text.includes("12:00:00")) {
                var forecastDate = new Date(forecastDt*1000).toLocaleDateString();
                var weatherIcon = response.list[i].weather[0].icon;
                var iconURL = `https://openweathermap.org/img/w/${weatherIcon}.png`
                var forecastTemp = 1.8*(response.list[i].main.temp-273) + 32;
                var forecastHumidity = response.list[i].main.humidity;
                
                displayCard(n, forecastDate, iconURL, forecastTemp, forecastHumidity);
                
                n++;
            }
            if(n >= 6) {
                break;
            }
           
        }
    })
};

// Search button event clicker, true to append a new button
searchButton.addEventListener("click", function() {
    getCityWeather(searchInput.value, true);
});