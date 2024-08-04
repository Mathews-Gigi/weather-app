import React, { useEffect, useState } from "react";
import classes from "./Home.module.css";
import cloudy from "../../../assets/images/cloudy.png";
import loading from "../../../assets/images/loading.gif";
import rainy from "../../../assets/images/rainy.png";
import snowy from "../../../assets/images/snowy.png";
import sunny from "../../../assets/images/sunny.png";
function Home() {
  const [data, setdata] = useState({});
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(error)
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const position = await getCurrentLocation();
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const weatherData = await res.json();
        setdata(weatherData);
      } catch (error) {
        setError(error);
      }
    };

    fetchWeather();
  }, []);

  const weatherImages = {
    Clear: sunny,
    Clouds: cloudy,
    Rain: rainy,
    Snow: snowy,
    Haze: cloudy,
    Mist: cloudy,
  };

  const weatherImage = data.weather
    ? weatherImages[data.weather[0].main]
    : null;

  const backgroundImages = {
    Clear: "linear-gradient(to right, #f3b07c, #fcd283)",
    Clouds: "linear-gradient(to right, #57d6d4, #71eeec)",
    Rain: "linear-gradient(to right, #5bc8fb, #80eaff)",
    Snow: "linear-gradient(to right, #aff2ff, #fff)",
    Haze: "linear-gradient(to right, #57d6d4, #71eeec)",
    Mist: "linear-gradient(to right, #57d6d4, #71eeec)",
  };

  const backgroundImage = data.weather
    ? backgroundImages[data.weather[0].main]
    : null;
  const apiKey = "44c577f504afad5f3c3d20900377f4e9";
  const handleInputChange = (e) => {
    setLocation(e.target.value);
  };
  const search = async () => {
    if (location.trim() !== "") {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&appid=${apiKey}`;
      const res = await fetch(url);
      const searchData = await res.json();

      if (searchData.cod != 200) {
        setdata({ notFound: true });
      } else {
        setdata(searchData);
        setLocation("");
      }
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  const currentDate = new Date();
  const daysOfWeeks = ["sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const daysOfWeek = daysOfWeeks[currentDate.getDay()];
  const Month = months[currentDate.getMonth()];
  const daysOfMonth = currentDate.getDate();

  const formatDate = `${daysOfMonth},${daysOfWeek},${Month}`;
  return (
    <div className={classes.container} style={{ backgroundImage }}>
      <div className={classes.weatherApp}>
        <div className={classes.search}>
          <div className={classes.searchTop}>
            <i className="fa-solid fa-location-dot"></i>
            <div className={classes.location}>{data.name}</div>
          </div>
          <div className={classes.searchBar}>
            <input
              type="text"
              placeholder="Search"
              value={location}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />

            <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
          </div>
        </div>

        {data.notFound ? (
          <div className={classes.notFound}>Not Found 🧐 </div>
        ) : (
          <>
            <div className={classes.weather}>
              <img
                src={weatherImage}
                alt={data.weather ? data.weather[0].main : null}
              />
              <div className={classes.weatherType}>
                {data.weather ? data.weather[0].main : null}
              </div>
              <div className={classes.temp}>
                {data.main ? `${Math.floor(data.main.temp)}°` : null}{" "}
              </div>
            </div>
            <div className={classes.weatherDate}>
              <p className={classes.date}>{formatDate}</p>
            </div>
            <div className={classes.weatherData}>
              <div className={classes.humidity}>
                <div className={classes.dataName}>Humidity</div>
                <i className="fa-solid fa-droplet"></i>
                <div className={classes.data}>
                  {data.main ? data.main.humidity : null}
                </div>
              </div>
              <div className={classes.wind}>
                <div className={classes.dataName}>Wind</div>
                <i className="fa-solid fa-wind"></i>
                <div className={classes.data}>
                  {data.main ? data.wind.speed : null}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
