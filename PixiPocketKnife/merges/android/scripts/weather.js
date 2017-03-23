var OpenPixiAppKey = "aa7614e90c4f699e0e74cd49013d9c25";

(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        $('#app-title').text('Android Weather!');
        getWeatherWithGeoLocation();
    };

}) ();

function getWeatherWithZipCode() {
    var zipcode = $('#zip-code-input').val();
    var queryString =
        'http://api.openweathermap.org/data/2.5/weather?zip=' + zipcode + ',us&appid=' + OpenPixiAppKey + '&units=imperial';
    $.getJSON(queryString, function (results) {
        showWeatherData(results);
    }).fail(function (jqXHR) {
        $('#error-msg').show();
        $('#error-msg').text("Error retrieving data. " + jqHXR.statusText);
        });
    return false;
}

function showWeatherData(results) {
    if (results.weather.length) {
        $('#error-msg').hide();
        $('#weather-data').show();

        $('#title').text(results.name);
        $('#temperature').text(results.main.temp);
        $('#wind').text(results.wind.speed);
        $('#humidity').text(results.main.humidity);
        $('#visibility').text(results.weather[0].main);

        var sunriseDate = new Date(results.sys.sunrise * 1000);
        $('#sunrise').text(sunriseDate.toLocaleTimeString());

        var sunsetDate = new Date(results.sys.sunset * 1000);
        $('#sunset').text(sunsetDate.toLocaleTimeString());

    } else {
        $('#weather-data').hide();
        $('#error-msg').show();
        $('#error-msg').text("Error retrieving data. ");
    }
}

function getWeatherWithGeoLocation() {
    //Call the Cordova Geolocation API
    navigator.geolocation.getCurrentPosition(onGetLocationSuccess, onGetLocationError,
        { enableHighAccuracy: true });
    $('#error-msg').show();
    $('#error-msg').text('Determining your current location ...');
    $('#get-weather-btn').prop('disabled', true);
}

function onGetLocationSuccess(position) {
    //Retrieve the location information from the position object
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    var queryString = 'http://api.openweathermap.org/data/2.5/weather?lat='
        + latitude + '&lon=' + longitude + '&appid=' + OpenPixiAppKey + '&units=imperial';

    $('#get-weather-btn').prop('disabled', false);

    $.getJSON(queryString, function (results) {
        showWeatherData(results);
    }).fail(function (jqXHR) {
        $('#error-msg').show();
        $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);
    });
}

function onGetLocationError(error) {
    $('#error-msg').text('Error getting location');
    $('#get-weather-btn').prop('disabled', false);
}