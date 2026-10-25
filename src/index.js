import "./styles.css"

const content = document.getElementById("content");
const search = document.getElementById("search");

const API_KEY = "MZHNN4ZKXKWDKKFJVAQRUUST3";
let location = "Denton TX"

async function getWeather(location) {
    const query = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&include=current&key=${API_KEY}&contentType=json`;
    const response = await fetch(query);
    const data = await response.json();
    return data;
}

function displayGreeting(data) {
    let greeting = "";
    const greetingContainer = document.createElement("div");
    const greetingDiv = document.createElement("p");

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

    console.log(time, sunrise, sunset);
    console.log(timeInSeconds, sunriseInSeconds, NOON, sunsetInSeconds)

    if (timeInSeconds < sunriseInSeconds) {
        greeting += "Up Late?";
    } else if (timeInSeconds >= sunriseInSeconds && timeInSeconds < NOON) {
        greeting += "Good morning";
    }   else if (timeInSeconds >= NOON && timeInSeconds < sunsetInSeconds) {
        greeting += "Good afternoon";
    } else {
        greeting += "Good evening";
    }
    if (greeting.at(-1) !== "?") greeting += ",";

    greetingDiv.textContent = greeting;
    

    const greetingLocation = document.createElement("p");
    greetingLocation.textContent = `The temperature in ${data.address} is:`;

    greetingContainer.append(greetingDiv, greetingLocation);
    content.append(greetingContainer)
}

function displayWeather(data) {
    const temp = data.currentConditions.temp;
    const feelsLike = data.currentConditions.feelslike;
    const humidity = data.currentConditions.humidity;
    const wind = data.currentConditions.windspeed;
    
    const containerDiv = document.createElement("div");
    containerDiv.classList.add("container");
    const mainInfo = document.createElement("div");
    mainInfo.classList.add("main-info");
    const secondaryInfo = document.createElement("div");
    secondaryInfo.classList.add("secondary-info");

    const tempDiv = document.createElement("div");
    tempDiv.classList.add("degrees", "current-temp");
    tempDiv.textContent = `${temp}`;

    const feelsLikeDiv = document.createElement("div");
    feelsLikeDiv.classList.add("degrees");
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

search.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
        location = search.value;
        search.value = "";
        console.log(location)
        const searchResults = await getWeather(location);
        console.log(searchResults)
        content.innerHTML = "";
        displayGreeting(searchResults);
        displayWeather(searchResults);
    }
})

const data = await getWeather(location);
displayWeather(data);
console.log(data)

