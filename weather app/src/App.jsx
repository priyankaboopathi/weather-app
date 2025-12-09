import { useEffect, useState } from 'react';
import './App.css';
// images
import clearicon from './assets/clear.png';
import cloudyicon from './assets/cloudy.png';
import rainicon from './assets/rain.png';
import searchicon from './assets/search.png';
import snowicon from './assets/snow.png';
import windicon from './assets/wind.png';
import humidityicon from './assets/humunity.jpg';
import PropTypes from 'prop-types';

const WeatherDetails = ({ icon, temp, city, country, lat, log, humidity, wind }) => {
  return (
    <div className='images'>
      <img src={icon} alt='weather-icon' />
      <div className="temp">{temp}°C</div>
      <div className='location'>{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className='lat'>latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='log'>longitude</span>
          <span>{log}</span>
        </div>
      </div>

      <div className='data-container'>
        <div className='element'>
          <img src={humidityicon} alt='humidity' className='icon' />
          <div className='data'>
            <div className='humidity-percentage'>{humidity}%</div>
            <div className='text'>humidity</div>
          </div>
        </div>
        <div className='element'>
          <img src={windicon} alt='wind' className='icon' />
          <div className='data'>
            <div className='wind-percentage'>{wind}/hr</div>
            <div className='text'>windSpeed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

WeatherDetails.propTypes = {
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  log: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired
};

function App() {
  const [icon, setIcon] = useState(snowicon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("chennai");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [text, setText] = useState("chennai");
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = 'ad9b58314a94fb8cff1712ab5ebec125';

  const weatherIconMap = {
    "01d": clearicon,
    "01n": clearicon,
    "02d": cloudyicon,
    "02n": cloudyicon,
    "09d": rainicon,
    "09n": rainicon,
    "10d": rainicon,
    "10n": rainicon,
    "13d": snowicon,
    "13n": snowicon,
  };

  const search = async () => {
    setLoading(true);
    setError(null);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${API_KEY}&units=metric`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.cod === '404') {
        setCityNotFound(true);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearicon);
      setCityNotFound(false);
    } catch (error) {
      console.error("An Error Occurred:", error.message);
      setError("An error occurred while fetching weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div className='container'>
      <div className='input-container'>
        <input
          type='text'
          className='city-input'
          placeholder='search city'
          onChange={handleCity}
          value={text}
          onKeyDown={handleKeyDown}
        />
        <div className='search-Icon' onClick={search}>
          <img src={searchicon} alt='searchIcon' style={{ width: "30px", height: "30px" }} />
        </div>
      </div>

      {loading && <div className='loading-msg'>Loading......</div>}
      {error && <div className='error-msg'>{error}</div>}
      {cityNotFound && <div className='city-not-found'>City not found</div>}

      {!loading && !cityNotFound && !error && (
        <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          log={log}
          humidity={humidity}
          wind={wind}
        />
      )}
    </div>
  );
}

export default App;
