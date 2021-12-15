import { me as companion } from "companion";
import { weather, WeatherCondition } from "weather";
import { WEATHER_FILE, WAKE_TIME } from "../../common/constants";
import * as sender from "../messaging/sender";

export function initialize() {
    if (companion.permissions.granted("access_location")) {
        // Refresh on companion launch
        refreshData();

        // Schedule a refresh every 30 minutes
        companion.wakeInterval = WAKE_TIME;
        companion.addEventListener("wakeinterval", refreshData);

    } else {
        console.error("This app requires the access_location permission.");
    }
}

function refreshData() {
    weather
        .getWeatherData()
        .then((data) => {
            if (data.locations.length > 0) {
                sender.sendData(WEATHER_FILE, {
                    temperature: Math.floor(data.locations[0].currentWeather.temperature),
                    condition: mapCondition(data.locations[0].currentWeather.weatherCondition),
                    location: data.locations[0].name,
                    unit: data.temperatureUnit
                });
            } else {
                console.warn("No data for this location.")
            }
        })
        .catch((ex) => {
            console.error(ex);
        });
}

function mapCondition(weatherConditionValue) {
    if (typeof weatherConditionValue === 'string') return weatherConditionValue;
    for (const weatherCondition of Object.keys(WeatherCondition)) {
        if (WeatherCondition[weatherCondition] === weatherConditionValue) return weatherCondition;
    }
}