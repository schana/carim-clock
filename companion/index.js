import { me as companion } from "companion";
import weather from "weather";

if (!companion.permissions.granted("run_background")) {
  console.warn("We're not allowed to access to run in the background!");
}

const MILLISECONDS_PER_MINUTE = 1000 * 60;

// Tell the Companion to wake after 30 minutes
companion.wakeInterval = 30 * MILLISECONDS_PER_MINUTE;

// Listen for the event
companion.addEventListener("wakeinterval", doThis);

// Event happens if the companion is launched and has been asleep
if (companion.launchReasons.wokenUp) {
  doThis();
}

function doThis() {
  if (companion.permissions.granted("access_location")) {
    weather
      .getWeatherData({ temperatureUnit: "Fahrenheit" })
      .then((data) => {
        console.log(data);
        if (data.locations.length > 0) {
          const temp = Math.floor(data.locations[0].currentWeather.temperature);
          const cond = data.locations[0].currentWeather.weatherCondition;
          const loc = data.locations[0].name;
          const unit = data.temperatureUnit;
          console.log(`It's ${temp}\u00B0 ${unit} and ${cond} in ${loc}`);
        }
      })
      .catch((ex) => {
        console.error(ex);
      });
  }
}