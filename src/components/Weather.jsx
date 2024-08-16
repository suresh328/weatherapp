import React, { useEffect, useState } from "react";
import "./style.css"
import propsType  from "prop-types"
import Axios from 'axios'
// Images--->
import clearIcon from "../assets/clear.png";
import dreselIcon from "../assets/dresel.png";
import cloudIcon from "../assets/cloud.png";
import humidityIcon from "../assets/humidity.png";
import rainIcon from "../assets/rain.png";
import snowIcon from "../assets/snow.png";
import windIcon from "../assets/wind.png";

const Weather = () => {
    
    const [text, setText] =useState("London")

    const [icon, setIcon] = useState(snowIcon);
    const [temp, setTemp] = useState(0);
    const [city, setCity] = useState("");
    const [lat, setLat] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [wind, setWind] = useState(0);
    const [log, setLog] = useState(0);
    const [country, SetCountry] = useState("");


    const [cityNotFound, SetCityNotFound] = useState(false);
    const [loading, SetLoading] = useState(false);
    const [error, SetError] = useState(null);


    const weatherIconMap = {
        "01d": clearIcon,
        "01n": clearIcon,
        "02d": cloudIcon,
        "02n": cloudIcon,
        "03d": dreselIcon,
        "03n": dreselIcon,
        "04d": dreselIcon,
        "04n": dreselIcon,
        "09d": rainIcon,
        "09n": rainIcon,
        "10d": rainIcon,
        "10n": rainIcon,
        "13d": snowIcon,
        "13n": snowIcon,
        
    }

    const search = async () => {
        SetLoading(true);
        const apikey = "7ae6f15fdb5c40a4fb854e58ba10586e";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apikey}&units=Metric`;
       
        try{
            const res = await fetch(url);
            var data = await res.json();
            console.log(data);
            if(data.code === "404"){
                console.error("city not found");
                SetCityNotFound(true);
                SetLoading(false);
                return;
            }
           setHumidity(data.main.humidity);
           setWind(data.wind.speed);
            setTemp(Math.floor(data.main.temp));
            setCity(data.name);
            SetCountry(data.sys.country);
            setLat(data.coord.lat);
            setLog(data.coord.lon);
            const weatherIconcode = data.weather[0].icon;
            setIcon(weatherIconMap[weatherIconcode] || clearIcon);
            SetCityNotFound(false);

        }catch(error){
            console.error("An error occurred:"+ error.message);
            SetError("An error occurrred while fetching weather data.");
        }finally{
            SetLoading(false);
            SetCityNotFound(false);
        }
    };

    const handleCity = (e) =>{
        setText(e.target.value);
    };

    const handleKeyDown = (e) =>{
        if(e.key === "Enter"){
           
        }
    };

    useEffect(function () {
        search();
    }, []);
  return (
    <>
      <div className="container">
            <div className="input-container">
                <input type="text"  className="cityInput" placeholder="Search City"
                onChange={handleCity} value={text} onKeyDown={handleKeyDown}/>
                <div className="search-icon" >
                    <i class="fa-brands fa-searchengin" onClick={() => search()}></i>
                </div>
            </div>
           
            {loading && <div className="loading-message">Loading...</div>}
            {error && <div className="error-message">{error}</div>}
            {cityNotFound && <div className="city-not-found">City-not-found</div>}

            {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp}
            city={city} country={country} lat={lat} log={log} 
            humidity={humidity} wind={wind} />}
      <p className="copyright">
        Designed by <span>Suresh</span>
      </p>
      </div>

    </>
  );
};


const WeatherDetails = ({icon, temp, city, country, lat, log, humidity, wind}) =>{
    return (<>
    <div className="image">
        <img src={icon} alt="image" />
    </div>
    <div className="temp">{temp}°C</div>
    <div className="location">{city}</div>
    <div className="country">{country}</div>
    <div className="cord">
        <div>
            <span className="lat">latitude</span>
            <span>{lat}</span>
        </div>
        <div>
            <span className="log">longitude</span>
            <span>{log}</span>
        </div>
    </div>
    <div className="data-container">
        <div className="element">
            <div className="icon">
                <img src={humidityIcon} alt="humidityIcon" />
            </div>
            <div className="data">
                <div className="humidity-percent">{humidity} %</div>
                <div className="text">Humidity</div>
            </div>
        </div>
        <div className="element">
            <div className="icon">
                <img src={windIcon} alt="wind" />
            </div>
            <div className="data">
                <div className="wind-percent">{wind} km/h</div>
                <div className="text">Wind Speed</div>
            </div>
        </div>
    </div>
    </>)
}

WeatherDetails.propsType = {
    icon: propsType.string.isRequired,
    temp: propsType.number.isRequired,
    city: propsType.string.isRequired,
    country: propsType.string.isRequired,
    humidity: propsType.number.isRequired, 
    wind: propsType.number.isRequired,
    lat: propsType.number.isRequired,
    log: propsType.number.isRequired,
};

export default Weather;
