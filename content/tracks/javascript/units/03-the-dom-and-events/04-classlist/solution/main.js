const alertBox = { tag: "div", id: "alert", classes: ["box"], text: "Saved!", children: [] };

function hasClass(el, name) {
  return el.classes.includes(name);
}

function addClass(el, name) {
  if (!hasClass(el, name)) {
    el.classes.push(name);
  }
}

function removeClass(el, name) {
  el.classes = el.classes.filter((c) => c !== name);
}

function toggleClass(el, name) {
  if (hasClass(el, name)) {
    removeClass(el, name);
    return false;
  }
  addClass(el, name);
  return true;
}

addClass(alertBox, "visible");
console.log(alertBox.classes.join(" "));
toggleClass(alertBox, "visible");
console.log(alertBox.classes.join(" "));
