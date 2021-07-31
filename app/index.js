import clock from "clock";
import * as document from "document";
import * as util from "../common/utils";

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const hoursLabel = document.getElementById("hours");
const minutesLabel = document.getElementById("minutes");
const dayLabel = document.getElementById("day");
const weekdayLabel = document.getElementById("weekday");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
    console.log(JSON.stringify(evt));
    var date = evt.date;
    var hours = date.getHours();
    var mins = util.zeroPad(date.getMinutes());
    var year = date.getFullYear();
    var month = util.zeroPad(date.getMonth() + 1);
    var day = util.zeroPad(date.getDate());
    var weekday = util.getDay(date.getDay());

    hoursLabel.text = hours;
    minutesLabel.text = mins;
    dayLabel.text = `${year}-${month}-${day}`;
    weekdayLabel.text = `${weekday}`;
}
