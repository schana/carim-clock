import * as cbor from "cbor";
import { me as companion } from "companion";
import { outbox } from "file-transfer";
import { weather, WeatherCondition } from "weather";
import { dataFile, wakeTime } from "../common/constants";

function refreshData() {
  weather
    .getWeatherData()
    .then((data) => {
      if (data.locations.length > 0) {
        sendData({
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

function sendData(data) {
  outbox.enqueue(dataFile, cbor.encode(data)).catch(error => {
    console.warn(`Failed to enqueue data. Error: ${error}`);
  });
}

if (companion.permissions.granted("access_location")) {
  // Refresh on companion launch
  refreshData();

  // Schedule a refresh every 30 minutes
  companion.wakeInterval = wakeTime;
  companion.addEventListener("wakeinterval", refreshData);

} else {
  console.error("This app requires the access_location permission.");
}