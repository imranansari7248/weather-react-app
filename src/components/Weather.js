import React, { useEffect, useState } from "react";
import classes from "./Weather.module.css";
import Clock from "react-live-clock";
import axios from "axios";
import Forcast from "./Forcast";
import loader from "../images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";
// import { KEY, URL, ICON_URL } from "../API";

const INITIAL_WEATHER = {
  city: undefined,
  country: undefined,
  main: undefined,
  temp: undefined,
  humidity: 0,
  visibility: 0,
  windSpeed: 0,
  icon: "",
};

const defaults = {
  color: "white",
  size: 60,
  animate: true,
};

const Weather = () => {
  const [weather, setWeather] = useState(INITIAL_WEATHER);
  const [position, setPosition] = useState({ lat: undefined, long: undefined });
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [icon, setIcon] = useState("");

  const loadCityBackground = (name) => {
    import(`../images/${name}.jpg`).then((image) => {
      setImgUrl(image.default);
    });
  };

  const fetchData = async (lat, long) => {
    setLoading(true);
    console.log(process.env);
    axios
      .get(
        `${process.env.REACT_APP_URL}/weather?lat=${lat}&lon=${long}&units=metric&appid=${process.env.REACT_APP_KEY}`
      )
      .then((result) => {
        setWeather((prevWeather) => {
          return {
            ...prevWeather,
            city: result.data.name,
            country: result.data.sys.country,
            main: result.data.weather[0].main,
            temp: result.data.main.temp,
            humidity: result.data.main.humidity,
            visibility: result.data.visibility,
            windSpeed: result.data.wind.speed,
            icon: result.data.weather[0].icon,
          };
        });
      });
  };

  const getposition = () => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
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
        case "Mist":
          return "FOG";
        case "Thunderstorm":
          return "SLEET";
      }
    });
    if (weather.main) {
      loadCityBackground(weather.main);
    }
    setLoading(false);
  }, [weather.main]);

  useEffect(() => {
    if (navigator.geolocation) {
      getposition()
        .then((position) => {
          setPosition({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
          fetchData(position.coords.latitude, position.coords.longitude);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
    const intervalId = setInterval(() => {
      console.log("hello");
      fetchData(position.lat, position.long);
    }, 500000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <React.Fragment>
        <img src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} />
        <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
          Detecting your location
        </h3>
        <h3 style={{ color: "white", marginTop: "10px" }}>
          Your current location wil be displayed on the App <br></br> & used for
          calculating Real time weather.
        </h3>
      </React.Fragment>
    );
  }

  if (weather.temp) {
    return (
      <React.Fragment>
        <div
          className={classes.city}
          style={{ backgroundImage: `url(${imgUrl})` }}
        >
          <div className={classes.title}>
            <div className={classes.icon}>
              <ReactAnimatedWeather
                icon={icon}
                color={defaults.color}
                size={defaults.size}
                animate={defaults.animate}
                />
                <h1>{weather.main}</h1>
            </div>
            <div className={classes.city_title}>
              <h2>{weather.city}</h2>
              <h3>{weather.country}</h3>
            </div>
          </div>
          <div className={classes["time-date-temp"]}>
            <div className={classes["time-date"]}>
              <h2 className={classes.time}>
                <Clock format={"HH:mm:ss"} ticking={true} />
              </h2>
              <h2>{dateBuilder(new Date())}</h2>
            </div>
            <div className={classes.temp}>
              <h1>{Math.round(weather.temp)}°C</h1>
            </div>
          </div>
        </div>
        <Forcast />
      </React.Fragment>
    );
  }
};

export default Weather;

const dateBuilder = (d) => {
  let months = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "Novermber",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednsday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();
  return `${day}, ${date} ${month} ${year}`;
};
