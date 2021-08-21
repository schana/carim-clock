import * as clock from "./clock";
import * as document from "document";
import * as newfile from "./newfile";
import { toFahrenheit } from "../common/utils";
import { units } from "user-settings";

const timeLabel = document.getElementById("time");
const dayLabel = document.getElementById("day");
const weekdayLabel = document.getElementById("weekday");
const distanceLabel = document.getElementById("distance");
const stepsLabel = document.getElementById("steps");
const floorsLabel = document.getElementById("floors");
const azmLabel = document.getElementById("azm");
const caloriesLabel = document.getElementById("calories");
const batteryLabel = document.getElementById("battery");
const batteryMask = document.getElementById("batteryMaskRect");
const weatherLabel = document.getElementById("weather");

newfile.initialize(data => {
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
    weatherLabel.text = `${data.temperature}\u00B0`;
    clock.tick();
});

// Update the <text> element every tick with the current time
clock.initialize("seconds", data => {
    timeLabel.text = data.time;
    dayLabel.text = data.day;
    weekdayLabel.text = data.weekday;

    batteryLabel.text = data.chargeLevel;
    const height = (1 - data.rawChargeLevel / 100) * 30;
    batteryMask.height = Math.min(25, Math.floor(height));

    distanceLabel.text = data.distance ? data.distance : "0";
    stepsLabel.text = data.steps ? data.steps : "0";
    floorsLabel.text = data.floors ? data.floors : "0";
    azmLabel.text = data.azm ? data.azm : "0";
    caloriesLabel.text = data.calories ? data.calories : "0";
});
