// main variables
var cityFormEl = document.querySelector("#city-search-form");
var weatherContainerEl = document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");
var searchButton = document.querySelector("#search-btn");
var displayWeather = document.getElementById("#display-weather");
brewContainer = $("#brew-container");
const apiKey = "844421298d794574c100e3409cee0499";

//  Bottle Cap Sound FX
var sfx = new Audio();
sfx.src = "assets/fx/cheers.mp3";

var saveSearch = function (city) {
  // localStorage.setItem("cities", JSON.stringify(cities));
  fetch("https://api.openbrewerydb.org/breweries?by_city=" + city)
    .then((response) => response.json())
    .then((data) => displayBrews(data));

  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=" +
    apiKey
  )
    .then((response) => response.json())
    .then((data) => weatherDisplay(data));
};

function weatherDisplay(data) {
  // console.log(data);
  const { name } = data;
  const { temp } = data.main;
  const { icon } = data.weather[0];
  console.log(name, temp, icon);
  //Gives Element text.
  document.querySelector(".city").innerText = name;
  document.querySelector(".temp").innerText = temp + "°";
  document.querySelector(".icon").src =
    "http://openweathermap.org/img/wn/" + icon + ".png";
  // weatherDisplay.removeClass("hide");
}

//Brewery Search

function displayBrews(data) {
  // debugger;
  //brewContainer.reset();
  //brewContainer.innerHTML = "";
  // brewContainer = $("#brew-container");

  for (let i = 0; i < data.length; i++) {
    // console.log(data);
    var brewName = data[i].name;
    var street = data[i].street;
    var city = data[i].city;
    var phone = data[i].phone;
    
    function formatPhoneNumber(phone) {
      var cleaned = ('' + phone).replace(/\D/g, '');
      var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
      }
      return null;
    }

    var realPhone = formatPhoneNumber(phone);
    var website = data[i].website_url;

    console.log(brewName, street, city, phone, website);

    var parentDiv = $('<div class="brew">');
    var brewNameEl = $('<h3 class="b-name"></h3>').text(brewName);
    var brewStreetEl = $('<p class= "b-street"></p>').text(street);
    var brewCityEl = $('<p class="b-city"></p>').text(city);
    var brewPhoneEl = $('<a class="b-phone" href="tel:b-phone"></a>').text(realPhone);
    var brewWebsiteEl = $('<a href="' + website + '" class="button b-website" target="_blank" id="site"></a>').text(website);

    parentDiv.append(brewNameEl);
    parentDiv.append(brewStreetEl);
    parentDiv.append(brewCityEl);
    parentDiv.append(brewPhoneEl);
    parentDiv.append(brewWebsiteEl);
    brewContainer.append(parentDiv);
  }
}

// ---- Past Searches Function----
var pastSearch = function (pastSearch) {
  // console.log(pastSearch)

  pastSearchEl = document.createElement("button");
  pastSearchEl.textContent = pastSearch;
  pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
  pastSearchEl.setAttribute("data-city", pastSearch);
  pastSearchEl.setAttribute("type", "submit");

  pastSearchButtonEl.prepend(pastSearchEl);
};

var pastSearchHandler = function (event) {
  var city = event.target.getAttribute("data-city");
  if (city) {
    getCityWeather(city);
    getCityCampsite(city);
  }
};

$(searchButton).on("click", function (event) {
  event.preventDefault();

  var searchResult = $("#city").val();
  if (searchResult != "") {

    $(".brew").remove();
    saveSearch(searchResult);
    console.log(searchResult);
    $("#display-weather").removeClass("hide");
    // clears the search bar
    document.getElementById("city").value = "";

    window.localStorage.setItem("cityName", JSON.stringify(searchResult));
    var cityName = JSON.parse(window.localStorage.getItem("cityName"));
    // console.log(cityName);

    // Dynamically adds a history button of the city just searched
    var container = $('#past-search-buttons')
    var cityEl = $('<button class="hist-btn" id="' + cityName + '"></button>').text(cityName)

    // makes the history button clickable and search for the city again
    cityEl.click(function (event) {
      console.log("you clicked on...")
      // console.log(event.target)
      event.preventDefault();
      $(".brew").remove();
      var searchResult = $("#city").val().trim()
      saveSearch(cityName)
    })
    container.append(cityEl)
  }
  else {
    Swal.fire({
      title: "Are you drunk already? Enter a City",
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    })
  }
  // else {
  //   $("#display-weather").text("Are you drunk already? Enter a City").removeClass("hide")
  //   $("#display-weather").addClass("h2")
  // }
  // else if {
  //   $(".brew").remove();
  //   saveSearch(searchResult);
  //   console.log(searchResult);
  //   $("#display-weather").removeClass("hide");
  //   // clears the search bar
  //   document.getElementById("city").value = "";
  // }
  // brewContainer.reset();
});

