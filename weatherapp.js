const input_city = document.getElementById("city");
const btn_input_city = document.getElementById("btn-city");
btn_input_city.addEventListener('click', searchCity);
const content = document.getElementById("content");

function searchCity() {
    var city = input_city.value.trim();

    fetchWeatherFrom(city);
}

function fetchWeatherFrom(city) {
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/?key=NUJ8JFRC7EUWQQNBGW79XAY4Z&lang=es`)
        .then((response) => {
            return response.json();
        }).then((response) => {
            let data = proccessWeatherData(response);
            console.log(data);
            const content = document.getElementById("content")
            content.replaceWith(displayWeatherData(data));
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
    temp.innerText = "Temperatura: " + weatherData.temp + "°F";

    const uvindex = document.createElement("div");
    uvindex.id = "uvindex";
    uvindex.innerText = "Índice UV: " + weatherData.uvindex;

    const humidity = document.createElement("div");
    humidity.id = "humidity";
    humidity.innerText = "Húmedad: " + weatherData.humidity + "%";

    const days = document.createElement("div");
    days.id = "days";
    days.innerText = "Próximos días: "
    const day_temps = document.createElement("div");
    day_temps.id = "day_temps";

    for (let i = 0; i < 7; i++) {
        const day = document.createElement("div");
        day.classList.add("day");
        day.innerHTML = weatherData.days[i].date + '<br />';
        day.innerHTML+= weatherData.days[i].tempmin.toFixed(1);
        day.innerHTML+= " - " + weatherData.days[i].tempmax.toFixed(1);

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
