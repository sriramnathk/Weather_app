const API_KEY = "7932690c2f5dbd16f93c816524f55805";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherCard = document.getElementById("weatherCard");
const cityNameEl = document.getElementById("cityName");
const descriptionEl = document.getElementById("description");
const temperatureEl = document.getElementById("temperature");
const iconEl = document.getElementById("icon");
const feelsEl = document.getElementById("feels");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const messageEl = document.getElementById("message");

async function fetchWeather(city) {

  messageEl.textContent = "Loading...";
  weatherCard.classList.add("hidden");

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${API_KEY}&units=metric`;

    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) throw new Error("City not found");
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    updateUI(data);
    messageEl.textContent = "";
  } catch (err) {
    messageEl.textContent = err.message;
  }
}

function updateUI(data) {
  const { name } = data;
  const { description, icon } = data.weather[0];
  const { temp, feels_like, humidity } = data.main;
  const windSpeed = data.wind?.speed ?? "--";

  cityNameEl.textContent = name;
  descriptionEl.textContent = capitalize(description);
  temperatureEl.textContent = `${Math.round(temp)}°C`;
  feelsEl.textContent = `${Math.round(feels_like)}°C`;
  humidityEl.textContent = `${humidity}%`;
  windEl.textContent = `${windSpeed} m/s`;

  iconEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  iconEl.alt = description;

  weatherCard.classList.remove("hidden");
}

function capitalize(str) {
  if (!str) return "";
  return str
    .split(" ")
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) {
    messageEl.textContent = "Please enter a city name.";
    return;
  }
  fetchWeather(city);
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});
