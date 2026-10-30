import "./styles.css";
import dayImg from "./assets/day.jpg";
import nightImg from "./assets/night.jpg";

const content = document.getElementById("content");
const mode = document.getElementById("mode");
const search = document.getElementById("search");

const API_KEY = "MZHNN4ZKXKWDKKFJVAQRUUST3";
let location = "Denton, TX";

let showCelsius = true;

async function getWeather(location) {
    const query = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&include=current&key=${API_KEY}&contentType=json`;
    const response = await fetch(query);
    if (!response.ok) throw new Error(`Location not found (${response.status})`);
    const data = await response.json();
    return data;
}

async function showWeather(location) {
    try {
        const data = await getWeather(location);
        // ---------------
        console.log(data)
        const cleanedLocation = cleanLocation(data);
        content.innerHTML = "";
        displayGreeting(data, cleanedLocation);
        displayWeather(data);
    } catch (error) {
        console.error(error);
        content.innerHTML = "";
        const message = document.createElement("p");
        message.textContent = "Location not found";
        message.classList.add("error");
        content.append(message);
    }
}

function displayGreeting(data, cleanedLocation) {
    let greeting = "";
    const greetingContainer = document.createElement("div");
    greetingContainer.classList.add("greeting");
    const greetingDiv = document.createElement("p");
    greetingDiv.classList.add("greeting-time")

    const time = data.currentConditions.datetime;
    const sunrise = data.currentConditions.sunrise;
    const sunset = data.currentConditions.sunset;

    const timeSplit = time.split(":");
    const timeInSeconds = +timeSplit[2] + (timeSplit[1] * 60) + (timeSplit[0] * 3600);

    const sunriseSplit = sunrise.split(":");
    const sunriseInSeconds = +sunriseSplit[2] + (sunriseSplit[1] * 60) + (sunriseSplit[0] * 3600);

    const sunsetSplit = sunset.split(":");
    const sunsetInSeconds = +sunsetSplit[2] + (sunsetSplit[1] * 60) + (sunsetSplit[0] * 3600);

    const NOON = 3600*12;

    if (timeInSeconds < sunriseInSeconds) {
        greeting += "Up Late?";
        document.body.style.backgroundImage = `url(${nightImg})`
    } else if (timeInSeconds >= sunriseInSeconds && timeInSeconds < NOON) {
        greeting += "Good morning";
        document.body.style.backgroundImage = `url(${dayImg})`
    }   else if (timeInSeconds >= NOON && timeInSeconds < sunsetInSeconds) {
        greeting += "Good afternoon";
        document.body.style.backgroundImage = `url(${dayImg})`
    } else {
        greeting += "Good evening";
        document.body.style.backgroundImage = `url(${nightImg})`
    }
    if (greeting.at(-1) !== "?") greeting += ",";

    greetingDiv.textContent = greeting;
    

    const greetingLocation = document.createElement("p");
    greetingLocation.classList.add("greeting-location");
    greetingLocation.textContent = `${cleanedLocation}`;

    greetingContainer.append(greetingDiv, greetingLocation);
    content.append(greetingContainer)

}

function displayWeather(data) {
    const current = data.currentConditions;
    const temp = showCelsius ? convertToCelsius(current.temp) : current.temp;
    const feelsLike = showCelsius ? convertToCelsius(current.feelslike) : current.feelslike;
    const humidity = data.currentConditions.humidity;
    const wind = data.currentConditions.windspeed;
    
    const containerDiv = document.createElement("div");
    containerDiv.classList.add("container");
    const mainInfo = document.createElement("div");
    mainInfo.classList.add("main-info");
    const secondaryInfo = document.createElement("div");
    secondaryInfo.classList.add("secondary-info");

    const tempDiv = document.createElement("div");
    if(showCelsius) tempDiv.classList.add("degrees-c", "current-temp");
    else tempDiv.classList.add("degrees-f", "current-temp");
    tempDiv.textContent = `${temp}`;

    const feelsLikeDiv = document.createElement("div");
    if (showCelsius) feelsLikeDiv.classList.add("degrees-c");
    else feelsLikeDiv.classList.add("degrees-f");
    feelsLikeDiv.textContent = `Feels Like: ${feelsLike}`;

    const humidityDiv = document.createElement("div");
    humidityDiv.classList.add("percent");
    humidityDiv.textContent = `Humidity: ${humidity}`;

    const windDiv = document.createElement("div");
    windDiv.classList.add("speed");
    windDiv.textContent = `Wind Speed: ${wind}`

    mainInfo.append(tempDiv);
    secondaryInfo.append(feelsLikeDiv, humidityDiv, windDiv);
    containerDiv.append(mainInfo, secondaryInfo);
    content.append(containerDiv);
}

function cleanLocation(data) {
    const arr = data.resolvedAddress.split(",");
    let cleanedArr = [];

    for(let word of arr) {
        if (word.trim() !== "United States") cleanedArr.push(word.trim());
    }
    return cleanedArr.join(", ");
}

function convertToCelsius(f) {
    return ((f - 32) * 5 / 9).toFixed(1)
}

search.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
        location = search.value;
        search.value = "";
        showWeather(location);
    }
});

mode.addEventListener("click", () => {
    showCelsius = !showCelsius;
    mode.textContent = showCelsius ? `C\u00B0` : `F\u00B0`;
    showWeather(location);
})

showWeather(location)
console.log(convertToCelsius(89))
