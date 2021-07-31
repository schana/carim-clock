// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

export function getDay(i) {
  switch (i) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
  }
}

export function toMiles(i) {
  return (i * 0.000621371).toFixed(2);
}

/**
* Convert Celsius to Fahrenheit
* @param {object} data - WeatherData -
*/
export function toFahrenheit(data) {

  if (data.unit.toLowerCase() === "celsius") {
    data.temperature = Math.round((data.temperature * 1.8) + 32);
    data.unit = "Fahrenheit";
  }

  return data
}
