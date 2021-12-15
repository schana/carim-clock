import { outbox } from "file-transfer";
import * as cbor from "cbor";

export function sendData(filename, data) {
    outbox.enqueue(filename, cbor.encode(data)).catch(error => {
        console.warn(`Failed to enqueue data. Error: ${error}`);
    });
}