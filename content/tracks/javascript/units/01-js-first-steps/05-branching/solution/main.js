const temperature = 35;   // leave this line alone — the checks rely on it

let advice;
if (temperature >= 30) {
  advice = "Stay hydrated";
} else if (temperature >= 15) {
  advice = "Nice day";
} else {
  advice = "Bring a jacket";
}

console.log(advice);
