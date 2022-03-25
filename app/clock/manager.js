import clock from "clock";
import { preferences } from "user-settings";
import * as util from "../../common/utils";
import { HeartRateSensor } from "heart-rate";
import { display } from "display";
import { today } from "user-activity";
import { battery } from "power";
import { me as appbit } from "appbit";
import { geolocation } from "geolocation";
import document from "document";
import * as device_settings from "../settings/device";
import { KEY_SECONDS } from "../../common/constants";

const heartrateLabel = document.getElementById("heartrate");
export var nightStart = 20;
var nightEnd = 6;
export var showSeconds = false;
export var enableNightLight = false;

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
export const weatherLabel = document.getElementById("weather");
export const debugLabel = document.getElementById("debug");

export function initialize() {
    clock.granularity = "seconds";
    clock.addEventListener("tick", tick);
}

function locationSuccess(position) {

}

function locationError(error) {
    nightStart = 24;
    nightEnd = 0;
}

export function tick(evt) {
    doHeartRateSensor();
    updateClockFace(buildData(evt));
}

function doHeartRateSensor() {
    if (appbit.permissions.granted("access_heart_rate") && HeartRateSensor) {
        const hrm = new HeartRateSensor({ frequency: 1 });
        hrm.addEventListener("reading", () => {
            heartrateLabel.text = hrm.heartRate;
            hrm.stop();
        });
        hrm.addEventListener("error", () => {
            hrm.stop();
        });
        display.addEventListener("change", () => {
            // Automatically stop the sensor when the screen is off to conserve battery
            display.on ? hrm.start() : hrm.stop();
        });
        hrm.start();
    }
}

function buildData(evt) {
    const date = evt ? evt.date : new Date();
    let hours = date.getHours();
    if (preferences.clockDisplay === "12h") {
        // 12h format
        hours = hours % 12 || 12;
    } else {
        // 24h format
        hours = util.zeroPad(hours);
    }
    const mins = util.zeroPad(date.getMinutes());
    const secs = util.zeroPad(date.getSeconds());
    let time = `${hours}:${mins}`;
    if (device_settings.get(KEY_SECONDS) == 'true') {
        time = time + `:${secs}`;
    }
    const year = date.getFullYear();
    const month = util.zeroPad(date.getMonth() + 1);
    const day = util.zeroPad(date.getDate());
    const weekday = util.getDay(date.getDay());

    if (mins == '00') {
        geolocation.getCurrentPosition(locationSuccess, locationError, {
            maximumAge: Infinity,
            timeout: 1000,
        });
    }

    var activity = today['adjusted'];
    const distance = util.toMiles(activity.distance);
    const steps = activity.steps;
    const floors = activity.elevationGain;
    const azm = activity.activeZoneMinutes.total;
    const calories = activity.calories;

    const chargeLevel = `${Math.floor(battery.chargeLevel)}%`;

    return {
        time: time,
        day: `${year}-${month}-${day}`,
        weekday: weekday,
        distance: distance,
        steps: steps,
        floors: floors,
        azm: azm,
        calories: calories,
        rawChargeLevel: battery.chargeLevel,
        chargeLevel: chargeLevel,
        night: date.getHours() >= nightStart || date.getHours() <= nightEnd,
    };
}

function updateClockFace(data) {
    timeLabel.text = data.time;
    dayLabel.text = data.day;
    weekdayLabel.text = data.weekday;

    batteryLabel.text = data.chargeLevel;
    const height = (1 - data.rawChargeLevel / 100) * 30;
    batteryMask.height = Math.min(25, Math.floor(height));
    const batteryIcon = document.getElementById('batteryIcon');
    if (data.rawChargeLevel > 40) {
        batteryIcon.style.fill = 'fb-green';
    } else if (data.rawChargeLevel > 10) {
        batteryIcon.style.fill = 'fb-yellow';
    } else {
        batteryIcon.style.fill = 'fb-red';
    }

    distanceLabel.text = data.distance ? data.distance : "0";
    stepsLabel.text = data.steps ? data.steps : "0";
    floorsLabel.text = data.floors ? data.floors : "0";
    azmLabel.text = data.azm ? data.azm : "0";
    caloriesLabel.text = data.calories ? data.calories : "0";

    if (data.night) {
        var elements = document.getElementsByClassName('nightHide');
        for (const e of elements) {
            e.class = e.class.replace('nightHide', 'nightHideApplied');
        }
        var elements = document.getElementsByClassName('nightText');
        for (const e of elements) {
            e.class = e.class.replace('nightText', 'nightTextApplied');
        }
    } else {
        var elements = document.getElementsByClassName('nightHideApplied');
        for (const e of elements) {
            e.class = e.class.replace('nightHideApplied', 'nightHide');
        }
        var elements = document.getElementsByClassName('nightTextApplied');
        for (const e of elements) {
            e.class = e.class.replace('nightTextApplied', 'nightText');
        }
    }
}