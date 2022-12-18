var apiKey = '7fc857720d5a4ee4808c383429e02f26'
var data = JSON.parse(localStorage.getItem('currentSearch')) || [];


// display current date in current current weather area html
const d = new Date()
let day = d.getDate()
let month = d.getMonth()
let year = d.getFullYear()
document.getElementById('day').innerHTML = day
document.getElementById('month').innerHTML = month
document.getElementById('year').innerHTML = year


// capture search input, display current search, save to localStorage as array
$('.btn').on("click", function (event) {
  //display current search city name
  event.preventDefault()
  var currentSearch = $('input[name=city]').val()
  //localStorage.setItem('currentSearch', currentSearch)
  var data = JSON.parse(localStorage.getItem('currentSearch')) || []
  data.push(currentSearch)
  localStorage.setItem('currentSearch', JSON.stringify(data))

  //call coord function to return lat and lon vars of city's coordinates
  listSearches(data)

  coord(currentSearch)

  //display current search city name in main dashboard
  $('#current-city').text(currentSearch)
})

//display saved searches as list
const listSearches = function (data) {
  $('#list-searches').text("");
  for (var i = 0; i < data.length; i++) {
    //var li = '<li id=list-previous></li>'
    var li = $("<li>");
    li.attr("data-city", data[i])
    //$('list-previous').addClass('searches')
    li.text(data[i])
    $('#list-searches').append(li)
    li.addClass('btn btn-secondary li-city')
  }
}
//onclick pass value of btn to coord function
$(document).on("click", ".li-city", function () {
  var cityName = $(this).attr("data-city");
  coord(cityName);
  //display new city name in main forecast area
  $('#current-city').text(cityName)
})

//use api to find lat and lon of city, send to currentWeatherData function and forecastWeatherData functions
function coord(city) {
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`).then(function (res) {
    return res.json()
  })
    .then(function (data) {
      console.log(JSON.stringify(data))
      var lat = data[0].lat
      var lon = data[0].lon

      currentWeatherData(lat, lon)
      forecastWeatherData(lat, lon)
    })
}

// use api to get current weather data for current search's lat and lon
function currentWeatherData(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
    .then(function (res) {
      return res.json()
    })
    // display data from api in current weather div in html
    .then(function (currentWeatherData) {
      console.log(currentWeatherData)
      //save current weather data as vars
      let currentTemp = currentWeatherData.main.temp
      let currentWind = currentWeatherData.wind.speed
      let currentHum = currentWeatherData.main.humidity
      let currentIcon = currentWeatherData.weather[0].icon

      //display vars in html by id
      $('#currentTemp').text(currentTemp)
      $('#currentWind').text(currentWind)
      $('#currentHum').text(currentHum)
      $('#current-icon').attr('src', `https://openweathermap.org/img/wn/${currentIcon}@2x.png`)
    })
  //console.log(JSON.stringify(currentWeatherData))
}

//use api to get forecast weather data for current search's lat and and lon
function forecastWeatherData(lat, lon) {
  fetch(`https://api.openweathermap.org//data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
    .then(function (res) {
      return res.json()
    })
    .then(function (forecastWeatherData) {
      console.log(forecastWeatherData)

      //create loop through five day forecast data
      for (var i = 0; i < forecastWeatherData.list.length; i++) {
        if (forecastWeatherData.list[i].dt_txt.split(" ")[1] === "15:00:00") {
          console.log(forecastWeatherData.list[i]);

          //generate divs for forecast cards
          var div = $("<div>");
          div.addClass("col-2 card forecast-card");

          //generate p elements with forecast api data temp, wind, hum
          var dt = $("<h4>");
          dt.text(forecastWeatherData.list[i].dt_txt.split(" ")[0]);
          var temp = $("<p>");
          temp.text("Temp: " + forecastWeatherData.list[i].main.temp);
          var wind = $("<p>");
          wind.text("Wind: " + forecastWeatherData.list[i].wind.speed);
          var hum = $("<p>");
          hum.text("Humidity: " + forecastWeatherData.list[i].main.humidity);

          div.append(dt, temp, wind, hum);
          $("#forecast-div").append(div);
        }
      }






    })
}

//listSearches(data);