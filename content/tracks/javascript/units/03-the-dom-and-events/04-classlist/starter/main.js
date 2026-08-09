const alertBox = { tag: "div", id: "alert", classes: ["box"], text: "Saved!", children: [] };

// 1. hasClass(el, name) — RETURN true when name is in el.classes.

// 2. addClass(el, name) — add name to el.classes, but never twice.

// 3. removeClass(el, name) — remove name from el.classes.
//    (Tip: el.classes = el.classes.filter(...) is the clean way.)

// 4. toggleClass(el, name) — remove it if present, add it if not.
//    RETURN true when the class is there AFTER the toggle
//    (the real classList.toggle does exactly this).

// 5. Drive the alert box:
//    addClass(alertBox, "visible");
//    console.log(alertBox.classes.join(" "));   // box visible
//    toggleClass(alertBox, "visible");
//    console.log(alertBox.classes.join(" "));   // box
