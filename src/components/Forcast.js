import React, { useEffect, useState } from "react";
import ReactAnimatedWeather from "react-animated-weather";
import "./Forcast.css";
// import { KEY, URL, ICON_URL } from "../API";
import axios from "axios";
import { AiOutlineSearch } from "react-icons/ai";

const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

const Forcast = () => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [icon, setIcon] = useState("");

  const search = (city) => {
    axios
      .get(
        `${process.env.REACT_APP_URL}/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_KEY}`
      )
      .then((result) => {
        setWeather({
          city: result.data.name,
          country: result.data.sys.country,
          main: result.data.weather[0].main,
          temp: result.data.main.temp,
          humidity: result.data.main.humidity,
          visibility: result.data.visibility,
          windSpeed: result.data.wind.speed,
          icon: result.data.weather[0].icon,
        });
        setQuery("");
      })
      .catch((err) => {
        alert("Please enter a valid city name");
      });
  };

  useEffect(() => {
    setIcon(() => {
      switch (weather.main) {
        case "Haze":
          return "CLEAR_DAY";
        case "Clouds":
          return "CLOUDY";
        case "Rain":
          return "RAIN";
        case "Snow":
          return "SNOW";
        case "Dust":
          return "WIND";
        case "Drizzle":
          return "SLEET";
        case "Fog":
          return "FOG";
        case "Smoke":
          return "FOG";
        case "Tornado":
          return "WIND";
        default:
          return "CLEAR_DAY";
      }
    });
    console.log(icon);
  }, [weather]);

  useEffect(() => {
    search("delhi");
  }, []);

  const forcastHandler = (e) => {
    e.preventDefault();
    if (query) {
      search(query);
    }
  };

  return (
    <div className="forcast">
      <div className="forcast-icon">
        <ReactAnimatedWeather
          icon={icon}
          color={defaults.color}
          size={defaults.size}
          animate={defaults.animate}
        />
      </div>
      <div className="today-weather">
        <h3>{weather.main}</h3>
        <div className="search-box">
          <form onSubmit={forcastHandler}>
            <input
              type="text"
              placeholder="Search any city"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">
              <AiOutlineSearch />
            </button>
          </form>
        </div>
        <ul className="ul-items">
          <li className="city-head">
            <p>
              {weather.city}, {weather.country}
            </p>
            <img src={`${process.env.REACT_APP_ICON_URL}/${weather.icon}.png`} alt="" />
          </li>
          <li>
            Temperature <span>{Math.round(weather.temp)}°C</span>
          </li>
          <li>
            Humidity <span>{weather.humidity}%</span>
          </li>
          <li>
            Visibility <span>{weather.visibility} m</span>
          </li>
          <li>
            Wind Speed <span>{weather.windSpeed} Km/h</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Forcast;
