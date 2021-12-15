import { KEY_SECONDS, KEY_ENABLE_NIGHT_LIGHT, KEY_NIGHT_START } from "../../common/constants";

let settings = {
    [KEY_SECONDS]: false,
    [KEY_ENABLE_NIGHT_LIGHT]: false,
    [KEY_NIGHT_START]: 20,
};

export function callback(data) {
    settings = data;
}

export function get(key) {
    return settings[key];
}