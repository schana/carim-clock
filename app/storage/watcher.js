import { inbox } from "file-transfer";
import { readFileSync, writeFileSync } from "fs";
import * as device_settings from "../settings/device";
import * as weather_reciever from "../weather/receiver";

import { WEATHER_FILE, WEATHER_CACHED_FILE, SETTINGS_FILE, DATA_TYPE } from "../../common/constants";

export function initialize() {
    inbox.addEventListener("newfile", fileHandler);
    fileHandler();
}

function fileHandler() {
    let fileName;
    do {
        fileName = inbox.nextFile();
        if (fileName === undefined) {
            break;
        }
        let data = loadData(fileName);
        if (data !== undefined) {
            // console.log(JSON.stringify(data));
            if (fileName === SETTINGS_FILE) {
                device_settings.callback(data);
            } else if (fileName === WEATHER_FILE) {
                if (weather_reciever.validate(data)) {
                    writeFileSync(WEATHER_CACHED_FILE, data, DATA_TYPE);
                }
            }
        }
    } while (fileName);
}

function loadData(filename) {
    try {
        return readFileSync(`/private/data/${filename}`, DATA_TYPE);
    } catch (ex) {
        console.error(`loadData() failed. ${ex}`);
        return;
    }
}
