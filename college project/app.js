// ========== SET YOUR OPENWEATHERMAP API KEY ==========
const OPENWEATHER_API_KEY = "10498155f39259f97ae0acf966b45bad"; // <-- Replace with your key
const DEFAULT_LOCATION = { lat: 28.7041, lon: 77.1025 }; // Delhi

// =================  TIME, DATE, DAY, YEAR  ===================
function updateDateTime() {
  const now = new Date();
  document.getElementById('time').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  document.getElementById('date').textContent = now.toLocaleDateString([], { day: '2-digit', month: 'short' });
  document.getElementById('day').textContent = now.toLocaleDateString('en-US', { weekday: 'long' });
  document.getElementById('year').textContent = now.getFullYear();
  document.getElementById('footerYear').textContent = now.getFullYear();
}
setInterval(updateDateTime, 1000);
updateDateTime();

// ========== BODY TEMPERATURE SIMULATION ==========
function randomBodyTemp() {
  // Normal cattle body temp: 38.0-39.3°C
  return (38 + Math.random() * 1.3).toFixed(1);
}
function updateBodyTemp() {
  document.getElementById('bodyTemp').textContent = randomBodyTemp();
}
updateBodyTemp();
setInterval(updateBodyTemp, 25000);

// ========== WEATHER FETCH ==========
function setWeatherInfo(temp, humidity, icon, desc) {
  document.getElementById('localTemp').textContent = temp !== null ? temp : 'N/A';
  document.getElementById('humidity').textContent = humidity !== null ? humidity : 'N/A';
  document.getElementById('weatherDesc').textContent = desc || 'N/A';

  // Map OpenWeather icon to b/w emoji for black/white style
  const iconMap = {
    "01d": "☀️", "01n": "🌑",
    "02d": "⛅", "02n": "☁️",
    "03d": "☁️", "03n": "☁️",
    "04d": "☁️", "04n": "☁️",
    "09d": "🌦️", "09n": "🌧️",
    "10d": "🌦️", "10n": "🌧️",
    "11d": "⛈️", "11n": "⛈️",
    "13d": "❄️", "13n": "❄️",
    "50d": "🌫️", "50n": "🌫️"
  };
  document.getElementById('weatherIcon').textContent = iconMap[icon] || "⛅";
}

function fetchWeather(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`)
    .then(res => res.json())
    .then(data => {
      setWeatherInfo(
        Math.round(data.main.temp),
        data.main.humidity,
        data.weather[0].icon,
        data.weather[0].main
      );
    })
    .catch(() => setWeatherInfo(null, null, null, null));
}

// Try geolocation, else default location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
    () => fetchWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon),
    { timeout: 7000 }
  );
} else {
  fetchWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon);
}