import { units } from "user-settings";
import * as document from "document";
import { toFahrenheit } from "../../common/utils";
import * as clock_manager from "../clock/manager";

export function callback(data) {
    // fresh weather file received

    // If the user-settings temperature == F and the result data.unit == Celsius then we convert to Fahrenheit
    // Use only if the getWeatherData() function you use without optional parameter.
    data = units.temperature === "F" ? toFahrenheit(data) : data;

    let icons = document.getElementsByClassName("weatherIcon");
    for (const icon of icons) {
        icon.style.display = "none";
    }
    const weatherIcon = document.getElementById(`weather${data.condition}`);
    if (weatherIcon) {
        weatherIcon.style.display = "inline";
    }
    clock_manager.weatherLabel.text = `${data.temperature}\u00B0`;
    clock_manager.tick();
}
