import { units } from "user-settings";
import * as document from "document";
import * as fs from "fs";
import { toFahrenheit } from "../../common/utils";
import * as clock_manager from "../clock/manager";
import * as util from "../../common/utils";
import { DATA_TYPE, WEATHER_CACHED_FILE } from "../../common/constants";

export function getWeatherDataForFace(evt) {
    const date = evt ? evt.date : new Date();

    var data;

    try {
        data = fs.readFileSync(WEATHER_CACHED_FILE, DATA_TYPE);
    } catch (ex) {
        return {
            success: false
        };
    }
    if (!validate(data)) {
        return {
            success: false
        };
    }

    // If the user-settings temperature == F and the result data.unit == Celsius then we convert to Fahrenheit
    // Use only if the getWeatherData() function you use without optional parameter.
    data = units.temperature === "F" ? toFahrenheit(data) : data;

    var day = date.getDate();
    var hour = date.getHours();

    var uvIndex = data.uv[`${util.zeroPad(day)}/${util.zeroPad(hour)}`];
    if (uvIndex === undefined) {
        uvIndex = 0;
    }

    var nextUVIndex = data.uv[`${util.zeroPad(day)}/${util.zeroPad(hour + 1)}`];
    if (nextUVIndex === undefined) {
        nextUVIndex = 0;
    }

    var city = data.location;
    if (data.city !== undefined) {
        city = data.city;
    }

    return {
        success: true,
        icon: `weather${data.condition}`,
        temp: `${data.temperature}\u00B0`,
        debug: `${data.timestamp} ${city} ${uvIndex} ${nextUVIndex}`,
    }
}

export function validate(data) {
    return (
        'unit' in data &&
        'temperature' in data &&
        'condition' in data &&
        'uv' in data &&
        'timestamp' in data &&
        'location' in data
    );
}
