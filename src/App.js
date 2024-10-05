import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const WeatherWidget = ({ city }) => {
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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

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
  const [forecast, setForecast] = useState([]);

  const API_KEY = '8443b6140013067cca19f8c91bdf42ba';

  const fetchForecast = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      const forecastData = response.data.list;

      // Create an object to hold unique dates
      const uniqueDates = {};
      const nextDaysForecast = [];

      // Loop through the forecast data
      forecastData.forEach((f) => {
        const date = new Date(f.dt * 1000);
        const dateString = date.toLocaleDateString(); // Get date string for uniqueness
        const dayString = date.toLocaleDateString('en-US', { weekday: 'long' }); // Get day of the week

        // Check if the date is already added to the uniqueDates object
        if (!uniqueDates[dateString]) {
          uniqueDates[dateString] = true; // Mark this date as seen
          nextDaysForecast.push({ ...f, day: dayString, fullDate: date.toLocaleDateString('en-US') }); // Push this forecast object to the array
        }
      });

      // Keep only the first 5 unique dates
      setForecast(nextDaysForecast.slice(0, 5));
    } catch (error) {
      console.error('Error fetching forecast:', error);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [city]);

  return (
    <div className="App">
      <div className="card">
        <h1>Weather App</h1>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
        />
        <WeatherWidget city={city} />
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
