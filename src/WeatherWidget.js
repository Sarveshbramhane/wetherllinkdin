// src/WeatherWidget.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherWidget.css';

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
  }, [city, API_KEY]);

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

export default WeatherWidget;
