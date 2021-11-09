import clock from "clock";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { HeartRateSensor } from "heart-rate";
import { display } from "display";
import { today } from "user-activity";
import { battery } from "power";
import { me as appbit } from "appbit";
import { geolocation } from "geolocation";
import document from "document";

let handleCallback;

const heartrateLabel = document.getElementById("heartrate");
var nightStart = 20;
var nightEnd = 6;

export function initialize(granularity, callback) {
    clock.granularity = granularity ? granularity : "seconds";
    handleCallback = callback;
    clock.addEventListener("tick", tick);
}

function locationSuccess(position) {

}

function locationError(error) {
    nightStart = 24;
    nightEnd = 0;
}

export function tick(evt) {
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

    if (appbit.permissions.granted("access_heart_rate") && HeartRateSensor) {
        const hrm = new HeartRateSensor({ frequency: 1 });
        hrm.addEventListener("reading", () => {
            // console.log(`Current heart rate: ${hrm.heartRate}`);
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

    const chargeLevel = `${Math.floor(battery.chargeLevel)}%`;

    if (typeof handleCallback === "function") {
        handleCallback({
            time: `${hours}:${mins}`,
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
        });
    }
}