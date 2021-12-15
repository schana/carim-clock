import { me as companion } from "companion";
import { settingsStorage } from "settings";
import { KEY_ENABLE_NIGHT_LIGHT, KEY_NIGHT_START, KEY_SECONDS, SETTINGS_FILE } from "../../common/constants";
import * as sender from "../messaging/sender";

export function initialize() {
    settingsStorage.addEventListener("change", (evt) => {
        if (evt.oldValue !== evt.newValue) {
            sendSettings();
        }
    });

    // Settings were changed while the companion was not running
    if (companion.launchReasons.settingsChanged) {
        sendSettings();
    }
}

function sendSettings() {
    sender.sendData(SETTINGS_FILE, {
        [KEY_SECONDS]: settingsStorage.getItem(KEY_SECONDS),
        [KEY_ENABLE_NIGHT_LIGHT]: settingsStorage.getItem(KEY_ENABLE_NIGHT_LIGHT),
        [KEY_NIGHT_START]: settingsStorage.getItem(KEY_NIGHT_START),
    })
}
