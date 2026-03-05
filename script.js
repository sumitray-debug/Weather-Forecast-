async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const currentWeatherDiv = document.getElementById("currentWeather");
  const forecastDiv = document.getElementById("forecast");

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  try {
    // Get latitude & longitude
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );
    const geoData = await geoResponse.json();

    if (!geoData.results) {
      alert("City not found!");
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Get weather data
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max&timezone=auto`
    );

    const weatherData = await weatherResponse.json();

    const current = weatherData.current_weather;
    const daily = weatherData.daily;

    // Show current weather
    currentWeatherDiv.innerHTML = `
      <h2>${name}, ${country}</h2>
      <p>🌡 Temperature: ${current.temperature}°C</p>
      <p>💨 Wind Speed: ${current.windspeed} km/h</p>
    `;

    // Show 7-day forecast
    forecastDiv.innerHTML = "";

    for (let i = 0; i < 7; i++) {
      const date = new Date(daily.time[i]);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      forecastDiv.innerHTML += `
        <div class="day-card">
          <h3>${dayName}</h3>
          <p>⬆ ${daily.temperature_2m_max[i]}°C</p>
          <p>⬇ ${daily.temperature_2m_min[i]}°C</p>
          <p>💨 ${daily.windspeed_10m_max[i]} km/h</p>
        </div>
      `;
    }

  } catch (error) {
    alert("Error fetching weather data");
  }
}