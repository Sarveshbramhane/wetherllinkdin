import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const WeatherWidget = ({ city, setTheme }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = '8443b6140013067cca19f8c91bdf42ba';

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        setWeather(response.data);
        
        // Update the theme based on weather
        const { main } = response.data.weather[0];
        setTheme(main.toLowerCase());
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, API_KEY, setTheme]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!weather) {
    return null;
  }

  const { main, description, icon } = weather.weather[0];
  const { temp } = weather.main;

  return (
    <div className="weather-widget">
      <h2>Weather in {city}</h2>
      <div className="weather-info">
        <p className="temperature">{temp} °C</p>
        <p className="description">{main}: {description}</p>
        <img
          src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={description}
        />
      </div>
    </div>
  );
};

const App = () => {
  const [city, setCity] = useState('Nagpur');
  const [theme, setTheme] = useState('clear');
  const [forecast, setForecast] = useState([]);

  const API_KEY = '8443b6140013067cca19f8c91bdf42ba';

  const fetchForecast = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      const forecastData = response.data.list;

      const uniqueDates = {};
      const nextDaysForecast = [];

      forecastData.forEach((f) => {
        const date = new Date(f.dt * 1000);
        const dateString = date.toLocaleDateString();
        const dayString = date.toLocaleDateString('en-US', { weekday: 'long' });

        if (!uniqueDates[dateString]) {
          uniqueDates[dateString] = true;
          nextDaysForecast.push({ ...f, day: dayString, fullDate: dateString });
        }
      });

      setForecast(nextDaysForecast.slice(0, 5));
    } catch (error) {
      console.error('Error fetching forecast:', error);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [city]);

  // Theme-based styles
  const themeStyles = {
    clear: { background: '#ffeb3b', color: '#333' },
    clouds: { background: '#90caf9', color: '#333' },
    rain: { background: '#2196f3', color: '#fff' },
    snow: { background: '#90caf9', color: '#333' },
  };

  const selectedTheme = themeStyles[theme] || themeStyles['clear'];

  return (
    <div className="App" style={{ background: selectedTheme.background, color: selectedTheme.color }}>
      <div className="card">
        <h1>Weather App</h1>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
        />
        <WeatherWidget city={city} setTheme={setTheme} />
        <div className="forecast-cards">
          {forecast.map((f, index) => (
            <div key={index} className="forecast-card">
              <h4>{`${f.day}, ${f.fullDate}`}</h4>
              <img
                src={`http://openweathermap.org/img/wn/${f.weather[0].icon}@2x.png`}
                alt={f.weather[0].description}
              />
              <p>{f.main.temp} °C</p>
              <p>{f.weather[0].description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
