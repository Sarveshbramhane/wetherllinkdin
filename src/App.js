// src/App.js
import React, { useState } from 'react';
import WeatherWidget from './WeatherWidget';
import './App.css';

const App = () => {
  const [city, setCity] = useState('London');

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
      </div>
    </div>
  );
};

export default App;
