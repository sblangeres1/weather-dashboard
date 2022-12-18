var apiKey = '7fc857720d5a4ee4808c383429e02f26'
var data = JSON.parse(localStorage.getItem('currentSearch')) || [];
const d = new Date()
let day = d.getDate()
let month = d.getMonth()
let year = d.getFullYear()
document.getElementById('day').innerHTML = day
document.getElementById('month').innerHTML = month
document.getElementById('year').innerHTML = year

$('.btn').on("click", function (event) {
  event.preventDefault()
  var currentSearch = $('input[name=city]').val()
  var data = JSON.parse(localStorage.getItem('currentSearch')) || []
  data.push(currentSearch)
  localStorage.setItem('currentSearch', JSON.stringify(data))

  listSearches(data)

  coord(currentSearch)

  $('#current-city').text(currentSearch)
})

const listSearches = function (data) {
  $('#list-searches').text("");
  for (var i = 0; i < data.length; i++) {
    var li = $("<li>");
    li.attr("data-city", data[i])
    li.text(data[i])
    $('#list-searches').append(li)
    li.addClass('btn btn-secondary li-city')
  }
}

$(document).on("click", ".li-city", function () {
  var cityName = $(this).attr("data-city");
  coord(cityName);
  $('#current-city').text(cityName)
})

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

function currentWeatherData(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
    .then(function (res) {
      return res.json()
    })
    .then(function (currentWeatherData) {
      console.log(currentWeatherData)
      let currentTemp = currentWeatherData.main.temp
      let currentWind = currentWeatherData.wind.speed
      let currentHum = currentWeatherData.main.humidity
      let currentIcon = currentWeatherData.weather[0].icon
      $('#currentTemp').text(currentTemp)
      $('#currentWind').text(currentWind)
      $('#currentHum').text(currentHum)
      $('#current-icon').attr('src', `https://openweathermap.org/img/wn/${currentIcon}@2x.png`)
    })
}

function forecastWeatherData(lat, lon) {
  fetch(`https://api.openweathermap.org//data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
    .then(function (res) {
      return res.json()
    })
    .then(function (forecastWeatherData) {
      console.log(forecastWeatherData)

      for (var i = 0; i < forecastWeatherData.list.length; i++) {
        if (forecastWeatherData.list[i].dt_txt.split(" ")[1] === "15:00:00") {
          console.log(forecastWeatherData.list[i]);

          var div = $("<div>");
          div.addClass("col-2 card forecast-card");

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

// load data when we first get on page
listSearches(data);