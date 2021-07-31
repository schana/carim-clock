import { inbox } from "file-transfer";
import { readFileSync } from "fs";

import { dataFile, dataType } from "../common/constants";

let data;
let handleCallback;

export function initialize(callback) {
    handleCallback = callback;
    data = loadData();
    inbox.addEventListener("newfile", fileHandler);
    fileHandler();
    updatedData();
}

function fileHandler() {
    let fileName;
    do {
        fileName = inbox.nextFile();
        data = loadData();
        updatedData();
    } while (fileName);
}

function loadData() {
    try {
        return readFileSync(`/private/data/${dataFile}`, dataType);
    } catch (ex) {
        console.error(`loadData() failed. ${ex}`);
        return;
    }
}

function existsData() {
    if (data === undefined) {
        console.warn("No data found.");
        return false;
    }
    return true;
}

function updatedData() {
    if (typeof handleCallback === "function" && existsData()) {
        handleCallback(data);
    }
}