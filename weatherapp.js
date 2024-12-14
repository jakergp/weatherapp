const input_location= document.getElementById("location");
const btn_input_location= document.getElementById("btn-location");
const btn_celsius = document.getElementById("btn-celsius");
const btn_fahrenheit= document.getElementById("btn-fahrenheit");
const loading = document.getElementById("loading");

btn_input_location.addEventListener('click', fetchWeatherFrom);
btn_celsius.addEventListener('click', changeUnits);
btn_fahrenheit.addEventListener('click', changeUnits);

const content = document.getElementById("content");

let units = "celsius"

function fetchWeatherFrom() {
    var location = input_location.value.trim();
    loading.innerText = "Cargando..."
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/?key=NUJ8JFRC7EUWQQNBGW79XAY4Z&lang=es`)
        .then((response) => {
            return response.json();
        }).then((response) => {
            let data = proccessWeatherData(response);
            console.log(data);
            const content = document.getElementById("content")
            content.replaceWith(displayWeatherData(data));
            loading.innerText = ""
        }).catch((error) => {
            const content = document.getElementById("content")
            content.replaceWith(displayError())
        })
}

function displayWeatherData(weatherData) {
    const new_content = document.createElement("div");
    new_content.id = "content";

    const name = document.createElement("div");
    name.id = "name";
    name.innerText = weatherData.name;

    const conditions = document.createElement("div");
    conditions.id = "conditions";
    conditions.innerText = weatherData.conditions;

    const temp = document.createElement("div");
    temp.id = "temp";
    temp.innerText = `Temperatura: ${convertUnits(weatherData.temp)}`

    const uvindex = document.createElement("div");
    uvindex.id = "uvindex";
    uvindex.innerText = `Índice UV: ${weatherData.uvindex}`;

    const humidity = document.createElement("div");
    humidity.id = "humidity";
    humidity.innerText = `Húmedad: ${weatherData.humidity}%`;

    const days = document.createElement("div");
    days.id = "days";
    days.innerText = "Próximos días: "
    const day_temps = document.createElement("div");
    day_temps.id = "day_temps";

    for (let i = 0; i < 7; i++) {
        const day = document.createElement("div");

        day.classList.add("day");
        day.innerHTML = `${weatherData.days[i].date} <br/>`;
        day.innerHTML += convertUnits(weatherData.days[i].tempmin);
        day.innerHTML += ` - ${convertUnits(weatherData.days[i].tempmax)}`;

        day_temps.appendChild(day);
    }
    days.appendChild(day_temps);

    new_content.appendChild(name);
    new_content.appendChild(conditions);
    new_content.appendChild(temp);
    new_content.appendChild(uvindex);
    new_content.appendChild(humidity);
    new_content.appendChild(days);

    return new_content
}

function displayError() {
    const error_content = document.createElement("div");
    error_content.id = "content";
    error_content.innerText = "Error: No es posible encontrar información de la ubicación indicada."

    return error_content;
}

function proccessWeatherData(weather) {
    const weatherData = {};
    weatherData.name = weather.resolvedAddress;
    weatherData.description = weather.description;
    weatherData.uvindex = weather.currentConditions.uvindex;
    weatherData.temp = weather.currentConditions.temp;
    weatherData.conditions = weather.currentConditions.conditions;
    weatherData.humidity = weather.currentConditions.humidity;

    const days = [];
    for (let i = 0; i < 7; i++) {
        days[i] = {};
        days[i].tempmax = weather.days[i].tempmax;
        days[i].tempmin = weather.days[i].tempmin;
        days[i].conditions = weather.days[i].conditions;
        days[i].date= weather.days[i].datetime;
    }

    weatherData.days = days;

    return weatherData
}

function changeUnits() {
    if (units == "celsius") {
        units = "fahrenheit";
        btn_fahrenheit.classList.add("active");
        btn_celsius.classList.remove("active");
    } else {
        units = "celsius";
        btn_celsius.classList.add("active");
        btn_fahrenheit.classList.remove("active");
    }

}

function convertUnits(degrees){
    if (units == "fahrenheit") {
        return `${degrees.toFixed(1)}°F`;
    }

    degrees = (degrees - 32) * (5 / 9);
    return `${degrees.toFixed(1)}°C`;
}
