import { me as companion } from "companion";
import { geolocation } from "geolocation";
import { weather, WeatherCondition } from "weather";
import { WEATHER_FILE, WAKE_TIME, MILLISECONDS_PER_MINUTE, STATES } from "../../common/constants";
import * as sender from "../messaging/sender";
import * as util from "../../common/utils";

export function initialize() {
    if (companion.permissions.granted("access_location")) {
        // Refresh on companion launch
        refreshData();

        // Schedule a refresh
        companion.wakeInterval = WAKE_TIME;
        companion.addEventListener("wakeinterval", refreshData);
    } else {
        console.error("This app requires the access_location permission.");
    }
}

function refreshData() {
    Promise.all([weather.getWeatherData(), getCurrentPosition({ maximumAge: 30 * MILLISECONDS_PER_MINUTE })])
        .then(([data, position]) => {
            const date = new Date();
            let sendingData = {
                timestamp: `${util.zeroPad(date.getHours())}:${util.zeroPad(date.getMinutes())}`,
                weatherTimestamp: -1,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            }
            if (data.locations.length > 0) {
                sendingData.temperature = Math.floor(data.locations[0].currentWeather.temperature);
                sendingData.condition = mapCondition(data.locations[0].currentWeather.weatherCondition);
                sendingData.location = data.locations[0].name;
                sendingData.unit = data.temperatureUnit;
                sendingData.weatherTimestamp = Date.now();
            }

            // console.log(JSON.stringify(sendingData));

            return sendingData;
        }).then(data => {
            return Promise.all([data, getCityState(data)]);
        }).then(([data, response]) => {
            // console.log(JSON.stringify(response));
            data.city = response.address.city;
            data.state = STATES[response.address.state];
            // console.log(JSON.stringify(data));
            return Promise.all([data, getUVHourly(data)]);
        }).then(([data, response]) => {
            // console.log(JSON.stringify(response));
            let values = {};
            for (const entry of response) {
                // MAR/22/2022 07 AM
                const dateParts = entry.DATE_TIME.split(" ");
                let day = dateParts[0].split("/")[1];
                let hour = parseInt(dateParts[1]);
                if (dateParts[2] === "PM" && hour != 12) {
                    hour += 12;
                }
                values[`${day}/${hour}`] = entry.UV_VALUE;
            }
            data.uv = values;

            return data;
        }).then(data => {
            // console.log(JSON.stringify(data));
            sender.sendData(WEATHER_FILE, data);
        }).catch(ex => {
            console.error(ex);
        });
}

function getCurrentPosition(options) {
    return new Promise((resolve, reject) => geolocation.getCurrentPosition(resolve, reject, options));
}

function getCityState(data) {
    return fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.latitude}&lon=${data.longitude}`)
        .then(response => response.json());
}

function getUVHourly(data) {
    var city = data.location;
    if (data.city !== undefined) {
        city = data.city;
    }
    return fetch(`https://enviro.epa.gov/enviro/efservice/getEnvirofactsUVHOURLY/CITY/${city}/STATE/${data.state}/JSON`)
        .then(response => response.json());
}

function mapCondition(weatherConditionValue) {
    if (typeof weatherConditionValue === 'string') return weatherConditionValue;
    for (const weatherCondition of Object.keys(WeatherCondition)) {
        if (WeatherCondition[weatherCondition] === weatherConditionValue) return weatherCondition;
    }
}